import React from "react";
import { Img, staticFile } from "remotion";
import { useBrand } from "../BrandContext";
import { SAFE_X } from "../layout";

/** Assinatura da marca, presente do primeiro ao último quadro. */
export const Watermark: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const brand = useBrand();
  return (
    <Img
      src={staticFile(brand.logo.lockupWhite)}
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
};
