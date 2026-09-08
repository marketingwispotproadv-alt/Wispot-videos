import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENT } from "../brand";

/**
 * Tela de autenticação do MyGuest dentro de um aparelho. Em `swapAt` a marca
 * exibida troca por um espaço genérico, ilustrando a operação em white label.
 */
export const WhiteLabelPhone: React.FC<{ at: number; swapAt: number }> = ({
  at,
  swapAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(at * fps);
  const enter = spring({
    frame: frame - start,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 22,
  });
  // troca sequencial: a marca sai primeiro, o espaço genérico entra depois —
  // assim as duas versões nunca aparecem sobrepostas
  const swapFrame = frame - Math.round(swapAt * fps);
  const logoOut = interpolate(swapFrame, [0, 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swap = interpolate(swapFrame, [6, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start - 2) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 520,
        width: 560,
        height: 900,
        marginLeft: -280,
        borderRadius: 62,
        padding: 16,
        background: "#0E1114",
        boxShadow: "0 36px 90px rgba(0,0,0,0.5)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [64, 0])}px) scale(${interpolate(enter, [0, 1], [0.93, 1])})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 48,
          background: COLORS.white,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "70px 44px 44px",
        }}
      >
        {/* área de marca do portal — é ela que muda no white label */}
        <div
          style={{
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <Img
            src={staticFile("brand/logo-blue.png")}
            style={{ width: 300, opacity: logoOut }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: swap,
              transform: `scale(${interpolate(swap, [0, 1], [0.9, 1])})`,
            }}
          >
            <div
              style={{
                border: `4px dashed ${COLORS.blue}`,
                borderRadius: 20,
                padding: "22px 34px",
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: 2,
                color: COLORS.blue,
                textAlign: "center",
              }}
            >
              SUA MARCA
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 44,
            color: COLORS.ink,
            marginTop: 26,
            textAlign: "center",
          }}
        >
          Bem-vindo!
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 28,
            color: COLORS.gray,
            marginTop: 12,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          Conecte-se à rede de visitantes
        </div>

        <div style={{ width: "100%", marginTop: 40, display: "grid", gap: 18 }}>
          {["E-mail", "Código do voucher"].map((f) => (
            <div
              key={f}
              style={{
                border: "3px solid rgba(81,77,75,0.18)",
                borderRadius: 18,
                padding: "24px 22px",
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 28,
                color: "rgba(81,77,75,0.55)",
              }}
            >
              {f}
            </div>
          ))}
          <div
            style={{
              background: GRADIENT,
              borderRadius: 18,
              padding: "26px 22px",
              textAlign: "center",
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 32,
              color: COLORS.white,
            }}
          >
            Conectar
          </div>
        </div>
      </div>
    </div>
  );
};
