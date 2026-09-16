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
  overlayStyle: "chips",
  // 0,22 s é o que o borrão de 6 quadros precisa para cair no mudo.
  lead: { head: 0.22, tail: 0.3 },
  speed: 1,
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
    // O vídeo de referência escreve tudo em caixa baixa; aqui a grafia do
    // roteiro é respeitada — nome próprio e início de frase em maiúscula.
    lowercase: false,
    highlight: "none",
    reveal: "reveal",
    // Identificada medindo a referência: a razão entre altura de x e
    // ascendente é 0,735 lá, 0,745 em Poppins e 0,698 em Montserrat. O manual
    // da marca pede Montserrat, que segue valendo no resto da peça.
    fontFamily: 'Poppins, "Helvetica Neue", Helvetica, Arial, sans-serif',
    enterFrames: 7,
    exitFrames: 6,
  },
  transitions: "cut",
  // A referência não tem logo em quadro nenhum, mas o manual da ProAdvanced
  // pede presença de marca — e essa decisão é da marca, não do estilo.
  watermark: true,
  overlayStyle: "quiet",
  // Na referência a fala atravessa os cortes sem pausa; sobra o suficiente
  // para a palavra não entrar decepada, e nada além disso.
  lead: { head: 0.08, tail: 0.12 },
  // ~35% entre o quadro cheio e o recorte, medido corte a corte na referência.
  punch: 1.35,
  // 8% é o que dá para tirar sem a fala soar apressada; acima de ~12% a
  // correção de tom começa a deixar a voz com textura de plástico.
  speed: 1.08,
  // Com o salto de enquadramento carregando o corte, o empurrão dentro da cena
  // fica só para o quadro não congelar. Na referência ele é de ~3,6% por
  // segundo, mas lá cinco das sete cenas não têm empurrão nenhum.
  push: 0.05,
  pushAlternates: false,
  warmth: 0.75,
  // Curto e a meio caminho do branco. Clarão cheio em dezesseis cortes cansa,
  // e o corte já tem o salto de enquadramento para marcá-lo.
  flash: { intensity: 0.55, rise: 2, fall: 4 },
  // Sintetizado em `tools/make_whoosh.py`, sem licença de ninguém no meio.
  // Baixo de propósito: são quinze cortes, e efeito alto em todos cansa mais
  // rápido do que o clarão.
  flashSfx: { src: "proadv/audio/whoosh.wav", volume: 0.26 },
  progressBar: true,
};

export const resolveStyle = (style?: Partial<Style>): Style => ({
  ...FICHAS,
  ...style,
  captions: { ...FICHAS.captions, ...style?.captions },
});
