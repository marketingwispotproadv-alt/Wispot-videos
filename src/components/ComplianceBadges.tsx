import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SAFE_X } from "../brand";

const Badge: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 18,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 34px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.96)",
        border: `3px solid ${COLORS.blue}`,
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        opacity: interpolate(enter, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.5 4.5 6v6c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 2.5Z"
          fill={COLORS.blue}
        />
        <path
          d="m8.6 12.2 2.3 2.3 4.5-4.7"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 38,
          color: COLORS.blueDeep,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Selos de conformidade, cada um entrando quando é citado na locução. */
export const ComplianceBadges: React.FC<{ lgpdAt: number; marcoAt: number }> = ({
  lgpdAt,
  marcoAt,
}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE_X,
      right: SAFE_X,
      bottom: 640,
      display: "flex",
      justifyContent: "center",
      gap: 24,
    }}
  >
    <Badge label="LGPD" at={lgpdAt} />
    <Badge label="Marco Civil" at={marcoAt} />
  </div>
);
