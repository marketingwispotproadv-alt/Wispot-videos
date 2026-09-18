import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../brand";

/**
 * Gravação do portal MyGuest rodando de verdade (white label da C&A), no trecho
 * em que o voucher é digitado e confirmado.
 *
 * O arquivo em `public/clips/portal.mp4` é só a tela: a moldura do aparelho vem
 * daqui, para bater com o celular da cena do white label. A tela é mais alta do
 * que cabe entre a manchete e a legenda, então o container mostra o topo — onde
 * está o campo do voucher — e esmaece na base, como se o aparelho seguisse fora
 * do quadro.
 *
 * `portalFrom` começa depois dos 7,8 s da gravação: até ali o navegador mostra
 * a barra de endereço em vermelho, que passa impressão de conexão insegura e
 * ainda expõe a URL de teste.
 */
export const PortalVoucher: React.FC<{
  /** quando o celular entra, em segundos da cena */
  at: number;
  /** ponto de partida dentro da gravação, em segundos */
  portalFrom: number;
}> = ({ at, portalFrom }) => {
  const { fps } = useVideoConfig();

  return (
    <Sequence from={Math.round(at * fps)} layout="none">
      <Phone portalFrom={portalFrom} />
    </Sequence>
  );
};

const Phone: React.FC<{ portalFrom: number }> = ({ portalFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 22,
  });
  const fade = "linear-gradient(to bottom, #000 80%, transparent 99%)";

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 432,
          width: 800,
          height: 966,
          marginLeft: -400,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 58,
            padding: 18,
            background: "#0E1114",
            boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 42,
              overflow: "hidden",
              background: COLORS.white,
            }}
          >
            <OffthreadVideo
              src={staticFile("clips/portal.mp4")}
              trimBefore={Math.round(portalFrom * fps)}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
