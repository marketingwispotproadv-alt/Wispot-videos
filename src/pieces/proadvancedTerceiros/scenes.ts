// Gerado por `tools/build_scenes.py`. Os tempos das legendas são
// relativos ao início da cena já cortada.
//
// `silence` é o silêncio de verdade nas pontas, medido do áudio — e não
// o que os tempos da transcrição sugerem, que erram para os dois lados:
// a primeira palavra vem marcada antes de o som sair, e a última fica
// esticada até o fim do segmento. `src/template/timing.ts` usa esse
// número para aparar o excesso e para decidir cada emenda.

import type { SceneDef } from "../../template/types";

export const SCENES: SceneDef[] = [
  {
    // A sua empresa utiliza sistemas de terceiros?
    clip: "01-terceiros",
    trimStart: 0.0,
    trimEnd: 3.58,
    silence: { head: 1.0, tail: 0.2 },
    chunks: [
      { words: [{ text: "A", start: 0.0, end: 1.0 }, { text: "sua", start: 1.0, end: 1.18 }, { text: "empresa", start: 1.18, end: 1.5 }, { text: "utiliza", start: 1.5, end: 2.26 }] },
      { words: [{ text: "sistemas", start: 2.26, end: 2.5 }, { text: "de", start: 2.5, end: 2.76 }, { text: "terceiros?", start: 2.76, end: 3.28 }] },
    ],
  },
  {
    // Foi o que um caso recente no Brasil mostrou.
    clip: "02-caso",
    trimStart: 0.1,
    trimEnd: 3.04,
    silence: { head: 0.46, tail: 0.14 },
    chunks: [
      { words: [{ text: "Foi", start: 0.2, end: 0.48 }, { text: "o", start: 0.48, end: 0.62 }, { text: "que", start: 0.62, end: 0.7 }, { text: "um", start: 0.7, end: 0.8 }] },
      { words: [{ text: "caso", start: 0.8, end: 1.18 }, { text: "recente", start: 1.18, end: 1.82 }, { text: "no", start: 1.82, end: 1.92 }, { text: "Brasil", start: 1.92, end: 2.2 }, { text: "mostrou.", start: 2.2, end: 2.64 }] },
    ],
  },
  {
    // Uma empresa de tecnologia teve os seus dados expostos,
    clip: "03-expostos",
    trimStart: 0.0,
    trimEnd: 4.1,
    silence: { head: 0.82, tail: 0.16 },
    chunks: [
      { words: [{ text: "Uma", start: 0.0, end: 0.9 }, { text: "empresa", start: 0.9, end: 1.28 }, { text: "de", start: 1.28, end: 1.48 }, { text: "tecnologia", start: 1.48, end: 1.86 }, { text: "teve", start: 1.86, end: 2.54 }] },
      { words: [{ text: "os", start: 2.54, end: 2.66 }, { text: "seus", start: 2.66, end: 2.8 }, { text: "dados", start: 2.8, end: 3.08 }, { text: "expostos,", start: 3.08, end: 3.8 }] },
    ],
  },
  {
    // E mais de 150 órgãos públicos utilizavam o sistema dela.
    clip: "04-orgaos",
    trimStart: 16.5,
    trimEnd: 21.58,
    silence: { head: 0.22, tail: 0.12 },
    chunks: [
      { words: [{ text: "E", start: 0.2, end: 0.3 }, { text: "mais", start: 0.3, end: 0.6 }, { text: "de", start: 0.6, end: 0.92 }, { text: "150", start: 0.92, end: 1.3 }, { text: "órgãos", start: 1.3, end: 2.46 }] },
      { words: [{ text: "públicos", start: 2.46, end: 3.0 }, { text: "utilizavam", start: 3.0, end: 3.92 }] },
      { words: [{ text: "o", start: 3.92, end: 4.1 }, { text: "sistema", start: 4.1, end: 4.4 }, { text: "dela.", start: 4.4, end: 4.78 }] },
    ],
  },
  {
    // Isso acontece quando um ataque chega através de uma empresa que já tem acesso à sua operação.
    clip: "05-acontece",
    trimStart: 0.0,
    trimEnd: 6.82,
    silence: { head: 0.91, tail: 0.3 },
    chunks: [
      { words: [{ text: "Isso", start: 0.0, end: 1.02 }, { text: "acontece", start: 1.02, end: 1.42 }, { text: "quando", start: 1.42, end: 1.96 }, { text: "um", start: 1.96, end: 2.18 }] },
      { words: [{ text: "ataque", start: 2.18, end: 2.54 }, { text: "chega", start: 2.54, end: 3.04 }, { text: "através", start: 3.04, end: 3.6 }, { text: "de", start: 3.6, end: 4.34 }] },
      { words: [{ text: "uma", start: 4.34, end: 4.44 }, { text: "empresa", start: 4.44, end: 4.72 }, { text: "que", start: 4.72, end: 4.96 }, { text: "já", start: 4.96, end: 5.06 }] },
      { words: [{ text: "tem", start: 5.06, end: 5.22 }, { text: "acesso", start: 5.22, end: 5.46 }, { text: "à", start: 5.46, end: 5.78 }, { text: "sua", start: 5.78, end: 5.88 }] },
      { words: [{ text: "operação.", start: 5.88, end: 6.32 }] },
    ],
  },
  {
    // Agora pensa, quantas empresas de fora têm acesso aos seus sistemas hoje?
    clip: "06-pensa",
    trimStart: 0.0,
    trimEnd: 6.26,
    silence: { head: 0.64, tail: 0.22 },
    chunks: [
      { words: [{ text: "Agora", start: 0.0, end: 0.82 }, { text: "pensa,", start: 0.82, end: 1.28 }, { text: "quantas", start: 1.46, end: 2.12 }] },
      { words: [{ text: "empresas", start: 2.12, end: 2.48 }, { text: "de", start: 2.48, end: 2.88 }, { text: "fora", start: 2.88, end: 3.22 }, { text: "têm", start: 3.22, end: 3.72 }, { text: "acesso", start: 3.72, end: 4.22 }] },
      { words: [{ text: "aos", start: 4.22, end: 4.9 }, { text: "seus", start: 4.9, end: 5.16 }, { text: "sistemas", start: 5.16, end: 5.5 }, { text: "hoje?", start: 5.5, end: 5.96 }] },
    ],
  },
  {
    // Contabilidade, suporte de software,
    clip: "07-contabilidade",
    trimStart: 1.12,
    trimEnd: 4.09,
    silence: { head: 0.22, tail: 0.2 },
    chunks: [
      { words: [{ text: "Contabilidade,", start: 0.2, end: 0.88 }, { text: "suporte", start: 1.0, end: 1.8 }, { text: "de", start: 1.8, end: 1.94 }, { text: "software,", start: 1.94, end: 2.34 }] },
    ],
  },
  {
    // Fornecedor de TI, quem administra os seus servidores.
    clip: "08-fornecedor",
    trimStart: 0.54,
    trimEnd: 4.36,
    silence: { head: 0.28, tail: 0.12 },
    chunks: [
      { words: [{ text: "Fornecedor", start: 0.2, end: 0.72 }, { text: "de", start: 0.72, end: 0.78 }, { text: "TI,", start: 0.78, end: 1.02 }, { text: "quem", start: 1.3, end: 1.82 }, { text: "administra", start: 1.82, end: 2.8 }] },
      { words: [{ text: "os", start: 2.8, end: 2.84 }, { text: "seus", start: 2.84, end: 2.98 }, { text: "servidores.", start: 2.98, end: 3.52 }] },
    ],
  },
  {
    // Se uma dessas empresas for invadida,
    clip: "09-invadida",
    trimStart: 0.0,
    trimEnd: 3.1,
    silence: { head: 0.9, tail: 0.28 },
    chunks: [
      { words: [{ text: "Se", start: 0.0, end: 0.96 }, { text: "uma", start: 0.96, end: 1.24 }, { text: "dessas", start: 1.24, end: 1.42 }, { text: "empresas", start: 1.42, end: 1.84 }] },
      { words: [{ text: "for", start: 1.84, end: 2.12 }, { text: "invadida,", start: 2.12, end: 2.7 }] },
    ],
  },
  {
    // Esses acessos podem ser usados para chegar até os seus dados.
    clip: "10-dados",
    trimStart: 18.39,
    trimEnd: 22.07,
    silence: { head: 0.24, tail: 0.26 },
    chunks: [
      { words: [{ text: "Esses", start: 0.2, end: 0.42 }, { text: "acessos", start: 0.42, end: 1.02 }, { text: "podem", start: 1.02, end: 1.26 }, { text: "ser", start: 1.26, end: 1.5 }, { text: "usados", start: 1.5, end: 2.06 }] },
      { words: [{ text: "para", start: 2.06, end: 2.26 }, { text: "chegar", start: 2.26, end: 2.52 }, { text: "até", start: 2.52, end: 2.76 }] },
      { words: [{ text: "os", start: 2.76, end: 2.94 }, { text: "seus", start: 2.94, end: 3.06 }, { text: "dados.", start: 3.06, end: 3.38 }] },
    ],
  },
  {
    // E o mais perigoso é que, muitas vezes,
    clip: "11-perigoso",
    trimStart: 0.0,
    trimEnd: 3.6,
    silence: { head: 0.86, tail: 0.22 },
    chunks: [
      { words: [{ text: "E", start: 0.0, end: 0.86 }, { text: "o", start: 0.86, end: 0.94 }, { text: "mais", start: 0.94, end: 1.2 }, { text: "perigoso", start: 1.2, end: 1.92 }] },
      { words: [{ text: "é", start: 1.92, end: 1.96 }, { text: "que,", start: 1.96, end: 2.24 }, { text: "muitas", start: 2.26, end: 2.66 }, { text: "vezes,", start: 2.66, end: 3.3 }] },
    ],
  },
  {
    // Ele pode parecer um acesso normal.
    clip: "12-normal",
    trimStart: 6.73,
    trimEnd: 8.99,
    silence: { head: 0.2, tail: 0.2 },
    chunks: [
      { words: [{ text: "Ele", start: 0.2, end: 0.32 }, { text: "pode", start: 0.32, end: 0.56 }, { text: "parecer", start: 0.56, end: 0.9 }, { text: "um", start: 0.9, end: 1.22 }] },
      { words: [{ text: "acesso", start: 1.22, end: 1.4 }, { text: "normal.", start: 1.4, end: 1.76 }] },
    ],
  },
  {
    // Por isso, não basta proteger somente a sua empresa.
    clip: "13-proteger",
    trimStart: 0.0,
    trimEnd: 3.95,
    silence: { head: 0.71, tail: 0.14 },
    chunks: [
      { words: [{ text: "Por", start: 0.0, end: 0.76 }, { text: "isso,", start: 0.76, end: 1.16 }, { text: "não", start: 1.16, end: 1.56 }, { text: "basta", start: 1.56, end: 2.1 }, { text: "proteger", start: 2.1, end: 2.7 }] },
      { words: [{ text: "somente", start: 2.7, end: 3.12 }, { text: "a", start: 3.12, end: 3.2 }, { text: "sua", start: 3.2, end: 3.28 }] },
      { words: [{ text: "empresa.", start: 3.28, end: 3.52 }] },
    ],
  },
  {
    // Também é importante controlar o que cada empresa externa pode acessar.
    clip: "14-controlar",
    trimStart: 0.0,
    trimEnd: 5.2,
    silence: { head: 0.76, tail: 0.28 },
    chunks: [
      { words: [{ text: "Também", start: 0.0, end: 1.1 }, { text: "é", start: 1.1, end: 1.3 }, { text: "importante", start: 1.3, end: 1.72 }, { text: "controlar", start: 1.72, end: 2.28 }] },
      { words: [{ text: "o", start: 2.28, end: 2.78 }, { text: "que", start: 2.78, end: 2.9 }, { text: "cada", start: 2.9, end: 3.2 }] },
      { words: [{ text: "empresa", start: 3.2, end: 3.54 }, { text: "externa", start: 3.54, end: 4.14 }, { text: "pode", start: 4.14, end: 4.34 }, { text: "acessar.", start: 4.34, end: 4.9 }] },
    ],
  },
  {
    // Separar os ambientes e acompanhar o acesso de perto.
    clip: "15-ambientes",
    trimStart: 0.44,
    trimEnd: 4.06,
    silence: { head: 0.22, tail: 0.22 },
    chunks: [
      { words: [{ text: "Separar", start: 0.2, end: 0.72 }, { text: "os", start: 0.72, end: 0.82 }, { text: "ambientes", start: 0.82, end: 1.38 }, { text: "e", start: 1.38, end: 1.82 }, { text: "acompanhar", start: 1.82, end: 2.46 }] },
      { words: [{ text: "o", start: 2.46, end: 2.6 }, { text: "acesso", start: 2.6, end: 2.82 }, { text: "de", start: 2.82, end: 3.06 }, { text: "perto.", start: 3.06, end: 3.32 }] },
    ],
  },
  {
    // Você sabe exatamente quais empresas externas acessam o seu sistema?
    clip: "16-sabe",
    trimStart: 0.0,
    trimEnd: 5.32,
    silence: { head: 0.38, tail: 0.25 },
    chunks: [
      { words: [{ text: "Você", start: 0.0, end: 0.82 }, { text: "sabe", start: 0.82, end: 1.32 }, { text: "exatamente", start: 1.32, end: 1.88 }, { text: "quais", start: 1.88, end: 2.72 }] },
      { words: [{ text: "empresas", start: 2.72, end: 3.22 }, { text: "externas", start: 3.22, end: 3.98 }] },
      { words: [{ text: "acessam", start: 3.98, end: 4.38 }, { text: "o", start: 4.38, end: 4.42 }, { text: "seu", start: 4.42, end: 4.5 }, { text: "sistema?", start: 4.5, end: 4.78 }] },
    ],
  },
  {
    // E até onde cada uma pode chegar?
    clip: "17-ate-onde",
    trimStart: 12.55,
    trimEnd: 15.16,
    silence: { head: 0.2, tail: 0.2 },
    chunks: [
      { words: [{ text: "E", start: 0.2, end: 0.3 }, { text: "até", start: 0.3, end: 0.48 }, { text: "onde", start: 0.48, end: 0.84 }, { text: "cada", start: 0.84, end: 1.36 }] },
      { words: [{ text: "uma", start: 1.36, end: 1.6 }, { text: "pode", start: 1.6, end: 1.84 }, { text: "chegar?", start: 1.84, end: 2.1 }] },
    ],
  },
  {
    // Fale conosco e agende um diagnóstico gratuito.
    clip: "18-fale",
    trimStart: 16.48,
    trimEnd: 19.18,
    silence: { head: 0.22, tail: 0.14 },
    chunks: [
      { words: [{ text: "Fale", start: 0.2, end: 0.34 }, { text: "conosco", start: 0.34, end: 0.82 }, { text: "e", start: 0.82, end: 0.88 }, { text: "agende", start: 0.88, end: 1.2 }] },
      { words: [{ text: "um", start: 1.2, end: 1.3 }, { text: "diagnóstico", start: 1.3, end: 1.82 }, { text: "gratuito.", start: 1.82, end: 2.4 }] },
    ],
  },
];
