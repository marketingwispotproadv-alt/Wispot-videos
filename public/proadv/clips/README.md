# Clipes — ProAdvanced

Os arquivos de vídeo deste roteiro vão aqui, já convertidos para H.264 SDR
1080×1920 a 30 fps. Pode manter a numeração original da câmera: a ordem das
cenas vem do roteiro e da transcrição do áudio, não do nome do arquivo.

Se o material vier em HEVC 10 bits HDR direto da câmera, converta antes — o
GitHub rejeita arquivo acima de 100 MB, e o render fica mais leve:

```bash
npx remotion ffmpeg -i entrada.mov \
  -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,\
tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=1080:1920:flags=lanczos,format=yuv420p" \
  -r 30 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k public/proadv/clips/saida.mp4
```
