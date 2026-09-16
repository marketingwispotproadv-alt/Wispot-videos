import type { Style } from "./types";

/** O estilo do primeiro corte da ProAdvanced: fichas, etiquetas e borrão. */
export const FICHAS: Style = {
  captions: {
    anchor: "bottom",
    offset: 236,
    fontSize: 66,
    fontWeight: 800,
    lineHeight: 1.14,
    lowercase: false,
    highlight: "pill",
    reveal: "preview",
  },
  transitions: "blur",
  watermark: true,
  push: 0.045,
  pushAlternates: true,
};

/**
 * O estilo medido do vídeo de referência (`public/ref`), em 720×1280:
 *
 * - legenda ancorada a 184 px do topo, centrada, duas linhas no máximo;
 * - altura de x de 36 px e altura de ascendente de 49 px, que em Montserrat
 *   dão ~68 px de corpo — 102 px no nosso quadro de 1920;
 * - entrelinha de 62 px, ou 0,91 do corpo: mais apertada que o corpo;
 * - tudo em caixa baixa, branco, sem pílula e sem cor de destaque;
 * - seis cortes em 18,8 s, todos secos: a diferença entre quadros vizinhos
 *   dura um quadro só em todos eles, então não há emenda nenhuma;
 * - nada de logo, etiqueta ou ficha em cena;
 * - pílula de chamada no último terço, a 71% da altura.
 */
export const LEGENDA_GRANDE: Style = {
  captions: {
    anchor: "top",
    offset: 276,
    fontSize: 102,
    fontWeight: 700,
    lineHeight: 0.91,
    lowercase: true,
    highlight: "none",
    reveal: "reveal",
  },
  transitions: "cut",
  watermark: false,
  // A cena mais longa da referência cresce ~3,6% por segundo; com os nossos
  // takes de ~3,7 s isso dá perto de 12% do começo ao fim do take.
  push: 0.12,
  pushAlternates: false,
  warmth: 0.75,
};

export const resolveStyle = (style?: Partial<Style>): Style => ({
  ...FICHAS,
  ...style,
  captions: { ...FICHAS.captions, ...style?.captions },
});
