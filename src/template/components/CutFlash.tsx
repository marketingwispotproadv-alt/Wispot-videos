import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export type FlashConfig = {
  /** opacidade no pico, de 0 a 1 */
  intensity: number;
  /** quadros antes do corte em que o clarão sobe */
  rise: number;
  /** quadros depois do corte em que ele cai */
  fall: number;
  color?: string;
};

/**
 * Clarão nos cortes.
 *
 * É desenhado **por cima** da peça, e não como emenda da TransitionSeries. A
 * diferença é audível: uma emenda sobrepõe as duas cenas, e com elas as duas
 * falas. Aqui o corte continua seco no vídeo e no áudio — o clarão é só uma
 * camada branca que sobe e desce em volta do quadro do corte.
 *
 * Sobe mais rápido do que desce, que é como clarão se comporta.
 */
export const CutFlash: React.FC<{
  cuts: number[];
  config: FlashConfig;
}> = ({ cuts, config }) => {
  const frame = useCurrentFrame();
  const { intensity, rise, fall, color = "#FFFFFF" } = config;

  const near = cuts.find((c) => frame > c - rise && frame < c + fall);
  if (near === undefined) return null;

  const d = frame - near;
  const opacity =
    d <= 0 ? ((d + rise) / rise) * intensity : (1 - d / fall) * intensity;

  return (
    <AbsoluteFill
      style={{ background: color, opacity: Math.max(0, opacity) }}
    />
  );
};
