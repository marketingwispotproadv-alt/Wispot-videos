// Tokens extraídos do Manual de Identidade Wispot 2026 (páginas "Gestão de cores" e "Tipografia").

export const COLORS = {
  /** Azul institucional — #25a8e0 */
  blue: "#25A8E0",
  /** Fim do degradê institucional — #0b91c1 */
  blueDeep: "#0B91C1",
  white: "#FFFFFF",
  /** Cinza institucional — #514d4b */
  gray: "#514D4B",
  ink: "#141312",
} as const;

/** Degradê institucional do manual (#25a8e0 → #0b91c1). */
export const GRADIENT = `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDeep} 100%)`;

/**
 * O manual pede as famílias Adineue Pro e Montserrat. Adineue Pro é uma fonte
 * proprietária e não redistribuível, então usamos Montserrat — a segunda família
 * institucional — em todas as peças deste projeto.
 */
export const FONT_FAMILY =
  'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Transparências recomendadas do azul (manual: priorizar 100% e 80%). */
export const blueAlpha = (alpha: number) => `rgba(37, 168, 224, ${alpha})`;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** Margem de segurança lateral para textos e elementos gráficos. */
export const SAFE_X = 76;
