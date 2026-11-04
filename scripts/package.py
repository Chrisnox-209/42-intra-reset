"""Build the unpacked extension archive without development files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
output = root / "dist" / "42-reset-brave.zip"
output.parent.mkdir(exist_ok=True)
files = [
    "manifest.json", "background.js", "cleaner.js", "toolbar.js",
    "reset.html", "style.css", "README.md",
    "README.fr.md", "README.en.md", "README.es.md",
]
files += [f"icons/icon-{size}.png" for size in (16, 32, 48, 128)]
with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    for filename in files:
        archive.write(root / filename, f"42-reset/{filename}")
print(output)
