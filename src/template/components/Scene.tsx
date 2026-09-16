import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scrim } from "../../components/Scrim";
import { useStyle } from "../StyleContext";
import type { SceneDef } from "../types";
import { Captions } from "./Captions";
import { Warmth } from "./Warmth";
import { Watermark } from "./Watermark";

/**
 * Uma cena é um take. São muitos, todos com o mesmo enquadramento — mesma
 * cadeira, mesmo fundo, mesma distância —, então corte seco entre dois deles
 * salta aos olhos.
 *
 * O contrapeso é este empurrão de escala: cada cena entra um pouco ampliada e
 * vai fechando ao longo do take. O quadro nunca fica parado, e a emenda passa
 * como movimento de câmera em vez de falha de continuidade. O sentido alterna
 * de cena para cena (`push`) para dois takes seguidos não andarem para o mesmo
 * lado.
 */
export const Scene: React.FC<{
  scene: SceneDef;
  clipsDir: string;
  durationInFrames: number;
  /** +1 fecha o quadro ao longo da cena, -1 abre */
  push?: 1 | -1;
  children?: React.ReactNode;
}> = ({ scene, clipsDir, durationInFrames, push = 1, children }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const style = useStyle();

  const AMOUNT = style.push;
  const from = push === 1 ? 1 + AMOUNT : 1;
  const to = push === 1 ? 1 : 1 + AMOUNT;
  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(`${clipsDir}/${scene.clip}.mp4`)}
        trimBefore={Math.round(scene.trimStart * fps)}
        trimAfter={Math.round(scene.trimEnd * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          // a referência é bem mais saturada que a nossa sala; o tempero quente
          // por si só não fecha isso, porque ele desloca a cor sem encorpá-la
          filter: style.warmth
            ? `saturate(${(1 + 0.3 * style.warmth).toFixed(2)})`
            : undefined,
        }}
      />
      {style.warmth ? <Warmth amount={style.warmth} /> : null}
      <Scrim />
      {style.watermark ? <Watermark /> : null}
      {children}
      <Captions chunks={scene.chunks} />
    </AbsoluteFill>
  );
};
