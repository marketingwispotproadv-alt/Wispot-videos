import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";

/**
 * Pílula de chamada no último terço, como a dos anúncios. Na referência ela
 * fica a 71% da altura do quadro e cresce ao entrar.
 */
export const CtaPill: React.FC<{ text: string; at: number }> = ({
  text,
  at,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const { colors, fontFamily } = useBrand();
  const enter = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 14, mass: 0.6 },
    durationInFrames: 18,
  });
  if (enter === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: height * 0.71,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "22px 52px",
          borderRadius: 999,
          background: colors.primary,
          color: colors.white,
          fontFamily,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 0.2,
          boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
          transform: `scale(${enter})`,
          opacity: Math.min(1, enter * 1.4),
        }}
      >
        {text}
      </div>
    </div>
  );
};
