import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { blurWhip } from "../transitions/blurWhip";
import "../fonts";
import { BrandProvider } from "./BrandContext";
import { StyleProvider } from "./StyleContext";
import { resolveStyle } from "./style";
import { CtaPill } from "./components/CtaPill";
import { CutFlash } from "./components/CutFlash";
import { CutSfx } from "./components/CutSfx";
import { EndCard } from "./components/EndCard";
import { ProgressBar } from "./components/ProgressBar";
import { MusicBed } from "./components/MusicBed";
import { RuleList } from "./components/RuleList";
import { Scene } from "./components/Scene";
import { SectionLabel } from "./components/SectionLabel";
import {
  endCardStart,
  sceneFrames,
  tightenAll,
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
const transitionAfter = (
  frames: number,
  last: boolean,
  kind: "blur" | "cut",
): React.ReactNode => {
  // Corte seco em tudo, menos a entrada do cartão final: sem ele a peça
  // termina num salto para uma imagem que não tem nada a ver com o resto.
  if (frames === 0 || (kind === "cut" && !last)) return null;
  const timing = linearTiming({ durationInFrames: frames });
  if (last) {
    return (
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
    );
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
  const { overlays = {}, endCard, music } = config;
  const style = resolveStyle(config.style);

  // O silêncio que passa do que o estilo pede sai aqui, uma vez, e tudo
  // adiante — duração, emendas, legenda — trabalha sobre a cena já apertada.
  const scenes = tightenAll(config.scenes, style);
  const durations = sceneFrames(scenes, fps);
  const transitions = transitionsFor(scenes, fps, style);
  const endCardFrames = Math.round(endCard.seconds * fps);
  const total = totalFrames(config.scenes, endCard.seconds, fps, style);
  const endCardFrom = endCardStart(config.scenes, endCard.seconds, fps, style);

  // Onde cada cena começa na linha do tempo final, descontadas as emendas —
  // é nesses quadros que o clarão cai.
  const cuts = durations.reduce<number[]>((acc, d, i) => {
    const prev = acc.length ? acc[acc.length - 1] : 0;
    return i === 0
      ? [0]
      : [...acc, prev + durations[i - 1] - transitions[i - 1]];
  }, []);

  return (
    <BrandProvider brand={config.brand}>
      <StyleProvider style={style}>
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
                      push={style.pushAlternates && i % 2 === 1 ? -1 : 1}
                    >
                      {overlay?.label ? (
                        <SectionLabel>{overlay.label}</SectionLabel>
                      ) : null}
                      {overlay?.items ? (
                        <RuleList items={overlay.items} />
                      ) : null}
                    </Scene>
                  </TransitionSeries.Sequence>
                  {transitionAfter(
                    transitions[i],
                    i === scenes.length - 1,
                    style.transitions,
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

          {style.flash ? (
            <CutFlash cuts={cuts.slice(1)} config={style.flash} />
          ) : null}

          {style.flashSfx ? (
            <CutSfx cuts={cuts.slice(1)} config={style.flashSfx} />
          ) : null}

          {style.progressBar ? <ProgressBar totalFrames={total} /> : null}

          {style.cta ? (
            <CtaPill
              text={style.cta.text}
              at={style.cta.at}
              until={endCardFrom}
            />
          ) : null}

          {music ? (
            <MusicBed
              config={music}
              totalFrames={total}
              endCardFrom={endCardFrom}
              fps={fps}
            />
          ) : null}
        </AbsoluteFill>
      </StyleProvider>
    </BrandProvider>
  );
};
