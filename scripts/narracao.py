"""
Gera a narração das histórias a partir de src/stories/narracao.json.

    pip install edge-tts soundfile numpy   # motor "edge"
    pip install kokoro-onnx                # motor "kokoro", além dos de cima
    python3 scripts/narracao.py            # todas as narrações
    python3 scripts/narracao.py painel     # só as que forem nomeadas

O campo "motor" do roteiro escolhe a voz:

- "edge": vozes neurais da Microsoft (a Francisca, pt-BR-FranciscaNeural), as
  mais naturais. Usa o acesso gratuito do leitor do Edge, que não é oficial;
  para uso comercial as mesmas vozes estão no Azure Speech, que é pago.
- "kokoro": modelo aberto (Apache 2.0) que roda local, sem internet. Na
  primeira execução baixa o modelo (~350 MB) para ~/.cache/kokoro. Soa mais
  robótico e pede mais grafias fonéticas (uai-fai, pôstit, tchéquin).

Antes de falar, cada texto passa pelo dicionário "pronuncia" do roteiro, que
troca os nomes das marcas pelo jeito de falar (Wispot → uispót). Uma fala
também pode ser uma lista de pedaços, gerados à parte e emendados com uma
pausa curta; pedaços iguais reaproveitam o mesmo áudio, e é assim que o
"Wispot." soa igual em todos os vídeos.

Para cada fala ele grava public/audio/narracao/<história>/<chave>.mp3,
normalizado a -16 LUFS, e escreve as durações em
src/stories/narracao-tempos.json — é desse arquivo que as composições tiram a
duração de cada plano, para nenhuma fala ser cortada.
"""

import asyncio
import json
import os
import re
import ssl
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "stories" / "narracao.json"
TIMES = ROOT / "src" / "stories" / "narracao-tempos.json"
OUT = ROOT / "public" / "audio" / "narracao"

CACHE = Path.home() / ".cache" / "kokoro"
BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
FILES = ["kokoro-v1.0.onnx", "voices-v1.0.bin"]


def kokoro(voice: str, speed: float):
    from kokoro_onnx import Kokoro

    CACHE.mkdir(parents=True, exist_ok=True)
    for f in FILES:
        if not (CACHE / f).exists():
            print("baixando", f)
            urllib.request.urlretrieve(BASE + f, CACHE / f)
    k = Kokoro(str(CACHE / FILES[0]), str(CACHE / FILES[1]))

    def say(text: str, raw: str):
        audio, sr = k.create(text, voice=voice, speed=speed, lang="pt-br")
        sf.write(raw, audio, sr, format="WAV")

    return say


def edge(voice: str, rate: str):
    import edge_tts
    import edge_tts.communicate

    # atrás de um proxy com certificado próprio, usa a cadeia de SSL_CERT_FILE
    if os.environ.get("SSL_CERT_FILE"):
        edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])

    def say(text: str, raw: str):
        asyncio.run(edge_tts.Communicate(text, voice, rate=rate).save(raw))

    return say


TRIM = (
    "silenceremove=start_periods=1:start_threshold=-50dB,"
    "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
)
GAP = 0.16  # pausa entre os pedaços de uma fala, em segundos


def piece(say, text: str, cache: dict[str, np.ndarray]) -> np.ndarray:
    """Um pedaço de fala, sem silêncio nas pontas. Texto igual devolve o mesmo áudio."""
    if text not in cache:
        with tempfile.NamedTemporaryFile(suffix=".audio") as raw, tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            for attempt in range(5):
                try:
                    say(text, raw.name)
                    break
                except Exception:
                    if attempt == 4:
                        raise
                    time.sleep(2 ** attempt)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw.name, "-af", TRIM, "-ac", "1", "-ar", "44100", wav.name], check=True)
            cache[text] = sf.read(wav.name, dtype="float32")[0]
    return cache[text]


def speak(say, pieces: list[str], dest: Path, cache: dict[str, np.ndarray]) -> float:
    gap = np.zeros(int(44100 * GAP), dtype=np.float32)
    parts = []
    for i, text in enumerate(pieces):
        if i:
            parts.append(gap)
        parts.append(piece(say, text, cache))
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, np.concatenate(parts), 44100)
        # normaliza a voz para -16 LUFS
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", tmp.name,
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100",
                "-c:a", "libmp3lame", "-b:a", "160k", str(dest),
            ],
            check=True,
        )
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)],
        capture_output=True, text=True, check=True,
    )
    return round(float(out.stdout.strip()), 3)


def pronounce(text: str, words: dict[str, str]) -> str:
    for word, said in words.items():
        text = re.sub(rf"\b{re.escape(word)}\b", said, text)
    return text


def main():
    script = json.loads(SCRIPT.read_text())
    voice, speed = script["voz"], script["velocidade"]
    say = edge(voice, speed) if script.get("motor", "kokoro") == "edge" else kokoro(voice, speed)
    words = script.get("pronuncia", {})
    cache: dict[str, np.ndarray] = {}
    only = set(sys.argv[1:])
    times: dict[str, dict[str, float]] = json.loads(TIMES.read_text()) if only and TIMES.exists() else {}
    for story, lines in script.items():
        if not isinstance(lines, dict) or "planos" not in lines or (only and story not in only):
            continue
        keys = {"capa": lines["capa"], "fim": lines["fim"], "assinatura": lines["assinatura"]}
        keys.update({str(i): t for i, t in enumerate(lines["planos"])})
        times[story] = {}
        for key, text in keys.items():
            pieces = text if isinstance(text, list) else [text]
            d = speak(say, [pronounce(p, words) for p in pieces], OUT / story / f"{key}.mp3", cache)
            times[story][key] = d
            print(f"{story:13s} {key:10s} {d:5.2f}s  {' '.join(pieces)}")
    TIMES.write_text(json.dumps(times, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
