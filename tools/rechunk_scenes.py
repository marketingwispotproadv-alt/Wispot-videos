#!/usr/bin/env python3
"""
Refaz as linhas de legenda de um `scenes.ts` que já existe.

    python3 tools/rechunk_scenes.py src/pieces/minhaPeca/scenes.ts

Serve para quando só a quebra da legenda muda — o `build_scenes.py` inteiro
transcreveria os clipes de novo, o que leva meia hora e, pior, desfaz as
correções feitas à mão em cima do que o modelo devolveu.

Aqui as palavras e os tempos são lidos do próprio arquivo e passados pelo
`chunk()` do `build_scenes.py`, que é onde mora a regra de quebra. Nada mais
do arquivo muda: `clip`, `trimStart`, `trimEnd` e `silence` saem como entraram.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_scenes import chunk  # noqa: E402

PALAVRA = re.compile(
    r'\{ text: (?P<t>"(?:[^"\\\\]|\\\\.)*"), start: (?P<s>[\d.]+), end: (?P<e>[\d.]+)'
    r"(?P<hl>, hl: true)? \}"
)


def render(grupos) -> str:
    linhas = []
    for grupo in grupos:
        corpo = ", ".join(
            "{{ text: {}, start: {}, end: {}{} }}".format(
                json.dumps(w["t"], ensure_ascii=False), w["s"], w["e"],
                ", hl: true" if w["hl"] else "")
            for w in grupo
        )
        linhas.append(f"      {{ words: [{corpo}] }},\n")
    return "".join(linhas)


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__, file=sys.stderr)
        return 1
    caminho = Path(sys.argv[1])
    linhas = caminho.read_text(encoding="utf-8").splitlines(keepends=True)

    saida, i = [], 0
    cenas = antes_total = depois_total = 0
    clip = ini = fim = None
    while i < len(linhas):
        ln = linhas[i]
        m = re.match(r'\s*clip: "([^"]+)",', ln)
        if m:
            clip = m.group(1)
        m = re.match(r"\s*trimStart: ([\d.]+),", ln)
        if m:
            ini = float(m.group(1))
        m = re.match(r"\s*trimEnd: ([\d.]+),", ln)
        if m:
            fim = float(m.group(1))
        if ln.strip() == "chunks: [":
            saida.append(ln)
            i += 1
            corpo = []
            while i < len(linhas) and linhas[i].strip() != "],":
                corpo.append(linhas[i])
                i += 1
            palavras = [
                {"t": json.loads(p["t"]), "s": float(p["s"]),
                 "e": float(p["e"]), "hl": bool(p["hl"])}
                for p in PALAVRA.finditer("".join(corpo))
            ]
            grupos = chunk(palavras, fim - ini)
            print(f"{clip:18} {len(corpo)} → {len(grupos)} linhas")
            cenas += 1
            antes_total += len(corpo)
            depois_total += len(grupos)
            saida.append(render(grupos))
            continue
        saida.append(ln)
        i += 1

    if not cenas:
        print(f"nenhuma cena reconhecida em {caminho}", file=sys.stderr)
        return 1
    caminho.write_text("".join(saida), encoding="utf-8")
    print(f"\n{cenas} cenas, {antes_total} → {depois_total} linhas de legenda")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
