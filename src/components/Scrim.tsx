import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Gradientes de leitura: escurecem topo e base o suficiente para o logo e as
 * legendas ficarem legíveis sobre qualquer cena, sem lavar a imagem.
 */
export const Scrim: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0) 34%)",
      }}
    />
  </>
);
