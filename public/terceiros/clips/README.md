# Clipes — ProAdvanced, vídeo de acesso de terceiros

18 clipes, um pedaço de frase por take, convertidos para 1080×1920 com áudio a
−16 LUFS. O nome traz a ordem do roteiro na frente, porque é por ele que
`tools/build_scenes.py` ordena as cenas.

## Como o material chegou

Vieram por uma pasta do Drive, 25 arquivos com nome UUID, **1280×720
armazenado com `rotation -90`** nos metadados — ou seja 720×1280 na tela,
vertical. Ler a dimensão armazenada sem olhar a matriz de rotação dá a
conclusão errada de que o material é horizontal.

Todos em **H.264 Baseline com áudio AAC a ~60 kb/s**, sem metadado de câmera:
assinatura de arquivo que passou por aplicativo de mensagem. É a mesma origem
do material de cartórios, e uma geração de perda melhor — lá chegou 576×1024,
aqui 720×1280. Se os originais da câmera aparecerem, vale reconverter.

A conversão está em `tools/convert_clips_terceiros.sh`. Ela reencoda em vez de
copiar o vídeo, de propósito: assim o autorotate grava a orientação no quadro e
o render não corre o risco de sair deitado.

## Mapa: take → roteiro

O que cada take fala, e o que foi descartado dele. Os tempos são do arquivo
original. O arquivo de origem está em `raw/terceiros/`, com o nome UUID; o mapa
completo entre os dois nomes está em `tools/terceiros-mapa.txt`.

| # | Clipe | Fala | Descartado |
| --- | --- | --- | --- |
| 1 | `01-terceiros` | "A sua empresa utiliza sistemas de terceiros?" | — |
| 2 | `02-caso` | "Foi o que um caso recente no Brasil mostrou" | — |
| 3 | `03-expostos` | "Uma empresa de tecnologia teve os seus dados expostos" | — |
| 4 | `04-orgaos` | "e mais de 150 órgãos públicos utilizavam o sistema dela" | as duas primeiras tentativas, 0–16,0 s, com **"Não, ficou muito pausado"** e **"Não, e mais não… Espera aí"** no meio |
| 5 | `05-acontece` | "Isso acontece quando um ataque chega através de uma empresa que já tem acesso à sua operação" | — |
| 6 | `06-pensa` | "Agora pensa, quantas empresas de fora têm acesso aos seus sistemas hoje?" | — |
| 7 | `07-contabilidade` | "Contabilidade, suporte de software," | estalo de 0,22 s na cabeça, antes da fala |
| 8 | `08-fornecedor` | "Fornecedor de TI, quem administra os seus servidores" | ruído curto na cauda, 4,79–4,94 s |
| 9 | `09-invadida` | "Se uma dessas empresas for invadida," | — |
| 10 | `10-dados` | "esses acessos podem ser usados para chegar até os seus dados" | três tentativas, 0–18,0 s: um começo truncado, uma versão no singular e uma com "chegar **a ter** os seus dados" — além de um **"Um grande abraço e até a próxima"** aos 7,4 s |
| 11 | `11-perigoso` | "E o mais perigoso é que, muitas vezes," | — |
| 12 | `12-normal` | "ele pode parecer um acesso normal" | duas tentativas, 0–6,5 s, com **"Não… Ele pode…"** no meio |
| 13 | `13-proteger` | "Por isso, não basta só proteger a sua empresa" | — |
| 14 | `14-controlar` | "Também é importante controlar o que cada empresa externa pode acessar," | — |
| 15 | `15-ambientes` | "separar os ambientes e acompanhar o acesso de perto" | — |
| 16 | `16-sabe` | "Você sabe exatamente quais empresas externas acessam o seu sistema" | — |
| 17 | `17-ate-onde` | "e até onde cada uma pode chegar?" | três tentativas, 0–11,8 s, com **"Não, cada empresa? Não, é o que você falou"** no meio, e um **"Pode, não?"** na cauda |
| 18 | `18-fale` | "Fale conosco e agende um diagnóstico gratuito" | conversa de set na cabeça (**"Ok. Beleza. Obrigado."**) e uma tentativa seguida de **"Não, tem que falar de novo, né?"** |

## O que ficou fora do corte

Sete arquivos inteiros, todos em `raw/terceiros/`:

| Arquivo | Por quê |
| --- | --- |
| `7050f56a` | outra tomada da abertura; o take escolhido está mais limpo |
| `f3d7d720` | idem, com **"Tchau, tchau! Beijo!"** e **"Ih, vai ter que fazer de novo"** no meio |
| `bb7542b6` | idem, com a autocorreção **"Não, não é de terceira, é de terceiros"** |
| `f73276ce` | tentativas do "Agora pensa", terminando em **"Calma, deixa eu ler de novo"** |
| `a457f1c3` | "Ele pode **ser** um acesso normal" — perde o "parecer", que é o que carrega o sentido da frase |
| `fffc7576` | fragmento de 0,96 s em 640×368 |
| `1593ae4e` | brincadeira sobre memória RAM, sem fala do roteiro |

## Take com mais de uma tentativa

Em cinco takes ele para e refaz dentro do mesmo arquivo, e em todos a tomada
boa é a última. Nesses o áudio é cortado **antes** de transcrever
(`--regiao` do `build_scenes.py`): num take assim, os tempos que o modelo
devolve para o trecho ruim são justamente os que não dá para confiar, e
filtrar as palavras depois não resolve.

```bash
python3 tools/build_scenes.py \
    --clips public/terceiros/clips \
    --roteiro src/pieces/proadvancedTerceiros/roteiro.txt \
    --out src/pieces/proadvancedTerceiros/scenes.ts \
    --nomes "Pro Advanced" \
    --regiao 04-orgaos:16.70-21.48 \
    --regiao 07-contabilidade:1.32-3.89 \
    --regiao 10-dados:18.59-22.75 \
    --regiao 12-normal:6.93-8.78 \
    --regiao 17-ate-onde:12.75-14.95 \
    --regiao 18-fale:16.68-19.05
```

## O que o roteiro pedia e não foi gravado

A abertura escrita — "Sua empresa pode estar protegida. Mas basta uma empresa
com acesso aos seus sistemas ser invadida para o risco chegar até você" — não
existe em áudio. No lugar dela o João gravou a pergunta "A sua empresa utiliza
sistemas de terceiros?", que o roteiro escrito não tem. O roteiro como foi
escrito está em `src/pieces/proadvancedTerceiros/roteiro-original.txt`, ao lado
do `roteiro.txt` que é o que a peça fala — e é o segundo que alimenta a
transcrição, porque o vocabulário de ancoragem tem de ser o do áudio.

Sem a frase do risco, o "Foi o que um caso recente no Brasil mostrou" da cena 2
fica sem antecedente. Quem a carrega é a etiqueta da abertura, com as palavras
do próprio roteiro. Se a abertura for regravada, ela entra como cena nova no
topo do `scenes.ts` e a etiqueta sai.

Também falta o **"ou a nuvem"** do fim da lista de empresas de fora: a voz para
em "quem administra os seus servidores". Esse entra pela ficha, que é onde o
dado exato cabe sem depender de regravação.
