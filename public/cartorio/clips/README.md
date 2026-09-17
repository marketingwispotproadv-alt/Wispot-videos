# Clipes — ProAdvanced, vídeo de cartórios

21 takes, um pedaço de frase por take, já convertidos para 1080×1920 a 24 fps
com áudio a −16 LUFS. O nome traz a ordem do roteiro na frente, porque é por
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

Os cinco descartes acima entram em `build_scenes.py` como `--regiao`. Sem isso
a ferramenta ancora o corte na primeira palavra que casa com o roteiro, e em
`08-exigencias` a primeira palavra que casa está no tropeço, não na tomada boa.

## O que o roteiro pede e não foi gravado

Não existe áudio para:

- **a abertura inteira** — "Quando o sistema de um cartório para, não é só a
  tecnologia que fica indisponível. Param escrituras, certidões, registros e o
  atendimento ao público.";
- **"Fale com a Pro Advanced."**, o fecho falado.

Por decisão de quem pediu o corte, a peça começa direto no "Todos os dias…" e o
fecho fica no cartão final. O roteiro como foi escrito está guardado em
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
