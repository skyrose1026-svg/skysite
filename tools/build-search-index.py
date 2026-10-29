#!/usr/bin/env python3
"""Build the client-side search index from the site's HTML and gear catalog."""

from html.parser import HTMLParser
from html import unescape
import json
from pathlib import Path
import re
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript"}:
            self.skip_depth += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript"} and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data):
        if not self.skip_depth:
            text = re.sub(r"\s+", " ", data).strip()
            if text:
                self.parts.append(text)


def extract_page(path):
    source = path.read_text(encoding="utf-8")
    parser = VisibleText()
    parser.feed(source)
    title_match = re.search(r"<title[^>]*>(.*?)</title>", source, re.I | re.S)
    description_match = re.search(
        r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']',
        source,
        re.I | re.S,
    )
    title = unescape(re.sub(r"\s+", " ", title_match.group(1)).strip()) if title_match else path.stem
    description = unescape(description_match.group(1).strip()) if description_match else ""
    relative_url = path.relative_to(ROOT).as_posix()
    return {
        "title": title,
        "description": description,
        "content": " ".join(parser.parts),
        "url": relative_url,
    }


def main():
    site_files = [
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and not any(part.startswith(".") or part == "generated-site" for part in path.relative_to(ROOT).parts)
    ]
    documents = [
        extract_page(path)
        for path in sorted(site_files)
        if path.suffix.lower() == ".html"
    ]

    products = []
    for catalog_name in ("products.json", "products-expanded.json"):
        catalog_path = ROOT / "gear" / catalog_name
        if catalog_path.exists():
            products.extend(json.loads(catalog_path.read_text(encoding="utf-8")))
    for product in products:
        filter_text = " ".join(
            f"{key} {value}" for key, value in product.get("filters", {}).items()
        )
        category = "all" if product.get("brand") else product["category"]
        brand_query = f"&brand={quote(product['brand'])}" if product.get("brand") else ""
        documents.append(
            {
                "title": product["name"],
                "description": product["description"],
                "content": f"{product.get('brand', '')} {product['description']} {product.get('details', '')} {filter_text}",
                "url": f"gear/shop.html?category={category}{brand_query}&product={product['id']}",
            }
        )

    brands_path = ROOT / "gear" / "brands.json"
    if brands_path.exists():
        for brand in json.loads(brands_path.read_text(encoding="utf-8")):
            documents.append(
                {
                    "title": f"{brand['name']} gear",
                    "description": brand["description"],
                    "content": f"{brand['name']} {brand['description']} fishing brand products",
                    "url": f"gear/shop.html?category=all&brand={quote(brand['name'])}",
                }
            )

    output = ROOT / "data" / "site-search-index.json"
    output.write_text(json.dumps(documents, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Wrote {len(documents)} search documents to {output.relative_to(ROOT)}")

    offline_extensions = {".html", ".css", ".js", ".json", ".svg", ".webmanifest"}
    offline_assets = [
        "./" + path.relative_to(ROOT).as_posix()
        for path in sorted(site_files)
        if path.suffix.lower() in offline_extensions
        and path.name not in {"service-worker.js"}
    ]
    offline_manifest = ROOT / "data" / "offline-assets.json"
    offline_manifest.write_text(
        json.dumps(offline_assets, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(offline_assets)} offline assets to {offline_manifest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
