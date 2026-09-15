# Vídeos

Projeto [Remotion](https://remotion.dev) para as peças de vídeo da Wispot e da
ProAdvanced.

## Composições

| ID | Formato | Duração | O que é |
| --- | --- | --- | --- |
| `MyGuest` | 1080×1920 (9:16) | ~44,8 s | Vídeo institucional do MyGuest (Wispot), com locução, trilha, legendas sincronizadas e gráficos de marca |
| `CartaoFinal` | 1080×1920 | 3,6 s | Cartão final do MyGuest, isolado |
| `ProAdvanced` | 1080×1920 (9:16) | ~60,5 s | Firewall gerenciado (ProAdvanced): 16 takes emendados, legendas palavra a palavra e fichas de apoio |
| `ProAdvancedCartaoFinal` | 1080×1920 | 4 s | Cartão final da ProAdvanced, isolado |

As duas marcas convivem no mesmo projeto. Os tokens ficam em `src/brands/`, e a
peça da ProAdvanced tem componentes próprios em `src/proadv/` — o que é
realmente neutro (`components/Scrim`, `transitions/blurWhip`) é compartilhado.

## Comandos

```bash
npm run dev                                          # abre o Remotion Studio
npx remotion render MyGuest out/myguest.mp4          # renderiza o vídeo da Wispot
npx remotion render ProAdvanced out/proadvanced.mp4  # renderiza o da ProAdvanced
npm run lint                                         # eslint + tsc
```

## Identidade visual — Wispot

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

## Material bruto — Wispot

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

## Roteiro e legendas — Wispot

`src/data/script.ts` guarda o corte de cada cena e as legendas **palavra a
palavra**. Os tempos vieram da transcrição do áudio real (faster-whisper com
*word timestamps*), com os nomes de marca corrigidos à mão — por isso a legenda
acompanha o que é dito, e não o roteiro escrito.

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

## Emendas e trilha — Wispot

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

Dois cortes existem por causa da apresentadora, não do texto: em 8452
(`trimStart` 1,05) e em 8454 (`trimStart` 3,38) ela começa de olhos baixos, lendo
o roteiro. Em 8454 o corte cai **depois** de "No painel,", que é dito justamente
durante a olhada — quem carrega esse sentido passa a ser a etiqueta "Painel de
controle" na tela, e a cena emenda em "Você acompanha quem está na rede".

Para reajustar um corte, mexa em `trimStart` / `trimEnd` da cena; para mover um
gráfico, nos tempos passados em `overlayFor` (`src/MyGuest.tsx`). Ao encurtar uma
cena, confira se os gráficos do fim dela ainda têm tempo de tela — foi o que
aconteceu com os selos de conformidade neste corte.


---

# ProAdvanced — Firewall gerenciado

Peça vertical de ~60 s. Fonte em `src/proadv/`, tokens em
`src/brands/proadvanced.ts`, material em `public/proadv/`.

## Identidade

Do *Brandbook ProAdvanced*:

- **Azul principal** `#3696CD` · **degradê** `#20A3D6 → #3696CD`
- **Cinza** `#676868` · **Branco** `#FFFFFF`
- **Montserrat** Regular e Bold

O manual é CMYK (PDF/X-1a). Converter as páginas para RGB devolve cores
*diferentes* das que o manual imprime — `#3696cd` sai como `(76,146,213)`. Os
tokens usam os hexadecimais do manual; o recorte da logomarca usou o render só
para pegar a forma e repintou com os valores certos.

A logomarca em `public/proadv/brand/` saiu das duas versões da página 07. A
máscara de transparência veio da versão branca sobre azul, onde o fundo é
chapado; as duas versões batem pixel a pixel, o que serviu de conferência. O
cadeado dentro do símbolo é **vazado** no manual e continua vazado no PNG —
sobre fundo azul ele aparece azul, e é esse o comportamento certo.

O manual não define preto nem direção de degradê. `COLORS.ink` é o cinza
institucional escurecido, e o degradê corre na diagonal (a amostra do manual é
vertical) porque rende mais em 9:16. Os dois estão marcados como decisão no
arquivo de tokens.

## Material bruto

Dezesseis takes de iPhone, um por frase do roteiro. Vieram deitados
(1920×1080 com rotação −90 nos metadados, que o ffmpeg aplica na decodificação
e devolve em pé), já em bt709 — dispensam o *tone mapping* que o MyGuest
precisou.

A pegadinha aqui é a faixa de cor: o iPhone grava **full range** (`pc`,
`yuvj420p`) e o projeto é **limited** (`tv`, `yuv420p`), como os clipes da
Wispot. Sem converter, o mesmo preto sai em nível diferente entre as duas
peças:

```bash
npx remotion ffmpeg -i IMG_0000.MOV \
  -vf "scale=1080:1920:flags=lanczos:in_range=full:out_range=limited,format=yuv420p" \
  -r 30 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k \
  -movflags +faststart public/proadv/clips/0000.mp4
```

Os `.MOV` originais estão na mesma pasta. Quando o corte fechar, dá para tirá-los
do checkout — o histórico do git guarda.

## Roteiro e legendas

`src/proadv/data/script.ts` guarda o corte e as legendas palavra a palavra,
geradas com faster-whisper `large-v3` e *word timestamps*, passando o roteiro
como `initial_prompt` — sem isso "firewall" saía como "falho", "faro" e "Fyro".

Duas armadilhas no caminho, que valem para a próxima peça:

**Alucinação em trecho mudo.** Pedir transcrição do silêncio entre as falas
devolve "Tchau", "Boa noite", "Se inscreva no canal" — frases que o modelo
aprendeu de vídeo do YouTube e despeja quando não há fala. O que desmascara é o
nível: esses trechos estavam 20 a 44 dB abaixo do pico da fala. Nenhum deles é
real.

**Take com começo falso.** Dois clipes têm mais de uma tentativa dentro do
arquivo, e aí o áudio é real:

| Clipe | O que tem dentro |
| --- | --- |
| `8424` | "Ok? Acesso antigo ou..." → "Confirmo... Não, é... Vamos lá." → a tomada boa aos 5,5 s |
| `8438` | "Não, tira." → a tomada boa aos 2,9 s |

O corte de cada cena é ancorado na **primeira e na última palavra do roteiro**,
não no envelope de áudio: começa 0,20 s antes e termina 0,30 s depois. Assim
nenhuma sobra entra, e sobra folga muda nas duas pontas para as emendas caírem
no silêncio.

Duas frases saíram diferentes do roteiro escrito e a legenda segue o que foi
dito, como no MyGuest: no `8415` ele fala "camadas de **segurança de** rede"
(roteiro: "de proteção da rede") e no `8438`, "É manter a **operação**
atualizada" (roteiro: "a proteção atualizada").

## Emendas

Os dezesseis takes têm o mesmo enquadramento — mesma cadeira, mesmo fundo,
mesma distância. Corte seco entre dois deles salta aos olhos, e fade sobrepõe
dois rostos quase iguais, que é pior. A emenda é o borrão de
`src/transitions/blurWhip.tsx`: 6 quadros, que é o que cabe nos 0,20 s de
silêncio da cabeça e nos 0,30 s da cauda.

O `8417` é o único take que já começa falando. Não há folga na cabeça dele para
a emenda morder, e ali entra corte seco (`0` em `TRANSITIONS`).

O contrapeso ao enquadramento repetido é o empurrão de escala em
`components/Scene.tsx`: cada cena entra 4,5% ampliada e vai fechando, alternando
o sentido a cada take. O quadro nunca fica parado e a emenda passa como
movimento de câmera.

## Gráficos

As fichas (`components/RuleList.tsx`) **atravessam o corte**: uma ficha sem `at`
já está em cena desde o primeiro quadro, porque veio do take anterior. É o que
faz três takes seguidos lerem como um bloco só em vez de três saltos —
"Controla o tráfego / Define acessos / Bloqueia ameaças" se monta ao longo de
duas cenas, e as três da gestão contínua ao longo de três.

O manual não tem cor de alerta: só azul, cinza e branco. O risco então não é
vermelho — é a mesma ficha escurecida, de borda tracejada. O azul fica
reservado para o que está sob controle, e a diferença se lê sozinha.

O fundo do cartão final (`components/RayBurst.tsx`) são os raios do próprio
símbolo, girando devagar.

## Falta a trilha

A peça está **sem música**. O `public/audio/music.mp3` é a trilha que a Wispot
forneceu para o MyGuest e não deve ser reaproveitada em vídeo de outra marca.
Quando chegar uma trilha da ProAdvanced, o `MusicBed` do MyGuest serve de
modelo: corte no tamanho do vídeo, normalize a −20 LUFS e monte o volume baixo
sob a locução, subindo no cartão final.
