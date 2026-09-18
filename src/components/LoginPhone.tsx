import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_FAMILY } from "../brand";

/**
 * Tela de entrada do portal, reproduzida a partir do layout real: a mesma
 * lista de opções de login e o mesmo rodapé.
 *
 * É mock, e não a gravação: a tela real que temos está em white label de um
 * cliente, e a marca dele não pode ir para uma peça da Wispot. Aqui a área de
 * marca é justamente o que se troca — começa com a Wispot e vira um espaço
 * genérico quando a locução chega em "white label".
 */

type Opcao = { rotulo: string; sigla: string; cor: string; texto?: string };

/** cores tiradas da tela real do portal */
const OPCOES: Opcao[] = [
  { rotulo: "CONECTE-SE COM FACEBOOK", sigla: "f", cor: "#3A5896" },
  { rotulo: "CONECTE-SE COM GOOGLE", sigla: "G", cor: "#D94734" },
  { rotulo: "CONECTE-SE COM LINKEDIN", sigla: "in", cor: "#0D75A8" },
  { rotulo: "CONECTE-SE COM APPLE", sigla: "A", cor: "#1E2020" },
  { rotulo: "ENTRAR COM X", sigla: "X", cor: "#1C99ED" },
  {
    rotulo: "CONECTE-SE COM CELULAR",
    sigla: "•",
    cor: "#FFFFFF",
    texto: "#2C2C2C",
  },
];

export const LoginPhone: React.FC<{
  /** quando o celular entra, em segundos da cena */
  at: number;
  /** quando a marca da tela vira um espaço genérico */
  swapAt: number;
}> = ({ at, swapAt }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} layout="none">
      <Body swapAt={swapAt - at} />
    </Sequence>
  );
};

const Body: React.FC<{ swapAt: number }> = ({ swapAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 22,
  });

  // a marca sai primeiro e o espaço genérico entra depois, para as duas nunca
  // aparecerem sobrepostas
  const t = frame - Math.round(swapAt * fps);
  const logoOut = interpolate(t, [0, 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swap = interpolate(t, [6, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 404,
          width: 556,
          height: 900,
          marginLeft: -278,
          borderRadius: 58,
          padding: 18,
          background: "#0E1114",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 42,
            overflow: "hidden",
            background: COLORS.white,
            display: "flex",
            flexDirection: "column",
            padding: "30px 28px 20px",
          }}
        >
          {/* área de marca do portal — é ela que muda no white label */}
          <div
            style={{
              height: 104,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("brand/logo-blue.png")}
              style={{ width: 232, opacity: logoOut }}
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
                  border: `3px dashed ${COLORS.blue}`,
                  borderRadius: 18,
                  padding: "18px 30px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 30,
                  letterSpacing: 2,
                  color: COLORS.blue,
                }}
              >
                SUA MARCA
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 36,
              color: COLORS.ink,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Seja bem-vindo
          </div>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 13,
              flex: 1,
              alignContent: "start",
            }}
          >
            {OPCOES.map((o) => (
              <div
                key={o.rotulo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "20px 20px",
                  borderRadius: 10,
                  background: o.cor,
                  border:
                    o.texto === undefined
                      ? "none"
                      : "1px solid rgba(0,0,0,0.14)",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 23,
                  letterSpacing: 0.3,
                  color: o.texto ?? COLORS.white,
                }}
              >
                <span
                  style={{
                    width: 26,
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {o.sigla}
                </span>
                {o.rotulo}
              </div>
            ))}
          </div>

          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 17,
              color: "rgba(81,77,75,0.75)",
              textAlign: "center",
              lineHeight: 1.4,
              paddingTop: 10,
            }}
          >
            Powered by Wispot | Termos e Condições,
            <br />e Política de Privacidade
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
