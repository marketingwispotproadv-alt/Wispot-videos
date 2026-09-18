import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../brand";

/** Um trecho da gravação do portal, esticado para durar `seconds` na cena. */
export type PortalClip = {
  /** ponto de partida dentro da gravação, em segundos */
  from: number;
  /** quanto esse trecho ocupa na cena, em segundos */
  seconds: number;
  /**
   * Velocidade. Abaixo de 1 estica um trecho curto — as telas do portal são
   * praticamente paradas, então isso não se nota.
   */
  rate?: number;
};

/**
 * Celular exibindo a gravação do portal MyGuest rodando de verdade (white label
 * da C&A). O arquivo em `public/clips/portal.mp4` é só a tela; a moldura vem
 * daqui, igual nas duas cenas que a usam.
 *
 * Quando `height` é menor do que a tela pede, o container mostra o topo e
 * esmaece na base, como se o aparelho seguisse fora do quadro.
 */
export const PortalPhone: React.FC<{
  /** quando o celular entra, em segundos da cena */
  at: number;
  clips: PortalClip[];
  /** largura da tela (sem a moldura) */
  width: number;
  top: number;
  /** altura visível; sem isso, a tela aparece inteira */
  height?: number;
}> = ({ at, clips, width, top, height }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} layout="none">
      <Body clips={clips} width={width} top={top} height={height} />
    </Sequence>
  );
};

/** proporção da tela recortada em public/clips/portal.mp4 */
const SCREEN_RATIO = 770 / 1668;

const Body: React.FC<{
  clips: PortalClip[];
  width: number;
  top: number;
  height?: number;
}> = ({ clips, width, top, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 22,
  });

  const full = Math.round(width / SCREEN_RATIO);
  const visible = height ?? full;
  const cortada = visible < full - 2;
  const fade = "linear-gradient(to bottom, #000 80%, transparent 99%)";
  const pad = 18;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top,
          width: width + pad * 2,
          height: visible + pad * 2,
          marginLeft: -(width + pad * 2) / 2,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          ...(cortada
            ? { WebkitMaskImage: fade, maskImage: fade }
            : {}),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 58,
            padding: pad,
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
            <Series>
              {clips.map((c, i) => (
                <Series.Sequence
                  key={i}
                  durationInFrames={Math.round(c.seconds * fps)}
                  layout="none"
                >
                  <OffthreadVideo
                    src={staticFile("clips/portal.mp4")}
                    trimBefore={Math.round(c.from * fps)}
                    playbackRate={c.rate ?? 1}
                    style={{ width: "100%", display: "block" }}
                  />
                </Series.Sequence>
              ))}
            </Series>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
