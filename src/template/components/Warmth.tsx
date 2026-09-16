import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Tempero quente por cima da imagem.
 *
 * A referência foi gravada numa sala de madeira e luz amarela, e a nossa numa
 * de vidro e luz fria: medindo a média dos canais, lá R−B é +24 e aqui −9. Boa
 * parte dessa distância é o lugar, não a grade — isto aproxima o que dá para
 * aproximar sem lavar a imagem, e não finge fechar o resto.
 */
export const Warmth: React.FC<{ amount: number }> = ({ amount }) => (
  <>
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FFB25A 0%, #FF9B3D 100%)",
        opacity: 0.16 * amount,
        mixBlendMode: "soft-light",
      }}
    />
    <AbsoluteFill
      style={{
        background: "#2A1B00",
        opacity: 0.06 * amount,
        mixBlendMode: "lighten",
      }}
    />
  </>
);
