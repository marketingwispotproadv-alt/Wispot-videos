import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { blurWhip } from "../transitions/blurWhip";
import "../fonts";
import { BrandProvider } from "./BrandContext";
import { EndCard } from "./components/EndCard";
import { MusicBed } from "./components/MusicBed";
import { RuleList } from "./components/RuleList";
import { Scene } from "./components/Scene";
import { SectionLabel } from "./components/SectionLabel";
import {
  endCardStart,
  sceneFrames,
  totalFrames,
  transitionsFor,
} from "./timing";
import type { PieceConfig } from "./types";

/**
 * A emenda que vem depois da cena `index`.
 *
 * Entre takes, borrão: o enquadramento é o mesmo em todos, e um fade ali
 * sobreporia dois rostos quase idênticos — o defeito fica evidente. Borrado, o
 * corte vira rastro e passa como movimento.
 *
 * O cartão final é a única imagem diferente da peça, e aí o fade cabe.
 *
 * Devolve o elemento pronto, e não um componente que o embrulhe: a
 * TransitionSeries identifica os filhos comparando `child.type`, e qualquer
 * wrapper no meio faz o render falhar.
 */
const transitionAfter = (frames: number, last: boolean): React.ReactNode => {
  if (frames === 0) return null;
  const timing = linearTiming({ durationInFrames: frames });
  if (last) {
    return <TransitionSeries.Transition presentation={fade()} timing={timing} />;
  }
  return (
    <TransitionSeries.Transition
      presentation={blurWhip({ maxBlur: 38, zoom: 0.09 })}
      timing={timing}
    />
  );
};

export const Piece: React.FC<{ config: PieceConfig }> = ({ config }) => {
  const { fps } = useVideoConfig();
  const { scenes, overlays = {}, endCard, music } = config;

  const durations = sceneFrames(scenes, fps);
  const transitions = transitionsFor(scenes, fps);
  const endCardFrames = Math.round(endCard.seconds * fps);
  const total = totalFrames(scenes, endCard.seconds, fps);

  return (
    <BrandProvider brand={config.brand}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <TransitionSeries>
          {scenes.map((scene, i) => {
            const overlay = overlays[scene.clip];
            return (
              <React.Fragment key={scene.clip}>
                <TransitionSeries.Sequence
                  durationInFrames={durations[i]}
                  name={`Cena ${i + 1} · ${scene.clip}`}
                >
                  <Scene
                    scene={scene}
                    clipsDir={config.clipsDir}
                    durationInFrames={durations[i]}
                    push={i % 2 === 0 ? 1 : -1}
                  >
                    {overlay?.label ? (
                      <SectionLabel>{overlay.label}</SectionLabel>
                    ) : null}
                    {overlay?.items ? <RuleList items={overlay.items} /> : null}
                  </Scene>
                </TransitionSeries.Sequence>
                {transitionAfter(
                  transitions[i],
                  i === scenes.length - 1,
                )}
              </React.Fragment>
            );
          })}
          <TransitionSeries.Sequence
            durationInFrames={endCardFrames}
            name="Cartão final"
          >
            <EndCard config={endCard} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {music ? (
          <MusicBed
            config={music}
            totalFrames={total}
            endCardFrom={endCardStart(scenes, endCard.seconds, fps)}
            fps={fps}
          />
        ) : null}
      </AbsoluteFill>
    </BrandProvider>
  );
};
