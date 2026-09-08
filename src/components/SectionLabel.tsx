import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENT, SAFE_X } from "../brand";

/** Etiqueta que nomeia o bloco do roteiro, ancorada abaixo do logo. */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.6 },
    durationInFrames: 14,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 196,
        left: SAFE_X,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 30px",
        borderRadius: 999,
        background: GRADIENT,
        boxShadow: "0 10px 34px rgba(11,145,193,0.45)",
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: COLORS.white,
          opacity: 0.9,
        }}
      />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 0.4,
          color: COLORS.white,
        }}
      >
        {children}
      </span>
    </div>
  );
};
