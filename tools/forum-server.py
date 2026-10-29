#!/usr/bin/env python3
"""Serve the static fishing guide and its shared, SQLite-backed forum API."""

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import re
import sqlite3
import threading
import time
from urllib.parse import parse_qs, urlsplit
from urllib.parse import unquote
import uuid


ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = (
    "General Fishing",
    "Reports & Catches",
    "Gear & Tackle",
    "Techniques & Knots",
    "Waters & Regulations",
)
MAX_BODY_BYTES = 16 * 1024
WRITE_WINDOW_SECONDS = 60
MAX_WRITES_PER_WINDOW = 12


def timestamp():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def clean_text(value, field, limit, multiline=False):
    if not isinstance(value, str):
        raise ValueError(f"{field} is required.")
    value = value.strip()
    if not value:
        raise ValueError(f"{field} is required.")
    if len(value) > limit:
        raise ValueError(f"{field} must be {limit} characters or fewer.")
    if any(ord(character) < 32 and character not in ("\n", "\t") for character in value):
        raise ValueError(f"{field} contains unsupported control characters.")
    if not multiline and ("\n" in value or "\r" in value):
        raise ValueError(f"{field} must fit on one line.")
    return value


class ForumStore:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connection() as database:
            database.executescript(
                """
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS threads (
                    id TEXT PRIMARY KEY,
                    category TEXT NOT NULL,
                    author TEXT NOT NULL,
                    title TEXT NOT NULL,
                    body TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    reply_count INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS replies (
                    id TEXT PRIMARY KEY,
                    thread_id TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
                    author TEXT NOT NULL,
                    body TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS threads_updated_at ON threads(updated_at DESC);
                CREATE INDEX IF NOT EXISTS threads_category ON threads(category);
                CREATE INDEX IF NOT EXISTS replies_thread_created ON replies(thread_id, created_at);
                """
            )

    def connect(self):
        database = sqlite3.connect(self.path, timeout=10)
        database.row_factory = sqlite3.Row
        database.execute("PRAGMA foreign_keys = ON")
        database.execute("PRAGMA busy_timeout = 10000")
        return database

    @contextmanager
    def connection(self):
        database = self.connect()
        try:
            yield database
            database.commit()
        except Exception:
            database.rollback()
            raise
        finally:
            database.close()

    def categories(self):
        with self.connection() as database:
            counts = {
                row["category"]: row["count"]
                for row in database.execute(
                    "SELECT category, COUNT(*) AS count FROM threads GROUP BY category"
                )
            }
        return [{"name": name, "threadCount": counts.get(name, 0)} for name in CATEGORIES]

    def list_threads(self, category="", query="", sort="recent"):
        clauses = []
        parameters = []
        if category:
            if category not in CATEGORIES:
                raise ValueError("Choose a forum category from the list.")
            clauses.append("t.category = ?")
            parameters.append(category)
        if query:
            escaped = query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
            clauses.append("(t.title LIKE ? ESCAPE '\\' OR t.body LIKE ? ESCAPE '\\')")
            parameters.extend([f"%{escaped}%", f"%{escaped}%"])
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        ordering = "t.reply_count DESC, t.updated_at DESC" if sort == "active" else "t.updated_at DESC"
        with self.connection() as database:
            rows = database.execute(
                f"""
                SELECT t.*,
                    (SELECT r.author FROM replies r WHERE r.thread_id = t.id
                     ORDER BY r.created_at DESC LIMIT 1) AS last_reply_author
                FROM threads t {where}
                ORDER BY {ordering}
                LIMIT 100
                """,
                parameters,
            ).fetchall()
        return [dict(row) for row in rows]

    def create_thread(self, category, author, title, body):
        if category not in CATEGORIES:
            raise ValueError("Choose a forum category from the list.")
        author = clean_text(author, "Nickname", 32)
        title = clean_text(title, "Topic title", 120)
        body = clean_text(body, "Message", 4000, multiline=True)
        thread_id = str(uuid.uuid4())
        now = timestamp()
        with self.connection() as database:
            database.execute(
                """INSERT INTO threads (id, category, author, title, body, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (thread_id, category, author, title, body, now, now),
            )
        return self.get_thread(thread_id)

    def get_thread(self, thread_id):
        with self.connection() as database:
            thread = database.execute("SELECT * FROM threads WHERE id = ?", (thread_id,)).fetchone()
            if thread is None:
                return None
            result = dict(thread)
            result["replies"] = [
                dict(reply)
                for reply in database.execute(
                    "SELECT id, author, body, created_at FROM replies WHERE thread_id = ? ORDER BY created_at, id",
                    (thread_id,),
                )
            ]
        return result

    def create_reply(self, thread_id, author, body):
        author = clean_text(author, "Nickname", 32)
        body = clean_text(body, "Reply", 4000, multiline=True)
        now = timestamp()
        with self.connect() as database:
            exists = database.execute("SELECT 1 FROM threads WHERE id = ?", (thread_id,)).fetchone()
            if exists is None:
                return None
            database.execute(
                "INSERT INTO replies (id, thread_id, author, body, created_at) VALUES (?, ?, ?, ?, ?)",
                (str(uuid.uuid4()), thread_id, author, body, now),
            )
            database.execute(
                "UPDATE threads SET reply_count = reply_count + 1, updated_at = ? WHERE id = ?",
                (now, thread_id),
            )
        return self.get_thread(thread_id)


class ForumHandler(SimpleHTTPRequestHandler):
    store = None
    rate_lock = threading.Lock()
    write_times = {}

    def send_head(self):
        relative = Path(unquote(urlsplit(self.path).path).lstrip("/"))
        target = Path(self.translate_path(self.path)).resolve()
        database_files = {
            self.store.path.resolve(),
            Path(f"{self.store.path}-shm").resolve(),
            Path(f"{self.store.path}-wal").resolve(),
        }
        if any(part.startswith(".") for part in relative.parts) or target in database_files:
            self.send_error(404, "File not found")
            return None
        return super().send_head()

    def send_json(self, status_code, payload, headers=None):
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        if headers:
            for name, value in headers.items():
                self.send_header(name, value)
        self.end_headers()
        self.wfile.write(encoded)

    def reject_cross_origin(self):
        origin = self.headers.get("Origin")
        if not origin:
            return False
        parsed = urlsplit(origin)
        return parsed.scheme not in ("http", "https") or parsed.netloc.casefold() != self.headers.get("Host", "").casefold()

    def allow_write(self):
        now = time.monotonic()
        address = self.client_address[0]
        with self.rate_lock:
            recent = [item for item in self.write_times.get(address, []) if now - item < WRITE_WINDOW_SECONDS]
            if len(recent) >= MAX_WRITES_PER_WINDOW:
                self.write_times[address] = recent
                return False
            recent.append(now)
            self.write_times[address] = recent
        return True

    def read_json(self):
        if self.headers.get_content_type() != "application/json":
            raise ValueError("Send forum posts as JSON.")
        raw_length = self.headers.get("Content-Length", "")
        try:
            length = int(raw_length)
        except ValueError as error:
            raise ValueError("A valid Content-Length header is required.") from error
        if length < 1 or length > MAX_BODY_BYTES:
            raise ValueError("The submitted post is empty or too large.")
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise ValueError("The request body must be valid JSON.") from error
        if not isinstance(payload, dict):
            raise ValueError("The request body must be a JSON object.")
        return payload

    def do_GET(self):
        path = urlsplit(self.path)
        if not path.path.startswith("/api/forum/"):
            return super().do_GET()
        try:
            if path.path == "/api/forum/categories":
                return self.send_json(200, {"categories": self.store.categories()})
            if path.path == "/api/forum/threads":
                params = parse_qs(path.query)
                category = params.get("category", [""])[0].strip()
                query = params.get("q", [""])[0].strip()
                if len(query) > 100:
                    return self.send_json(400, {"error": "Search must be 100 characters or fewer."})
                sort = params.get("sort", ["recent"])[0]
                if sort not in ("recent", "active"):
                    return self.send_json(400, {"error": "Choose recent or active sorting."})
                threads = self.store.list_threads(category, query, sort)
                return self.send_json(200, {"threads": threads})
            match = re.fullmatch(r"/api/forum/threads/([0-9a-f-]{36})", path.path)
            if match:
                thread = self.store.get_thread(match.group(1))
                if thread is None:
                    return self.send_json(404, {"error": "That discussion could not be found."})
                return self.send_json(200, {"thread": thread})
            return self.send_json(404, {"error": "Forum endpoint not found."})
        except ValueError as error:
            return self.send_json(400, {"error": str(error)})
        except sqlite3.Error:
            self.log_error("Forum database request failed")
            return self.send_json(500, {"error": "The forum could not read its local database."})

    def do_POST(self):
        path = urlsplit(self.path).path
        if not path.startswith("/api/forum/"):
            return self.send_json(404, {"error": "Forum endpoint not found."})
        if self.reject_cross_origin():
            return self.send_json(403, {"error": "Cross-origin forum submissions are not accepted."})
        if not self.allow_write():
            return self.send_json(
                429,
                {"error": "Please wait a minute before posting again."},
                {"Retry-After": str(WRITE_WINDOW_SECONDS)},
            )
        try:
            payload = self.read_json()
            if path == "/api/forum/threads":
                thread = self.store.create_thread(
                    payload.get("category"),
                    payload.get("author"),
                    payload.get("title"),
                    payload.get("body"),
                )
                return self.send_json(201, {"thread": thread})
            match = re.fullmatch(r"/api/forum/threads/([0-9a-f-]{36})/replies", path)
            if match:
                thread = self.store.create_reply(
                    match.group(1),
                    payload.get("author"),
                    payload.get("body"),
                )
                if thread is None:
                    return self.send_json(404, {"error": "That discussion could not be found."})
                return self.send_json(201, {"thread": thread})
            return self.send_json(404, {"error": "Forum endpoint not found."})
        except ValueError as error:
            return self.send_json(400, {"error": str(error)})
        except sqlite3.IntegrityError:
            return self.send_json(400, {"error": "The forum could not save that post."})
        except sqlite3.Error:
            self.log_error("Forum database write failed")
            return self.send_json(500, {"error": "The forum could not save to its local database."})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1", help="Interface to bind; default is localhost only.")
    parser.add_argument("--port", type=int, default=8000, help="HTTP port (default: 8000).")
    parser.add_argument("--database", type=Path, default=ROOT / "data" / "forum.sqlite3")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")
    ForumHandler.store = ForumStore(args.database)
    handler = lambda *handler_args, **handler_kwargs: ForumHandler(
        *handler_args, directory=str(ROOT), **handler_kwargs
    )
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Fishing forum serving at http://{args.host}:{args.port}/forum.html")
    print(f"Forum database: {args.database.resolve()}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping forum server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
