# Clipes — ProAdvanced, vídeo de cartórios

23 clipes, um pedaço de frase por take, já convertidos para 1080×1920 a 24 fps
com áudio a −16 LUFS. Vinte e dois entram no corte; o `00-quando` fica de
reserva, esperando o resto da abertura (veja o fim deste arquivo). O nome traz a ordem do roteiro na frente, porque é por
ele que `tools/build_scenes.py` ordena as cenas.

## Como o material chegou

Os arquivos vieram com nome UUID, **1024×576 armazenado com `rotation -90`**
nos metadados — ou seja, 576×1024 na tela, vertical. Ler a dimensão
armazenada sem olhar a matriz de rotação dá a conclusão errada de que o
material é horizontal.

Todos chegaram em **H.264 Baseline, vídeo a ~1,65 Mb/s e áudio AAC a ~60 kb/s**,
sem metadado de câmera. É assinatura de arquivo que passou por mensageiro. Se
os originais da câmera aparecerem, vale reconverter: o material daqui já entrou
com uma geração de perda.

A conversão está em `tools/convert_clips_cartorio.sh`. Ela reencoda em vez de
copiar o vídeo, de propósito: assim o autorotate grava a orientação no quadro e
o render não corre o risco de sair deitado.

## Mapa: take → roteiro

O que cada take fala, e o que foi cortado dele. Os tempos são do arquivo
original.

| # | Clipe | Fala | Descartado |
| --- | --- | --- | --- |
| 1 | `01-todos-os-dias` | "Todos os dias, dados pessoais, documento com valor legal." | — |
| 2 | `02-patrimoniais` | "e informações patrimoniais" | — |
| 3 | `03-circulam` | "circulam pelo sistema do cartório." | ruído na cauda, 3,76–4,20 s |
| 4 | `04-comprometidas` | "Se essas informações são comprometidas," | **"De novo."**, voz fora de quadro, 1,44–1,68 s |
| 5 | `05-impacto` | "O impacto atinge a operação, o atendimento." | — |
| 6 | `06-confianca` | "E a confiança no serviço." | — |
| 7 | `07-provimentos` | "E essa preocupação ganhou mais peso no provimento 213 e no provimento 243." | 1ª tentativa gaguejada ("E essa preocupação… e essa preocupação"), 0–0,85 s, e **"Perfeito."** fora de quadro, 8,72–8,92 s |
| 8 | `08-exigencias` | "que reforçam as exigências da segurança da informação." | os primeiros 6,7 s: rabo da tomada anterior, tropeço em "ref…" e **"Está gravando?"** fora de quadro |
| 9 | `09-continuidade` | "E continuidade para cartórios." | — |
| 10 | `10-politicas` | "Na prática, isso envolve políticas de segurança." | — |
| 11 | `11-controle-acesso` | "controle de acesso, inventários de ativos." | — |
| 12 | `12-negocio-backup` | "Continuidade do negócio e backup." | — |
| 13 | `13-antivirus` | "Por isso, proteger um cartório exige mais que um antivírus." | — |
| 14 | `14-prevenir` | "É preciso ter uma estrutura preparada para prevenir" | — |
| 15 | `15-monitorar` | "Monitorar e responder a incidentes." | — |
| 16 | `16-sem-comprometer` | "sem comprometer a continuidade da sua operação." | — |
| 17 | `17-proadvanced` | "Na Pro Advanced, ajudamos cartórios com soluções de cibersegurança." | — |
| 18 | `18-infraestrutura` | "Backup, monitoramento e infraestrutura de TI." | — |
| 19 | `19-preparado` | "Seu cartório está preparado para proteger os dados?" | — |
| 20 | `20-novas-exigencias` | "Atender as novas exigências" | — |
| 21 | `21-incidente` | "e continuar operando diante de um incidente?" | **1ª tentativa inteira**, em que ele erra e pede de novo ("…incidente, argh, de novo"), 0,68–3,86 s |
| 22 | `22-fale-conosco` | "Fale conosco!" | — |
| — | `00-quando` | "Quando o sistema de um cartório para," | **fora do corte**, à espera do resto da abertura |

Há ainda um sexto descarte, que não é de ponta e por isso não vira `--regiao`:
em `17-proadvanced`, depois de "cibersegurança" e de **0,47 s de silêncio**, o
João diz **"Não foi."** — comentário sobre a tomada, não roteiro. O `trimEnd`
fecha em 5,95 s para deixá-lo de fora. Esse foi o único caso em que o som
depois da última palavra era outra fala, e não o decaimento da própria palavra;
o que os separa é o vão de silêncio entre uma coisa e outra.

Os cinco descartes de ponta entram em `build_scenes.py` como `--regiao`. Sem isso
a ferramenta ancora o corte na primeira palavra que casa com o roteiro, e em
`08-exigencias` a primeira palavra que casa está no tropeço, não na tomada boa.

## O que o roteiro pede e ainda não foi gravado

O fecho falado chegou: `22-fale-conosco` diz "Fale conosco!", e é ele que fecha
a peça antes do cartão final.

Da abertura chegou só a primeira metade, em `00-quando`:

> "Quando o sistema de um cartório para,"

Falta **"não é só a tecnologia que fica indisponível"** e a frase inteira
**"Param escrituras, certidões, registros e o atendimento ao público."**

Oração subordinada sozinha não emenda no "Todos os dias…" — sairia quebrado e
leria como erro de montagem. Por isso o `00-quando` está convertido e guardado,
mas fora do `scenes.ts`. Quando o resto chegar, ele entra como as primeiras
cenas e nada mais na configuração precisa mudar. O roteiro como foi escrito está guardado em
`src/pieces/proadvancedCartorio/roteiro-original.txt`; o `roteiro.txt` ao lado
é o que a peça fala de verdade, e é ele que alimenta a transcrição.

## Onde a fala se afasta do roteiro escrito

A legenda acompanha o áudio, não o texto — então estas diferenças estão na
tela como foram ditas:

| Roteiro escrito | Falado |
| --- | --- |
| "documentos com valor legal" | "documento com valor legal" |
| "circulam pelos sistemas do cartório" | "circulam pelo sistema do cartório" |
| "Provimentos 213/2026 e 243/2026 do CNJ" | "no provimento 213 e no provimento 243" |
| "exigências de segurança da informação" | "exigências da segurança da informação" |
| "continuidade para os cartórios" | "continuidade para cartórios" |
| "inventário de ativos" | "inventários de ativos" |
| "backups protegidos e testados" | "backup" |
| "exige mais do que antivírus" | "exige mais que um antivírus" |
| "a continuidade da operação" | "a continuidade da sua operação" |
| "atender às novas exigências" | "atender as novas exigências" |

O ano dos provimentos, a sigla do CNJ e o "protegidos e testados" entram pela
camada gráfica, que é onde o dado exato do roteiro pode ser dito sem depender
de regravar a locução.
