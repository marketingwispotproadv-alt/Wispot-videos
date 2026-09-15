import React from "react";
import { Img, staticFile } from "remotion";
import { LOGO } from "../../brands/proadvanced";
import { SAFE_X } from "../layout";

/** Assinatura da marca, presente do primeiro ao último quadro. */
export const Watermark: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <Img
    src={staticFile(LOGO.white)}
    style={{
      position: "absolute",
      top: 72,
      left: SAFE_X,
      width: 296,
      opacity,
      filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.45))",
    }}
  />
);
