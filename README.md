# Vídeos

Projeto [Remotion](https://remotion.dev) para as peças de vídeo da Wispot e da
ProAdvanced.

## Composições

| ID | Formato | Duração | O que é |
| --- | --- | --- | --- |
| `MyGuest` | 1080×1920 (9:16) | ~44,8 s | Vídeo institucional do MyGuest (Wispot), com locução, trilha, legendas sincronizadas e gráficos de marca |
| `CartaoFinal` | 1080×1920 | 3,6 s | Cartão final do MyGuest, isolado |
| `ProAdvancedFirewall` | 1080×1920 (9:16) | ~60,5 s | Firewall gerenciado (ProAdvanced): 16 takes emendados, legendas palavra a palavra e fichas de apoio |
| `ProAdvancedFirewallRef` | 1080×1920 (9:16) | ~60,5 s | Mesmo corte, no estilo medido do vídeo de referência: legenda grande no topo, corte seco, sem cromo |
| `ProAdvancedFirewallCartaoFinal` | 1080×1920 | 4 s | Cartão final da ProAdvanced, isolado |
| `ProAdvancedCartorio` | 1080×1920 (9:16) | ~66,2 s | Segurança da informação em cartórios (ProAdvanced): 22 takes, legenda grande no topo, corte seco |
| `ProAdvancedCartorioCapa` | 1080×1920 | still | Mesmo corte sem legenda nem ficha, para tirar quadro de capa |
| `ProAdvancedTerceiros` | 1080×1920 (9:16) | ~57,5 s | Ataque que chega pela empresa de fora (ProAdvanced): 18 takes, legenda grande no topo, corte seco |
| `ProAdvancedTerceirosCapa` | 1080×1920 | still | Mesmo corte sem legenda nem ficha, para tirar quadro de capa |

O MyGuest é de antes do template e tem componentes próprios em `src/components/`.
A peça da ProAdvanced é montada com o template de `src/template/`; as duas
compartilham `components/Scrim`, `transitions/blurWhip` e a fonte.

## Comandos

```bash
npm run dev                                          # abre o Remotion Studio
npx remotion render MyGuest out/myguest.mp4          # renderiza o vídeo da Wispot
npx remotion render ProAdvancedFirewall out/proadvanced.mp4  # renderiza o do firewall
npx remotion render ProAdvancedCartorio out/cartorio.mp4     # renderiza o de cartórios
npx remotion render ProAdvancedTerceiros out/terceiros.mp4   # renderiza o de acesso de terceiros
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

# O template

O estilo da peça da ProAdvanced — plano do apresentador cortado em muitos
takes, legenda palavra a palavra, fichas que se acumulam e cartão final de
marca — está em `src/template/`, separado de qualquer marca. Uma peça nova é um
arquivo de configuração e uma pasta de clipes.

```
src/template/          o estilo: não muda de peça para peça
  types.ts             o que uma peça precisa preencher
  timing.ts            mede a folga muda e decide cada emenda
  Piece.tsx            a composição
  components/          Scene, Captions, RuleList, SectionLabel, EndCard…
src/brands/            tokens por marca
src/pieces/            uma pasta por peça
tools/                 conversão dos clipes e montagem do scenes.ts
```

## A peça de cartórios

`src/pieces/proadvancedCartorio/`. Vale ler por causa de três coisas que este
corte ensinou.

**A transcrição comprime a última palavra, e o `trimEnd` da ferramenta sai em
cima da fala.** O `build_scenes.py` marca `trimEnd` como o fim da última palavra
mais 0,30 s. Em seis dos 21 takes o modelo encurtou essa palavra e o corte comeu
fala: em `17-proadvanced` faltavam 0,58 s do fim de "cibersegurança", e em
`07-provimentos` o número "243" é dito de 6,90 a 7,95 s enquanto o modelo o deu
como encerrado em 6,97 — o corte caía 1,68 s antes do fim.

O que denuncia é o `silence.tail` valendo `0.00`: se não há folga na cauda, o
corte está em cima de som. Confira **toda** cena com cauda zerada comparando
`trimEnd` com o último instante de fala sustentada do envelope de energia, e não
com o tempo que a transcrição devolveu. O mesmo vale para a cabeça: em
`18-infraestrutura` a palavra "backup" começa em 0,65 s e o corte estava em
1,26.

**Palavra que a transcrição erra é palavra que a ferramenta joga fora.** Ela
ancora o corte na primeira e na última palavra que casam com o roteiro; quando o
modelo ouve "laptendimento" no lugar de "atendimento", nada casa e a cena
termina antes. Foi o que aconteceu em `05-impacto`. A ferramenta avisa —
"descartei 'x', mas o nível está só −2 dB abaixo do pico" —, e esse aviso é para
ler, não para passar batido.

**A folga que sobra depois da última palavra pode não ser folga.** Estender o
`trimEnd` até o último instante de fala é o conserto certo quando o som de lá é
o decaimento da própria palavra — que é o caso em quase todas as cenas. Mas em
`17-proadvanced` havia **0,47 s de silêncio de verdade** entre "cibersegurança"
e o som seguinte, e o som seguinte era o João dizendo **"Não foi."**. Estender
o corte o trouxe para dentro da peça, e ele ficou no vídeo entregue.

O teste que separa os dois casos é a pausa: decaimento de palavra é contínuo
com ela; comentário fora do roteiro vem depois de um vão. Antes de estender um
`trimEnd`, procure o vão — e, se houver, transcreva o que vem depois dele.

**Quando o clipe acaba junto com a fala, não há cauda para pegar.** Em
`05-impacto` e `17-proadvanced` a câmera foi parada em cima da última palavra, e
o `trimEnd` corrigido passava do fim do arquivo. Aí o jeito é travar na duração
do arquivo e aceitar a cauda curta — 0,02 s em `17-proadvanced`. Com corte seco
isso passa; com borrão não passaria, porque a emenda não teria onde morder.

### O que o roteiro pedia e não foi gravado

A abertura inteira e o "Fale com a Pro Advanced" falado não existem em áudio. A
peça começa no "Todos os dias..." e a chamada fica na pílula e no cartão final.
O roteiro como foi escrito está em `roteiro-original.txt`, ao lado do
`roteiro.txt` que é o que a peça fala — e é o segundo que alimenta a
transcrição, porque o vocabulário de ancoragem tem de ser o do áudio.

Onde a locução se afasta do texto escrito, a legenda segue o áudio. O que o
roteiro tinha de mais preciso e a voz deixou de fora — o ano dos provimentos, a
sigla do CNJ, o "protegidos e testados" — entra pela camada gráfica, que é onde
o dado exato cabe sem depender de regravação.

### O material chegou por mensageiro

Os 21 takes vieram **1024×576 armazenado com `rotation -90`** nos metadados, ou
seja 576×1024 na tela. Ler a dimensão armazenada sem olhar a matriz de rotação
dá a conclusão errada de que o material é horizontal. Todos em H.264 Baseline
com áudio a ~60 kb/s, sem metadado de câmera — assinatura de arquivo que passou
por aplicativo de mensagem. Detalhes e o mapa take por take em
`public/cartorio/clips/README.md`.

### O salto de enquadramento estava declarado e sem efeito

`style.punch` existia em `LEGENDA_GRANDE` desde o corte do firewall, mas o
`Piece.tsx` nunca passava `baseScale` para a `Scene` — o `punch` ficava lido e
ignorado, e as cenas todas saíam no mesmo enquadramento. É ele que faz o corte
seco ler como movimento de câmera em vez de falha de continuidade, então a
peça inteira dependia só do clarão para marcar os cortes.

Consertado: as cenas de índice ímpar entram com o recorte de `punch`, as pares
em quadro cheio. Isso muda o visual de **todas** as peças no estilo de legenda
grande, o vídeo do firewall incluído. O estilo de fichas não tem `punch`, então
o `ProAdvancedFirewall` e o `MyGuest` seguem iguais.

### As bolinhas, e por que a legenda sai quando elas entram

O bloco em que o roteiro enumera as exigências ganhou um terceiro estilo de
ficha, `bubbles` (`src/template/components/BubbleList.tsx`): cada item entra por
baixo da borda e sobe até o lugar, empurrando para cima os que já estão em
cena. A lista é ancorada pelo pé, então crescer para cima sai do próprio layout
— não há posição calculada à mão.

Junto veio `hideCaptions` no `Overlay`, que tira a legenda daquela cena. Não é
enfeite: a bolinha diz exatamente o que a voz está dizendo, e legenda e ficha
com o mesmo conteúdo na mesma tela fazem quem assiste não ler nenhuma das duas.

A bolinha é de uma linha só. A maior da peça, "Backups protegidos e testados",
ocupa 804 dos 928 px entre as margens com corpo 48 — daí o teto do corpo.

Efeito colateral a conhecer: a primeira bolinha entra 1,6 s depois do começo da
cena `10-politicas`, porque é quando ele diz "políticas". Nesse 1,6 s a tela
fica sem texto nenhum, enquanto ele diz o "Na prática, isso envolve". Funciona
como respiro antes da lista começar a subir, mas é uma escolha — querendo a
legenda ali, é só tirar o `hideCaptions` dessa cena.

## A peça de acesso de terceiros

`src/pieces/proadvancedTerceiros/`. Dezoito takes de 25 que chegaram, 57,5 s.
Três coisas que este corte ensinou, e que o de cartórios não tinha mostrado.

**O modelo entra em laço, e o laço escapa do `drop_loop`.** Em três takes a
transcrição devolveu a frase duas vezes, com a segunda cópia inteira empilhada
num instante só no fim do clipe — todas as palavras com `start` igual ao `end`.
O `drop_loop` compara a cauda com o que veio antes dela e não pegou nenhum dos
três, porque a repetição vem com grafia trocada: "una" por "uma" em
`05-acontece`, "Si una" por "Se uma" em `09-invadida`, "no basta" por "não
basta" em `13-proteger`. São erros de um caractere, o suficiente para o
`normalise` não casar.

O que denuncia é o tempo: **palavra com duração zero não existe em fala**. Vale
varrer o `scenes.ts` procurando `start` igual a `end` antes de renderizar — em
`05-acontece` o laço ainda esticava o corte por 0,9 s de silêncio, além da
legenda fantasma no fim das três cenas.

**Cauda zerada de novo, e em quatro cenas.** `07-contabilidade`, `12-normal`,
`17-ate-onde` e `16-sabe` (0,02 s). A causa é a mesma do corte de cartórios — a
ferramenta marca a cauda pelo fim da última palavra da transcrição, e o modelo
comprime essa palavra —, mas aqui três das quatro são cenas cortadas por
`--regiao`, em que a região foi escolhida pela envoltória e termina exatamente
onde a fala termina. Ao passar `--regiao`, conte que o `trimEnd` vai cair em
cima do fim da região, e confira. Em `07-contabilidade` o corte comia 0,13 s do
"software".

**A abertura gravada não era a do roteiro.** O roteiro escrito abre com "Sua
empresa pode estar protegida. Mas basta uma empresa com acesso aos seus
sistemas ser invadida para o risco chegar até você", e nada disso existe em
áudio: o que ele gravou foi a pergunta "A sua empresa utiliza sistemas de
terceiros?", em quatro tomadas. A palavra "terceiros" não aparece no roteiro
escrito, o que serve de aviso — quando a transcrição traz palavra que o
`initial_prompt` não tinha, é fala de verdade, não contaminação do contexto.

Sem a frase do risco, o "Foi o que um caso recente no Brasil mostrou" da cena 2
fica sem antecedente. Quem a carrega é a etiqueta da abertura, com as palavras
do próprio roteiro: **"Basta uma delas ser invadida"**. Regravando a abertura,
ela entra como cena nova no topo do `scenes.ts` e a etiqueta sai.

**O caso não é nomeado, de propósito.** A locução diz "uma empresa de
tecnologia teve os seus dados expostos, e mais de 150 órgãos públicos
utilizavam o sistema dela". Nomear a empresa invadida põe marca de terceiro em
peça da ProAdvanced e transforma o exemplo em acusação; o número, que é o que
dá tamanho ao risco, fica.

## Fazer uma peça nova

**1. Converter o material.** Um clipe por frase do roteiro.

```bash
tools/convert_clips.sh ~/brutos public/minhamarca/clips
```

**2. Montar as cenas e as legendas.**

```bash
python3 tools/build_scenes.py \
  --clips public/minhamarca/clips \
  --roteiro src/pieces/minhaPeca/roteiro.txt \
  --out src/pieces/minhaPeca/scenes.ts \
  --nomes "Minha Marca" \
  --destaques "termo,outro termo"
```

A ferramenta transcreve com faster-whisper `large-v3` passando o roteiro como
contexto, ancora o corte na primeira e na última palavra do roteiro com folga
de 0,20 s na cabeça e 0,30 s na cauda, e **imprime uma lista do que precisa de
olho humano**. Leia essa lista: é ali que estão os casos que ela não decide
sozinha.

**3. Conferir o texto.** A transcrição erra uma palavra aqui e ali — na peça da
ProAdvanced foram três em dezesseis cenas. Compare com o roteiro e ajuste no
`scenes.ts`, mantendo os tempos.

**4. Escrever a configuração**, no formato de
`src/pieces/proadvancedFirewall/index.ts`: marca, pasta dos clipes, fichas por
clipe e cartão final. Registre no `src/Root.tsx`.

## O que a ferramenta não decide

**Take com mais de uma tentativa dentro do arquivo.** Acontece bastante: a
pessoa erra, para, e refaz sem cortar a gravação. A ferramenta detecta trechos
de fala separados por silêncio e avisa; você escolhe a tomada boa e passa
`--regiao 8424:5.3-8.8`. Aí o áudio é cortado **antes** de transcrever — filtrar
as palavras depois não serve, porque num take assim os tempos que o modelo
devolve para o trecho ruim são justamente os que não dá para confiar.

Na peça da ProAdvanced foram dois:

| Clipe | O que tem dentro |
| --- | --- |
| `8424` | "Ok? Acesso antigo ou..." → "Confirmo... Não, é... Vamos lá." → a tomada boa aos 5,5 s |
| `8438` | "Não, tira." → a tomada boa aos 2,9 s |

**Alucinação em trecho mudo.** Pedir transcrição do silêncio entre as falas
devolve "Tchau", "Boa noite", "Se inscreva no canal", "Seja bem-vindo" — frases
que o modelo aprendeu de vídeo do YouTube e despeja quando não há fala. Ancorar
o corte nas palavras do roteiro já as descarta. O que a ferramenta ainda faz é
medir o nível de cada palavra descartada e avisar quando ela está alta demais
para ser ruído — aí vale conferir na mão.

## O silêncio é medido do áudio, não deduzido da transcrição

`scenes.ts` guarda, por cena, o silêncio de verdade nas duas pontas
(`silence: { head, tail }`), medido do envelope do áudio. `timing.ts` usa esse
número para duas coisas: aparar o que passa do que o estilo pede, e decidir
cada emenda.

Usar os tempos da legenda para isso não funciona, e a peça da ProAdvanced é a
prova. O Whisper **marca a primeira palavra cerca de 0,2 s antes de o som
sair** e **estica a última até o fim do segmento**. Ancorando o corte nesses
tempos, as dezesseis cenas ficaram com:

| | o que a transcrição dizia | o que o áudio tinha |
| --- | --- | --- |
| cabeça | 0,20 s | **0,40 s** |
| cauda | 0,30 s | 0,00 a 0,20 s |

Os dois erros machucam de um jeito diferente. Na cabeça, sobrava o dobro de
silêncio — com corte seco em dezesseis cenas isso é mais de 6 s de ar morto, e
foi o que apareceu assim que as emendas saíram. Na cauda faltava: três cenas
tinham **zero** silêncio no fim, e o borrão de 6 quadros caía em cima da fala,
sobrepondo as duas vozes por um sexto de segundo.

### O som tem que se sustentar

A primeira medição errou feio numa cena. O `8417` marcou 0,00 s de silêncio na
cabeça quando tem **1,04 s**: um estalo de um quadro logo no começo do take
passava do limiar e o detector dava a fala por começada. No vídeo isso virou
uma pausa de mais de um segundo no meio da peça.

A regra que resolve é simples: o som só conta como fala se **se sustentar por
60 ms**. Estalo não sustenta.

O mesmo take também tinha os tempos das palavras podres — o Whisper esticou
"Ele" por 1,10 s para cobrir o silêncio que ele não sabia que existia. Nenhuma
aparagem conserta tempo de palavra errado, então essa cena foi retranscrita com
a janela já corrigida.

`lead` é quanto silêncio o estilo quer manter em cada ponta. O que passa disso
é aparado e a legenda anda junto, então os dois estilos partem do mesmo
`scenes.ts`: o de borrão guarda os 0,22 s de que a emenda precisa, e o de corte
seco fica com a fala quase colada, como na referência.

A emenda, então, é o menor silêncio entre a cauda de quem sai e a cabeça de
quem entra, até 6 quadros — e zero quando não cabe. Uma lista escrita à mão
passa a mentir assim que um corte muda; medida do material, ela se corrige.

## Por que borrão e não fade

Os takes têm todos o mesmo enquadramento — mesma cadeira, mesmo fundo, mesma
distância. Corte seco entre dois deles salta aos olhos, e fade é pior: sobrepõe
dois rostos quase idênticos e o defeito fica evidente. O borrão de
`src/transitions/blurWhip.tsx` vira o corte em rastro, e ele passa como
movimento. Fade só na entrada do cartão final, que é a única imagem diferente
da peça.

O contrapeso ao enquadramento repetido é o empurrão de escala em
`template/components/Scene.tsx`: cada cena entra 4,5% ampliada e vai fechando,
alternando o sentido a cada take.

## Dois estilos

`src/template/style.ts` guarda os dois, e uma peça escolhe com `style:`.

| | `FICHAS` | `LEGENDA_GRANDE` |
| --- | --- | --- |
| Legenda | embaixo, 66 px, peso 800, Montserrat | no topo, 102 px, peso 700, Poppins |
| Palavra ativa | pílula na cor da marca | nada: tudo branco |
| Palavras por dizer | aparecem escurecidas | não aparecem; entram ao serem ditas |
| Emendas | borrão de 6 quadros | corte seco |
| Em cena | logo, etiqueta de bloco, fichas | logo e a legenda |
| Empurrão | 4,5%, alternando o sentido | 5%, sempre fechando |
| Velocidade | 1× | 1,08× |
| Fichas de apoio | plaquinha com ícone | só texto com um fio ao lado |
| Clarão no corte | — | em 4 dos 15 cortes, 0,55 de opacidade |
| Efeito no corte | — | *swish* sintetizado, nos mesmos 4 cortes |
| Fio de progresso | — | sim |
| Salto de quadro no corte | — | alterna entre cheio e 1,35× |
| Silêncio mantido nas pontas | 0,22 s / 0,30 s | 0,08 s / 0,12 s |

`LEGENDA_GRANDE` saiu de medir o vídeo de referência que a Wispot mandou, em
720×1280:

- legenda a 184 px do topo (14,4% da altura), centrada, duas linhas no máximo;
- altura de x de 36 px e ascendente de 49 px — em Montserrat isso dá ~68 px de
  corpo, que no nosso quadro de 1920 são 102 px;
- entrelinha de 62 px, ou 0,91 do corpo: mais apertada que o corpo;
- seis cortes em 18,8 s, **todos secos** — a diferença entre quadros vizinhos
  dura um quadro só em todos eles, então não há emenda nenhuma;
- nada de logo, etiqueta ou ficha: o único gráfico do vídeo é a legenda, mais
  uma pílula de chamada no último terço, a 71% da altura. **A nossa peça não
  segue isso**: o manual da ProAdvanced pede presença de marca, e a assinatura
  fica no canto superior esquerdo, acima da legenda;
- empurrão de ~3,6% por segundo, sempre fechando, e em cinco das sete cenas ele
  simplesmente não existe.

### A transição que não é transição

Os seis cortes são secos: a diferença entre quadros vizinhos dura um quadro em
todos eles, o brilho não pisca e não há assobio no áudio — medi as três coisas
procurando corte cruzado, flash e *whoosh*, e não há nenhum.

O que dá a sensação de transição é outra coisa: **o enquadramento salta a cada
corte**. Comparando o último quadro de uma cena com o primeiro da seguinte em
várias escalas, o salto é de ~35% e alterna de sentido — fecha, abre, fecha,
abre. Não é a pessoa se mexendo; 35% é recorte digital.

`punch: 1.35` reproduz isso: cenas pares vão no quadro cheio, ímpares num
recorte 1,35× mais fechado. Com o salto carregando o corte, o empurrão dentro
da cena pode ser pequeno.

O arquivo de referência não fica no repositório — é conteúdo de terceiro, e o
que importava dele são estes números. Ele está no histórico do git, no commit
em que foi subido.

### O clarão não vem da referência

Medi o brilho quadro a quadro nos seis cortes dela e ele não oscila: não há
clarão nenhum. O `flash` é escolha de montagem, pedida depois, e está lá como
parâmetro para ser calibrado ou desligado.

Ele é desenhado **por cima** da peça, não como emenda da `TransitionSeries`.
A diferença é audível: emenda sobrepõe as duas cenas e, com elas, as duas
falas. Assim o corte continua seco no vídeo e no áudio, e o clarão é só uma
camada branca em volta do quadro do corte.

### A fonte da legenda é Poppins, e foi identificada medindo

A referência não usa Montserrat. Dá para ver nas formas — bojo circular e 'a'
de um andar com a haste reta — e para confirmar com número: a razão entre
**altura de x e ascendente** na legenda da referência é **0,735**; em Poppins é
0,745 e em Montserrat, 0,698. Poppins erra por 0,01, Montserrat por 0,04.

Isso contraria o manual da ProAdvanced, que pede Montserrat. A troca foi
pedida e vale só para a legenda; etiqueta, ficha de apoio, pílula de chamada e
cartão final seguem em Montserrat. Para voltar atrás, é apagar uma linha
(`captions.fontFamily`) em `src/template/style.ts`.

A assinatura da marca, essa, voltou: `watermark: true`. Copiar a referência ao
pé da letra a tirava de cena, mas presença de marca é decisão da marca, não do
estilo.

A caixa **não** segue a referência: lá a legenda é toda minúscula, aqui a
grafia do roteiro é respeitada — nome próprio e início de frase em maiúscula.

### O trecho entra e sai

Cada trecho entra subindo com mola em 7 quadros. A saída leva 6, mas **só
acontece quando há silêncio entre um trecho e o seguinte**: colados, animar a
saída apagaria a última palavra enquanto ela ainda está sendo dita. Aí o trecho
dá lugar ao próximo e é a entrada dele que carrega o movimento.

Três detalhes de tempo que só aparecem no vídeo pronto, e que custaram um
render cada:

**O trecho não pode trocar antes da hora.** No modo `reveal` a troca acontece
exatamente quando a primeira palavra do próximo começa. Antecipar em 0,05 s —
que é o certo no modo `preview`, onde a linha inteira aparece de uma vez —
abria um buraco: o trecho novo entrava em cena mas ainda não tinha palavra
nenhuma para mostrar, e a tela ficava vazia por dois quadros. Pior, cortava a
última palavra do trecho anterior enquanto ela ainda estava cinza, não dita.

**A primeira linha de cada cena precisa travar em zero.** O corte já aparou o
silêncio da cabeça, então a primeira palavra cai um pouco *antes* do primeiro
quadro. Sem travar, a entrada chegava pronta e a linha aparecia de estalo.

**Palavra longa não abre linha.** Na revelação palavra a palavra, ela fica
sozinha em cena o tempo todo que durar. No firewall um "é" de 0,76 s ficou 0,7
segundo sozinho na tela — parecia legenda travada, ou palavra dita antes da
hora. A regra manda a palavra longa para a linha anterior, onde ela vira o
fecho de "O que faz diferença é".

A regra irmã: **linha final de uma palavra só não existe**, porque some antes
de ser lida. As duas estão em `tools/build_scenes.py`. Juntas, tiraram os
trechos de meio segundo: eram onze abaixo de 1 s, com mínimo de 0,49 s; ficaram
cinco, com mínimo de 0,63 s.

### Clarão em quatro cortes, não em quinze

Clarão em todo corte vira papel de parede: a peça tem quinze deles e o olho
para de registrar o que se repete a cada três segundos. `flashBefore`, na
configuração da peça, marca só onde o argumento vira:

| Entra em | Virada |
| --- | --- |
| `8415` | da abertura para a explicação |
| `8420` | da explicação para o problema |
| `8427` | do problema para a ProAdvanced |
| `8435` | da solução para o fecho |

Nos outros onze cortes fica só o salto de enquadramento. O efeito sonoro
acompanha os mesmos quatro: *swish* sem clarão é som sem imagem.

### Acelerar sem deixar a voz fina

`speed: 1.08` corre a imagem e a fala 8% mais rápido. `trimStart` e `trimEnd`
são posições no arquivo de origem e não mudam; quem encolhe é o tempo que a
cena ocupa na linha do tempo, e junto com ele a legenda, o silêncio medido e
os tempos dos gráficos.

**A armadilha**: quem vem do ffmpeg corrige o tom na mão, porque lá acelerar
sobe a voz. No Remotion, `playbackRate` **já preserva o tom no render** — pôr
`toneFrequency={1 / speed}` por cima derruba a voz. Medido na fundamental do
apresentador: 129 Hz viravam 119 Hz, um semitom e meio abaixo. Sem a
"correção", ficam 126,5 Hz, que é o mesmo dentro do erro da medida.

Acima de ~12% a fala começa a soar apressada e a correção de tom deixa textura
de plástico. 8% passa despercebido e tira quatro segundos da peça.

### Um gráfico, e só um

A peça de legenda grande tem **um** elemento de apoio no vídeo inteiro, no
único lugar em que ele explica em vez de enfeitar: o bloco em que o roteiro
enumera o que envelhece — porta aberta, acesso antigo, configuração
desatualizada. A lista se acumula enquanto ele fala, e o item que acabou de
entrar fica cheio enquanto os anteriores recuam para 38%. É o recuo que conta
a história: a lista cresce junto com o problema.

`QuietList` é de propósito o oposto da `RuleList` do outro estilo — sem
plaquinha, sem ícone, sem sombra, no mesmo idioma tipográfico da legenda. Num
corte que não tem cromo nenhum, ficha de plástico azul denunciaria o template.

### O efeito de corte é sintetizado aqui

`tools/make_whoosh.py` gera `public/proadv/audio/whoosh.wav`: ruído passado por
um filtro de estado variável cuja frequência sobe de 260 Hz a 5,2 kHz, com
ataque rápido, cauda de 75 ms e um toque de grave em 92 Hz para não ficar fino
no alto-falante do celular. Rodar o script de novo devolve o mesmo arquivo byte
a byte.

Efeito de transição é a parte mais fácil de resolver sem depender de licença de
banco de som — um *swish* é só ruído filtrado. Trilha é outra história, e essa
precisa vir de fora.

O pico do arquivo cai a 0,12 s do início, e `CutSfx` entra com o som adiantado
desse tanto para o pico bater no quadro do corte: efeito de transição que
começa **no** corte chega tarde ao ouvido.

### O que não dá para copiar com a nossa grade

A referência foi gravada numa sala de madeira e luz amarela; a nossa, numa de
vidro e luz fria. Medindo a média dos canais, lá R−B é **+24** e aqui era
**−9**. O tempero quente de `components/Warmth.tsx` mais um ganho de saturação
levam a nossa para **+10**, com a saturação de 21 para 25 contra 35 da
referência. Fecha pouco mais da metade da distância; o resto é o lugar, não a
grade, e forçar mais deixa a pele alaranjada.

## Fichas que atravessam o corte

Em `RuleList`, ficha sem `at` já está em cena desde o primeiro quadro: é a que
veio do take anterior. É isso que faz três takes seguidos lerem como um bloco
só em vez de três saltos — "Controla o tráfego / Define acessos / Bloqueia
ameaças" se monta ao longo de duas cenas.

Manual de marca raramente tem cor de alerta. O risco então não é vermelho: é a
mesma ficha escurecida, de borda tracejada. A cor da marca fica reservada para
o que está sob controle.

---

# ProAdvanced — Firewall gerenciado

Peça vertical de ~60,5 s, montada com o template acima.
Configuração em `src/pieces/proadvancedFirewall/`, tokens em
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

`src/pieces/proadvancedFirewall/roteiro.txt` é o roteiro escrito;
`scenes.ts` é o corte e a legenda que saíram dele, via
`tools/build_scenes.py`. O comando que gerou esta peça:

```bash
python3 tools/build_scenes.py \
  --clips public/proadv/clips \
  --roteiro src/pieces/proadvancedFirewall/roteiro.txt \
  --out src/pieces/proadvancedFirewall/scenes.ts \
  --nomes "Pro Advanced" \
  --regiao 8424:5.3-8.8 --regiao 8438:2.85-6.15 \
  --destaques "protegida,gerenciado,ameaça,aberta,antigo,desatualizada,\
brechas,continuamente,atualizada,segurança,Pro Advanced"
```

O `scenes.ts` no repositório é o dessa saída **com três palavras corrigidas na
mão** — "não" no `8421`, "Podem" no `8426` e um "o" que ficou maiúsculo no
`8429`. Rodar o comando de novo não devolve o arquivo idêntico: o modelo não é
determinista o bastante para cravar o mesmo início de palavra duas vezes, e os
cortes saem alguns centésimos diferentes. Se regerar, confira o texto e
renderize antes de substituir.

Duas frases saíram diferentes do roteiro escrito e a legenda segue o que foi
dito: no `8415` ele fala "camadas de **segurança de** rede" (roteiro: "de
proteção da rede") e no `8438`, "É manter a **operação** atualizada" (roteiro:
"a proteção atualizada").

## A trilha

*Funky Corporate Explainer*, de Alex Morgan, em `public/proadv/audio`. O
original tem 38,52 s contra os 56,75 s da peça, e foi esticado na grade
musical — 110,8 BPM, emendas em compasso inteiro, cauda original preservada
para resolver embaixo do cartão final. O detalhe está no README daquela pasta.

O `public/audio/music.mp3` continua sendo só da Wispot: foi licenciado para o
MyGuest e não cobre vídeo de outra marca.
