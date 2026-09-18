import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../brand";

/** Carimbo que entra quando a locução chega em "white label". */
export const WhiteLabelStamp: React.FC<{ at: number; top: number }> = ({
  at,
  top,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(
    frame - Math.round(at * fps),
    [0, 9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (enter <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px) rotate(-3deg) scale(${interpolate(enter, [0, 1], [0.86, 1])})`,
      }}
    >
      <div
        style={{
          padding: "18px 40px",
          borderRadius: 999,
          background: COLORS.white,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: 2,
          color: COLORS.blueDeep,
          boxShadow: "0 18px 44px rgba(0,0,0,0.38)",
        }}
      >
        WHITE LABEL
      </div>
    </div>
  );
};
