import json
import os
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / 'src'
LOCALE_FILE = PROJECT_ROOT / 'src' / 'locales' / 'en.json'
IGNORED_DIRS = {'.git', 'node_modules', 'dist', 'build', '.cache', '.next', 'coverage', 'public'}

KEY_PATTERN = re.compile(r"\bt\(\s*([\"'`])([^\"'`]+?)\1", re.MULTILINE)


def flatten_keys(obj, prefix=""):
    keys = set()

    if isinstance(obj, dict):
        for key, value in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            if isinstance(value, dict):
                keys.update(flatten_keys(value, full_key))
            else:
                keys.add(full_key)
    return keys


def walk_source_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        for filename in filenames:
            if filename.endswith(('.js', '.jsx', '.ts', '.tsx')):
                yield Path(dirpath) / filename


def main():
    translation_keys = flatten_keys(json.loads(LOCALE_FILE.read_text(encoding='utf-8')))
    used_keys = set()
    dynamic_keys = set()

    for file_path in walk_source_files(SRC_DIR):
        source = file_path.read_text(encoding='utf-8')
        for match in KEY_PATTERN.finditer(source):
            key = match.group(2)
            if '${' in key:
                dynamic_keys.add(key)
                continue
            used_keys.add(key)

    missing_keys = sorted(key for key in used_keys if key not in translation_keys)

    result = {
        'missingKeys': missing_keys,
        'usedKeyCount': len(used_keys),
        'translationKeyCount': len(translation_keys),
        'dynamicKeys': sorted(dynamic_keys),
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
