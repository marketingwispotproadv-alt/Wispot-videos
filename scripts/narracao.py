"""
Gera a narração das histórias a partir de src/stories/narracao.json.

    pip install kokoro-onnx soundfile
    python3 scripts/narracao.py

A voz é sintética, do Kokoro (modelo aberto, licença Apache 2.0), e roda
localmente — nenhum texto sai da máquina. Na primeira execução o script baixa
o modelo (~350 MB) para ~/.cache/kokoro.

Para cada fala ele grava public/audio/narracao/<história>/<chave>.mp3,
normalizado a -16 LUFS, e escreve as durações em
src/stories/narracao-tempos.json — é desse arquivo que as composições tiram a
duração de cada plano, para nenhuma fala ser cortada.
"""

import json
import subprocess
import tempfile
import urllib.request
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "stories" / "narracao.json"
TIMES = ROOT / "src" / "stories" / "narracao-tempos.json"
OUT = ROOT / "public" / "audio" / "narracao"

CACHE = Path.home() / ".cache" / "kokoro"
BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
FILES = ["kokoro-v1.0.onnx", "voices-v1.0.bin"]


def model() -> Kokoro:
    CACHE.mkdir(parents=True, exist_ok=True)
    for f in FILES:
        if not (CACHE / f).exists():
            print("baixando", f)
            urllib.request.urlretrieve(BASE + f, CACHE / f)
    return Kokoro(str(CACHE / FILES[0]), str(CACHE / FILES[1]))


def speak(k: Kokoro, text: str, voice: str, speed: float, dest: Path) -> float:
    audio, sr = k.create(text, voice=voice, speed=speed, lang="pt-br")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, audio, sr)
        # tira o silêncio das pontas e normaliza a voz para -16 LUFS
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", tmp.name,
                "-af",
                "silenceremove=start_periods=1:start_threshold=-50dB,"
                "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
                "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100",
                "-c:a", "libmp3lame", "-b:a", "160k", str(dest),
            ],
            check=True,
        )
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)],
        capture_output=True, text=True, check=True,
    )
    return round(float(out.stdout.strip()), 3)


def main():
    script = json.loads(SCRIPT.read_text())
    voice, speed = script["voz"], script["velocidade"]
    k = model()
    times: dict[str, dict[str, float]] = {}
    for story, lines in script.items():
        if not isinstance(lines, dict):
            continue
        keys = {"capa": lines["capa"], "fim": lines["fim"], "assinatura": lines["assinatura"]}
        keys.update({str(i): t for i, t in enumerate(lines["planos"])})
        times[story] = {}
        for key, text in keys.items():
            d = speak(k, text, voice, speed, OUT / story / f"{key}.mp3")
            times[story][key] = d
            print(f"{story:13s} {key:10s} {d:5.2f}s  {text}")
    TIMES.write_text(json.dumps(times, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
