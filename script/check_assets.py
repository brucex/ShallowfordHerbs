#!/usr/bin/env python3
"""Fail if any src, srcset, or local asset href on a built page is missing.

Run after `jekyll build`. Paths are resolved the way a browser would, from
the page URL, so a relative img/ on /zh/ must exist at _site/zh/img/.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

SITE = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
ASSET_EXT = {
    ".css", ".js", ".svg", ".jpg", ".jpeg", ".png", ".webp", ".gif",
    ".ico", ".woff", ".woff2", ".map",
}
SRC_RE = re.compile(r"""\b(?:src|href|poster)\s*=\s*["']([^"']+)["']""", re.I)
SRCSET_RE = re.compile(r"""\b(?:srcset|imagesrcset)\s*=\s*["']([^"']+)["']""", re.I)
SKIP_PREFIX = ("#", "mailto:", "tel:", "javascript:", "data:")


def page_url(path):
    rel = path.relative_to(SITE).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def candidates(html):
    found = []
    for match in SRCSET_RE.finditer(html):
        for part in match.group(1).split(","):
            url = part.strip().split()[0] if part.strip() else ""
            if url:
                found.append(url)
    for match in SRC_RE.finditer(html):
        found.append(match.group(1).strip())
    return found


def local_file(page, raw):
    if not raw or raw.startswith(SKIP_PREFIX) or raw.startswith("//"):
        return None
    parsed = urlparse(raw)
    if parsed.scheme in ("http", "https"):
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    joined = urljoin("https://www.shallowfordherbs.net" + page_url(page), path)
    local = unquote(urlparse(joined).path)
    if Path(local).suffix.lower() not in ASSET_EXT:
        return None
    return SITE / local.lstrip("/")


def main():
    if not SITE.is_dir():
        sys.exit(f"missing build directory: {SITE}")
    pages = sorted(SITE.rglob("*.html"))
    missing = []
    checked = 0
    for page in pages:
        for raw in candidates(page.read_text(errors="replace")):
            target = local_file(page, raw)
            if target is None:
                continue
            checked += 1
            if not target.is_file():
                missing.append((page.relative_to(SITE).as_posix(), raw, target.relative_to(SITE).as_posix()))
    print(f"checked {checked} asset urls on {len(pages)} pages")
    if missing:
        print(f"missing {len(missing)}:")
        for page, raw, target in missing:
            print(f"  {page}: {raw} -> {target}")
        sys.exit(1)
    print("ok")


if __name__ == "__main__":
    main()
