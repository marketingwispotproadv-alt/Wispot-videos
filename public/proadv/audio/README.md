# Áudio — ProAdvanced

A trilha e os efeitos da peça vão aqui. Nada do `public/audio` da Wispot serve:
aquela trilha foi licenciada para o MyGuest e não cobre vídeo de outra marca.

## O que está aqui

| Arquivo | O que é |
| --- | --- |
| `trilha.mp3` | *Funky Corporate Explainer*, de Alex Morgan, esticada para caber na peça |
| `whoosh.wav` | efeito de corte, sintetizado em `tools/make_whoosh.py` |

### Como a trilha foi ajustada

O original tem 38,52 s e a peça 52,93 s. Repetir e cortar no talho deixa a
emenda à mostra, então `tools/fit_music.py` corta na grade musical:

```bash
python3 tools/fit_music.py original.mp3 public/proadv/audio/trilha.mp3 52.93
```

- batida medida por autocorrelação do envelope de ataque: **110,4 BPM**,
  compasso de 2,1746 s;
- monta **introdução → miolo → miolo repetido por 7 compassos → cauda**, com
  cruzamento de meia batida em cada emenda;
- normaliza a −20 dBFS de RMS.

Guardar a cauda original importa: é ela que resolve a faixa embaixo do cartão
final, em vez de o vídeo terminar com a música cortada no meio de uma frase.

**Atenção**: o número no fim do comando é a duração do vídeo **final**. Mexer
em `speed` muda essa duração e a trilha precisa ser remontada — do contrário a
cauda fica de fora. Foi o que aconteceu ao acelerar a peça em 8%: a trilha
estava montada para 56,75 s e passou a ser cortada 4 s antes do fim.

O volume na peça é montado por `template/components/MusicBed.tsx`: baixo sob a
locução, subindo no cartão final.

**Conferido**: nenhuma queda de nível nas emendas. Se elas soarem, é questão de
ouvido e não de medida — vale escutar antes de publicar.

## Onde baixar

Como é vídeo de empresa, vale usar fonte com licença comercial explícita.

**Pagas, e é o que eu recomendaria para uso recorrente**

- [Epidemic Sound](https://www.epidemicsound.com) — assinatura, cobre trilha e
  efeito, licença clara para redes sociais e anúncio
- [Artlist](https://artlist.io) — assinatura, mesma ideia

**Gratuitas**

- [Pixabay](https://pixabay.com/music/) — trilha e efeito, sem exigir crédito
- [Uppbeat](https://uppbeat.io) — camada gratuita pede crédito; a paga não
- [Freesound](https://freesound.org) — bom acervo de efeito, mas **a licença
  varia de arquivo para arquivo**: confira antes, tem CC que exige atribuição

Evite tirar o áudio de vídeo dos outros, mesmo de referência — é o caminho
curto para tomar *strike* no Instagram e no YouTube.

## Que tipo de trilha combina

O roteiro é sobre risco e controle, e a peça fecha em confiança. Instrumental
de base eletrônica, andamento médio, sem vocal e sem virada dramática no meio —
o corte já tem ritmo de sobra, e trilha com muito evento briga com a locução.
