import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SAFE_X } from "../brand";

/** Título das cenas de tela cheia: sobrenome curto em cima, manchete embaixo. */
export const Headline: React.FC<{
  eyebrow: string;
  title: string;
  at?: number;
}> = ({ eyebrow, title, at = 0.2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: 16,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        top: 268,
        textAlign: "center",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.72)",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.08,
          letterSpacing: -2,
          color: COLORS.white,
          textShadow: "0 6px 24px rgba(0,0,0,0.22)",
        }}
      >
        {title}
      </div>
    </div>
  );
};
