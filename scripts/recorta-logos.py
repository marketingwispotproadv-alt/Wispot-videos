"""
Recorta os logos dos produtos (JPEG sobre fundo branco, em assets-src/logos)
e gera PNGs com transparência em public/brand/products.

    python3 scripts/recorta-logos.py

O alfa sai da distância de cada pixel até o branco (o canal mais escuro), e a
cor é "desmultiplicada" do branco — assim a borda fica suave, sem franja, e o
branco de dentro das letras vira transparente. Nos logos de uma cor só a cor
é trocada pela cor dominante, o que limpa o ruído de compressão do JPEG.

Além da versão colorida, os logos de uma cor (e o MyGuest) ganham uma versão
branca, para ir sobre o azul institucional.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "logos"
OUT = ROOT / "public" / "brand" / "products"

# logos de uma cor só: a versão branca é o mesmo alfa com RGB branco
MONO = {"wiquest", "wimap", "hora-premiada"}


def extract(path: Path):
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    ink = 255 - rgb.min(axis=2)
    # o piso tira o chuvisco do JPEG em volta; o divisor deixa o cinza do
    # MyGuest (canal mínimo ~120) totalmente opaco
    alpha = np.clip((ink - 10) / 110, 0, 1)
    a = np.maximum(alpha, 1e-3)[..., None]
    color = np.clip((rgb - 255 * (1 - a)) / a, 0, 255)
    return color, alpha


def crop(color, alpha, pad=24, max_w=1400):
    ys, xs = np.where(alpha > 0.03)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, alpha.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, alpha.shape[1])
    rgba = np.dstack([color, alpha * 255])[y0:y1, x0:x1].round().astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(SRC.glob("*.jpg")):
        name = path.stem
        color, alpha = extract(path)

        if name in MONO:
            solid = alpha > 0.95
            dominant = np.median(color[solid], axis=0)
            color[:] = dominant

        if name == "myguest":
            # o boneco branco dentro do quadrado vermelho é um "buraco" grande
            # no alfa; os miolos das letras são buracos pequenos e ficam
            # transparentes
            mask = alpha > 0.5
            holes, n = ndimage.label(ndimage.binary_fill_holes(mask) & ~mask)
            sizes = ndimage.sum(np.ones_like(alpha), holes, range(1, n + 1))
            for i, size in enumerate(sizes, start=1):
                if size > 3000:
                    region = ndimage.binary_dilation(holes == i, iterations=3)
                    alpha[region] = np.maximum(alpha[region], 1)
                    color[holes == i] = 255

        crop(color, alpha).save(OUT / f"{name}.png")

        if name in MONO or name == "myguest":
            white = color.copy()
            if name in MONO:
                white[:] = 255
            else:
                # só o texto cinza vira branco; os quadrados coloridos ficam
                sat = color.max(axis=2) - color.min(axis=2)
                white[sat < 40] = 255
            crop(white, alpha).save(OUT / f"{name}-white.png")
        print("ok", name)


if __name__ == "__main__":
    main()
