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
import { useBrand } from "../BrandContext";
import type { EndCardConfig } from "../types";
import { BrandBackdrop } from "./BrandBackdrop";

export const EndCard: React.FC<{ config: EndCardConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, fontFamily, logo } = useBrand();

  const step = (delay: number, mass: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 200, mass },
      durationInFrames: 20,
    });

  const mark = step(0, 0.9);
  const line = step(11, 0.7);
  const cta = step(22, 0.7);

  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", padding: 90 }}
      >
        <Img
          src={staticFile(logo.lockupWhite)}
          style={{
            width: 780,
            opacity: mark,
            transform: `scale(${interpolate(mark, [0, 1], [0.88, 1])})`,
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.3))",
          }}
        />

        <div
          style={{
            width: 150,
            height: 6,
            borderRadius: 999,
            background: "rgba(255,255,255,0.6)",
            marginTop: 54,
            opacity: line,
          }}
        />

        <div
          style={{
            marginTop: 46,
            fontFamily,
            fontWeight: 600,
            fontSize: 46,
            lineHeight: 1.36,
            textAlign: "center",
            color: "rgba(255,255,255,0.96)",
            opacity: line,
            transform: `translateY(${interpolate(line, [0, 1], [22, 0])}px)`,
          }}
        >
          {config.tagline.map((row, i) => (
            <React.Fragment key={row}>
              {i > 0 ? <br /> : null}
              {row}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            marginTop: 58,
            padding: "26px 54px",
            borderRadius: 999,
            background: colors.white,
            fontFamily,
            fontWeight: 800,
            fontSize: 46,
            color: colors.primary,
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [22, 0])}px)`,
            boxShadow: "0 18px 46px rgba(0,0,0,0.24)",
          }}
        >
          {config.callToAction}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
