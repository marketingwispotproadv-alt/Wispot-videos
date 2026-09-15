import type { SceneDef } from "./types";

/**
 * Emenda máxima, em quadros. Mais que isto e o borrão come fala nas cenas de
 * folga curta; menos e ele deixa de disfarçar o corte.
 */
export const MAX_TRANSITION = 6;

/** Abaixo disto não vale emendar: entra corte seco. */
const MIN_TRANSITION = 3;

/** Entrada do cartão final, que é a única imagem diferente da peça. */
export const END_CARD_TRANSITION = 8;

const lastWordEnd = (scene: SceneDef) => {
  const chunk = scene.chunks[scene.chunks.length - 1];
  return chunk.words[chunk.words.length - 1].end;
};

/** Silêncio antes da primeira palavra, em segundos. */
export const headHandle = (scene: SceneDef) => scene.chunks[0].words[0].start;

/** Silêncio depois da última palavra, em segundos. */
export const tailHandle = (scene: SceneDef) =>
  scene.trimEnd - scene.trimStart - lastWordEnd(scene);

export const sceneFrames = (scenes: SceneDef[], fps: number) =>
  scenes.map((s) => Math.round((s.trimEnd - s.trimStart) * fps));

/**
 * A emenda depois de cada cena, medida do próprio material.
 *
 * Ela consome o mesmo tempo das duas vizinhas, então o que cabe é o menor
 * entre a folga da cauda de quem sai e a da cabeça de quem entra. Take que já
 * começa falando não tem cabeça para a emenda morder, e ali o corte entra seco
 * — foi o que aconteceu com o 8417 do firewall.
 *
 * O último valor é a entrada do cartão final.
 */
export const transitionsFor = (scenes: SceneDef[], fps: number): number[] => {
  const between = scenes.slice(0, -1).map((scene, i) => {
    const room = Math.min(tailHandle(scene), headHandle(scenes[i + 1]));
    const frames = Math.min(MAX_TRANSITION, Math.floor(room * fps));
    return frames < MIN_TRANSITION ? 0 : frames;
  });

  const last = scenes[scenes.length - 1];
  const toEndCard = Math.min(
    END_CARD_TRANSITION,
    Math.floor(tailHandle(last) * fps),
  );

  return [...between, toEndCard];
};

export const totalFrames = (
  scenes: SceneDef[],
  endCardSeconds: number,
  fps: number,
) =>
  sceneFrames(scenes, fps).reduce((a, b) => a + b, 0) +
  Math.round(endCardSeconds * fps) -
  transitionsFor(scenes, fps).reduce((a, b) => a + b, 0);

/** Frame em que o cartão final entra, já descontadas as emendas. */
export const endCardStart = (
  scenes: SceneDef[],
  endCardSeconds: number,
  fps: number,
) =>
  totalFrames(scenes, endCardSeconds, fps) - Math.round(endCardSeconds * fps);
