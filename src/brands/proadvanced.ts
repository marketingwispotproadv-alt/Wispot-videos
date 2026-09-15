// Tokens extraídos do Brandbook ProAdvanced (páginas "Cores", "Transparência"
// e "Tipográfia"). O manual é CMYK (PDF/X-1a) e os hexadecimais abaixo são os
// que ele próprio imprime — não os valores que um leitor de PDF devolve ao
// converter CMYK para RGB, que saem diferentes.

export const COLORS = {
  /** Azul principal — #3696cd */
  blue: "#3696CD",
  /** Azul claro do degradê institucional — #20a3d6 */
  blueLight: "#20A3D6",
  /** Cinza institucional — #676868 */
  gray: "#676868",
  white: "#FFFFFF",
  /**
   * Fundo escuro. O manual não define um preto; este é o cinza institucional
   * escurecido, para scrim e texto sobre fundo claro.
   */
  ink: "#1B1C1C",
} as const;

/**
 * Degradê institucional (#20a3d6 → #3696cd). No manual a amostra é vertical;
 * aqui ele corre na diagonal, que rende mais em quadro 9:16.
 */
export const GRADIENT = `linear-gradient(160deg, ${COLORS.blueLight} 0%, ${COLORS.blue} 100%)`;

/**
 * O manual pede Montserrat Regular e Bold. A família já está no projeto,
 * servida de `public/fonts` como arquivo variável (ver `src/fonts.ts`).
 */
export const FONT_FAMILY =
  'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Transparências do azul previstas no manual: 30%, 60% e 100%. */
export const blueAlpha = (alpha: number) => `rgba(54, 150, 205, ${alpha})`;

/** Arquivos em `public/proadv/brand`, vetorizados do próprio manual. */
export const LOGO = {
  /** Lockup completo, branco — para fundo azul ou imagem escura. */
  white: "proadv/brand/logo-white.png",
  /** Lockup completo, cinza + azul — para fundo branco. */
  color: "proadv/brand/logo-color.png",
  /** Só o símbolo (sol com cadeado), branco. */
  iconWhite: "proadv/brand/icon-white.png",
  /** Só o símbolo, azul. */
  iconBlue: "proadv/brand/icon-blue.png",
} as const;

/**
 * Área de respiro da logomarca: o manual pede, no mínimo, a altura da letra
 * "a" em volta dela. No lockup exportado isso dá ~17% da altura da arte.
 */
export const LOGO_CLEAR_SPACE = 0.17;
