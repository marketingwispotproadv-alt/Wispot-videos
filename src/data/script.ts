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
    trimStart: 1.63,
    trimEnd: 8.9,
    chunks: [
      { words: [{ text: "Visitantes,", start: 0.35, end: 0.95 }, { text: "clientes,", start: 0.95, end: 1.55 }] },
      { words: [{ text: "funcionários", start: 1.69, end: 2.23 }, { text: "e", start: 2.23, end: 2.39 }, { text: "prestadores", start: 2.39, end: 2.95 }, { text: "de", start: 2.95, end: 3.13 }, { text: "serviços.", start: 3.13, end: 3.71 }] },
      { words: [{ text: "Faz", start: 3.97, end: 4.21 }, { text: "sentido", start: 4.21, end: 4.63 }, { text: "todos", start: 4.63, end: 5.03 }, { text: "acessarem", start: 5.03, end: 5.55 }, { text: "a", start: 5.55, end: 5.73 }, { text: "sua", start: 5.73, end: 5.81 }] },
      { words: [{ text: "rede", start: 5.81, end: 6.01 }, { text: "pelo", start: 6.01, end: 6.23 }, { text: "mesmo", start: 6.23, end: 6.47 }, { text: "caminho?", start: 6.47, end: 6.81 }] },
    ],
  },
  {
    clip: "8446",
    trimStart: 1.45,
    trimEnd: 11.6,
    chunks: [
      { words: [{ text: "O", start: 0.39, end: 0.89 }, { text: "MyGuest", start: 0.89, end: 1.39, hl: true }, { text: "é", start: 1.39, end: 1.49 }, { text: "o", start: 1.49, end: 1.55 }, { text: "portal", start: 1.55, end: 1.71 }, { text: "inteligente", start: 1.71, end: 2.23 }] },
      { words: [{ text: "da", start: 2.23, end: 2.39 }, { text: "Wispot,", start: 2.39, end: 2.87 }, { text: "o", start: 3.23, end: 3.43 }, { text: "acesso", start: 3.43, end: 3.73 }, { text: "pode", start: 3.73, end: 4.05 }, { text: "ser", start: 4.05, end: 4.21 }, { text: "liberado", start: 4.21, end: 4.65 }] },
      { words: [{ text: "por", start: 4.65, end: 4.85 }, { text: "voucher.", start: 4.85, end: 5.43, hl: true }] },
      { words: [{ text: "Você", start: 5.83, end: 6.01 }, { text: "entrega", start: 6.01, end: 6.43 }, { text: "o", start: 6.43, end: 6.49 }, { text: "código", start: 6.49, end: 6.77 }, { text: "e", start: 6.77, end: 6.99 }, { text: "define", start: 6.99, end: 7.25 }, { text: "quem", start: 7.25, end: 7.49 }] },
      { words: [{ text: "entra,", start: 7.49, end: 7.83 }, { text: "com", start: 7.93, end: 8.01 }, { text: "qual", start: 8.01, end: 8.21 }, { text: "permissão", start: 8.21, end: 8.75 }, { text: "e", start: 8.75, end: 8.91 }, { text: "por", start: 8.91, end: 9.09 }] },
      { words: [{ text: "quanto", start: 9.09, end: 9.31 }, { text: "tempo.", start: 9.31, end: 9.75 }] },
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
    trimStart: 2.0,
    trimEnd: 10.25,
    chunks: [
      { words: [{ text: "No", start: 0.36, end: 0.92 }, { text: "painel,", start: 0.92, end: 1.36 }, { text: "você", start: 1.42, end: 1.56 }, { text: "acompanha", start: 1.56, end: 1.98 }, { text: "quem", start: 1.98, end: 2.16 }, { text: "está", start: 2.16, end: 2.44 }] },
      { words: [{ text: "na", start: 2.44, end: 2.6 }, { text: "rede,", start: 2.6, end: 2.86 }, { text: "aplica", start: 3.14, end: 3.42 }, { text: "as", start: 3.42, end: 3.58 }, { text: "políticas", start: 3.58, end: 3.86 }, { text: "de", start: 3.86, end: 4.1 }] },
      { words: [{ text: "navegação", start: 4.1, end: 4.78 }, { text: "e", start: 4.78, end: 5.12 }, { text: "fique", start: 5.12, end: 5.24 }, { text: "em", start: 5.24, end: 5.4 }, { text: "conformidade", start: 5.4, end: 5.98 }] },
      { words: [{ text: "com", start: 5.98, end: 6.3 }, { text: "a", start: 6.3, end: 6.42 }, { text: "LGPD", start: 6.42, end: 6.98, hl: true }, { text: "e", start: 6.98, end: 7.3 }, { text: "o", start: 7.3, end: 7.38 }, { text: "Marco", start: 7.38, end: 7.62, hl: true }, { text: "Civil.", start: 7.62, end: 7.84, hl: true }] },
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
