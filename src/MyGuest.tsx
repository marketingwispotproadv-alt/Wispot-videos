import React from "react";
import { AbsoluteFill, Series } from "remotion";
import "./fonts";
import { VIDEO } from "./brand";
import { SCENES } from "./data/script";
import { ComplianceBadges } from "./components/ComplianceBadges";
import { EndCard } from "./components/EndCard";
import { Scene } from "./components/Scene";
import { SectionLabel } from "./components/SectionLabel";
import { VoucherCard } from "./components/VoucherCard";
import { WhiteLabelPhone } from "./components/WhiteLabelPhone";

export const END_CARD_SECONDS = 3.6;

export const sceneFrames = (fps: number) =>
  SCENES.map((s) => Math.round((s.trimEnd - s.trimStart) * fps));

export const totalFrames = (fps: number) =>
  sceneFrames(fps).reduce((a, b) => a + b, 0) +
  Math.round(END_CARD_SECONDS * fps);

/**
 * Gráficos por cena. Os tempos são os da locução (em segundos, contados a
 * partir do início da cena já cortada), tirados dos word timestamps.
 */
const overlayFor = (clip: string): React.ReactNode => {
  switch (clip) {
    case "8446":
      return (
        <>
          <SectionLabel>Acesso por voucher</SectionLabel>
          <VoucherCard at={4.35} />
        </>
      );
    case "8450":
      return (
        <>
          <SectionLabel>Autenticação white label</SectionLabel>
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

export const MyGuest: React.FC = () => {
  const durations = sceneFrames(VIDEO.fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {SCENES.map((scene, i) => (
          <Series.Sequence
            key={scene.clip}
            durationInFrames={durations[i]}
            name={`Cena ${i + 1} · IMG_${scene.clip}`}
          >
            <Scene
              scene={scene}
              durationInFrames={durations[i]}
              fadeToBrand={i === SCENES.length - 1}
            >
              {overlayFor(scene.clip)}
            </Scene>
          </Series.Sequence>
        ))}
        <Series.Sequence
          durationInFrames={Math.round(END_CARD_SECONDS * VIDEO.fps)}
          name="Cartão final"
        >
          <EndCard />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
