import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

/**
 * Trilha de fundo. Fica baixa enquanto a locução corre e sobe no cartão final,
 * que não tem fala — assim o vídeo não termina no silêncio.
 * O arquivo em `public/audio` já vem normalizado a -20 LUFS.
 */
export const MusicBed: React.FC<{
  totalFrames: number;
  /** frame em que o cartão final começa */
  endCardFrom: number;
  fps: number;
}> = ({ totalFrames, endCardFrom, fps }) => {
  const frame = useCurrentFrame();

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
    [0, 0.22, 0.22, 0.62, 0.62, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <Audio src={staticFile("audio/music.mp3")} volume={volume} />;
};
