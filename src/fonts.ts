import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Montserrat servida do próprio projeto (`public/fonts`) em vez do Google
 * Fonts: assim o render não depende de rede e a fonte nunca falta num frame.
 * Arquivo variável, declarado em 100–900: o manual da Wispot usa de 500 para
 * cima, o da ProAdvanced pede Regular (400) e Bold (700).
 */
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

const EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const SUBSETS = [
  {
    file: "fonts/Montserrat-latin.woff2",
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  },
  {
    file: "fonts/Montserrat-latin-ext.woff2",
    unicodeRange:
      "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  },
];

/**
 * Poppins, para a legenda do corte que segue o vídeo de referência.
 *
 * A fonte foi identificada medindo o próprio arquivo: a razão entre altura de
 * x e ascendente na legenda da referência é 0,735; em Poppins é 0,745 e em
 * Montserrat, 0,698. As formas confirmam — bojo circular e 'a' de um andar com
 * a haste reta.
 *
 * O manual da ProAdvanced pede Montserrat, e ela continua valendo para tudo o
 * mais da peça: etiqueta, ficha, cartão final. Poppins fica só na legenda, por
 * pedido, e sai daí trocando uma linha em `src/template/style.ts`.
 */
const POPPINS = [
  { file: "fonts/Poppins-600-latin.woff2", weight: "600", unicodeRange: LATIN },
  { file: "fonts/Poppins-600-latin-ext.woff2", weight: "600", unicodeRange: EXT },
  { file: "fonts/Poppins-700-latin.woff2", weight: "700", unicodeRange: LATIN },
  { file: "fonts/Poppins-700-latin-ext.woff2", weight: "700", unicodeRange: EXT },
];

const handle = delayRender("Carregando Montserrat e Poppins");

Promise.all([
  ...SUBSETS.map((s) =>
    loadFont({
      family: "Montserrat",
      url: staticFile(s.file),
      format: "woff2",
      weight: "100 900",
      style: "normal",
      display: "block",
      unicodeRange: s.unicodeRange,
    }),
  ),
  ...POPPINS.map((s) =>
    loadFont({
      family: "Poppins",
      url: staticFile(s.file),
      format: "woff2",
      weight: s.weight,
      style: "normal",
      display: "block",
      unicodeRange: s.unicodeRange,
    }),
  ),
])
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Falha ao carregar as fontes", err);
    continueRender(handle);
  });
