#!/bin/bash
# Converte os takes do vídeo de acesso de terceiros para o formato do projeto.
#
#     tools/convert_clips_terceiros.sh
#
# Lê o mapa `tools/terceiros-mapa.txt` (nome de destino, nome de origem) e
# escreve em `public/terceiros/clips/`. A origem fica em `raw/terceiros/`.
#
# Mesma receita do corte de cartórios, e pelo mesmo motivo: o material chegou
# por aplicativo de mensagem, 1280x720 com `rotation -90` nos metadados — ou
# seja 720x1280 na tela — em H.264 Baseline com áudio a ~60 kb/s. Reencodar
# deixa o autorotate gravar a orientação no quadro e tira o risco de o render
# sair deitado; o upscale para 1080x1920 é lanczos aqui em vez de ficar para o
# Chromium, que ainda teria de esticar 2,5x por causa do salto de
# enquadramento do estilo.
#
# `-nostdin` não é decoração: sem ele o ffmpeg consome o stdin deste loop, que
# é o próprio mapa de nomes, e os arquivos saem com o nome mutilado.
#
# O áudio leva loudnorm em duas passagens: a medida da primeira entra na
# segunda. Em clipe curto com muito silêncio a passagem única erra o alvo.
cd /home/user/Wispot-videos
mkdir -p public/terceiros/clips
while read novo antigo; do
  [ -z "$novo" ] && continue
  src="raw/terceiros/$antigo.mp4"
  med=$(npx --no-install remotion ffmpeg -nostdin -hide_banner -vn -i "$src" \
      -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null /dev/null 2>&1 | python3 -c "
import sys, json, re
m = re.search(r'\{[^{}]*\"input_i\"[^{}]*\}', sys.stdin.read(), re.S)
if not m:
    print('FALHOU', file=sys.stderr); sys.exit(1)
d = json.loads(m.group(0))
print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")
") || { echo "MEDICAO FALHOU: $novo"; continue; }
  npx --no-install remotion ffmpeg -nostdin -v error -y -i "$src" \
    -vf "scale=1080:1920:flags=lanczos,format=yuv420p" \
    -r 30 -c:v libx264 -preset slow -crf 18 \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11:${med}:linear=true" \
    -ar 48000 -c:a aac -b:a 192k "public/terceiros/clips/$novo.mp4" 2>&1 | grep -v Warning
  echo "OK $novo  ($med)"
done < tools/terceiros-mapa.txt
echo "FIM: $(ls public/terceiros/clips/*.mp4 2>/dev/null | wc -l) clipes"
