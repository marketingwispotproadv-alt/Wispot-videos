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
import { MyGuestLogo } from "./MyGuestLogo";
import { Ripples } from "./Ripples";

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
        <Ripples size={700} opacity={0.26} />
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
            width: 300,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.86, 1])})`,
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.28))",
          }}
        />

        <div
          style={{
            marginTop: 52,
            opacity: name,
            transform: `translateY(${interpolate(name, [0, 1], [26, 0])}px)`,
          }}
        >
          <MyGuestLogo width={560} />
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
