import type { Brand } from "../template/types";

/**
 * Tokens do *Brandbook ProAdvanced* (páginas "Cores", "Transparência" e
 * "Tipográfia").
 *
 * O manual é CMYK (PDF/X-1a) e estes são os hexadecimais que ele próprio
 * imprime — não os que um leitor de PDF devolve ao converter CMYK para RGB,
 * que saem diferentes: #3696cd vira (76,146,213).
 *
 * Duas decisões que o manual não cobre: ele não define preto, e a amostra do
 * degradê é vertical. `ink` é o cinza institucional escurecido, e o degradê
 * corre na diagonal porque rende mais em quadro 9:16.
 */
export const PROADVANCED: Brand = {
  name: "ProAdvanced",
  colors: {
    primary: "#3696CD",
    primaryLight: "#20A3D6",
    neutral: "#676868",
    white: "#FFFFFF",
    ink: "#1B1C1C",
  },
  gradient: "linear-gradient(160deg, #20A3D6 0%, #3696CD 100%)",
  /** O manual pede Montserrat Regular e Bold; a família é servida de `public/fonts`. */
  fontFamily: 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
  /** Vetorizados do próprio manual; o cadeado do símbolo é vazado. */
  logo: {
    lockupWhite: "proadv/brand/logo-white.png",
    lockupColor: "proadv/brand/logo-color.png",
    iconWhite: "proadv/brand/icon-white.png",
    iconColor: "proadv/brand/icon-blue.png",
  },
};

/**
 * Área de respiro da logomarca: o manual pede, no mínimo, a altura da letra
 * "a" em volta dela. No lockup exportado isso dá ~17% da altura da arte.
 */
export const LOGO_CLEAR_SPACE = 0.17;
