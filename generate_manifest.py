#!/usr/bin/env python3
"""Scan the `sounds/` directory and write `sounds/sounds.json` manifest.

This makes the static site loadable on GitHub Pages (the manifest is a static JSON file
that lists audio file paths relative to site root).
"""
import os
import json

ROOT = os.path.dirname(__file__)
SOUNDS_DIR = os.path.join(ROOT, 'sounds')
OUT = os.path.join(SOUNDS_DIR, 'sounds.json')

def main():
    exts = ('.mp3','.wav','.ogg','.m4a')
    items = []
    if not os.path.isdir(SOUNDS_DIR):
        print('No sounds/ directory found in project root')
        return
    for dirpath, dirnames, filenames in os.walk(SOUNDS_DIR):
        # skip hidden dirs
        rel_dir = os.path.relpath(dirpath, ROOT)
        for fn in sorted(filenames):
            if fn.lower().endswith(exts):
                path = os.path.join(rel_dir, fn).replace('\\','/')
                items.append(path)
    # remove the manifest itself if present
    items = [i for i in items if not i.endswith('sounds.json')]
    items.sort()
    with open(OUT, 'w', encoding='utf8') as f:
        json.dump(items, f, indent=2)
    print('Wrote', OUT, 'with', len(items), 'entries')

if __name__ == '__main__':
    main()
