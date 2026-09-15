// Gerado de `tools/build_scenes.py` a partir dos 16 takes (faster-whisper
// large-v3, word timestamps), com o roteiro passado como contexto para os
// nomes de marca saírem certos.
//
// O corte de cada cena começa 0,20 s antes da primeira palavra e termina
// 0,30 s depois da última — folga suficiente para as emendas caírem no
// silêncio. `src/template/timing.ts` mede essa folga e decide a emenda.

import type { SceneDef } from "../../template/types";

export const SCENES: SceneDef[] = [
  {
    // "Ter um firewall não significa que a sua empresa está protegida."
    clip: "8413",
    trimStart: 0.76,
    trimEnd: 3.92,
    chunks: [
      { words: [{ text: "Ter", start: 0.2, end: 0.4 }, { text: "um", start: 0.4, end: 0.54 }, { text: "firewall", start: 0.54, end: 0.78 }, { text: "não", start: 0.78, end: 1.12 }] },
      { words: [{ text: "significa", start: 1.12, end: 1.44 }, { text: "que", start: 1.44, end: 1.72 }, { text: "a", start: 1.72, end: 1.72 }, { text: "sua", start: 1.72, end: 1.8 }] },
      { words: [{ text: "empresa", start: 1.8, end: 2.0 }, { text: "está", start: 2.0, end: 2.22 }, { text: "protegida.", start: 2.22, end: 2.86, hl: true }] },
    ],
  },
  {
    // "O que faz diferença é como ele está configurado e gerenciado."
    clip: "8414",
    trimStart: 0.56,
    trimEnd: 5.4,
    chunks: [
      { words: [{ text: "O", start: 0.2, end: 0.4 }, { text: "que", start: 0.4, end: 0.54 }, { text: "faz", start: 0.54, end: 0.72 }, { text: "diferença", start: 0.72, end: 0.98 }] },
      { words: [{ text: "é", start: 0.98, end: 1.74 }, { text: "como", start: 1.74, end: 2.06 }, { text: "ele", start: 2.06, end: 2.32 }, { text: "está", start: 2.32, end: 2.62 }] },
      { words: [{ text: "configurado", start: 2.62, end: 3.8 }, { text: "e", start: 3.8, end: 3.9 }, { text: "gerenciado.", start: 3.9, end: 4.54, hl: true }] },
    ],
  },
  {
    // "O firewall é uma das principais camadas de segurança de rede."
    clip: "8415",
    trimStart: 0.38,
    trimEnd: 5.1,
    chunks: [
      { words: [{ text: "O", start: 0.2, end: 0.42 }, { text: "firewall", start: 0.42, end: 0.78 }, { text: "é", start: 0.78, end: 1.3 }, { text: "uma", start: 1.3, end: 1.76 }] },
      { words: [{ text: "das", start: 1.76, end: 1.94 }, { text: "principais", start: 1.94, end: 2.76 }, { text: "camadas", start: 2.76, end: 3.36 }, { text: "de", start: 3.36, end: 3.46 }] },
      { words: [{ text: "segurança", start: 3.46, end: 3.76, hl: true }, { text: "de", start: 3.76, end: 4.2 }, { text: "rede.", start: 4.2, end: 4.42 }] },
    ],
  },
  {
    // "Ele controla o tráfego e define os acessos."
    clip: "8417",
    trimStart: 0.0,
    trimEnd: 4.12,
    chunks: [
      { words: [{ text: "Ele", start: 0.0, end: 1.1 }, { text: "controla", start: 1.1, end: 1.68 }, { text: "o", start: 1.68, end: 1.86 }, { text: "tráfego", start: 1.86, end: 2.42 }] },
      { words: [{ text: "e", start: 2.42, end: 2.7 }, { text: "define", start: 2.7, end: 3.06 }, { text: "os", start: 3.06, end: 3.22 }, { text: "acessos.", start: 3.22, end: 3.82 }] },
    ],
  },
  {
    // "E ajuda a bloquear conexões que representam ameaça."
    clip: "8419",
    trimStart: 0.58,
    trimEnd: 5.48,
    chunks: [
      { words: [{ text: "E", start: 0.2, end: 0.44 }, { text: "ajuda", start: 0.44, end: 0.78 }, { text: "a", start: 0.78, end: 1.04 }, { text: "bloquear", start: 1.04, end: 1.72 }] },
      { words: [{ text: "conexões", start: 1.72, end: 2.78 }, { text: "que", start: 2.78, end: 3.16 }, { text: "representam", start: 3.16, end: 3.98 }] },
      { words: [{ text: "ameaça.", start: 3.98, end: 4.6, hl: true }] },
    ],
  },
  {
    // "Mas essas regras não podem ficar paradas no tempo."
    clip: "8420",
    trimStart: 0.18,
    trimEnd: 3.98,
    chunks: [
      { words: [{ text: "Mas", start: 0.2, end: 0.58 }, { text: "essas", start: 0.58, end: 0.78 }, { text: "regras", start: 0.78, end: 1.34 }, { text: "não", start: 1.34, end: 1.62 }] },
      { words: [{ text: "podem", start: 1.62, end: 2.02 }, { text: "ficar", start: 2.02, end: 2.4 }, { text: "paradas", start: 2.4, end: 2.88 }, { text: "no", start: 2.88, end: 3.0 }] },
      { words: [{ text: "tempo.", start: 3.0, end: 3.5 }] },
    ],
  },
  {
    // "Porta que não deveria estar mais aberta."
    clip: "8421",
    trimStart: 0.24,
    trimEnd: 2.56,
    chunks: [
      { words: [{ text: "Porta", start: 0.2, end: 0.62 }, { text: "que", start: 0.62, end: 0.74 }, { text: "não", start: 0.74, end: 0.8 }, { text: "deveria", start: 0.8, end: 1.16 }] },
      { words: [{ text: "estar", start: 1.16, end: 1.32 }, { text: "mais", start: 1.32, end: 1.5 }, { text: "aberta.", start: 1.5, end: 2.02, hl: true }] },
    ],
  },
  {
    // "Acesso antigo ou configurações desatualizadas."
    clip: "8424",
    trimStart: 5.36,
    trimEnd: 8.92,
    chunks: [
      { words: [{ text: "Acesso", start: 0.2, end: 0.72 }, { text: "antigo", start: 0.72, end: 1.32, hl: true }, { text: "ou", start: 1.32, end: 1.54 }, { text: "configurações", start: 1.54, end: 2.32 }] },
      { words: [{ text: "desatualizadas.", start: 2.32, end: 3.26, hl: true }] },
    ],
  },
  {
    // "Podem criar brechas mesmo com o firewall instalado."
    clip: "8426",
    trimStart: 0.26,
    trimEnd: 3.68,
    chunks: [
      { words: [{ text: "Podem", start: 0.2, end: 0.5 }, { text: "criar", start: 0.5, end: 0.76 }, { text: "brechas", start: 0.76, end: 1.32, hl: true }, { text: "mesmo", start: 1.32, end: 1.72 }] },
      { words: [{ text: "com", start: 1.72, end: 2.0 }, { text: "o", start: 2.0, end: 2.04 }, { text: "firewall", start: 2.04, end: 2.34 }, { text: "instalado.", start: 2.34, end: 3.12 }] },
    ],
  },
  {
    // "Na Pro Advanced, o firewall é gerenciado continuamente."
    clip: "8427",
    trimStart: 0.28,
    trimEnd: 4.94,
    chunks: [
      { words: [{ text: "Na", start: 0.2, end: 0.46 }, { text: "Pro Advanced,", start: 0.46, end: 0.9, hl: true }] },
      { words: [{ text: "o", start: 1.36, end: 1.48 }, { text: "firewall", start: 1.48, end: 1.9 }, { text: "é", start: 1.9, end: 2.4 }, { text: "gerenciado", start: 2.4, end: 3.5 }] },
      { words: [{ text: "continuamente.", start: 3.5, end: 4.36, hl: true }] },
    ],
  },
  {
    // "Revisamos regras, acompanhamos o ambiente."
    clip: "8429",
    trimStart: 0.18,
    trimEnd: 2.68,
    chunks: [
      { words: [{ text: "Revisamos", start: 0.2, end: 0.8 }, { text: "regras,", start: 0.8, end: 1.24 }, { text: "acompanhamos", start: 1.24, end: 1.86 }, { text: "o", start: 1.86, end: 1.98 }] },
      { words: [{ text: "ambiente.", start: 1.98, end: 2.2 }] },
    ],
  },
  {
    // "Ajustamos as configurações de acordo com as necessidades."
    clip: "8430",
    trimStart: 0.5,
    trimEnd: 4.24,
    chunks: [
      { words: [{ text: "Ajustamos", start: 0.2, end: 1.08 }, { text: "as", start: 1.08, end: 1.26 }, { text: "configurações", start: 1.26, end: 2.14 }, { text: "de", start: 2.14, end: 2.28 }] },
      { words: [{ text: "acordo", start: 2.28, end: 2.62 }, { text: "com", start: 2.62, end: 2.78 }, { text: "as", start: 2.78, end: 2.88 }, { text: "necessidades.", start: 2.88, end: 3.44 }] },
    ],
  },
  {
    // "E os riscos de operações."
    clip: "8434",
    trimStart: 0.26,
    trimEnd: 2.66,
    chunks: [
      { words: [{ text: "E", start: 0.2, end: 0.46 }, { text: "os", start: 0.46, end: 0.6 }, { text: "riscos", start: 0.6, end: 1.16 }, { text: "de", start: 1.16, end: 1.4 }] },
      { words: [{ text: "operações.", start: 1.4, end: 2.1 }] },
    ],
  },
  {
    // "Firewall não é só instalar e deixar funcionando."
    clip: "8435",
    trimStart: 0.2,
    trimEnd: 3.96,
    chunks: [
      { words: [{ text: "Firewall", start: 0.2, end: 0.72 }, { text: "não", start: 0.72, end: 1.04 }, { text: "é", start: 1.04, end: 1.26 }, { text: "só", start: 1.26, end: 1.54 }] },
      { words: [{ text: "instalar", start: 1.54, end: 2.14 }, { text: "e", start: 2.14, end: 2.32 }, { text: "deixar", start: 2.32, end: 2.68 }, { text: "funcionando.", start: 2.68, end: 3.46 }] },
    ],
  },
  {
    // "É manter a operação atualizada todos os dias."
    clip: "8438",
    trimStart: 2.6,
    trimEnd: 6.14,
    chunks: [
      { words: [{ text: "É", start: 0.2, end: 0.42 }, { text: "manter", start: 0.42, end: 0.74 }, { text: "a", start: 0.74, end: 1.06 }, { text: "operação", start: 1.06, end: 1.68 }] },
      { words: [{ text: "atualizada", start: 1.68, end: 2.46, hl: true }, { text: "todos", start: 2.46, end: 2.74 }, { text: "os", start: 2.74, end: 2.96 }, { text: "dias.", start: 2.96, end: 3.24 }] },
    ],
  },
  {
    // "Fale com a Pro Advanced e saiba como está a segurança da sua rede."
    clip: "8439",
    trimStart: 0.64,
    trimEnd: 4.72,
    chunks: [
      { words: [{ text: "Fale", start: 0.2, end: 0.6 }, { text: "com", start: 0.6, end: 0.7 }, { text: "a", start: 0.7, end: 0.78 }, { text: "Pro Advanced", start: 0.78, end: 1.02, hl: true }] },
      { words: [{ text: "e", start: 1.02, end: 1.5 }, { text: "saiba", start: 1.5, end: 2.08 }, { text: "como", start: 2.08, end: 2.36 }, { text: "está", start: 2.36, end: 2.66 }] },
      { words: [{ text: "a", start: 2.66, end: 2.88 }, { text: "segurança", start: 2.88, end: 3.2, hl: true }, { text: "da", start: 3.2, end: 3.42 }, { text: "sua", start: 3.42, end: 3.54 }] },
      { words: [{ text: "rede.", start: 3.54, end: 3.78 }] },
    ],
  },
];
