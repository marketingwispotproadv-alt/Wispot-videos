import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { MusicConfig } from "../types";

/**
 * Trilha de fundo. Fica baixa sob a locução e sobe no cartão final, que não
 * tem fala — assim a peça não termina no silêncio. O arquivo em `public/` já
 * deve vir normalizado a −20 LUFS.
 */
export const MusicBed: React.FC<{
  config: MusicConfig;
  totalFrames: number;
  endCardFrom: number;
  fps: number;
}> = ({ config, totalFrames, endCardFrom, fps }) => {
  const frame = useCurrentFrame();

  const under = config.under ?? 0.22;
  const over = config.over ?? 0.62;
  const fadeIn = Math.round(fps * 1.2);
  const lift = Math.round(fps * 0.5);
  const fadeOut = Math.round(fps * 0.9);

  const volume = interpolate(
    frame,
    [
      0,
      fadeIn,
      endCardFrom,
      endCardFrom + lift,
      totalFrames - fadeOut,
      totalFrames,
    ],
    [0, under, under, over, over, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <Audio src={staticFile(config.src)} volume={volume} />;
};
