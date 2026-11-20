"""Builds screenshots/overview.jpg: every page, desktop and phone, above the fold."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
S = Path(__file__).resolve().parent.parent / 'screenshots'
F = Path(__file__).resolve().parent.parent / 'public' / 'fonts'
pages = ['home', 'checkout', 'success-paid', 'advertise', 'terms', 'refunds', 'privacy', 'cookies', 'download-invalid', 'success-unconfirmed', '404']
labels = {'success-paid': 'success (paid, test mode)'}
DW, PW, PAD, LH = 560, 182, 24, 40
try:
    font = ImageFont.truetype(str(Path(r'C:/Windows/Fonts/segoeuib.ttf')), 20)
    big = ImageFont.truetype(str(Path(r'C:/Windows/Fonts/segoeuib.ttf')), 34)
except OSError:
    font = big = ImageFont.load_default()
cols = 3
cell_w = DW + PW + PAD * 3
cell_h = LH + round(900 * DW / 1440) + PAD
rows = (len(pages) + cols - 1) // cols
W = cols * cell_w + PAD; H = 90 + rows * cell_h + PAD
cv = Image.new('RGB', (W, H), (7, 9, 13)); d = ImageDraw.Draw(cv)
d.text((PAD, 26), 'LINEWISE website: every page, desktop 1440 px and phone 390 px (local preview, Stripe test mode)', font=big, fill=(232, 237, 244))
for i, name in enumerate(pages):
    x = PAD + (i % cols) * cell_w; y = 90 + (i // cols) * cell_h
    d.text((x, y + 6), labels.get(name, name), font=font, fill=(61, 214, 255))
    for dev, w, dx in (('desktop', DW, 0), ('phone', PW, DW + PAD)):
        p = S / '_fold' / f'{name}-{dev}-fold.jpg'
        if not p.exists():
            continue
        im = Image.open(p).convert('RGB'); im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im = im.crop((0, 0, w, min(im.height, cell_h - LH - PAD)))
        cv.paste(im, (x + dx, y + LH)); d.rectangle([x + dx - 1, y + LH - 1, x + dx + im.width, y + LH + im.height], outline=(34, 43, 55))
cv.save(S / 'overview.jpg', quality=86, optimize=True)
print('overview', cv.size)
