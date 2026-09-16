# Wispot — Vídeos

Projeto [Remotion](https://remotion.dev) para as peças de vídeo da Wispot.

## Composições

| ID | Formato | Duração | O que é |
| --- | --- | --- | --- |
| `MyGuest` | 1080×1920 (9:16) | ~44,8 s | Vídeo institucional do MyGuest, com locução, trilha, legendas sincronizadas e gráficos de marca |
| `Capa` | 1080×1920 | still | Capa do post, montada sobre um frame do próprio material |
| `CartaoFinal` | 1080×1920 | 3,6 s | Cartão final isolado, para reaproveitar em outras peças |

## Comandos

```bash
npm run dev                                  # abre o Remotion Studio
npx remotion render MyGuest out/myguest.mp4  # renderiza o vídeo
npx remotion still Capa out/capa/capa.png    # gera a capa do post
npm run lint                                 # eslint + tsc
```

## Identidade visual

Tokens em `src/brand.ts`, extraídos do *Manual de Identidade Wispot 2026*:

- **Azul institucional** `#25A8E0`
- **Degradê institucional** `#25A8E0 → #0B91C1`
- **Branco** `#FFFFFF` · **Cinza** `#514D4B`

O manual indica as famílias **Adineue Pro** e **Montserrat**. Adineue Pro é
proprietária e não redistribuível, então o projeto usa **Montserrat** (carregada
via `@remotion/google-fonts`) em todas as peças.

O logo e o ícone da Wispot em `public/brand/` foram extraídos em vetor do
próprio manual e exportados em PNG com transparência, nas versões branca e azul.

O logo do MyGuest (`public/brand/myguest.png`) veio de um JPEG de fundo branco.
O recorte foi feito por componentes conexos de branco a partir da borda, e não
por chave de cor — assim o branco de dentro do logo (o boneco e as frestas entre
os quadrados) fica preservado.

Ele sempre aparece sobre placa branca (`src/components/MyGuestLogo.tsx`), por
dois motivos: o quadrado azul do logo é quase o mesmo azul institucional da
Wispot e some solto sobre o degradê; e o JPEG de origem deixa franja de
compressão nas bordas, que contra branco desaparece. A exceção é o card do
voucher, que já é branco e recebe o logo direto. Se aparecer uma versão em
vetor, é só trocar o arquivo.

## Material bruto

Os clipes originais são HEVC 10 bits HDR (HLG), 4K, gravados na vertical. Eles
foram convertidos para H.264 SDR 1080×1920 a 30 fps com *tone mapping*, e o
áudio normalizado para −16 LUFS:

```bash
npx remotion ffmpeg -i entrada.mov \
  -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,\
tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=1080:1920:flags=lanczos,format=yuv420p" \
  -r 30 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k public/clips/saida.mp4
```

Os arquivos prontos ficam em `public/clips/` (`8445`, `8446`, `8450`, `8452`,
`8454`, `8455` — a numeração é a original da câmera e segue a ordem do roteiro).

## Roteiro e legendas

`src/data/script.ts` guarda o corte de cada cena e as legendas **palavra a
palavra**. Os tempos vieram da transcrição do áudio real (faster-whisper com
*word timestamps*), com os nomes de marca corrigidos à mão — por isso a legenda
acompanha o que é dito, e não o roteiro escrito.

Atenção a um detalhe do whisper: ele erra o alinhamento da **primeira palavra**
de uma fala quando há silêncio antes dela, e erra para os dois lados — em 8445
atrasou 0,6 s, em 8446 adiantou 0,3 s. Escolher `trimStart` por esses tempos
corta no lugar errado. Confira o começo de cada corte pela envoltória de energia
do áudio antes de confiar no timestamp.

Estrutura do vídeo:

| Cena | Clipe | Bloco do roteiro | Gráfico |
| --- | --- | --- | --- |
| 1 | 8445 | Abertura — o gancho | — |
| 2 | 8446 | Acesso por voucher | Tela cheia de marca: lockup do MyGuest e card de voucher |
| 3 | 8450 | Autenticação personalizada | Tela cheia de marca: portal em white label |
| 4 | 8452 | "E o controle é completo" | — |
| 5 | 8454 | Painel e conformidade | Selos LGPD e Marco Civil |

| 6 | 8455 | Fechamento — CTA | — |
| 7 | — | — | Cartão final |

## Emendas e trilha

As transições ficam em `TRANSITIONS` e `transitionAfter` (`src/MyGuest.tsx`).
As cenas de marca entram deslizando pela direita; entre os planos da
apresentadora entra o borrão de `src/transitions/blurWhip.tsx`. Fade só na
entrada do cartão final: entre dois planos quase idênticos dela, a dissolvência
sobrepõe dois rostos e duas legendas ao mesmo tempo, e o borrão resolve isso
virando as duas cenas em rastro.

`transitionAfter` devolve o elemento pronto em vez de um componente que o
embrulhe — a `TransitionSeries` identifica os filhos comparando `child.type`, e
qualquer wrapper no meio faz o render falhar.

Cada emenda consome o tempo dela das duas cenas vizinhas, e todas caem em
trechos mudos das pontas — por isso nenhuma fala se sobrepõe. Ao mexer num
corte, confira se a emenda continua caindo no silêncio.

A trilha (`public/audio/music.mp3`, fornecida pela Wispot) foi cortada em 48 s e
normalizada a −20 LUFS. O volume é controlado em `src/components/MusicBed.tsx`:
fica baixo sob a locução e sobe no cartão final, que não tem fala.

Nos clipes 8446 e 8450 a câmera está só na mesa, sem a apresentadora em quadro.
Essas duas cenas rodam na variante `brand` (`variantFor`, em `src/MyGuest.tsx`):
a tela inteira vira peça de marca e o clipe fica por baixo, desfocado, só como
textura — é dele que vem a locução. Nelas a legenda também inverte, porque azul
sobre azul sumiria: a palavra ativa fica em pílula branca com texto azul.

Alguns cortes existem por causa da gravação, não do texto: em 8452
(`trimStart` 1,05) e em 8454 (`trimStart` 3,38) a apresentadora começa de olhos
baixos, lendo o roteiro; em 8446 (`trimStart` 1,88) havia uma respirada audível
antes da fala. Em 8454 o corte cai **depois** de "No painel,", que é dito justamente
durante a olhada — quem carrega esse sentido passa a ser a etiqueta "Painel de
controle" na tela, e a cena emenda em "Você acompanha quem está na rede".

A capa (`src/Capa.tsx`) puxa um frame do próprio clipe por `trimBefore`, em vez
de guardar uma imagem à parte. O texto fica no miolo vertical de propósito: no
feed a capa é recortada em 4:5, e o que estiver muito no pé some.

Para reajustar um corte, mexa em `trimStart` / `trimEnd` da cena; para mover um
gráfico, nos tempos passados em `overlayFor` (`src/MyGuest.tsx`). Ao encurtar uma
cena, confira se os gráficos do fim dela ainda têm tempo de tela — foi o que
aconteceu com os selos de conformidade neste corte.
