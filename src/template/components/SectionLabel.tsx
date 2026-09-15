import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { SAFE_X } from "../layout";

/** Etiqueta que nomeia o bloco do roteiro, ancorada abaixo da assinatura. */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  at?: number;
}> = ({ children, at = 0.1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, gradient, fontFamily } = useBrand();
  const enter = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 200, mass: 0.6 },
    durationInFrames: 13,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 186,
        left: SAFE_X,
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "14px 28px",
        borderRadius: 999,
        background: gradient,
        boxShadow: `0 10px 32px ${colors.primaryLight}6B`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-36, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: 999,
          background: colors.white,
          opacity: 0.9,
        }}
      />
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 0.4,
          color: colors.white,
        }}
      >
        {children}
      </span>
    </div>
  );
};
