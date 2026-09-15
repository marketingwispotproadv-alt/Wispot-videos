import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { blurWhip } from "../transitions/blurWhip";
import "../fonts";
import { VIDEO } from "../brand";
import { SCENES } from "./data/script";
import { EndCard } from "./components/EndCard";
import { RuleList } from "./components/RuleList";
import type { RuleItem } from "./components/RuleList";
import { Scene } from "./components/Scene";
import { SectionLabel } from "./components/SectionLabel";

export const END_CARD_SECONDS = 4;

/**
 * Cada cena guarda 0,20 s de silêncio na cabeça e 0,30 s na cauda. A emenda
 * consome esse tempo das duas vizinhas, então 6 quadros (0,20 s) é o limite
 * que ainda cai no mudo dos dois lados.
 *
 * `0` é corte seco. O 8417 é o único take que já começa falando — não há folga
 * na cabeça dele para uma emenda morder, e o corte entra limpo.
 *
 * O índice é o da cena que termina; o último valor é a entrada do cartão final.
 */
const TRANSITIONS: readonly number[] = [
  6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8,
];

export const sceneFrames = (fps: number) =>
  SCENES.map((s) => Math.round((s.trimEnd - s.trimStart) * fps));

const endCardFrames = (fps: number) => Math.round(END_CARD_SECONDS * fps);

export const totalFrames = (fps: number) =>
  sceneFrames(fps).reduce((a, b) => a + b, 0) +
  endCardFrames(fps) -
  TRANSITIONS.reduce((a, b) => a + b, 0);

/**
 * Gráficos por cena. Os tempos são segundos contados do início da cena já
 * cortada, tirados dos word timestamps — cada ficha entra na palavra que a
 * nomeia.
 *
 * Ficha sem `at` já está em cena desde o primeiro quadro: é a que veio do take
 * anterior. Assim a lista atravessa o corte sem reanimar, e três takes
 * seguidos passam a ler como um bloco só em vez de três saltos.
 */
const OVERLAYS: Record<string, { label?: string; items?: RuleItem[] }> = {
  "8413": {
    label: "Segurança de rede",
    items: [
      { text: "Firewall instalado", tone: "ok", at: 0.4 },
      { text: "Empresa protegida", tone: "question", at: 1.75 },
    ],
  },
  "8414": {
    items: [
      { text: "Como está configurado", at: 0.75 },
      { text: "Como é gerenciado", at: 2.5 },
    ],
  },
  "8415": { label: "O que ele faz" },
  "8417": {
    items: [
      { text: "Controla o tráfego", at: 1.0 },
      { text: "Define acessos", at: 2.6 },
    ],
  },
  "8419": {
    items: [
      { text: "Controla o tráfego" },
      { text: "Define acessos" },
      { text: "Bloqueia ameaças", at: 0.7 },
    ],
  },
  "8420": { label: "As regras envelhecem" },
  "8421": { items: [{ text: "Porta aberta", tone: "risk", at: 0.5 }] },
  "8424": {
    items: [
      { text: "Porta aberta", tone: "risk" },
      { text: "Acesso antigo", tone: "risk", at: 0.3 },
      { text: "Configuração desatualizada", tone: "risk", at: 1.3 },
    ],
  },
  "8426": {
    items: [
      { text: "Porta aberta", tone: "risk" },
      { text: "Acesso antigo", tone: "risk" },
      { text: "Configuração desatualizada", tone: "risk" },
    ],
  },
  "8427": { label: "Gestão contínua" },
  "8429": {
    items: [
      { text: "Revisamos regras", at: 0.3 },
      { text: "Acompanhamos o ambiente", at: 1.2 },
    ],
  },
  "8430": {
    items: [
      { text: "Revisamos regras" },
      { text: "Acompanhamos o ambiente" },
      { text: "Ajustamos as configurações", at: 0.4 },
    ],
  },
  "8434": {
    items: [
      { text: "Revisamos regras" },
      { text: "Acompanhamos o ambiente" },
      { text: "Ajustamos as configurações" },
    ],
  },
};

/**
 * A emenda que vem depois da cena `index`.
 *
 * Entre takes, borrão: o enquadramento é o mesmo nos dezesseis, e um fade ali
 * sobreporia dois rostos quase idênticos — o defeito fica evidente. Borrado, o
 * corte vira rastro e passa como movimento.
 *
 * O cartão final é a única imagem diferente do vídeo todo, e aí o fade cabe.
 *
 * Devolve o elemento pronto, e não um componente que o embrulhe: a
 * TransitionSeries identifica os filhos comparando `child.type`, e qualquer
 * wrapper no meio faz o render falhar.
 */
const transitionAfter = (index: number): React.ReactNode => {
  const frames = TRANSITIONS[index];
  if (frames === 0) return null;

  const timing = linearTiming({ durationInFrames: frames });

  if (index === TRANSITIONS.length - 1) {
    return <TransitionSeries.Transition presentation={fade()} timing={timing} />;
  }
  return (
    <TransitionSeries.Transition
      presentation={blurWhip({ maxBlur: 38, zoom: 0.09 })}
      timing={timing}
    />
  );
};

export const ProAdvanced: React.FC = () => {
  const { fps } = VIDEO;
  const durations = sceneFrames(fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => {
          const overlay = OVERLAYS[scene.clip];
          return (
            <React.Fragment key={scene.clip}>
              <TransitionSeries.Sequence
                durationInFrames={durations[i]}
                name={`Cena ${i + 1} · ${scene.clip}`}
              >
                <Scene
                  scene={scene}
                  durationInFrames={durations[i]}
                  push={i % 2 === 0 ? 1 : -1}
                >
                  {overlay?.label ? (
                    <SectionLabel>{overlay.label}</SectionLabel>
                  ) : null}
                  {overlay?.items ? <RuleList items={overlay.items} /> : null}
                </Scene>
              </TransitionSeries.Sequence>
              {transitionAfter(i)}
            </React.Fragment>
          );
        })}
        <TransitionSeries.Sequence
          durationInFrames={endCardFrames(fps)}
          name="Cartão final"
        >
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
