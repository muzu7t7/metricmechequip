"""Generates the product illustrations in public/products/*.svg and points
each entry of src/data/products.json at its image.

Run from the project root:  python scripts/generate-product-images.py
"""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'products'
JSON_PATH = ROOT / 'src' / 'data' / 'products.json'

PHOTO_EXTS = ('.webp', '.jpg', '.jpeg', '.png')
RAW_EXTS = ('.jpg', '.jpeg', '.png')   # converted to WebP by compress_photos()
ORIGINALS = ROOT / 'product-photos-original'
MAX_WIDTH = 1000
WEBP_QUALITY = 80

RED = '#9E2A2B'

PAL = {
    'steel': ('#59616a', '#aab1b8', '#f1f4f6'),
    'brass': ('#7a4d0f', '#c99a35', '#f7de9c'),
    'rubber': ('#101010', '#2a2a2a', '#5c5c5c'),
    'red': ('#6e1a1b', '#b03a3c', '#e58a8b'),
    'gi': ('#6d7378', '#b3b8bd', '#e6e9eb'),
    'blue': ('#154f99', '#3b8be0', '#a6d0ff'),
    'hose': ('#18212a', '#33444f', '#6d8296'),
}


def gradient(id_, stops, vertical=True):
    d = 'x1="0" y1="0" x2="0" y2="1"' if vertical else 'x1="0" y1="0" x2="1" y2="0"'
    s = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" {d}>{s}</linearGradient>'


def metal_stops(p):
    dark, mid, hi = p
    return [(0, mid), (0.18, hi), (0.45, mid), (0.8, dark), (1, mid)]


DEFS = (
    '<defs>'
    + gradient('bg', [(0, '#ffffff'), (1, '#e8ebee')])
    # Y = light/dark changes top to bottom (for shapes whose axis runs along x)
    + ''.join(gradient(f'{n}Y', metal_stops(PAL[n])) for n in ('steel', 'brass', 'rubber', 'red', 'gi', 'blue'))
    # X = the same, changing left to right (for shapes whose axis runs along y)
    + ''.join(gradient(f'{n}X', metal_stops(PAL[n]), False) for n in ('steel', 'brass', 'rubber', 'red', 'gi', 'blue'))
    + '<radialGradient id="steelR" cx="0.35" cy="0.3" r="0.9">'
      '<stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#b9c0c6"/>'
      '<stop offset="1" stop-color="#666e76"/></radialGradient>'
    + '<radialGradient id="brassR" cx="0.35" cy="0.3" r="0.9">'
      '<stop offset="0" stop-color="#fbe9b4"/><stop offset="0.5" stop-color="#c99a35"/>'
      '<stop offset="1" stop-color="#6f450c"/></radialGradient>'
    + '<pattern id="braid" width="7" height="7" patternUnits="userSpaceOnUse">'
      '<path d="M0 0L7 7M7 0L0 7" stroke="#3f464d" stroke-width="1.1" opacity=".55"/></pattern>'
    + '<filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
    + '</defs>'
)

EDGE = 'stroke="#3d444a" stroke-opacity=".55" stroke-width=".9"'


# ─── primitives ──────────────────────────────────────────────────────────────
def rect(x, y, w, h, fill, rx=0, edge=True):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" '
            f'{EDGE if edge else ""}/>')


def line(x1, y1, x2, y2, color='#20262b', op=0.35, w=1):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}"/>'


def threads_h(x, y, w, h, step=4):
    """Thread ridges on a shape whose axis runs along x."""
    return ''.join(line(i, y + 1, i, y + h - 1) for i in frange(x + step, x + w - 1, step))


def threads_v(x, y, w, h, step=4):
    return ''.join(line(x + 1, i, x + w - 1, i) for i in frange(y + step, y + h - 1, step))


def frange(a, b, s):
    v = a
    while v < b:
        yield v
        v += s


def hex_h(x, y, w, h, fill):
    """Hex nut seen from the side, axis along x (two edge lines)."""
    return rect(x, y, w, h, fill, 2) + line(x, y + h / 3, x + w, y + h / 3, op=.4) + line(x, y + 2 * h / 3, x + w, y + 2 * h / 3, op=.4)


def hex_v(x, y, w, h, fill):
    return rect(x, y, w, h, fill, 2) + line(x + w / 3, y, x + w / 3, y + h, op=.4) + line(x + 2 * w / 3, y, x + 2 * w / 3, y + h, op=.4)


def tube(d, w, pal='steel', cap='butt', extra=''):
    dark, mid, hi = PAL[pal]
    return (
        f'<path d="{d}" fill="none" stroke="{dark}" stroke-width="{w}" stroke-linecap="{cap}" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="none" stroke="{mid}" stroke-width="{w * .78:.1f}" stroke-linecap="{cap}" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="none" stroke="{hi}" stroke-width="{w * .2:.1f}" stroke-linecap="{cap}" stroke-linejoin="round" '
        f'opacity=".85" transform="translate({-w * .15:.1f} {-w * .15:.1f})"/>'
        + extra
    )


def group(body, x=0, y=0, a=0, s=1):
    return f'<g transform="translate({x} {y}) rotate({a}) scale({s})">{body}</g>'


def hexagon(cx, cy, r, fill, rot=0):
    pts = ' '.join(
        f'{cx + r * math.cos(math.radians(60 * i + rot)):.1f},{cy + r * math.sin(math.radians(60 * i + rot)):.1f}'
        for i in range(6))
    return f'<polygon points="{pts}" fill="{fill}" {EDGE}/>'


def fitting(x, y, a=0, s=1.0, kind='std'):
    """Hose end fitting. Origin is the hose end, it points along +x."""
    if kind == 'camlock':
        body = (
            rect(-4, -28, 54, 56, 'url(#steelY)', 4)
            + line(14, -28, 14, 28, op=.45) + line(30, -28, 30, 28, op=.45)
            + rect(50, -24, 22, 48, 'url(#brassY)', 3) + line(56, -24, 56, 24, op=.4)
            + rect(6, -40, 36, 13, 'url(#redY)', 6) + rect(6, 27, 36, 13, 'url(#redY)', 6)
            + '<circle cx="14" cy="-33.5" r="3" fill="#dfe3e6"/><circle cx="14" cy="33.5" r="3" fill="#dfe3e6"/>'
        )
    else:
        body = (
            rect(-4, -23, 34, 46, 'url(#steelY)', 4)
            + line(8, -23, 8, 23, op=.5) + line(20, -23, 20, 23, op=.5)
            + hex_h(30, -19, 24, 38, 'url(#steelY)')
            + rect(54, -12, 26, 24, 'url(#brassY)', 2) + threads_h(54, -12, 26, 24, 4)
        )
    return group(body, x, y, a, s)


def clamp_ring(cx, cy, r, ang):
    """Worm-drive hose clamp, front view."""
    bx, by = cx, cy - r - 2
    housing = (
        rect(bx - 24, by - 15, 48, 26, 'url(#steelY)', 5)
        + rect(bx - 40, by - 10, 18, 20, 'url(#steelY)', 3) + line(bx - 40, by, bx - 22, by, op=.5, w=2)
        + rect(bx + 24, by - 5, 26, 10, 'url(#steelY)', 2) + threads_h(bx + 24, by - 5, 26, 10, 3)
    )
    return (
        f'<g transform="rotate({ang} {cx} {cy})">'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#59616a" stroke-width="15"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#c4cad0" stroke-width="12"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r - 2}" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="2.5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#3d444a" stroke-opacity=".7" stroke-width="3.6" '
        f'stroke-dasharray="13 8"/>'
        f'{housing}</g>'
    )


def drop(x, y, s=1.0, fill='#d99a1c'):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M0,-14 C8,-2 10,4 10,8 A10 10 0 0 1 -10 8 '
            f'C-10 4 -8 -2 0 -14 Z" fill="{fill}"/><path d="M-4,3 C-4,7 -2,9 1,9" fill="none" stroke="#fff" '
            f'stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/></g>')


# ─── the 20 illustrations ────────────────────────────────────────────────────
def hoses():
    d = 'M 80 205 C 160 205, 130 95, 200 95 C 270 95, 240 205, 320 205'
    ribs = f'<path d="{d}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="34" stroke-dasharray="2 8"/>'
    return tube(d, 34, 'rubber', extra=ribs) + fitting(80, 205, 180, .8) + fitting(320, 205, 0, .8)


def hose_fittings():
    elbow = (tube('M 210 240 L 250 240 A 32 32 0 0 0 282 208 L 282 175', 30, 'brass')
             + fitting(210, 240, 180, .6) + fitting(282, 175, -90, .6))
    return fitting(58, 132, -12, 1.75) + elbow


def couplings():
    body = (
        rect(60, 132, 24, 36, 'url(#brassY)', 2) + threads_h(60, 132, 24, 36)
        + hex_h(84, 118, 50, 64, 'url(#steelY)')
        + rect(134, 128, 132, 44, 'url(#steelY)', 4) + line(160, 128, 160, 172, op=.4) + line(240, 128, 240, 172, op=.4)
        + rect(186, 108, 28, 84, 'url(#brassY)', 4) + line(200, 108, 200, 192, op=.3)
        + hex_h(266, 118, 50, 64, 'url(#steelY)')
        + rect(316, 132, 24, 36, 'url(#brassY)', 2) + threads_h(316, 132, 24, 36)
    )
    return group(body, 0, 0, -10) .replace('rotate(-10)', 'rotate(-10 200 150)')


def adaptors():
    return (
        rect(64, 134, 26, 32, 'url(#brassY)', 2) + threads_h(64, 134, 26, 32)
        + hex_h(90, 122, 30, 56, 'url(#steelY)')
        + rect(120, 130, 160, 40, 'url(#brassY)', 3)
        + hex_h(280, 122, 30, 56, 'url(#steelY)')
        + rect(310, 134, 26, 32, 'url(#brassY)', 2) + threads_h(310, 134, 26, 32)
        + rect(180, 62, 40, 70, 'url(#brassX)', 3) + rect(174, 88, 52, 22, 'url(#steelX)', 3)
        + line(187, 88, 187, 110, op=.4) + line(213, 88, 213, 110, op=.4)
        + rect(184, 46, 32, 20, 'url(#steelX)', 3) + threads_v(184, 46, 32, 20, 4)
        + hex_v(168, 118, 64, 64, 'url(#steelY)').replace('url(#steelY)', 'url(#steelR)')
    )


def gauge():
    cx, cy, r = 135, 128, 76
    ticks = ''
    for i in range(0, 51):
        ang = math.radians(135 + i * 5.4)
        long_ = i % 5 == 0
        r1, r2 = r - 14, r - (25 if long_ else 20)
        ticks += line(cx + r1 * math.cos(ang), cy + r1 * math.sin(ang), cx + r2 * math.cos(ang), cy + r2 * math.sin(ang),
                      '#22282d', .85 if long_ else .5, 2 if long_ else 1)
    a0, a1 = math.radians(135 + 0.8 * 270), math.radians(405)
    zr = r - 30
    red_arc = (f'<path d="M {cx + zr * math.cos(a0):.1f} {cy + zr * math.sin(a0):.1f} A {zr} {zr} 0 0 1 '
               f'{cx + zr * math.cos(a1):.1f} {cy + zr * math.sin(a1):.1f}" fill="none" stroke="{RED}" '
               f'stroke-width="5" stroke-linecap="round"/>')
    na = math.radians(135 + 0.62 * 270)
    needle = (f'<line x1="{cx - 12 * math.cos(na):.1f}" y1="{cy - 12 * math.sin(na):.1f}" '
              f'x2="{cx + 48 * math.cos(na):.1f}" y2="{cy + 48 * math.sin(na):.1f}" stroke="#c0393b" '
              f'stroke-width="3.4" stroke-linecap="round"/>')
    stem = (hex_h(cx - 17, cy + r - 4, 34, 20, 'url(#brassY)').replace('x="118"', 'x="118"')
            + rect(cx - 11, cy + r + 16, 22, 22, 'url(#brassY)', 2) + threads_h(cx - 11, cy + r + 16, 22, 22, 4))
    hose = tube(f'M {cx} {cy + r + 38} C {cx} 292, 215 294, 250 254 C 275 222, 300 200, 335 202', 13, 'rubber', 'round')
    return (
        stem + hose + fitting(335, 202, 0, .42)
        + f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#steelR)" {EDGE}/>'
        + f'<circle cx="{cx}" cy="{cy}" r="{r - 7}" fill="#ffffff" stroke="#8a9299" stroke-width="2"/>'
        + ticks + red_arc + needle
        + f'<circle cx="{cx}" cy="{cy}" r="7" fill="#22282d"/><circle cx="{cx - 2}" cy="{cy - 2}" r="2.4" fill="#8a9299"/>'
        + f'<path d="M {cx - 44} {cy - 30} A 56 56 0 0 1 {cx + 10} {cy - 55}" fill="none" stroke="#fff" '
          f'stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/>'
    )


def bellows():
    out = rect(108, 98, 184, 104, '#4a5158', 4, False)
    for i in range(9):
        cx = 118 + i * 20.5
        out += f'<ellipse cx="{cx}" cy="150" rx="13" ry="57" fill="url(#steelY)" stroke="#5c646b" stroke-width=".9"/>'
    out += rect(58, 112, 32, 76, 'url(#steelY)', 3) + threads_h(58, 112, 32, 76, 6)
    out += rect(310, 112, 32, 76, 'url(#steelY)', 3) + threads_h(310, 112, 32, 76, 6)
    for x in (88, 294):
        out += rect(x, 66, 18, 168, 'url(#steelY)', 3)
        out += rect(x + 5, 66, 8, 168, 'url(#redY)', 0, False).replace('fill="url(#redY)"', 'fill="url(#redY)" opacity=".85"')
        for y in (78, 110, 178, 210):
            out += rect(x - 6 if x < 200 else x + 18, y - 6, 6, 12, 'url(#steelY)', 1)
    return out


def tubes_clamps():
    d = 'M 60 208 L 190 208 A 55 55 0 0 0 245 153 L 245 62'
    return (
        tube(d, 24, 'steel')
        + rect(54, 195, 12, 26, 'url(#steelY)', 2) + rect(233, 54, 24, 11, 'url(#steelY)', 2)
        # compression fitting
        + rect(94, 194, 8, 28, 'url(#brassY)', 2) + hex_h(102, 188, 40, 40, 'url(#brassY)')
        + rect(142, 196, 10, 24, 'url(#brassY)', 2)
        # P-clamp on the horizontal run
        + rect(160, 191, 20, 34, 'url(#redY)', 5) + rect(163, 224, 14, 22, 'url(#steelY)', 2)
        + '<circle cx="170" cy="237" r="4" fill="#dfe3e6" stroke="#3d444a" stroke-opacity=".6"/>'
        # clamp on the vertical run
        + rect(227, 96, 36, 20, 'url(#redY)', 5) + rect(262, 98, 22, 16, 'url(#steelY)', 2)
        + '<circle cx="273" cy="106" r="4" fill="#dfe3e6" stroke="#3d444a" stroke-opacity=".6"/>'
    )


def pneumatics():
    out = ''
    for i in range(6):
        cx = 70 + i * 24
        out += (f'<ellipse cx="{cx}" cy="150" rx="27" ry="56" fill="none" stroke="#154f99" stroke-width="12"/>'
                f'<ellipse cx="{cx}" cy="150" rx="27" ry="56" fill="none" stroke="#3b8be0" stroke-width="9"/>'
                f'<ellipse cx="{cx}" cy="150" rx="27" ry="56" fill="none" stroke="#a6d0ff" stroke-width="2.5" '
                f'stroke-dasharray="46 400" stroke-dashoffset="-190"/>')
    for y in (206, 94):
        out += tube(f'M 190 {y} L 252 {y}', 12, 'blue')
        out += (rect(250, y - 15, 12, 30, 'url(#rubberY)', 3) + rect(262, y - 18, 40, 36, 'url(#steelY)', 3)
                + line(276, y - 18, 276, y + 18, op=.4)
                + rect(302, y - 11, 24, 22, 'url(#brassY)', 2) + threads_h(302, y - 11, 24, 22, 4))
    return out


def hose_protectors():
    d = 'M 62 232 C 140 232, 130 92, 200 92 C 270 92, 260 200, 338 200'
    return (
        tube(d, 34, 'rubber')
        + f'<path d="{d}" fill="none" stroke="{RED}" stroke-width="42" stroke-dasharray="9 12"/>'
        + f'<path d="{d}" fill="none" stroke="#e58a8b" stroke-width="6" stroke-dasharray="9 12" opacity=".55" '
          f'transform="translate(-6 -6)"/>'
        + fitting(62, 232, 180, .7) + fitting(338, 200, 0, .7)
    )


def oil():
    out = ''
    # drum
    out += rect(80, 84, 120, 158, 'url(#redX)', 0)
    out += '<ellipse cx="140" cy="242" rx="60" ry="14" fill="#6e1a1b"/>'
    out += rect(80, 84, 120, 158, 'url(#redX)', 0, False)
    for y in (122, 205):
        out += (f'<path d="M80 {y} Q140 {y + 16} 200 {y}" fill="none" stroke="#4e1213" stroke-width="3"/>'
                f'<path d="M80 {y + 3} Q140 {y + 19} 200 {y + 3}" fill="none" stroke="#e58a8b" stroke-opacity=".45" stroke-width="1.5"/>')
    out += '<ellipse cx="140" cy="84" rx="60" ry="14" fill="#c0393b" stroke="#6e1a1b" stroke-width="1.2"/>'
    out += '<ellipse cx="140" cy="84" rx="48" ry="9" fill="none" stroke="#6e1a1b" stroke-opacity=".6"/>'
    out += '<circle cx="164" cy="85" r="5" fill="#dfe3e6" stroke="#3d444a" stroke-opacity=".6"/>'
    out += '<rect x="102" y="146" width="76" height="44" rx="4" fill="#fff" stroke="#3d444a" stroke-opacity=".4"/>'
    out += drop(140, 166, 1.15, RED)
    out += '<rect x="112" y="180" width="56" height="3" rx="1.5" fill="#20262b" opacity=".4"/>'
    # bottle
    out += rect(252, 146, 70, 96, 'url(#rubberX)', 12)
    out += rect(276, 122, 22, 28, 'url(#rubberX)', 4)
    out += rect(270, 104, 34, 20, 'url(#redX)', 4) + threads_v(270, 104, 34, 20, 4)
    out += '<rect x="260" y="170" width="54" height="40" rx="4" fill="#fff" stroke="#3d444a" stroke-opacity=".4"/>'
    out += drop(287, 187, .9, '#d99a1c')
    out += '<rect x="268" y="200" width="38" height="3" rx="1.5" fill="#20262b" opacity=".4"/>'
    out += '<path d="M260 158 Q258 200 262 232" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>'
    out += drop(346, 218, 1.0, '#d99a1c')
    return out


def hose_clips():
    return clamp_ring(135, 158, 62, 0) + clamp_ring(290, 168, 40, 35)


def sae_flange():
    hexes = ''.join(hexagon(x, y, 14, 'url(#steelR)') + f'<circle cx="{x}" cy="{y}" r="6" fill="#59616a" opacity=".6"/>'
                    for x, y in ((156, 106), (244, 106), (156, 194), (244, 194)))
    return (
        '<polygon points="275,75 289,61 289,211 275,225" fill="#59616a"/>'
        '<polygon points="125,75 139,61 289,61 275,75" fill="#8f979e"/>'
        '<rect x="125" y="75" width="150" height="150" rx="12" fill="url(#steelR)" stroke="#3d444a" stroke-opacity=".6"/>'
        '<circle cx="200" cy="150" r="49" fill="none" stroke="#101010" stroke-width="9"/>'
        '<circle cx="200" cy="150" r="49" fill="none" stroke="#5c5c5c" stroke-width="2.5" '
        'stroke-dasharray="40 300" stroke-dashoffset="-40"/>'
        '<circle cx="200" cy="150" r="38" fill="#1a1e21" stroke="#8f979e" stroke-width="2"/>'
        '<circle cx="200" cy="150" r="27" fill="#0b0d0e"/>'
        + hexes
    )


def quick_release():
    return (
        rect(36, 132, 24, 36, 'url(#brassY)', 2) + threads_h(36, 132, 24, 36)
        + hex_h(60, 118, 50, 64, 'url(#steelY)')
        + rect(110, 126, 30, 48, 'url(#steelY)', 3)
        + rect(140, 108, 46, 84, 'url(#redY)', 7)
        + ''.join(line(x, 110, x, 190, '#20262b', .35) for x in frange(146, 184, 4))
        + rect(186, 122, 30, 56, 'url(#steelY)', 4)
        + '<ellipse cx="216" cy="150" rx="6" ry="20" fill="#101010"/>'
        # male plug
        + rect(246, 130, 34, 40, 'url(#steelY)', 8) + line(262, 130, 262, 170, op=.55, w=2)
        + hex_h(280, 114, 44, 72, 'url(#steelY)')
        + rect(324, 132, 24, 36, 'url(#brassY)', 2) + threads_h(324, 132, 24, 36)
    )


def valves():
    return group(
        rect(-116, -8, 232, 16, 'url(#redY)', 8, False) + rect(70, -14, 46, 28, 'url(#rubberY)', 9)
        + '<circle cx="0" cy="0" r="7" fill="#dfe3e6" stroke="#3d444a" stroke-opacity=".6"/>', 200, 76, -6
    ) + (
        rect(190, 88, 20, 30, 'url(#brassX)', 2) + rect(184, 84, 32, 12, 'url(#steelX)', 2)
        + rect(66, 152, 22, 44, 'url(#brassY)', 2) + threads_h(66, 152, 22, 44)
        + hex_h(88, 138, 34, 72, 'url(#steelY)')
        + rect(122, 148, 156, 52, 'url(#brassY)', 4)
        + hex_h(278, 138, 34, 72, 'url(#steelY)')
        + rect(312, 152, 22, 44, 'url(#brassY)', 2) + threads_h(312, 152, 22, 44)
        + '<ellipse cx="200" cy="174" rx="52" ry="48" fill="url(#brassR)" stroke="#5e3b08" stroke-opacity=".6"/>'
        + '<ellipse cx="200" cy="174" rx="30" ry="27" fill="none" stroke="#5e3b08" stroke-opacity=".35" stroke-width="2"/>'
    )


def belts():
    c1, r1, c2, r2 = (118, 165), 60, (290, 150), 38
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    d, th = math.hypot(dx, dy), math.atan2(dy, dx)
    ro = 7  # belt runs just outside the pulleys
    R1, R2 = r1 + ro, r2 + ro
    al = math.acos((R1 - R2) / d)

    def p(c, r, a):
        return f'{c[0] + r * math.cos(a):.1f} {c[1] + r * math.sin(a):.1f}'
    path = (f'M {p(c1, R1, th - al)} L {p(c2, R2, th - al)} A {R2} {R2} 0 0 1 {p(c2, R2, th + al)} '
            f'L {p(c1, R1, th + al)} A {R1} {R1} 0 1 1 {p(c1, R1, th - al)} Z')

    def pulley(c, r):
        cx, cy = c
        return (
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#steelR)" {EDGE}/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * .82:.1f}" fill="none" stroke="#3d444a" stroke-opacity=".5" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * .6:.1f}" fill="#8f979e" stroke="#3d444a" stroke-opacity=".5"/>'
            + ''.join(f'<circle cx="{cx + r * .38 * math.cos(math.radians(a)):.1f}" cy="{cy + r * .38 * math.sin(math.radians(a)):.1f}" '
                      f'r="{r * .09:.1f}" fill="#2a2f34"/>' for a in range(0, 360, 60))
            + f'<circle cx="{cx}" cy="{cy}" r="{r * .2:.1f}" fill="#22282d"/>'
        )
    return (
        pulley(c1, r1) + pulley(c2, r2)
        + f'<path d="{path}" fill="none" stroke="#101010" stroke-width="13" stroke-linejoin="round"/>'
        + f'<path d="{path}" fill="none" stroke="#3a3a3a" stroke-width="8" stroke-linejoin="round"/>'
        + f'<path d="{path}" fill="none" stroke="#9a9a9a" stroke-width="8" stroke-dasharray="1.6 6" stroke-opacity=".55"/>'
        + f'<path d="{path}" fill="none" stroke="{RED}" stroke-width="1.6" transform="translate(0 0)" opacity=".0"/>'
    )


def gi_fittings():
    def bead(x, y, w, h, pal):
        return rect(x, y, w, h, f'url(#{pal}{"Y" if w > h else "X"})', 4)
    elbow = (
        tube('M 70 92 L 128 92 A 30 30 0 0 1 158 122 L 158 176', 42, 'gi')
        + bead(62, 68, 14, 48, 'gi') + bead(134, 172, 48, 14, 'gi')
    )
    tee = (
        tube('M 226 172 L 344 172', 42, 'steel') + tube('M 285 172 L 285 96', 42, 'steel')
        + bead(220, 148, 14, 48, 'steel') + bead(336, 148, 14, 48, 'steel') + bead(261, 90, 48, 14, 'steel')
    )
    socket = (
        rect(138, 226, 132, 38, 'url(#rubberY)', 8) + bead(132, 222, 14, 46, 'rubber') + bead(262, 222, 14, 46, 'rubber')
        + line(150, 232, 260, 232, '#ffffff', .25, 2)
    )
    return elbow + tee + socket


def ss_hoses():
    d = 'M 70 84 C 70 268, 330 268, 330 84'
    return (
        tube(d, 34, 'steel')
        + f'<path d="{d}" fill="none" stroke="url(#braid)" stroke-width="34"/>'
        + fitting(70, 84, -90, .72) + fitting(330, 84, -90, .72)
    )


def brass_fittings():
    elbow = (
        tube('M 68 90 L 118 90 A 30 30 0 0 1 148 120 L 148 168', 32, 'brass')
        + hex_h(62, 68, 30, 44, 'url(#brassY)') + hex_v(126, 162, 44, 34, 'url(#brassX)')
    )
    barb = rect(252, 140, 96, 20, 'url(#brassY)', 2, False)
    for i in range(3):
        x = 256 + i * 30
        barb += f'<polygon points="{x},140 {x + 24},132 {x + 24},168 {x},160" fill="url(#brassY)" {EDGE}/>'
    barb = hex_h(212, 126, 40, 48, 'url(#brassY)') + barb
    cap = (
        rect(230, 220, 60, 40, 'url(#brassY)', 6) + line(246, 220, 246, 260, op=.4) + line(274, 220, 274, 260, op=.4)
        + '<ellipse cx="290" cy="240" rx="7" ry="20" fill="url(#brassX)" stroke="#5e3b08" stroke-opacity=".5"/>'
    )
    union = hex_h(96, 222, 92, 36, 'url(#brassY)') + rect(90, 218, 10, 44, 'url(#brassY)', 3) + rect(184, 218, 10, 44, 'url(#brassY)', 3)
    return elbow + barb + cap + union


def injector_pipes():
    out = ''
    for k in range(3):
        oy = -k * 30
        d = f'M 74 {242 + oy} L 130 {242 + oy} C 190 {242 + oy}, 190 {116 + oy}, 250 {116 + oy} L 326 {116 + oy}'
        out += tube(d, 11, 'steel')
    for k in range(3):
        oy = -k * 30
        out += fitting(74, 242 + oy, 180, .42) + fitting(326, 116 + oy, 0, .42)
    return out


def composite_hoses():
    d = 'M 100 208 C 170 208, 160 108, 230 108 L 290 108'
    return (
        tube(d, 54, 'hose')
        + f'<path d="{d}" fill="none" stroke="#dfe6ec" stroke-width="54" stroke-dasharray="2.5 11" stroke-opacity=".45"/>'
        + f'<path d="{d}" fill="none" stroke="{RED}" stroke-width="3" transform="translate(-9 -9)" opacity=".9"/>'
        + fitting(100, 208, 180, .8, 'camlock') + fitting(290, 108, 0, .8, 'camlock')
    )


ART = [hoses, hose_fittings, couplings, adaptors, gauge, bellows, tubes_clamps, pneumatics, hose_protectors,
       oil, hose_clips, sae_flange, quick_release, valves, belts, gi_fittings, ss_hoses, brass_fittings,
       injector_pipes, composite_hoses]


def wrap(body):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" '
        'role="img">'
        + DEFS
        + '<rect width="400" height="300" fill="url(#bg)"/>'
        + '<circle cx="200" cy="146" r="122" fill="#f6f7f8" stroke="#d5d9dd" stroke-width="1.2" stroke-dasharray="3 6"/>'
        + '<ellipse cx="200" cy="268" rx="140" ry="9" fill="#000" opacity=".16" filter="url(#blur)"/>'
        + body
        + f'<rect x="0" y="293" width="400" height="7" fill="{RED}"/>'
        + '</svg>'
    )


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower().replace('&', 'and')).strip('-')


def compress_photos():
    """Turns any JPG/PNG dropped into public/products/ into a resized WebP.
    The original is moved to product-photos-original/ (outside public/, so it is not deployed)."""
    raws = [f for f in OUT.iterdir() if f.suffix.lower() in RAW_EXTS]
    if not raws:
        return
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print('Pillow is not installed - skipping photo compression (pip install pillow)')
        return
    ORIGINALS.mkdir(exist_ok=True)
    for f in raws:
        with Image.open(f) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            if im.width > MAX_WIDTH:
                im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
            target = f.with_suffix('.webp')
            im.save(target, 'WEBP', quality=WEBP_QUALITY, method=6)
        before, after = f.stat().st_size // 1024, target.stat().st_size // 1024
        f.replace(ORIGINALS / f.name)
        print(f'compressed {f.name}: {before} KB -> {after} KB')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    compress_photos()
    products = json.loads(JSON_PATH.read_text(encoding='utf-8'))
    assert len(products) == len(ART), f'{len(products)} products but {len(ART)} illustrations'
    for p, fn in zip(products, ART):
        base = slug(p['name'])
        # A real photo dropped into public/products/ (see scripts/product-image-prompts.md) wins over the SVG.
        photo = next((f for ext in PHOTO_EXTS if (f := OUT / f'{base}{ext}').exists()), None)
        if photo:
            p['image'] = f'products/{photo.name}'
            continue
        name = f'{base}.svg'
        (OUT / name).write_text(wrap(fn()), encoding='utf-8')
        p['image'] = f'products/{name}'
    # keep the file's compact one-object-per-line style
    rows = ',\n'.join(
        '  { ' + ', '.join(f'{json.dumps(k)}: {json.dumps(v, ensure_ascii=False)}' for k, v in p.items()) + ' }'
        for p in products)
    JSON_PATH.write_text(f'[\n{rows}\n]\n', encoding='utf-8')
    print(f'wrote {len(products)} images to {OUT}')


if __name__ == '__main__':
    main()
