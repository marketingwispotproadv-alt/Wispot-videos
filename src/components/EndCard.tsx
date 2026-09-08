import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_FAMILY, GRADIENT } from "../brand";

/** Ondas do ícone da marca, pulsando atrás do logo. */
const Ripples: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = ((frame / fps) * 0.42 + i / 3) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 700,
              height: 700,
              marginLeft: -350,
              marginTop: -350,
              borderRadius: 999,
              border: "3px solid rgba(255,255,255,0.4)",
              opacity: interpolate(p, [0, 0.15, 1], [0, 0.26, 0]),
              transform: `scale(${interpolate(p, [0, 1], [0.45, 1.7])})`,
            }}
          />
        );
      })}
    </>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 24,
  });
  const name = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: 18,
  });
  const cta = spring({
    frame: frame - 24,
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill style={{ background: GRADIENT }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 90,
        }}
      >
        <Img
          src={staticFile("brand/logo-white.png")}
          style={{
            width: 640,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.86, 1])})`,
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.28))",
          }}
        />

        <div
          style={{
            marginTop: 54,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 128,
            letterSpacing: -3,
            color: COLORS.white,
            opacity: name,
            transform: `translateY(${interpolate(name, [0, 1], [26, 0])}px)`,
          }}
        >
          MyGuest
        </div>

        <div
          style={{
            width: 160,
            height: 6,
            borderRadius: 999,
            background: "rgba(255,255,255,0.65)",
            marginTop: 34,
            opacity: name,
          }}
        />

        <div
          style={{
            marginTop: 44,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1.4,
            textAlign: "center",
            color: "rgba(255,255,255,0.95)",
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [22, 0])}px)`,
          }}
        >
          Controle de acesso que
          <br />
          vira dado estratégico.
        </div>

        <div
          style={{
            marginTop: 56,
            padding: "26px 54px",
            borderRadius: 999,
            background: COLORS.white,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 46,
            color: COLORS.blueDeep,
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [22, 0])}px)`,
            boxShadow: "0 18px 46px rgba(0,0,0,0.22)",
          }}
        >
          wispot.com.br
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
