// Gerado a partir da transcrição dos clipes originais (faster-whisper, word timestamps),
// com correção manual dos nomes de marca. Tempos em segundos, relativos ao início da cena.

export type CaptionWord = {
  text: string;
  start: number;
  end: number;
  /** termo-chave: recebe destaque na cor da marca */
  hl?: boolean;
};

export type CaptionChunk = { words: CaptionWord[] };

export type SceneDef = {
  clip: string;
  /** corte no material original, em segundos */
  trimStart: number;
  trimEnd: number;
  chunks: CaptionChunk[];
};

export const SCENES: SceneDef[] = [
  {
    clip: "8445",
    trimStart: 1.3,
    trimEnd: 8.9,
    chunks: [
      { words: [{ text: "Visitantes,", start: 0.08, end: 1.0 }, { text: "clientes,", start: 1.28, end: 1.88 }] },
      { words: [{ text: "funcionários", start: 2.02, end: 2.56 }, { text: "e", start: 2.56, end: 2.72 }, { text: "prestadores", start: 2.72, end: 3.28 }, { text: "de", start: 3.28, end: 3.46 }, { text: "serviços.", start: 3.46, end: 4.04 }] },
      { words: [{ text: "Faz", start: 4.3, end: 4.54 }, { text: "sentido", start: 4.54, end: 4.96 }, { text: "todos", start: 4.96, end: 5.36 }, { text: "acessarem", start: 5.36, end: 5.88 }, { text: "a", start: 5.88, end: 6.06 }, { text: "sua", start: 6.06, end: 6.14 }] },
      { words: [{ text: "rede", start: 6.14, end: 6.34 }, { text: "pelo", start: 6.34, end: 6.56 }, { text: "mesmo", start: 6.56, end: 6.8 }, { text: "caminho?", start: 6.8, end: 7.14 }] },
    ],
  },
  {
    clip: "8446",
    trimStart: 1.88,
    trimEnd: 11.6,
    chunks: [
      { words: [{ text: "O", start: 0.3, end: 0.46 }, { text: "MyGuest", start: 0.46, end: 0.96, hl: true }, { text: "é", start: 0.96, end: 1.06 }, { text: "o", start: 1.06, end: 1.12 }, { text: "portal", start: 1.12, end: 1.28 }, { text: "inteligente", start: 1.28, end: 1.8 }] },
      { words: [{ text: "da", start: 1.8, end: 1.96 }, { text: "Wispot,", start: 1.96, end: 2.44 }, { text: "o", start: 2.8, end: 3.0 }, { text: "acesso", start: 3.0, end: 3.3 }, { text: "pode", start: 3.3, end: 3.62 }, { text: "ser", start: 3.62, end: 3.78 }, { text: "liberado", start: 3.78, end: 4.22 }] },
      { words: [{ text: "por", start: 4.22, end: 4.42 }, { text: "voucher.", start: 4.42, end: 5.0, hl: true }] },
      { words: [{ text: "Você", start: 5.4, end: 5.58 }, { text: "entrega", start: 5.58, end: 6.0 }, { text: "o", start: 6.0, end: 6.06 }, { text: "código", start: 6.06, end: 6.34 }, { text: "e", start: 6.34, end: 6.56 }, { text: "define", start: 6.56, end: 6.82 }, { text: "quem", start: 6.82, end: 7.06 }] },
      { words: [{ text: "entra,", start: 7.06, end: 7.4 }, { text: "com", start: 7.5, end: 7.58 }, { text: "qual", start: 7.58, end: 7.78 }, { text: "permissão", start: 7.78, end: 8.32 }, { text: "e", start: 8.32, end: 8.48 }, { text: "por", start: 8.48, end: 8.66 }] },
      { words: [{ text: "quanto", start: 8.66, end: 8.88 }, { text: "tempo.", start: 8.88, end: 9.32 }] },
    ],
  },
  {
    clip: "8450",
    trimStart: 0.6,
    trimEnd: 10.55,
    chunks: [
      { words: [{ text: "A", start: 0.38, end: 0.86 }, { text: "autenticação", start: 0.86, end: 1.34 }, { text: "sai", start: 1.34, end: 1.66 }, { text: "personalizada", start: 1.66, end: 2.56 }] },
      { words: [{ text: "e", start: 2.56, end: 2.8 }, { text: "com", start: 2.8, end: 2.94 }, { text: "a", start: 2.94, end: 3.0 }, { text: "identidade", start: 3.0, end: 3.42 }, { text: "da", start: 3.42, end: 3.6 }, { text: "sua", start: 3.6, end: 3.7 }, { text: "empresa", start: 3.7, end: 4.0 }] },
      { words: [{ text: "na", start: 4.0, end: 4.18 }, { text: "tela.", start: 4.18, end: 4.52 }] },
      { words: [{ text: "E", start: 4.9, end: 4.92 }, { text: "é", start: 4.92, end: 5.0 }, { text: "a", start: 5.0, end: 5.02 }, { text: "primeira", start: 5.02, end: 5.2 }, { text: "coisa", start: 5.2, end: 5.5 }, { text: "que", start: 5.5, end: 5.66 }, { text: "a", start: 5.66, end: 5.7 }, { text: "pessoa", start: 5.7, end: 5.96 }] },
      { words: [{ text: "vê", start: 5.96, end: 6.28 }, { text: "ao", start: 6.28, end: 6.54 }, { text: "se", start: 6.54, end: 6.66 }, { text: "conectar,", start: 6.66, end: 7.22 }, { text: "e", start: 7.48, end: 7.7 }, { text: "pode", start: 7.7, end: 7.84 }, { text: "ser", start: 7.84, end: 8.06 }, { text: "configurada", start: 8.06, end: 8.7 }] },
      { words: [{ text: "em", start: 8.7, end: 8.9 }, { text: "white label.", start: 8.9, end: 9.52 }] },
    ],
  },
  {
    clip: "8452",
    trimStart: 1.05,
    trimEnd: 2.69,
    chunks: [
      { words: [{ text: "E", start: 0, end: 0.09 }, { text: "o", start: 0.09, end: 0.17 }, { text: "controle", start: 0.17, end: 0.57 }, { text: "é", start: 0.57, end: 0.79 }, { text: "completo.", start: 0.79, end: 1.17 }] },
    ],
  },
  {
    clip: "8454",
    trimStart: 3.38,
    trimEnd: 10.25,
    chunks: [
      { words: [{ text: "Você", start: 0.04, end: 0.18 }, { text: "acompanha", start: 0.18, end: 0.6 }, { text: "quem", start: 0.6, end: 0.78 }, { text: "está", start: 0.78, end: 1.06 }, { text: "na", start: 1.06, end: 1.22 }, { text: "rede,", start: 1.22, end: 1.48 }] },
      { words: [{ text: "aplica", start: 1.76, end: 2.04 }, { text: "as", start: 2.04, end: 2.2 }, { text: "políticas", start: 2.2, end: 2.48 }, { text: "de", start: 2.48, end: 2.72 }, { text: "navegação", start: 2.72, end: 3.4 }] },
      { words: [{ text: "e", start: 3.4, end: 3.74 }, { text: "fique", start: 3.74, end: 3.86 }, { text: "em", start: 3.86, end: 4.02 }, { text: "conformidade", start: 4.02, end: 4.6 }, { text: "com", start: 4.6, end: 4.92 }, { text: "a", start: 4.92, end: 5.04 }, { text: "LGPD", start: 5.04, end: 5.6, hl: true }] },
      { words: [{ text: "e", start: 5.6, end: 5.92 }, { text: "o", start: 5.92, end: 6.0 }, { text: "Marco", start: 6.0, end: 6.24, hl: true }, { text: "Civil.", start: 6.24, end: 6.46, hl: true }] },
    ],
  },
  {
    clip: "8455",
    trimStart: 0.0,
    trimEnd: 7.45,
    chunks: [
      { words: [{ text: "MyGuest", start: 0, end: 0.7, hl: true }, { text: "é", start: 0.7, end: 0.82 }, { text: "da", start: 0.82, end: 0.9 }, { text: "Wispot.", start: 0.9, end: 1.58 }] },
      { words: [{ text: "Fale", start: 1.72, end: 1.9 }, { text: "conosco", start: 1.9, end: 2.52 }, { text: "e", start: 2.52, end: 2.68 }, { text: "descubra", start: 2.68, end: 3.06 }, { text: "como", start: 3.06, end: 3.28 }, { text: "transformar", start: 3.28, end: 3.9 }] },
      { words: [{ text: "um", start: 3.9, end: 4.08 }, { text: "acesso", start: 4.08, end: 4.38 }, { text: "de", start: 4.38, end: 4.62 }, { text: "navegação", start: 4.62, end: 5.36 }, { text: "em", start: 5.36, end: 5.7 }, { text: "uma", start: 5.7, end: 5.8 }, { text: "oportunidade", start: 5.8, end: 6.38 }] },
      { words: [{ text: "para", start: 6.38, end: 6.58 }, { text: "o", start: 6.58, end: 6.7 }, { text: "seu", start: 6.7, end: 6.74 }, { text: "negócio.", start: 6.74, end: 7.04 }] },
    ],
  },
];
