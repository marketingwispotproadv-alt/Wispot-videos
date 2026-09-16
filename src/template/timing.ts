import type { SceneDef, Style } from "./types";

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

/**
 * Silêncio nas pontas da cena, em segundos.
 *
 * Prefere o que foi medido do áudio. Os tempos da legenda só entram como
 * recurso para cena sem medição, e são um mau substituto: o Whisper marca a
 * primeira palavra antes de o som sair e estica a última até o fim do
 * segmento, então eles inventam folga na cabeça e escondem a falta dela na
 * cauda.
 */
export const silenceOf = (scene: SceneDef) =>
  scene.silence ?? {
    head: scene.chunks[0].words[0].start,
    tail: scene.trimEnd - scene.trimStart - lastWordEnd(scene),
  };

/**
 * Apara o silêncio que passa do que o estilo pede e leva a legenda junto.
 *
 * Só tira; nunca acrescenta folga que a cena não tenha. Cortar aqui, e não no
 * `scenes.ts`, é o que deixa os dois estilos partirem do mesmo material: o
 * corte com borrão guarda o silêncio de que a emenda precisa, e o de corte
 * seco fica com a fala quase colada.
 */
export const tighten = (scene: SceneDef, style: Style): SceneDef => {
  const silence = silenceOf(scene);
  const cutHead = Math.max(0, silence.head - style.lead.head);
  const cutTail = Math.max(0, silence.tail - style.lead.tail);
  if (cutHead === 0 && cutTail === 0) return scene;

  return {
    ...scene,
    trimStart: scene.trimStart + cutHead,
    trimEnd: scene.trimEnd - cutTail,
    silence: {
      head: silence.head - cutHead,
      tail: silence.tail - cutTail,
    },
    chunks: scene.chunks.map((chunk) => ({
      words: chunk.words.map((w) => ({
        ...w,
        start: Math.round((w.start - cutHead) * 100) / 100,
        end: Math.round((w.end - cutHead) * 100) / 100,
      })),
    })),
  };
};

export const tightenAll = (scenes: SceneDef[], style: Style) =>
  scenes.map((s) => tighten(s, style));

export const sceneFrames = (scenes: SceneDef[], fps: number) =>
  scenes.map((s) => Math.round((s.trimEnd - s.trimStart) * fps));

/**
 * A emenda depois de cada cena, medida do próprio material.
 *
 * Ela consome o mesmo tempo das duas vizinhas, então o que cabe é o menor
 * entre o silêncio da cauda de quem sai e o da cabeça de quem entra. Take que
 * já começa falando não tem cabeça para a emenda morder, e ali o corte entra
 * seco.
 *
 * Com `transitions: "cut"` só sobra a entrada do cartão final: sem ela a peça
 * termina num salto para uma imagem que não tem nada a ver com o resto.
 *
 * O último valor é sempre a entrada do cartão final.
 */
export const transitionsFor = (
  scenes: SceneDef[],
  fps: number,
  style: Style,
): number[] => {
  const between = scenes.slice(0, -1).map((scene, i) => {
    if (style.transitions === "cut") return 0;
    const room = Math.min(silenceOf(scene).tail, silenceOf(scenes[i + 1]).head);
    const frames = Math.min(MAX_TRANSITION, Math.floor(room * fps));
    return frames < MIN_TRANSITION ? 0 : frames;
  });

  // A entrada do cartão final não depende de silêncio: o cartão é mudo, então
  // não há duas falas para se sobreporem — só a imagem atravessa.
  return [...between, END_CARD_TRANSITION];
};

export const totalFrames = (
  scenes: SceneDef[],
  endCardSeconds: number,
  fps: number,
  style: Style,
) => {
  const tight = tightenAll(scenes, style);
  return (
    sceneFrames(tight, fps).reduce((a, b) => a + b, 0) +
    Math.round(endCardSeconds * fps) -
    transitionsFor(tight, fps, style).reduce((a, b) => a + b, 0)
  );
};

/** Frame em que o cartão final entra, já descontadas as emendas. */
export const endCardStart = (
  scenes: SceneDef[],
  endCardSeconds: number,
  fps: number,
  style: Style,
) =>
  totalFrames(scenes, endCardSeconds, fps, style) -
  Math.round(endCardSeconds * fps);
