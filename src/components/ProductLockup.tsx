import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_FAMILY, SAFE_X } from "../brand";

/**
 * Abertura da cena do voucher: apresenta o produto enquanto a locução diz
 * "o portal inteligente da Wispot", e sai de cena quando o voucher entra.
 */
export const ProductLockup: React.FC<{ outAt: number }> = ({ outAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.8 },
    durationInFrames: 20,
  });
  const exit = interpolate(
    frame,
    [Math.round(outAt * fps), Math.round((outAt + 0.3) * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (exit >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        top: 620,
        textAlign: "center",
        opacity: enter * (1 - exit),
        transform: `translateY(${interpolate(exit, [0, 1], [0, -40])}px) scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      <Img
        src={staticFile("brand/icon-white.png")}
        style={{
          display: "block",
          width: 240,
          margin: "0 auto",
          filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.25))",
        }}
      />
      <div
        style={{
          marginTop: 44,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 132,
          letterSpacing: -4,
          lineHeight: 1,
          color: COLORS.white,
        }}
      >
        MyGuest
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.35,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        o portal inteligente
        <br />
        da Wispot
      </div>
    </div>
  );
};
