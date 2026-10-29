#!/usr/bin/env python3
"""Check local HTML references and optionally verify linked public URLs."""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_TIMEOUT_SECONDS = 8
EXTERNAL_WORKERS = 8


class PageLinks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
        self.ids = set()
        self.unsafe_new_tabs = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag in {"a", "link", "script", "img", "source"}:
            attribute = "src" if tag in {"script", "img", "source"} else "href"
            value = attrs.get(attribute)
            if value:
                self.references.append((tag, value))
        if tag == "a" and attrs.get("target", "").lower() == "_blank":
            rel = set(attrs.get("rel", "").lower().split())
            if "noopener" not in rel:
                self.unsafe_new_tabs.append(attrs.get("href", "(missing href)"))


def parse_pages():
    pages = []
    for path in sorted(ROOT.rglob("*.html")):
        relative = path.relative_to(ROOT)
        if any(part.startswith(".") or part == "generated-site" for part in relative.parts):
            continue
        parser = PageLinks()
        parser.feed(path.read_text(encoding="utf-8-sig"))
        pages.append((path, parser))
    return pages


def check_local_reference(page, tag, reference, parser, target_parsers):
    parsed = urlparse(reference)
    if reference.startswith("//"):
        return None, f"https:{reference}"
    if parsed.scheme or reference.startswith(("data:", "mailto:", "tel:", "javascript:")):
        return None, reference if parsed.scheme in {"http", "https"} else None

    target_path = unquote(parsed.path)
    if target_path.startswith("/"):
        target = (ROOT / target_path.lstrip("/")).resolve()
    elif target_path:
        target = (page.parent / target_path).resolve()
    else:
        target = page

    try:
        target.relative_to(ROOT)
    except ValueError:
        return f"{page.relative_to(ROOT)}: {tag} reference escapes the project: {reference}", None
    if not target.exists():
        return f"{page.relative_to(ROOT)}: missing {tag} target: {reference}", None
    if parsed.fragment and target == page and unquote(parsed.fragment) not in parser.ids:
        return f"{page.relative_to(ROOT)}: missing fragment #{parsed.fragment}", None
    if parsed.fragment and target.suffix.lower() == ".html" and target != page:
        target_parser = target_parsers.get(target)
        if target_parser and unquote(parsed.fragment) not in target_parser.ids:
            return f"{page.relative_to(ROOT)}: missing fragment in {reference}", None
    return None, None


def check_external_url(url):
    request = Request(url, method="HEAD", headers={"User-Agent": "Southern Oregon Angler Guide link checker"})
    try:
        with urlopen(request, timeout=EXTERNAL_TIMEOUT_SECONDS) as response:
            return url, response.status, None
    except HTTPError as error:
        if error.code not in {403, 405, 501}:
            return url, error.code, str(error.reason)
    except (URLError, TimeoutError) as error:
        return url, None, str(error)

    request = Request(
        url,
        headers={
            "User-Agent": "Southern Oregon Angler Guide link checker",
            "Range": "bytes=0-0",
        },
    )
    try:
        with urlopen(request, timeout=EXTERNAL_TIMEOUT_SECONDS) as response:
            return url, response.status, None
    except (HTTPError, URLError, TimeoutError) as error:
        status = error.code if isinstance(error, HTTPError) else None
        return url, status, str(error)


def main():
    argument_parser = argparse.ArgumentParser(description=__doc__)
    argument_parser.add_argument(
        "--external",
        action="store_true",
        help="check unique external URLs over the network (may encounter rate limits)",
    )
    args = argument_parser.parse_args()
    pages = parse_pages()
    target_parsers = {path.resolve(): parser for path, parser in pages}

    errors = []
    external_urls = set()
    for path, parser in pages:
        for tag, reference in parser.references:
            error, external_url = check_local_reference(path, tag, reference, parser, target_parsers)
            if error:
                errors.append(error)
            if external_url:
                external_urls.add(external_url)
        for href in parser.unsafe_new_tabs:
            errors.append(f"{path.relative_to(ROOT)}: target=_blank link needs rel=noopener: {href}")

    print(f"Checked local references in {len(pages)} HTML pages.")
    if args.external:
        print(f"Checking {len(external_urls)} unique external URLs...")
        with ThreadPoolExecutor(max_workers=EXTERNAL_WORKERS) as executor:
            checks = [executor.submit(check_external_url, url) for url in sorted(external_urls)]
            for future in as_completed(checks):
                url, status, reason = future.result()
                if reason or status is None or status >= 400:
                    errors.append(f"External URL failed ({status or 'network error'}): {url} ({reason or 'HTTP error'})")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(f"Found {len(errors)} link issue(s).", file=sys.stderr)
        return 1
    if args.external:
        print("All local references and checked external URLs are available.")
    else:
        print("All local references and external-link hygiene checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
