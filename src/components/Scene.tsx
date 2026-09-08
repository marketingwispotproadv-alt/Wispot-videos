import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GRADIENT } from "../brand";
import type { SceneDef } from "../data/script";
import { Captions } from "./Captions";
import { Scrim } from "./Scrim";
import { Watermark } from "./Watermark";

/**
 * Uma cena = um clipe bruto já cortado no trecho falado, com os elementos fixos
 * da marca por cima. `fadeToBrand` fecha a cena no degradê institucional para
 * emendar no cartão final.
 */
export const Scene: React.FC<{
  scene: SceneDef;
  durationInFrames: number;
  fadeToBrand?: boolean;
  children?: React.ReactNode;
}> = ({ scene, durationInFrames, fadeToBrand, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = fadeToBrand
    ? interpolate(frame, [durationInFrames - 9, durationInFrames - 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(`clips/${scene.clip}.mp4`)}
        trimBefore={Math.round(scene.trimStart * fps)}
        trimAfter={Math.round(scene.trimEnd * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Scrim />
      <Watermark />
      {children}
      <Captions chunks={scene.chunks} />
      {fade > 0 ? (
        <AbsoluteFill style={{ background: GRADIENT, opacity: fade }} />
      ) : null}
    </AbsoluteFill>
  );
};
