#!/usr/bin/env python3
"""
Sintetiza o efeito de corte da peça.

    python3 tools/make_whoosh.py public/proadv/audio/whoosh.wav

Feito em casa de propósito: efeito de transição é a parte mais fácil de
resolver sem depender de licença de banco de som, e um *swish* é só ruído
passado por um filtro que sobe.

A forma importa mais do que o timbre. O pico cai a 0,12 s do início do
arquivo, e `CutSfx` entra com o som adiantado desse tanto para o pico bater no
quadro do corte — efeito de transição que começa no corte chega tarde ao
ouvido.
"""

import sys
import wave

import numpy as np

SR = 48000
DUR = 0.34
PEAK = 0.12


def whoosh(seed: int = 7) -> np.ndarray:
    n = int(SR * DUR)
    t = np.arange(n) / SR
    noise = np.random.default_rng(seed).normal(0, 1, n)

    # Filtro de estado variável com a frequência subindo em curva log: é o que
    # dá caráter de swish em vez de chiado.
    fc = 260 * (5200 / 260) ** (t / DUR)
    q = 1.35
    low = band = 0.0
    swept = np.empty(n)
    for i in range(n):
        f = 2 * np.sin(np.pi * min(fc[i], SR * 0.24) / SR)
        high = noise[i] - low - (1 / q) * band
        band += f * high
        low += f * band
        swept[i] = band

    # Ataque rápido, cauda curta.
    env = np.where(t < PEAK, (t / PEAK) ** 1.6, np.exp(-(t - PEAK) / 0.075))
    swept *= env

    # Um toque de corpo grave, senão fica fino demais no alto-falante do celular.
    thump = np.sin(2 * np.pi * 92 * t) * np.exp(-t / 0.05) * 0.5

    mix = swept / np.abs(swept).max() * 0.82 + thump * 0.28
    mix = np.tanh(mix * 1.15)
    mix = mix / np.abs(mix).max() * 0.89

    # 3 ms de fade nas pontas, senão estala.
    k = int(SR * 0.003)
    mix[:k] *= np.linspace(0, 1, k)
    mix[-k:] *= np.linspace(1, 0, k)
    return mix


def main() -> int:
    dest = sys.argv[1] if len(sys.argv) > 1 else "public/proadv/audio/whoosh.wav"
    samples = whoosh()
    with wave.open(dest, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((samples * 32767).astype(np.int16).tobytes())
    print(f"{dest}  {DUR:.2f}s, pico em {PEAK:.2f}s, "
          f"{20 * np.log10(np.abs(samples).max()):.1f} dBFS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
