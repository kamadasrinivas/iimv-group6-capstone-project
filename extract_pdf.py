from pathlib import Path
from pypdf import PdfReader
from sys import stdout
p = Path('IIMVProject.pdf')
reader = PdfReader(p)
for i, page in enumerate(reader.pages, start=1):
    stdout.write(f'---PAGE {i}---\n')
    stdout.write(page.extract_text() or '[no extractable text]')
    stdout.write('\n')
