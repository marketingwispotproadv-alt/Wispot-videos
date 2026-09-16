#!/usr/bin/env python3
"""
Estica (ou encurta) uma trilha para a duração exata de uma peça, cortando na
grade musical em vez de no talho.

    python3 tools/fit_music.py original.mp3 public/proadv/audio/trilha.mp3 52.93

Repetir a faixa e cortar onde der deixa a emenda à mostra. Aqui a batida é
medida por autocorrelação do envelope de ataque, e as emendas caem em compasso
inteiro, com cruzamento de meia batida.

A peça montada é **introdução → miolo → miolo repetido → cauda**. Guardar a
cauda original importa: é ela que resolve a faixa no fim do vídeo, em vez de a
música morrer cortada no meio de uma frase.

Cuidado: a duração alvo é a do vídeo **final**. Mexer em `speed` muda essa
duração, e a trilha precisa ser remontada — senão a cauda fica de fora.
"""

from __future__ import annotations

import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 48000


def decode(src: Path, dest: Path) -> np.ndarray:
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", str(src),
         "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", str(dest)],
        check=True,
    )
    with wave.open(str(dest)) as w:
        pcm = np.frombuffer(w.readframes(w.getnframes()), np.int16)
    return pcm.astype(np.float64).reshape(-1, 2) / 32768


def grid(audio: np.ndarray) -> tuple[float, float]:
    """Devolve (batida, fase) em segundos."""
    mono = audio.mean(1)
    k = int(SR / 200)
    env = np.array([mono[i:i + k].std() for i in range(0, len(mono) - k, k)])
    flux = np.maximum(0, np.diff(env))
    flux /= flux.max()
    fs = 200.0

    centred = flux - flux.mean()
    ac = np.correlate(centred, centred, "full")[len(flux) - 1:]
    lags = np.arange(1, len(ac))
    bpm = 60 * fs / lags
    keep = (bpm > 85) & (bpm < 135)
    lag = lags[keep][np.argmax(ac[1:][keep])]
    y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
    beat = (lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)) / fs

    best = (0.0, -1.0)
    for off in np.arange(0, beat, 1 / fs):
        idx = np.round((np.arange(0, len(flux) / fs - beat, beat) + off) * fs)
        idx = idx.astype(int)
        score = flux[idx[idx < len(flux)]].sum()
        if score > best[1]:
            best = (off, score)
    return beat, best[0]


def crossfade(parts: list[np.ndarray], seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    out = parts[0]
    for part in parts[1:]:
        t = np.linspace(0, 1, n)[:, None]
        mixed = out[-n:] * np.cos(t * np.pi / 2) + part[:n] * np.sin(t * np.pi / 2)
        out = np.concatenate([out[:-n], mixed, part[n:]])
    return out


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__)
        return 1
    src, dest, target = Path(sys.argv[1]), Path(sys.argv[2]), float(sys.argv[3])

    with tempfile.TemporaryDirectory() as tmp:
        audio = decode(src, Path(tmp) / "src.wav")
        beat, phase = grid(audio)
        bar = beat * 4
        duration = len(audio) / SR
        print(f"batida {beat:.4f}s ({60 / beat:.1f} BPM), compasso {bar:.4f}s")

        def bar_at(t: float) -> float:
            return phase + round((t - phase) / bar) * bar

        loop_lo = bar_at(duration * 0.23)
        loop_hi = bar_at(duration * 0.79)
        cut = lambda a, b: audio[int(a * SR):int(b * SR)].copy()  # noqa: E731

        best = None
        for bars in range(0, 40):
            parts = [cut(0, loop_hi)]
            if bars:
                parts.append(cut(loop_lo, loop_lo + bars * bar))
            parts.append(cut(loop_hi, duration))
            y = crossfade(parts, beat / 2)
            got = len(y) / SR
            if best is None or abs(got - target) < abs(best[1] - target):
                best = (bars, got, y)
        bars, got, y = best
        print(f"miolo {loop_lo:.2f}→{loop_hi:.2f}s repetido por {bars} compassos"
              f"  →  {got:.2f}s (alvo {target:.2f}s)")

    fade_in, fade_out = int(SR * 0.8), int(SR * 1.6)
    y[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    y[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
    y *= 10 ** (-20 / 20) / np.sqrt((y ** 2).mean())
    peak = np.abs(y).max()
    if peak > 0.95:
        y *= 0.95 / peak

    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "out.wav"
        with wave.open(str(wav), "w") as o:
            o.setnchannels(2)
            o.setsampwidth(2)
            o.setframerate(SR)
            o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", str(wav),
             "-c:a", "libmp3lame", "-b:a", "192k", str(dest)],
            check=True,
        )
    print(f"{dest}  RMS {20 * np.log10(np.sqrt((y ** 2).mean())):.1f} dBFS, "
          f"pico {20 * np.log10(np.abs(y).max()):.1f} dBFS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
