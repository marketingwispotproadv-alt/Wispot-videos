#!/usr/bin/env python3
"""
Monta o `scenes.ts` de uma peça a partir dos clipes e do roteiro.

    python3 tools/build_scenes.py \
        --clips public/proadv/clips \
        --roteiro roteiro.txt \
        --out src/pieces/proadvancedFirewall/scenes.ts

Um clipe por frase do roteiro, na ordem em que o nome do arquivo ordena.
O que a ferramenta faz, e por quê:

1. Transcreve com faster-whisper `large-v3`, word timestamps ligados, passando
   o roteiro inteiro como `initial_prompt`. Sem isso os nomes de marca saem
   errados — "firewall" já virou "falho", "faro" e "Fyro" aqui.

2. Descarta alucinação. Pedir transcrição de trecho mudo devolve "Tchau",
   "Boa noite", "Se inscreva no canal" — frase de YouTube que o modelo despeja
   quando não há fala. O que desmascara é o nível: esses trechos ficam dezenas
   de dB abaixo do pico da fala. A ferramenta mede e avisa.

3. Ancora o corte na primeira e na última palavra que batem com o roteiro,
   com folga de 0,20 s na cabeça e 0,30 s na cauda. É essa folga que o
   `src/template/timing.ts` mede depois para decidir cada emenda.

O que ela NÃO decide sozinha: take com mais de uma tentativa dentro do arquivo.
Aí o áudio extra é real, não alucinação, e escolher a tomada boa é julgamento.
A ferramenta detecta e lista os candidatos; você responde com `--regiao`.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
import wave
from pathlib import Path

import numpy as np

HEAD_HANDLE = 0.20
TAIL_HANDLE = 0.30
# Abaixo disto, em relação ao pico da fala, o trecho é ruído — não fala.
QUIET_DB = -26.0


def normalise(word: str) -> str:
    w = unicodedata.normalize("NFD", word.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)


def extract_audio(clip: Path, dest: Path) -> None:
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", str(clip),
         "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(dest)],
        check=True,
    )


def envelope(path: Path, hop_s: float = 0.02):
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        pcm = np.frombuffer(w.readframes(w.getnframes()), np.int16)
    audio = pcm.astype(float) / 32768
    hop = int(sr * hop_s)
    rms = np.array([
        np.sqrt((audio[i:i + hop] ** 2).mean() + 1e-12)
        for i in range(0, max(1, len(audio) - hop), hop)
    ])
    return 20 * np.log10(rms), hop_s, len(audio) / sr


def peak_db(db: np.ndarray, hop_s: float, start: float, end: float) -> float:
    lo, hi = int(start / hop_s), max(int(start / hop_s) + 1, int(end / hop_s))
    window = db[lo:hi]
    return float(window.max()) if len(window) else -120.0


def speech_runs(db: np.ndarray, hop_s: float, floor_db: float, gap_s: float = 0.6):
    """Trechos com fala, separados por silêncios maiores que `gap_s`."""
    voiced = np.where(db > floor_db)[0]
    if not len(voiced):
        return []
    runs, start, prev = [], voiced[0], voiced[0]
    for i in voiced[1:]:
        if (i - prev) * hop_s > gap_s:
            runs.append((start * hop_s, (prev + 1) * hop_s))
            start = i
        prev = i
    runs.append((start * hop_s, (prev + 1) * hop_s))
    return runs


def slice_wav(src: Path, dest: Path, lo: float, hi: float) -> None:
    with wave.open(str(src)) as w:
        sr, n = w.getframerate(), w.getnframes()
        pcm = np.frombuffer(w.readframes(n), np.int16)
    cut = pcm[int(lo * sr):int(hi * sr)]
    with wave.open(str(dest), "w") as o:
        o.setnchannels(1)
        o.setsampwidth(2)
        o.setframerate(sr)
        o.writeframes(cut.tobytes())


def transcribe(model, path: Path, prompt: str, offset: float = 0.0):
    segments, _ = model.transcribe(
        str(path), language="pt", vad_filter=False, beam_size=5,
        word_timestamps=True, condition_on_previous_text=False,
        initial_prompt=prompt, temperature=0.0,
    )
    return [
        {"t": w.word.strip(), "s": round(w.start + offset, 2), "e": round(w.end + offset, 2)}
        for seg in segments for w in seg.words
    ]


def script_words(roteiro: str) -> set[str]:
    return {normalise(w) for w in roteiro.split() if normalise(w)}


STEM = 4


def in_script(word: str, vocab: set[str]) -> bool:
    """
    Casa com o roteiro tolerando flexão: quem lê raramente diz a frase escrita
    palavra por palavra. "operações" por "operação" e "podem" por "pode" são a
    mesma fala, e descartá-las cortaria o fim de uma cena.
    """
    w = normalise(word)
    if not w:
        return False
    if w in vocab:
        return True
    if len(w) < STEM:
        return False
    return any(v.startswith(w[:STEM]) or w.startswith(v[:STEM])
               for v in vocab if len(v) >= STEM)


def trim_to_script(words, vocab):
    """Primeira e última palavra que existem no roteiro; o resto das pontas cai."""
    keep = [i for i, w in enumerate(words) if in_script(w["t"], vocab)]
    return (keep[0], keep[-1]) if keep else (0, len(words) - 1)


def drop_loop(words):
    """
    O modelo às vezes entra em laço e transcreve a mesma frase duas vezes num
    clipe curto demais para ela caber duas vezes. Quando o fim da lista repete
    o que veio logo antes, a repetição sai.
    """
    n = len(words)
    for size in range(n // 2, 1, -1):
        head = [normalise(w["t"]) for w in words[n - 2 * size:n - size]]
        tail = [normalise(w["t"]) for w in words[n - size:]]
        if head == tail:
            return words[:n - size]
    return words


def respell(words, roteiro: str):
    """
    Conserta caixa alta. O modelo às vezes devolve uma frase inteira em
    maiúsculas, e a legenda não deve herdar isso.

    Só mexe em palavra toda em maiúscula, e a chave preserva o acento: sem isso
    "e" e "é" viram a mesma entrada, e o roteiro passa a reescrever uma pela
    outra — que é um erro bem pior do que o que se quer corrigir.
    """
    canon: dict[str, str] = {}
    for w in roteiro.split():
        core = w.strip('.,;:!?()"\u2014')
        if core and core.lower() not in canon:
            canon[core.lower()] = core

    out = []
    for w in words:
        core = w["t"].rstrip(".,;:!?")
        tail = w["t"][len(core):]
        good = canon.get(core.lower()) if core.isupper() and len(core) > 1 else None
        out.append({**w, "t": good + tail} if good else dict(w))
    return out


def tidy(words, names: list[str], roteiro: str):
    """
    Duas limpezas que a transcrição sempre pede:

    - gagueira e repetição saem (a leitura repete a palavra, o modelo
      transcreve as duas);
    - nome de marca com mais de uma palavra vira um símbolo só, senão a
      legenda pode quebrar "Pro" numa linha e "Advanced" na seguinte.
    """
    words = drop_loop(words)
    joined = []
    for w in words:
        if joined and normalise(joined[-1]["t"]) == normalise(w["t"]):
            joined[-1]["e"] = w["e"]
            continue
        joined.append(dict(w))

    for name in names:
        parts = [normalise(p) for p in name.split()]
        if len(parts) < 2:
            continue
        out, i = [], 0
        while i < len(joined):
            window = joined[i:i + len(parts)]
            if (len(window) == len(parts)
                    and all(normalise(w["t"]).startswith(p)
                            for w, p in zip(window, parts))):
                text = name + re.sub(r"[\w]", "", window[-1]["t"])
                out.append({"t": text, "s": window[0]["s"], "e": window[-1]["e"]})
                i += len(parts)
            else:
                out.append(joined[i])
                i += 1
        joined = out
    return respell(joined, roteiro)


def chunk(words, max_words=4, max_span=2.0, gap=0.34):
    out, cur = [], []
    for w in words:
        if cur and (len(cur) >= max_words
                    or w["s"] - cur[0]["s"] > max_span
                    or w["s"] - cur[-1]["e"] > gap):
            out.append(cur)
            cur = []
        cur.append(w)
    if cur:
        out.append(cur)
    return out


def render_ts(scenes, highlights: set[str]) -> str:
    lines = [
        "// Gerado por `tools/build_scenes.py`. Os tempos das legendas são",
        "// relativos ao início da cena já cortada; a folga muda nas pontas é o",
        "// que `src/template/timing.ts` mede para decidir cada emenda.",
        "",
        'import type { SceneDef } from "../../template/types";',
        "",
        "export const SCENES: SceneDef[] = [",
    ]
    for sc in scenes:
        phrase = " ".join(w["t"] for w in sc["words"])
        lines += [
            "  {",
            f"    // {json.dumps(phrase, ensure_ascii=False)[1:-1]}",
            f'    clip: "{sc["clip"]}",',
            f'    trimStart: {sc["trimStart"]},',
            f'    trimEnd: {sc["trimEnd"]},',
            "    chunks: [",
        ]
        for group in chunk(sc["words"]):
            body = ", ".join(
                "{{ text: {}, start: {}, end: {}{} }}".format(
                    json.dumps(w["t"], ensure_ascii=False), w["s"], w["e"],
                    ", hl: true" if normalise(w["t"]) in highlights else "")
                for w in group
            )
            lines.append(f"      {{ words: [{body}] }},")
        lines += ["    ],", "  },"]
    lines += ["];", ""]
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--clips", required=True, type=Path,
                    help="pasta com os .mp4 já convertidos")
    ap.add_argument("--roteiro", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--destaques", default="",
                    help="termos que ganham a cor da marca, separados por vírgula")
    ap.add_argument("--regiao", action="append", default=[], metavar="CLIPE:INI-FIM",
                    help="take com mais de uma tentativa: o trecho a aproveitar, "
                         "em segundos (ex.: 8424:5.3-8.8). Pode repetir.")
    ap.add_argument("--nomes", default="",
                    help="nomes de marca com mais de uma palavra, separados por "
                         "vírgula (ex.: \"Pro Advanced\"), para a legenda não "
                         "quebrá-los entre duas linhas")
    ap.add_argument("--modelo", default="large-v3")
    args = ap.parse_args()

    regions = {}
    for spec in args.regiao:
        clip, span = spec.split(":")
        lo, hi = span.split("-")
        regions[clip] = (float(lo), float(hi))

    roteiro = args.roteiro.read_text(encoding="utf-8")
    vocab = script_words(roteiro)
    highlights = {normalise(t) for t in args.destaques.split(",") if t.strip()}
    names = [n.strip() for n in args.nomes.split(",") if n.strip()]

    from faster_whisper import WhisperModel
    model = WhisperModel(args.modelo, device="cpu", compute_type="int8")

    clips = sorted(args.clips.glob("*.mp4"))
    if not clips:
        print(f"nenhum .mp4 em {args.clips}", file=sys.stderr)
        return 1

    scenes, warnings = [], []
    with tempfile.TemporaryDirectory() as tmp:
        for clip in clips:
            name = clip.stem
            wav = Path(tmp) / f"{name}.wav"
            extract_audio(clip, wav)
            db, hop_s, duration = envelope(wav)
            floor_db = db.max() + QUIET_DB

            lo, hi = regions.get(name, (0.0, duration))
            runs = [r for r in speech_runs(db, hop_s, floor_db) if r[1] > lo and r[0] < hi]
            if name not in regions and len(runs) > 1:
                spans = ", ".join(f"{a:.2f}-{b:.2f}" for a, b in runs)
                warnings.append(
                    f"  {name}: {len(runs)} trechos de fala separados ({spans}).\n"
                    f"      Pode ser take com mais de uma tentativa. Confira e, se for,\n"
                    f"      passe --regiao {name}:INI-FIM com a tomada boa."
                )

            # Com --regiao o áudio é cortado ANTES de transcrever. Filtrar as
            # palavras depois não serve: num take com tentativa falsa os tempos
            # que o modelo devolve para o trecho ruim são justamente os que não
            # dá para confiar.
            if name in regions:
                piece = Path(tmp) / f"{name}.regiao.wav"
                slice_wav(wav, piece, lo, hi)
                words = transcribe(model, piece, roteiro, offset=lo)
            else:
                words = transcribe(model, wav, roteiro)
            words = tidy(words, names, roteiro)
            if not words:
                warnings.append(f"  {name}: nada transcrito no trecho pedido; clipe ignorado.")
                continue

            first, last = trim_to_script(words, vocab)
            dropped = words[:first] + words[last + 1:]
            for w in dropped:
                level = peak_db(db, hop_s, w["s"], w["e"]) - db.max()
                if level > -14:
                    warnings.append(
                        f"  {name}: descartei {w['t']!r} em {w['s']:.2f}s, mas o nível está\n"
                        f"      só {level:.0f} dB abaixo do pico — é fala de verdade, não alucinação."
                    )

            words = words[first:last + 1]
            start = max(0.0, words[0]["s"] - HEAD_HANDLE)
            end = min(duration, words[-1]["e"] + TAIL_HANDLE)
            scenes.append({
                "clip": name,
                "trimStart": round(start, 2),
                "trimEnd": round(end, 2),
                "words": [{"t": w["t"], "s": round(w["s"] - start, 2),
                           "e": round(w["e"] - start, 2)} for w in words],
            })
            print(f"{name}  {start:5.2f}→{end:5.2f}  "
                  f"{' '.join(w['t'] for w in words)}")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(render_ts(scenes, highlights), encoding="utf-8")
    total = sum(s["trimEnd"] - s["trimStart"] for s in scenes)
    print(f"\n{len(scenes)} cenas, {total:.2f}s → {args.out}")

    if warnings:
        print("\nConfira antes de renderizar:")
        print("\n".join(warnings))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
