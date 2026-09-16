import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useBrand } from "../BrandContext";

/**
 * Fio de progresso no topo. Custa dois pixels de tela e devolve a única coisa
 * que um plano fixo de um minuto não tem sozinho: a sensação de que a peça
 * está indo a algum lugar.
 */
export const ProgressBar: React.FC<{ totalFrames: number; height?: number }> = ({
  totalFrames,
  height = 8,
}) => {
  const frame = useCurrentFrame();
  const { colors } = useBrand();
  const pct = interpolate(frame, [0, totalFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height,
        background: "rgba(255,255,255,0.18)",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: colors.primaryLight,
          boxShadow: `0 0 18px ${colors.primaryLight}`,
        }}
      />
    </div>
  );
};
