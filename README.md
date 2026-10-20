# Wispot — Vídeos

Projeto [Remotion](https://remotion.dev) para as peças de vídeo da Wispot.

## Composições

| ID | Formato | Duração | O que é |
| --- | --- | --- | --- |
| `MyGuest` | 1080×1920 (9:16) | ~44,8 s | Vídeo institucional do MyGuest, com locução, trilha, legendas sincronizadas e gráficos de marca |
| `Capa` | 1080×1920 | still | Capa do post, montada sobre um frame do próprio material |
| `CartaoFinal` | 1080×1920 | 3,6 s | Cartão final isolado, para reaproveitar em outras peças |
| `DemoHoraPremiada` | 1080×1920 | ~33 s | Demo animada do Hora Premiada |
| `DemoMyGuest` | 1080×1920 | ~33 s | Demo animada do MyGuest |
| `DemoSending` | 1080×1920 | ~32 s | Demo animada do Sending |
| `DemoWimap` | 1080×1920 | ~32 s | Demo animada do Wimap |
| `DemoWiquest` | 1080×1920 | ~32 s | Demo animada do Wiquest |
| `ExplainerHoraPremiada` | 1920×1080 | ~47 s | Explainer no estilo do institucional antigo |
| `ExplainerMyGuest` | 1920×1080 | ~47 s | Idem, MyGuest |
| `ExplainerSending` | 1920×1080 | ~47 s | Idem, Sending |
| `ExplainerWimap` | 1920×1080 | ~47 s | Idem, Wimap |
| `ExplainerWiquest` | 1920×1080 | ~47 s | Idem, Wiquest |
| `HistoriaHoraPremiada` | 1920×1080 | ~39 s | História "Loja vazia às 15h" (varejo) |
| `HistoriaMyGuest` | 1920×1080 | ~34 s | História "A senha no post-it" (hotéis) |
| `HistoriaSending` | 1920×1080 | ~35 s | História "A cliente que sumiu" (cafeterias) |
| `HistoriaWimap` | 1920×1080 | ~35 s | História "O mistério da vitrine" (shoppings) |
| `HistoriaWiquest` | 1920×1080 | ~35 s | História "A estrela que faltava" (restaurantes) |

## Comandos

```bash
npm run dev                                  # abre o Remotion Studio
npx remotion render MyGuest out/myguest.mp4  # renderiza o vídeo
npx remotion still Capa out/capa/capa.png    # gera a capa do post
npm run lint                                 # eslint + tsc
npx remotion render DemoWimap out/demos/wimap.mp4  # renderiza uma demo
```

Os MP4 já renderizados ficam em `renders/demos/` (verticais),
`renders/explainers/` e `renders/historias/` (16:9). As capas das histórias,
em PNG, ficam em `renders/historias/capas/`.

O fundo azul de todos os vídeos é o azul institucional `#25A8E0`.

## Demos animadas das ferramentas

Uma animação por ferramenta (Hora Premiada, MyGuest, Sending, Wimap e
Wiquest), sem locução, só com a trilha. Todas seguem o mesmo esqueleto
(`src/demos/DemoVideo.tsx`):

1. abertura com a marca do produto e a frase de posicionamento;
2. quatro passos, cada um com a plataforma em uso — painel numa janela de
   navegador ou o celular do cliente, com ponteiro, toques, digitação,
   números subindo e gráficos se desenhando;
3. os quatro benefícios, tirados das páginas de cada produto em wispot.com.br;
4. o cartão final (`EndCard`, agora com a marca e a frase por props).

O roteiro de cada demo está no arquivo do produto em `src/demos/` (o
`...Config` no fim de cada um): título e subtítulo de cada passo, duração e a
cena. As peças de interface reutilizáveis — celular, janela, ponteiro, toque,
campos, botões, gráficos, notificações — ficam em `src/demos/kit.tsx`, e os
tempos dentro de cada cena são em segundos.

As telas são **recriadas**, não gravadas: seguem o layout das gravações e das
artes da pasta do Drive (painel do Hora Premiada, portal do MyGuest, painel do
Sending, telas de celular por produto), mas com "SUA MARCA" e dados fictícios
no lugar dos clientes que aparecem nas gravações.

Cada produto tem uma cor de destaque (`PRODUCTS`, em
`src/demos/ProductMark.tsx`), tirada do logo oficial. O verde do Hora Premiada
desce um tom para o texto branco ler bem, e o Sending fica no amarelo do "ing".

## Logos dos produtos

Os originais (JPEG sobre branco) ficam em `assets-src/logos/`. O script
`scripts/recorta-logos.py` gera os PNGs com transparência em
`public/brand/products/`: a versão colorida de todos e uma versão branca para
o azul (Hora Premiada, MyGuest, Wimap e Wiquest — o Sending só existe colorido
e funciona direto sobre o azul).

```bash
pip install pillow numpy scipy
python3 scripts/recorta-logos.py
```

O alfa sai da distância de cada pixel até o branco, então a borda fica suave e
o branco de dentro das letras vira transparente. No MyGuest o boneco branco do
quadrado vermelho é preservado (é um "buraco" grande; os miolos das letras são
pequenos e ficam vazados). Quando chegarem os logos em vetor, basta trocar os
PNGs.

## Explainers no estilo do institucional antigo

Seguem o vídeo institucional antigo da Wispot (16:9, ~90 s, com locução):
cena ilustrada com pessoas, logo no azul (aqui, o institucional `#25A8E0`), aparelhos no estúdio cinza,
"Painel de Controle", notebook no azul, recursos sobre o painel desfocado e
fechamento com tópicos e o site. O esqueleto está em
`src/explainers/ExplainerVideo.tsx` e cada produto tem o seu arquivo
(`src/explainers/Ex*.tsx`) com as telas, o painel, o notebook e o texto.

1. **Gancho** — cenário ilustrado (`src/explainers/people.tsx`: loja, hotel,
   café, rua e restaurante, com personagens em SVG) e a pergunta do problema;
2. **Logo** do produto revelado no azul, com "uma solução wispot";
3. **Celular** do cliente no estúdio, com cartões de perfil ao lado;
4. **Painel de Controle** mudando o que aparece no celular;
5. **Notebook** com o painel web;
6. **Recursos** em três blocos sobre o painel desfocado;
7. **Fechamento** com dois tópicos e WWW.WISPOT.COM.BR;
8. **Cartão final** com o slogan "Interação e experiência em Wi-Fi".

O vídeo antigo é narrado; aqui a narração vira legenda (`Caption`, em
`src/explainers/ex-kit.tsx`), uma frase por vez. Os textos estão nos campos
`hook` e `caption` de cada config — se for gravar locução, eles já servem de
roteiro, e os tempos de cada cena ficam em `SECONDS`. A trilha tem 48 s, por
isso os explainers ficam em ~47 s.

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

`public/clips/portal.mp4` é a gravação do portal MyGuest rodando, recortada só
na tela do aparelho (`crop=770:1668:154:126`) — a moldura vem de
`src/components/PortalPhone.tsx`.

**Só a janela de 8,05 s a 13,0 s dessa gravação pode ir ao ar.** O portal foi
gravado em white label de um cliente, e a arte dele aparece de 0 a 2,2 s e de
13,25 s ao fim — marca de terceiro não entra em peça da Wispot. Entre 4,9 s e
7,8 s o navegador ainda mostra a barra de endereço em vermelho, que passa
impressão de conexão insegura e expõe a URL de teste. Sobra a faixa do meio, com
o voucher confirmado e o cadastro; `rate: 0.85` estica esses 5 s para os 5,8 s
da cena.

Por isso a tela de login da cena 3 é mock (`src/components/LoginPhone.tsx`), e
não gravação: ela reproduz o layout real — as mesmas opções de login e o mesmo
rodapé — com a área de marca livre, que é justamente o que se troca quando a
locução chega em "white label". Ao regravar o portal com uma marca própria da
Wispot, dá para substituir esse mock pela gravação.

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
| 2 | 8446 | Acesso por voucher | Tela cheia de marca: lockup do MyGuest e a tela real do portal |
| 3 | 8450 | Autenticação personalizada | Tela cheia de marca: mock da tela de login |
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

## Histórias (versão rápida, com 3D)

Uma narrativa por ferramenta, de ~35 s, narrada, com capa de abertura e de
fechamento, planos de 2,5 a 4 s e emendas de 0,3 s. Cada uma tem personagem, conflito, virada e resultado, e fecha com
os setores atendidos e os serviços da Wispot (captive portal com a marca do
cliente, dados de acordo com a LGPD, integração com os sistemas dele):

| Ferramenta | História | Setor |
| --- | --- | --- |
| Hora Premiada | **Loja vazia às 15h** — a Marina cria uma oferta só para a hora parada, dispara para quem já passou pelo Wi-Fi e a loja enche | Varejo |
| MyGuest | **A senha no post-it** — a senha vazou para a rua inteira; com voucher por hóspede, quem não é hóspede fica de fora | Hotéis |
| Sending | **A cliente que sumiu** — a Ana veio uma vez e nunca voltou; uma mensagem com o nome dela na sexta de manhã e ela volta | Cafeterias |
| Wimap | **O mistério da vitrine** — o mapa de calor mostra que ninguém chegava ao fundo da loja; a promoção muda de lugar e a loja inteira vende | Shoppings |
| Wiquest | **A estrela que faltava** — a nota baixa vira alerta na hora, o problema é resolvido na mesa e a mesma cliente dá 5 estrelas | Restaurantes |

Cada história fica num arquivo (`src/stories/Story*.tsx`), como uma lista de
planos (`shots`) com duração e tipo de emenda. Os números das histórias são
de cenário, não de clientes reais.

**Movimento.** Segue a skill de motion design da LottieFiles
(`.claude/skills/motion-design`): personalidade "Energetic" na narrativa e
"Corporate" nas telas; entradas em expo de saída, saídas aceleradas e câmera
em ease-in-out — nunca linear em deslocamento; durações de 0,25 / 0,4 / 0,7 s;
stagger sempre abaixo de 0,5 s; e as três camadas (principal, secundária e
ambiente) em todo plano. As peças estão em `src/stories/motion.tsx`:

- `Kinetic` — frases que sobem palavra por palavra por trás de uma máscara,
  com destaque na cor do produto (`*palavra*`) e tarja opcional;
- `Camera` — câmera pose a pose sobre as ilustrações, com tranco de zoom nos
  impactos e uma deriva mínima para o quadro nunca ficar parado;
- `cut` — emendas de 9 quadros: chicote com borrão, mergulho de zoom e clarão.

**3D.** As cenas em `src/stories/three3d.tsx` usam three.js via
`@remotion/three`, seguindo a skill de React Three Fiber
(`.claude/skills/threejs-*`): ondas de Wi-Fi na vinheta de cada produto,
cupons explodindo (Hora Premiada), vouchers em leque (MyGuest), mensagens
voando até os clientes (Sending), mapa de calor em torres (Wimap) e estrelas
acendendo (Wiquest). Diferente do R3F comum, nada usa `useFrame`: tudo é
função do quadro atual, para o render ser determinístico. O container não tem
GPU, então o WebGL roda por software (`Config.setChromiumOpenGlRenderer
("swangle")` em `remotion.config.ts`); com GPU dá para trocar por `angle`.

**Capas.** Cada história abre com uma capa ("uma história", o título, o logo
do produto e o setor) e fecha com a assinatura da Wispot (slogan, site,
telefone e as outras quatro ferramentas). As duas ficam em
`src/stories/story-kit.tsx` (`OpeningCover` e `ClosingCover`); o título de
cada capa é o campo `title` da história.

**Narração.** A voz é a Francisca (`pt-BR-FranciscaNeural`), uma das vozes
neurais da Microsoft. O roteiro está em `src/stories/narracao.json`, na grafia
normal: uma fala para a capa, uma por plano, uma para o fechamento do produto
e uma para a assinatura. O dicionário `pronuncia` do mesmo arquivo troca, só
na hora de gerar o áudio, os nomes que a voz leria errado (Wispot → uispót,
Wiquest → uiquést, voucher → vaucher…). Depois de mudar o roteiro:

```bash
pip install edge-tts
python3 scripts/narracao.py   # grava public/audio/narracao/ e src/stories/narracao-tempos.json
```

Cada plano dura o que estiver na história ou o tempo da fala mais uma folga, o
que for maior, então nenhuma fala é cortada. A trilha fica baixa sob a voz.

O script usa o acesso gratuito do leitor de texto do Edge, que não é um
serviço oficial. Para uso comercial, as mesmas vozes estão no Azure Speech
(pago). Também há o motor `kokoro` (`"motor": "kokoro"`, voz `pm_alex` ou
`pf_dora`), um modelo aberto que roda sem internet, mas soa mais robótico. Para
trocar por um locutor de verdade, basta gravar os MP3 com os mesmos nomes e
atualizar as durações em `narracao-tempos.json`.
