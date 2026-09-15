import React from "react";
import { AbsoluteFill } from "remotion";
import { GRADIENT } from "../../brands/proadvanced";
import { RayBurst } from "./RayBurst";

/** Degradê institucional ocupando a tela, com os raios do símbolo ao fundo. */
export const BrandBackdrop: React.FC<{ opacity?: number }> = ({
  opacity = 1,
}) => (
  <>
    <AbsoluteFill style={{ background: GRADIENT, opacity }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <RayBurst />
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 44%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.26) 100%)",
      }}
    />
  </>
);
