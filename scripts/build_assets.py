"""Build optimised web assets from the Linewise e-book design source.

Usage: python scripts/build_assets.py  (set LINEWISE_SRC to the `stickman` folder)
Outputs into public/ and private/ (private/ holds the paid PDFs for the R2 upload
and is gitignored-by-content: it is never served).
"""
import os, subprocess, shutil
from pathlib import Path
from PIL import Image
import fitz
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(os.environ.get('LINEWISE_SRC', r'C:/Users/PC/AppData/Local/Temp/claude/6e60ed90514f9a6a/92185747-57a6-40fb-ba41-cf24f325ddad/scratchpad/stickman'))
EB = SRC / 'ebook'
LOGO = SRC / 'logo/linewise/premium'
PUB = ROOT / 'public'
IMG = PUB / 'img'
for d in [IMG, IMG / 'pages', IMG / 'stills', PUB / 'fonts', PUB / 'media', PUB / 'sample', ROOT / 'app', ROOT / 'private']:
    d.mkdir(parents=True, exist_ok=True)

BOOK = EB / 'Linewise - How to Make Viral Stickman Shorts (2nd edition).pdf'
BONUS = EB / 'Linewise - Bonus Pack Templates (2nd edition).pdf'


def webp(im, out, w=None, q=80):
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    if w and im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(out, 'WEBP', quality=q, method=6)
    return im.size


# 1. Fonts: subset to Latin + punctuation, woff2
uni = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215'
for f in ['Anton', 'Barlow-Regular', 'Barlow-Medium', 'Barlow-SemiBold', 'Barlow-Bold', 'Barlow-ExtraBold', 'BarlowSC-800']:
    out = PUB / 'fonts' / f'{f}.woff2'
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
    fnt = subset.load_font(str(EB / 'fonts' / f'{f}.ttf'), opts)
    s = subset.Subsetter(opts); s.populate(unicodes=subset.parse_unicodes(uni)); s.subset(fnt)
    subset.save_font(fnt, str(out), opts)
shutil.copy(EB / 'fonts' / 'OFL-Barlow.txt', PUB / 'fonts' / 'OFL-Barlow.txt')
shutil.copy(EB / 'fonts' / 'LICENCE.txt', PUB / 'fonts' / 'LICENCE.txt')

# 2. Logo: header wordmark (tagline cropped), mark, icons
wm = Image.open(LOGO / 'linewise-wordmark-horizontal.png')
bb = wm.getbbox(); wm = wm.crop(bb)
webp(wm, IMG / 'linewise-wordmark.webp', 640, 90)
wm.resize((640, round(wm.height * 640 / wm.width)), Image.LANCZOS).save(IMG / 'linewise-wordmark.png', optimize=True)
mark = Image.open(LOGO / 'linewise-mono-white-mark.png'); mark = mark.crop(mark.getbbox())
webp(mark, IMG / 'linewise-mark.webp', 120, 90)
prof = Image.open(LOGO / 'linewise-profile.png').convert('RGB')
prof.resize((512, 512), Image.LANCZOS).save(ROOT / 'app' / 'icon.png', optimize=True)
prof.resize((180, 180), Image.LANCZOS).save(ROOT / 'app' / 'apple-icon.png', optimize=True)
prof.convert('RGBA').save(ROOT / 'app' / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], bitmap_format='bmp')
prof.resize((192, 192), Image.LANCZOS).save(PUB / 'icon-192.png', optimize=True)
prof.resize((512, 512), Image.LANCZOS).save(PUB / 'icon-512.png', optimize=True)

# 3. Cover, mockup, OG image
cover = Image.open(EB / 'cover.png')
for w in (480, 800):
    webp(cover, IMG / f'cover-{w}.webp', w, 82)
mock = Image.open(EB / 'mockup.png').convert('RGB')
for w in (960, 1600):
    webp(mock, IMG / f'mockup-{w}.webp', w, 80)
# hero: book only (right half of the mockup)
# hero: the 3D book rendered on a transparent background from scripts/book-transparent.html
chrome = os.environ.get('CHROME', r'C:/Program Files/Google/Chrome/Application/chrome.exe')
subprocess.run([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000', '--window-size=2400,1600',
                f'--screenshot={ROOT / "private" / "book-t.png"}', (ROOT / 'scripts' / 'book-transparent.html').as_uri()], check=True, capture_output=True)
bt = Image.open(ROOT / 'private' / 'book-t.png')
x0, y0, x1, y1 = bt.getchannel('A').getbbox()
book = bt.crop((x0 - 8, y0 - 8, x1 + 8, y1 + 8))
for w in (520, 880):
    webp(book, IMG / f'book-{w}.webp', w, 86)
og = mock.resize((1200, 800), Image.LANCZOS).crop((0, 40, 1200, 670))
og.save(ROOT / 'app' / 'opengraph-image.jpg', quality=86, optimize=True)
og.save(ROOT / 'app' / 'twitter-image.jpg', quality=86, optimize=True)

# 4. Film stills (our own Linewise films)
for p in sorted((EB / 'build' / 'img').glob('*.jpg')):
    if p.stem.startswith(('linewise', 'guide')):
        continue
    webp(Image.open(p), IMG / 'stills' / f'{p.stem}.webp', 360, 74)

# 5. Page previews rendered from the real PDF
doc = fitz.open(BOOK)
# page numbers for the 2nd edition (90 pages); the 1st edition used 3/6/7/8/13/19/21/24/26/29/36/42/49/54/59/64/65/69
pages = {3: 'contents', 6: 'ch1', 7: 'research', 8: 'rules', 13: 'ch2', 20: 'ch3', 22: 'scene-template', 25: 'worked-example',
         28: 'ch4', 30: 'light', 38: 'ch5', 44: 'keyframes', 52: 'ch6', 58: 'ch7', 65: 'ch8', 70: 'streams', 71: 'ch9', 76: 'bonus'}
for n, name in pages.items():
    pix = doc[n - 1].get_pixmap(matrix=fitz.Matrix(1.0, 1.0))
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    webp(im, IMG / 'pages' / f'{name}.webp', 480, 78)
bon = fitz.open(BONUS)
for n, name in {1: 'bonus-1', 4: 'bonus-concepts', 10: 'bonus-calendar'}.items():
    if n <= bon.page_count:
        pix = bon[n - 1].get_pixmap(matrix=fitz.Matrix(1.0, 1.0))
        webp(Image.frombytes('RGB', (pix.width, pix.height), pix.samples), IMG / 'pages' / f'{name}.webp', 480, 78)

# 6. Free sample: the research page + the eight rules (pages 7-8), plus the cover
sample = fitz.open()
sample.insert_pdf(doc, from_page=0, to_page=0)
sample.insert_pdf(doc, from_page=6, to_page=7)
sample.set_metadata({'title': 'Linewise free sample: the 8 rules viral stickman Shorts share (2nd edition)', 'author': 'Linewise (Blackwellen Ltd)'})
sample.save(PUB / 'sample' / 'linewise-free-sample-8-rules.pdf', garbage=4, deflate=True)

# 7. Paid files staged for the private R2 upload (never in public/)
shutil.copy(BOOK, ROOT / 'private' / 'linewise-how-to-make-viral-stickman-shorts.pdf')
shutil.copy(BONUS, ROOT / 'private' / 'linewise-bonus-pack-templates.pdf')

# 8. Film loop (our own film 001 "Light on"), muted, web-sized
film = SRC / 'share' / '001-ncs-720.mp4'
ff = ['ffmpeg', '-y', '-loglevel', 'error', '-i', str(film), '-an', '-vf', 'scale=432:768:flags=lanczos', '-r', '30']
subprocess.run(ff + ['-c:v', 'libx264', '-profile:v', 'high', '-crf', '30', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(PUB / 'media' / 'linewise-film-001.mp4')], check=True)
subprocess.run(ff + ['-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1', str(PUB / 'media' / 'linewise-film-001.webm')], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '21', '-i', str(film), '-frames:v', '1', '-vf', 'scale=432:768', str(ROOT / 'private' / '_poster.png')], check=True)
webp(Image.open(ROOT / 'private' / '_poster.png'), PUB / 'media' / 'linewise-film-001-poster.webp', 432, 72)
os.remove(ROOT / 'private' / '_poster.png')
print('assets ok')

# 9. Header lock-up without the tagline (tagline is illegible at 30 px)
wm2 = Image.open(LOGO / 'linewise-wordmark-horizontal.png').convert('RGBA')
px = wm2.load()
for y in range(320, wm2.height):
    for x in range(470, wm2.width):
        px[x, y] = (0, 0, 0, 0)
al = wm2.getchannel('A').point(lambda v: 255 if v > 24 else 0)
wm2 = wm2.crop(al.getbbox())
webp(wm2, IMG / 'linewise-lockup.webp', 480, 90)
print('lockup', Image.open(IMG / 'linewise-lockup.webp').size)

# 10. Small hero copies of the fanned pages, and a mid-size book for phones
for name in ('ch4', 'ch6'):
    webp(Image.open(IMG / 'pages' / f'{name}.webp'), IMG / 'pages' / f'{name}-260.webp', 260, 76)
webp(Image.open(IMG / 'book-880.webp'), IMG / 'book-400.webp', 400, 84)
