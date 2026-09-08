import React from "react";
import { Img, staticFile } from "remotion";
import { SAFE_X } from "../brand";

/** Assinatura da marca presente em todo o vídeo (versão branca sobre imagem). */
export const Watermark: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <Img
    src={staticFile("brand/logo-white.png")}
    style={{
      position: "absolute",
      top: 74,
      left: SAFE_X,
      width: 228,
      opacity,
      filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.45))",
    }}
  />
);
