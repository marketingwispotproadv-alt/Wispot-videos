// Gerado por `tools/build_scenes.py` e corrigido à mão: a transcrição
// comprimiu a última palavra em seis takes e a ferramenta cortou em cima
// da fala. Cada `trimEnd` aqui foi conferido contra o envelope de energia
// do áudio, não contra o tempo que o modelo devolveu.
//
// Os tempos das legendas são relativos ao início da cena já cortada.
//
// `silence` é o silêncio de verdade nas pontas, medido do áudio — e não
// o que os tempos da transcrição sugerem, que erram para os dois lados:
// a primeira palavra vem marcada antes de o som sair, e a última fica
// esticada até o fim do segmento. `src/template/timing.ts` usa esse
// número para aparar o excesso e para decidir cada emenda.

import type { SceneDef } from "../../template/types";

export const SCENES: SceneDef[] = [
  {
    // Todos os dias, dados pessoais, documento com valor legal
    clip: "01-todos-os-dias",
    trimStart: 0.0,
    trimEnd: 5.15,
    silence: { head: 0.72, tail: 0.2 },
    chunks: [
      { words: [{ text: "Todos", start: 0.0, end: 0.78 }, { text: "os", start: 0.78, end: 0.98 }, { text: "dias,", start: 0.98, end: 1.34 }, { text: "dados", start: 1.5, end: 2.18 }, { text: "pessoais,", start: 2.18, end: 3.06 }] },
      { words: [{ text: "documento", start: 3.1, end: 4.0 }, { text: "com", start: 4.0, end: 4.08 }, { text: "valor", start: 4.08, end: 4.3 }, { text: "legal", start: 4.3, end: 4.64 }] },
    ],
  },
  {
    // e informações patrimoniais
    clip: "02-patrimoniais",
    trimStart: 0.0,
    trimEnd: 2.96,
    silence: { head: 0.66, tail: 0.28 },
    chunks: [
      { words: [{ text: "e", start: 0.0, end: 0.76 }, { text: "informações", start: 0.76, end: 1.14 }, { text: "patrimoniais", start: 1.14, end: 2.66 }] },
    ],
  },
  {
    // circulam pelo sistema do cartório.
    clip: "03-circulam",
    trimStart: 0.2,
    trimEnd: 2.94,
    silence: { head: 0.42, tail: 0.1 },
    chunks: [
      { words: [{ text: "circulam", start: 0.2, end: 0.9 }, { text: "pelo", start: 0.9, end: 1.3 }, { text: "sistema", start: 1.3, end: 1.74 }, { text: "do", start: 1.74, end: 1.98 }, { text: "cartório.", start: 1.98, end: 2.44 }] },
    ],
  },
  {
    // Se essas informações são comprometidas,
    clip: "04-comprometidas",
    trimStart: 2.2,
    trimEnd: 5.28,
    silence: { head: 0.38, tail: 0.12 },
    chunks: [
      { words: [{ text: "Se", start: 0.2, end: 0.46 }, { text: "essas", start: 0.46, end: 0.72 }, { text: "informações", start: 0.72, end: 1.1 }, { text: "são", start: 1.1, end: 1.92 }, { text: "comprometidas,", start: 1.92, end: 2.78 }] },
    ],
  },
  {
    // o impacto atinge a operação, o atendimento
    clip: "05-impacto",
    trimStart: 0.0,
    trimEnd: 4.28,
    silence: { head: 0.78, tail: 0.12 },
    chunks: [
      { words: [{ text: "o", start: 0.0, end: 0.76 }, { text: "impacto", start: 0.76, end: 1.18 }, { text: "atinge", start: 1.18, end: 2.1 }, { text: "a", start: 2.1, end: 2.14 }, { text: "operação,", start: 2.14, end: 2.84 }] },
      { words: [{ text: "o", start: 3.14, end: 3.3 }, { text: "atendimento", start: 3.34, end: 4.16 }] },
    ],
  },
  {
    // e a confiança no serviço.
    clip: "06-confianca",
    trimStart: 0.0,
    trimEnd: 2.58,
    silence: { head: 0.9, tail: 0.16 },
    chunks: [
      { words: [{ text: "e", start: 0.0, end: 0.94 }, { text: "a", start: 0.94, end: 1.02 }, { text: "confiança", start: 1.02, end: 1.62 }, { text: "no", start: 1.62, end: 1.7 }, { text: "serviço.", start: 1.7, end: 2.28 }] },
    ],
  },
  {
    // E essa preocupação ganhou mais peso no provimento 213 e no provimento 243,
    clip: "07-provimentos",
    trimStart: 1.05,
    trimEnd: 8.25,
    silence: { head: 0.16, tail: 0.28 },
    chunks: [
      { words: [{ text: "E", start: 0.1, end: 0.2 }, { text: "essa", start: 0.2, end: 0.36 }, { text: "preocupação", start: 0.36, end: 1.04 }, { text: "ganhou", start: 1.04, end: 1.54 }] },
      { words: [{ text: "mais", start: 1.54, end: 1.7 }, { text: "peso", start: 1.7, end: 2.14 }, { text: "no", start: 2.14, end: 2.52 }, { text: "provimento", start: 2.52, end: 3.12 }, { text: "213", start: 3.12, end: 4.08 }] },
      { words: [{ text: "e", start: 4.08, end: 4.4 }, { text: "no", start: 4.4, end: 4.68 }, { text: "provimento", start: 4.68, end: 5.56 }, { text: "243,", start: 5.85, end: 6.9 }] },
    ],
  },
  {
    // que reforçam as exigências da segurança da informação
    clip: "08-exigencias",
    trimStart: 6.5,
    trimEnd: 10.85,
    silence: { head: 0.46, tail: 0.22 },
    chunks: [
      { words: [{ text: "que", start: 0.2, end: 0.46 }, { text: "reforçam", start: 0.46, end: 1.26 }, { text: "as", start: 1.26, end: 1.62 }, { text: "exigências", start: 1.62, end: 2.44 }] },
      { words: [{ text: "da", start: 2.44, end: 2.9 }, { text: "segurança", start: 2.9, end: 3.28 }, { text: "da", start: 3.28, end: 3.48 }, { text: "informação", start: 3.48, end: 4.09 }] },
    ],
  },
  {
    // e continuidade para cartórios.
    clip: "09-continuidade",
    trimStart: 0.0,
    trimEnd: 2.4,
    silence: { head: 0.48, tail: 0.04 },
    chunks: [
      { words: [{ text: "e", start: 0.0, end: 0.54 }, { text: "continuidade", start: 0.54, end: 1.24 }, { text: "para", start: 1.24, end: 1.5 }, { text: "cartórios.", start: 1.5, end: 2.1 }] },
    ],
  },
  {
    // Na prática, isso envolve políticas de segurança,
    clip: "10-politicas",
    trimStart: 0.0,
    trimEnd: 4.26,
    silence: { head: 0.58, tail: 0.08 },
    chunks: [
      { words: [{ text: "Na", start: 0.0, end: 0.74 }, { text: "prática,", start: 0.74, end: 1.34 }, { text: "isso", start: 1.34, end: 1.72 }, { text: "envolve", start: 1.72, end: 2.34 }] },
      { words: [{ text: "políticas", start: 2.34, end: 3.02 }, { text: "de", start: 3.02, end: 3.28 }, { text: "segurança,", start: 3.28, end: 3.96 }] },
    ],
  },
  {
    // controle de acesso, inventários de ativos,
    clip: "11-controle-acesso",
    trimStart: 0.0,
    trimEnd: 3.88,
    silence: { head: 0.76, tail: 0.12 },
    chunks: [
      { words: [{ text: "controle", start: 0.0, end: 1.2 }, { text: "de", start: 1.2, end: 1.28 }, { text: "acesso,", start: 1.28, end: 1.72 }, { text: "inventários", start: 1.98, end: 2.9 }] },
      { words: [{ text: "de", start: 2.9, end: 3.0 }, { text: "ativos,", start: 3.0, end: 3.58 }] },
    ],
  },
  {
    // continuidade do negócio e backup.
    clip: "12-negocio-backup",
    trimStart: 0.0,
    trimEnd: 3.25,
    silence: { head: 0.7, tail: 0.12 },
    chunks: [
      { words: [{ text: "continuidade", start: 0.0, end: 1.38 }, { text: "do", start: 1.38, end: 1.6 }, { text: "negócio", start: 1.6, end: 1.94 }, { text: "e", start: 1.94, end: 2.5 }, { text: "backup.", start: 2.5, end: 3.12 }] },
    ],
  },
  {
    // Por isso, proteger um cartório exige mais que um antivírus.
    clip: "13-antivirus",
    trimStart: 0.0,
    trimEnd: 5.25,
    silence: { head: 0.64, tail: 0.24 },
    chunks: [
      { words: [{ text: "Por", start: 0.0, end: 0.68 }, { text: "isso,", start: 0.68, end: 1.08 }, { text: "proteger", start: 1.16, end: 1.88 }, { text: "um", start: 1.88, end: 2.0 }, { text: "cartório", start: 2.0, end: 2.5 }] },
      { words: [{ text: "exige", start: 2.5, end: 3.34 }, { text: "mais", start: 3.34, end: 3.78 }, { text: "que", start: 3.78, end: 4.12 }] },
      { words: [{ text: "um", start: 4.12, end: 4.24 }, { text: "antivírus.", start: 4.24, end: 5.0 }] },
    ],
  },
  {
    // É preciso ter uma estrutura preparada para prevenir,
    clip: "14-prevenir",
    trimStart: 0.0,
    trimEnd: 4.2,
    silence: { head: 0.62, tail: 0.22 },
    chunks: [
      { words: [{ text: "É", start: 0.0, end: 0.64 }, { text: "preciso", start: 0.64, end: 1.02 }, { text: "ter", start: 1.02, end: 1.36 }, { text: "uma", start: 1.36, end: 1.54 }, { text: "estrutura", start: 1.54, end: 2.18 }] },
      { words: [{ text: "preparada", start: 2.18, end: 3.0 }, { text: "para", start: 3.0, end: 3.16 }, { text: "prevenir,", start: 3.16, end: 3.76 }] },
    ],
  },
  {
    // monitorar e responder a incidentes,
    clip: "15-monitorar",
    trimStart: 0.0,
    trimEnd: 3.28,
    silence: { head: 0.6, tail: 0.24 },
    chunks: [
      { words: [{ text: "monitorar", start: 0.0, end: 1.36 }, { text: "e", start: 1.36, end: 1.46 }, { text: "responder", start: 1.46, end: 1.98 }] },
      { words: [{ text: "a", start: 1.98, end: 2.34 }, { text: "incidentes,", start: 2.34, end: 2.98 }] },
    ],
  },
  {
    // sem comprometer a continuidade da sua operação.
    clip: "16-sem-comprometer",
    trimStart: 0.0,
    trimEnd: 5.34,
    silence: { head: 1.64, tail: 0.1 },
    chunks: [
      { words: [{ text: "sem", start: 0.0, end: 1.74 }, { text: "comprometer", start: 1.74, end: 2.56 }] },
      { words: [{ text: "a", start: 2.56, end: 2.94 }, { text: "continuidade", start: 2.94, end: 3.98 }] },
      { words: [{ text: "da", start: 3.98, end: 4.24 }, { text: "sua", start: 4.24, end: 4.48 }, { text: "operação.", start: 4.48, end: 5.04 }] },
    ],
  },
  {
    // Na Pro Advanced, ajudamos cartórios com soluções de cibersegurança,
    clip: "17-proadvanced",
    trimStart: 0.0,
    trimEnd: 5.95,
    silence: { head: 0.68, tail: 0.24 },
    chunks: [
      { words: [{ text: "Na", start: 0.0, end: 0.78 }, { text: "Pro Advanced,", start: 0.78, end: 1.6 }, { text: "ajudamos", start: 1.6, end: 2.54 }] },
      { words: [{ text: "cartórios", start: 2.54, end: 3.24 }, { text: "com", start: 3.24, end: 3.58 }, { text: "soluções", start: 3.58, end: 4.62 }] },
      { words: [{ text: "de", start: 4.62, end: 4.72 }, { text: "cibersegurança,", start: 4.72, end: 5.69 }] },
    ],
  },
  {
    // backup, monitoramento e infraestrutura de TI.
    clip: "18-infraestrutura",
    trimStart: 0.6,
    trimEnd: 4.45,
    silence: { head: 0.18, tail: 0.2 },
    chunks: [
      { words: [{ text: "backup,", start: 0.05, end: 0.73 }, { text: "monitoramento", start: 0.77, end: 1.77 }, { text: "e", start: 1.77, end: 2.03 }, { text: "infraestrutura", start: 2.03, end: 3.05 }] },
      { words: [{ text: "de", start: 3.05, end: 3.15 }, { text: "TI.", start: 3.15, end: 3.37 }] },
    ],
  },
  {
    // Seu cartório está preparado para proteger os dados,
    clip: "19-preparado",
    trimStart: 0.0,
    trimEnd: 4.25,
    silence: { head: 0.82, tail: 0.24 },
    chunks: [
      { words: [{ text: "Seu", start: 0.0, end: 0.96 }, { text: "cartório", start: 0.96, end: 1.46 }, { text: "está", start: 1.46, end: 1.84 }, { text: "preparado", start: 1.84, end: 2.52 }] },
      { words: [{ text: "para", start: 2.52, end: 2.72 }, { text: "proteger", start: 2.72, end: 3.32 }, { text: "os", start: 3.32, end: 3.44 }, { text: "dados,", start: 3.44, end: 3.68 }] },
    ],
  },
  {
    // atender as novas exigências
    clip: "20-novas-exigencias",
    trimStart: 0.0,
    trimEnd: 2.7,
    silence: { head: 0.86, tail: 0.08 },
    chunks: [
      { words: [{ text: "atender", start: 0.0, end: 1.28 }, { text: "as", start: 1.28, end: 1.42 }, { text: "novas", start: 1.42, end: 1.76 }, { text: "exigências", start: 1.76, end: 2.4 }] },
    ],
  },
  {
    // e continuar operando diante de um incidente?
    clip: "21-incidente",
    trimStart: 4.35,
    trimEnd: 7.75,
    silence: { head: 0.36, tail: 0.18 },
    chunks: [
      { words: [{ text: "e", start: 0.2, end: 0.36 }, { text: "continuar", start: 0.36, end: 0.96 }, { text: "operando", start: 0.96, end: 1.62 }, { text: "diante", start: 1.62, end: 2.24 }] },
      { words: [{ text: "de", start: 2.24, end: 2.4 }, { text: "um", start: 2.4, end: 2.44 }, { text: "incidente?", start: 2.44, end: 3.1 }] },
    ],
  },
  {
    // Fale conosco!
    clip: "22-fale-conosco",
    trimStart: 0.82,
    trimEnd: 2.13,
    silence: { head: 0.2, tail: 0.28 },
    chunks: [
      { words: [{ text: "Fale", start: 0.0, end: 0.34 }, { text: "conosco!", start: 0.34, end: 1.01 }] },
    ],
  },
];
