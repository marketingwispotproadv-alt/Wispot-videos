import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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
    <>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 460,
          width: 620,
          height: 920,
          marginLeft: -310,
          borderRadius: 68,
          padding: 18,
          background: "#0E1114",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [64, 0])}px) scale(${interpolate(enter, [0, 1], [0.93, 1])})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 52,
            background: COLORS.white,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "76px 48px 48px",
          }}
        >
          {/* área de marca do portal — é ela que muda no white label */}
          <div
            style={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <Img
              src={staticFile("brand/logo-blue.png")}
              style={{ width: 330, opacity: logoOut }}
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
                  borderRadius: 22,
                  padding: "26px 40px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 38,
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
              fontSize: 50,
              color: COLORS.ink,
              marginTop: 30,
              textAlign: "center",
            }}
          >
            Bem-vindo!
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 31,
              color: COLORS.gray,
              marginTop: 14,
              textAlign: "center",
              lineHeight: 1.35,
            }}
          >
            Conecte-se à rede de visitantes
          </div>

          <div style={{ width: "100%", marginTop: 44, display: "grid", gap: 20 }}>
            {["E-mail", "Código do voucher"].map((f) => (
              <div
                key={f}
                style={{
                  border: "3px solid rgba(81,77,75,0.18)",
                  borderRadius: 20,
                  padding: "27px 24px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 31,
                  color: "rgba(81,77,75,0.55)",
                }}
              >
                {f}
              </div>
            ))}
            <div
              style={{
                background: GRADIENT,
                borderRadius: 20,
                padding: "29px 24px",
                textAlign: "center",
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 35,
                color: COLORS.white,
              }}
            >
              Conectar
            </div>
          </div>
        </div>
      </div>

      {/* carimbo que entra junto com a troca de marca */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1404,
          marginLeft: -310,
          width: 620,
          display: "flex",
          justifyContent: "center",
          opacity: swap,
          transform: `translateY(${interpolate(swap, [0, 1], [20, 0])}px) rotate(-3deg)`,
        }}
      >
        <div
          style={{
            padding: "18px 40px",
            borderRadius: 999,
            background: COLORS.white,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 40,
            letterSpacing: 2,
            color: COLORS.blueDeep,
            boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
          }}
        >
          WHITE LABEL
        </div>
      </div>
    </>
  );
};
