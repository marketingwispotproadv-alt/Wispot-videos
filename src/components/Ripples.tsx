import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Ondas do ícone da marca, expandindo em loop — textura de fundo. */
export const Ripples: React.FC<{
  size?: number;
  opacity?: number;
  speed?: number;
}> = ({ size = 700, opacity = 0.26, speed = 0.42 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = ((frame / fps) * speed + i / 3) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: 999,
              border: "3px solid rgba(255,255,255,0.4)",
              opacity: interpolate(p, [0, 0.15, 1], [0, opacity, 0]),
              transform: `scale(${interpolate(p, [0, 1], [0.45, 1.7])})`,
            }}
          />
        );
      })}
    </>
  );
};
