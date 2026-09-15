#!/usr/bin/env bash
# Converte o material bruto para o formato do projeto.
#
#     tools/convert_clips.sh ~/brutos public/proadv/clips
#
# Saída: H.264 SDR 1080×1920 a 30 fps, faixa de cor limited, áudio a −16 LUFS.
#
# A pegadinha é a faixa de cor. iPhone grava full range (pc, yuvj420p) e o
# projeto é limited (tv, yuv420p); sem converter, o mesmo preto sai em nível
# diferente de uma peça para outra. Vídeo deitado com rotação nos metadados o
# ffmpeg endireita sozinho na decodificação.
set -euo pipefail

src="${1:?uso: $0 <pasta-com-brutos> <pasta-de-saida>}"
dest="${2:?uso: $0 <pasta-com-brutos> <pasta-de-saida>}"
mkdir -p "$dest"

shopt -s nullglob nocaseglob
for file in "$src"/*.{mov,mp4,m4v}; do
  name=$(basename "${file%.*}")
  name=${name#IMG_}
  echo "→ $name"
  npx remotion ffmpeg -v error -y -i "$file" \
    -vf "scale=1080:1920:flags=lanczos:in_range=full:out_range=limited,format=yuv420p" \
    -r 30 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
    -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k \
    -movflags +faststart "$dest/$name.mp4"
done
echo "pronto: $(ls -1 "$dest"/*.mp4 | wc -l) clipes em $dest"
