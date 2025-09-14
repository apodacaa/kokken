#!/usr/bin/env python3
import re
from pathlib import Path

ROOTS = [
    Path('content/recipes'),
    Path('content/cocktails'),
    Path('content/smoke'),
    Path('content/grill'),
]

def strip_tags_block(fm: str) -> str:
    # Remove a YAML tags block starting with 'tags:' then indented list items
    pattern = re.compile(r"^tags:\n(?:^[ \t]+- .*(?:\n|$))+", re.M)
    return re.sub(pattern, "", fm)

def parse_front_matter(text: str):
    if not text.startswith('---'):
        return None, None
    end = text.find('\n---', 3)
    if end == -1:
        return None, None
    end += 4  # include closing line
    return text[:end], text[end:]

def process_file(p: Path) -> bool:
    src = p.read_text(encoding='utf-8')
    fm, body = parse_front_matter(src)
    if fm is None:
        return False
    new_fm = strip_tags_block(fm)
    if new_fm != fm:
        p.write_text(new_fm + body, encoding='utf-8')
        return True
    return False

def main():
    changed = 0
    for root in ROOTS:
        if not root.exists():
            continue
        for p in root.glob('*.md'):
            if process_file(p):
                changed += 1
    print(f"Stripped tags from {changed} files.")

if __name__ == '__main__':
    main()

