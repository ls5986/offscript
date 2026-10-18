"""Export the original vector identity. Requires fonttools and PyMuPDF.
No remote fonts or image services; all lettering is outlined from licensed fonts.
"""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import fitz

root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'brand'
out.mkdir(exist_ok=True)
navy, paper, coral = '#172B49', '#F8F6F1', '#F29B87'
mark = f'''<rect x="1" y="1" width="38" height="38" rx="11" fill="{coral}"/><path d="M11 10h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H19l-7 6v-6h-1a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3Z" fill="{navy}"/><path d="M14 16h11M14 21h7" stroke="{paper}" stroke-width="2.2" stroke-linecap="round"/><path d="m29 7 4 4-5 5-4-4Z" fill="{paper}"/>'''

def svg(body, width, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="Off Script">{body}</svg>'

def lettering(text, font, size, x=0, baseline=0, color=navy):
    font = TTFont(root / 'assets' / 'fonts' / font)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    advance, parts = 0, []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        parts.append(f'<path transform="translate({x+advance*scale:.3f} {baseline}) scale({scale} {-scale})" d="{pen.getCommands()}"/>')
        advance += glyphs[name].width
    return f'<g fill="{color}">{"".join(parts)}</g>', advance*scale

word, width = lettering('OFF SCRIPT', 'DMSans-Bold.ttf', 22, baseline=22)
(out/'wordmark.svg').write_text(svg(word, round(width,3), 28))
# Keep the app wordmark independent of the font-loading lifecycle.
# The transform and path data remain SVG, so large text and export stay sharp.
import re
paths = re.findall(r'<path transform="([^"]+)" d="([^"]*)"/>', word)
(root/'src/design/wordmark.json').write_text(json.dumps({'width': width, 'height':28, 'paths':[{'transform':t,'d':d} for t,d in paths]}, separators=(',',':'))+'\n')
(out/'mark.svg').write_text(svg(mark,40,40))
lockword, _ = lettering('OFF SCRIPT','DMSans-Bold.ttf',22,x=52,baseline=28)
(out/'lockup.svg').write_text(svg(mark+lockword,52+round(width,3),40))

def raster(body, width, height, path, px):
    doc = fitz.open(stream=svg(body,width,height).encode(),filetype='svg')
    doc[0].get_pixmap(matrix=fitz.Matrix(px/width,px/width),alpha=True).save(path)

for size, path in [(192,root/'public/icon-192.png'),(512,root/'public/icon-512.png'),(64,root/'public/favicon.png'),(1024,root/'assets/icon.png'),(256,root/'assets/splash-mark.png')]:
    raster(f'<rect width="40" height="40" fill="{paper}"/>'+mark,40,40,path,size)
share = f'<rect width="1200" height="630" fill="{paper}"/><g transform="translate(80 66) scale(2)">{mark}</g>'
for text,font,size,x,y,color in [
    ('OFF SCRIPT','DMSans-Bold.ttf',34,185,120,navy),
    ('Less overthinking.','Fraunces-Regular.ttf',72,80,285,navy),
    ('More making it up.','Fraunces-Regular.ttf',72,80,380,'#AA4234'),
    ('Improv party games. One phone. 2–12 people.','DMSans-Regular.ttf',30,84,487,'#555F70'),
    ('Make it up as you go.','DMSans-Medium.ttf',22,84,552,navy)]:
    share += lettering(text,font,size,x,y,color)[0]
raster(share,1200,630,root/'public/share-card.png',1200)
print('Exported vector mark, wordmark, lockup, app icons and share card.')
