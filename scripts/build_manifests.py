"""Create browser-readable lists of TXT files. Run from any directory."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def build(folder_name: str) -> None:
    folder = ROOT / folder_name
    names = sorted(path.name for path in (folder / "content").glob("*.txt") if path.is_file())
    output = folder / "manifest.json"
    output.write_text(json.dumps(names, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{output.relative_to(ROOT)}: {len(names)} file(s)")


if __name__ == "__main__":
    for name in ("projects", "publications"):
        build(name)
