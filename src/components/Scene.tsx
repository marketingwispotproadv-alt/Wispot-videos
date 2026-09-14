import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import type { SceneDef } from "../data/script";
import { BrandBackdrop } from "./BrandBackdrop";
import { Captions } from "./Captions";
import { Scrim } from "./Scrim";
import { Watermark } from "./Watermark";

/**
 * `footage` = a imagem do clipe é a cena.
 * `brand` = a câmera está só na mesa e não agrega nada: a tela vira uma peça de
 * marca inteira. O clipe continua rodando por baixo, desfocado, porque é dele
 * que vem a locução.
 */
export type SceneVariant = "footage" | "brand";

export const Scene: React.FC<{
  scene: SceneDef;
  variant?: SceneVariant;
  children?: React.ReactNode;
}> = ({ scene, variant = "footage", children }) => {
  const { fps } = useVideoConfig();
  const onBrand = variant === "brand";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(`clips/${scene.clip}.mp4`)}
        trimBefore={Math.round(scene.trimStart * fps)}
        trimAfter={Math.round(scene.trimEnd * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...(onBrand
            ? { filter: "blur(44px) saturate(0.7) brightness(0.85)", transform: "scale(1.16)" }
            : {}),
        }}
      />
      {onBrand ? <BrandBackdrop /> : <Scrim />}
      <Watermark />
      {children}
      <Captions chunks={scene.chunks} variant={variant} />
    </AbsoluteFill>
  );
};
