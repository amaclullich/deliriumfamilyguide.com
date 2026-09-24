"""Refresh the 'Recent posts' list on the home page from the Substack RSS feed.

Run by .github/workflows/substack-posts.yml. It rewrites only the lines between
<!-- substack-posts:start --> and <!-- substack-posts:end --> in index.html.
If the feed cannot be read, the page is left unchanged.
"""
import html
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED = "https://alasdairmaclullich.substack.com/feed"
PAGE = Path(__file__).resolve().parents[2] / "index.html"
COUNT = 3
MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]


def main() -> int:
    try:
        req = urllib.request.Request(FEED, headers={"User-Agent": "deliriumfamilyguide.com feed check"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            root = ET.fromstring(resp.read())
    except Exception as exc:  # network or parse problem: leave the page alone
        print(f"Feed not read, page unchanged: {exc}")
        return 0

    items = root.findall("./channel/item")[:COUNT]
    if not items:
        print("Feed has no items, page unchanged")
        return 0

    lines = []
    for item in items:
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        if not title or not link.startswith("https://alasdairmaclullich.substack.com/"):
            continue
        link = link.split("?")[0]
        try:
            when = parsedate_to_datetime(item.findtext("pubDate"))
            stamp = f' <time datetime="{when:%Y-%m-%d}">{when.day} {MONTHS[when.month - 1]} {when.year}</time>'
        except Exception:
            stamp = ""
        lines.append(f'            <li><a href="{html.escape(link)}">{html.escape(title, quote=False)}</a>{stamp}</li>')

    if not lines:
        print("No usable items, page unchanged")
        return 0

    text = PAGE.read_text(encoding="utf-8")
    pattern = re.compile(r"(<!-- substack-posts:start -->\n)(.*?)(\n\s*<!-- substack-posts:end -->)", re.S)
    if not pattern.search(text):
        print("Markers not found, page unchanged")
        return 0
    updated = pattern.sub(lambda m: m.group(1) + "\n".join(lines) + m.group(3), text, count=1)
    if updated != text:
        PAGE.write_text(updated, encoding="utf-8")
        print(f"Updated {len(lines)} posts")
    else:
        print("Posts already current")
    return 0


if __name__ == "__main__":
    sys.exit(main())
