import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import "./fonts";
import { VIDEO } from "./brand";
import { SCENES } from "./data/script";
import { ComplianceBadges } from "./components/ComplianceBadges";
import { EndCard } from "./components/EndCard";
import { Headline } from "./components/Headline";
import { MusicBed } from "./components/MusicBed";
import { ProductLockup } from "./components/ProductLockup";
import { Scene } from "./components/Scene";
import type { SceneVariant } from "./components/Scene";
import { SectionLabel } from "./components/SectionLabel";
import { VoucherCard } from "./components/VoucherCard";
import { WhiteLabelPhone } from "./components/WhiteLabelPhone";

export const END_CARD_SECONDS = 3.6;

/**
 * Emendas entre as cenas, na ordem em que aparecem. Cada uma consome o tempo
 * dela das duas cenas vizinhas, e todas caem em trechos mudos das pontas —
 * nenhuma fala se sobrepõe.
 */
const TRANSITIONS = [12, 12, 12, 10, 10, 12] as const;

export const sceneFrames = (fps: number) =>
  SCENES.map((s) => Math.round((s.trimEnd - s.trimStart) * fps));

const endCardFrames = (fps: number) => Math.round(END_CARD_SECONDS * fps);

export const totalFrames = (fps: number) =>
  sceneFrames(fps).reduce((a, b) => a + b, 0) +
  endCardFrames(fps) -
  TRANSITIONS.reduce((a, b) => a + b, 0);

/** Frame em que o cartão final entra, já descontadas as emendas. */
export const endCardStart = (fps: number) =>
  totalFrames(fps) - endCardFrames(fps);

/**
 * Gráficos por cena. Os tempos são os da locução (em segundos, contados a
 * partir do início da cena já cortada), tirados dos word timestamps.
 */
const overlayFor = (clip: string): React.ReactNode => {
  switch (clip) {
    case "8446":
      return (
        <>
          <ProductLockup outAt={4.1} />
          <Headline eyebrow="MYGUEST" title="Acesso por voucher" at={4.35} />
          <VoucherCard at={4.35} />
        </>
      );
    case "8450":
      return (
        <>
          <Headline eyebrow="AUTENTICAÇÃO" title="Com a sua marca" at={0.3} />
          <WhiteLabelPhone at={0.9} swapAt={8.75} />
        </>
      );
    case "8454":
      return (
        <>
          <SectionLabel>Painel de controle</SectionLabel>
          <ComplianceBadges lgpdAt={6.3} marcoAt={7.25} />
        </>
      );
    default:
      return null;
  }
};

/**
 * Nos clipes 8446 e 8450 a câmera está só na mesa, sem a apresentadora em
 * quadro. Neles a tela inteira vira peça de marca — só a locução do clipe é
 * aproveitada.
 */
const variantFor = (clip: string): SceneVariant =>
  clip === "8446" || clip === "8450" ? "brand" : "footage";

/**
 * As cenas de marca entram pela direita, como quem passa de tela em tela.
 *
 * Entre os planos da apresentadora não dá para usar fade: o enquadramento é
 * quase o mesmo, e a dissolvência sobrepõe dois rostos e duas legendas ao mesmo
 * tempo. Slide de baixo resolve — nada se superpõe e a emenda fica com cara de
 * vertical mesmo. Para o cartão final, aí sim fade: a imagem é outra.
 */
const presentationFor = (index: number) => {
  if (index <= 2) return slide({ direction: "from-right" });
  if (index === TRANSITIONS.length - 1) return fade();
  return slide({ direction: "from-bottom" });
};

export const MyGuest: React.FC = () => {
  const { fps } = VIDEO;
  const durations = sceneFrames(fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={scene.clip}>
            <TransitionSeries.Sequence
              durationInFrames={durations[i]}
              name={`Cena ${i + 1} · IMG_${scene.clip}`}
            >
              <Scene scene={scene} variant={variantFor(scene.clip)}>
                {overlayFor(scene.clip)}
              </Scene>
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={presentationFor(i)}
              timing={linearTiming({ durationInFrames: TRANSITIONS[i] })}
            />
          </React.Fragment>
        ))}
        <TransitionSeries.Sequence
          durationInFrames={endCardFrames(fps)}
          name="Cartão final"
        >
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <MusicBed
        totalFrames={totalFrames(fps)}
        endCardFrom={endCardStart(fps)}
        fps={fps}
      />
    </AbsoluteFill>
  );
};
