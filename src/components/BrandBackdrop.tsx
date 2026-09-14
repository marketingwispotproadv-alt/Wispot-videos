import React from "react";
import { AbsoluteFill } from "remotion";
import { GRADIENT } from "../brand";
import { Ripples } from "./Ripples";

/**
 * Fundo de marca que ocupa a tela inteira nas cenas em que a câmera está só na
 * mesa. O clipe continua rodando por baixo (é dele que vem a locução) e entra
 * aqui apenas como textura desfocada, para o fundo não ficar parado.
 */
export const BrandBackdrop: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: GRADIENT, opacity: 0.94 }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Ripples size={900} opacity={0.2} speed={0.3} />
    </AbsoluteFill>
    {/* leve escurecida nas bordas para o conteúdo central ganhar foco */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.28) 100%)",
      }}
    />
  </>
);
