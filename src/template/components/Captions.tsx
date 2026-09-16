import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { useStyle } from "../StyleContext";
import { SAFE_X } from "../layout";
import type { CaptionChunk } from "../types";

/**
 * Legenda sincronizada palavra a palavra. Dois comportamentos, conforme o
 * estilo da peça:
 *
 * `preview` mostra o trecho inteiro e escurece o que ainda não foi dito — o
 * olho lê a frase antes de ouvi-la, que é como a maior parte das pessoas
 * assiste, no mudo.
 *
 * `reveal` não adianta nada: cada palavra entra no instante em que é falada,
 * com uma aparição curta. Dá mais ritmo e é o que o vídeo de referência faz.
 */
export const Captions: React.FC<{ chunks: CaptionChunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = useBrand();
  const { captions } = useStyle();
  const colors = brand.colors;
  const fontFamily = captions.fontFamily ?? brand.fontFamily;
  const t = frame / fps;
  /**
   * No modo `reveal` o trecho troca exatamente quando a primeira palavra dele
   * começa. Qualquer antecipação abre um buraco: o trecho novo entra em cena
   * mas ainda não tem palavra nenhuma para mostrar, e a tela fica vazia.
   */
  const LEAD = captions.reveal === "reveal" ? 0 : 0.16;

  const index = chunks.findIndex(
    (c, i) =>
      t >= c.words[0].start - LEAD &&
      (i === chunks.length - 1 || t < chunks[i + 1].words[0].start - LEAD),
  );
  if (index === -1) return null;

  const chunk = chunks[index];
  /**
   * O corte já aparou o silêncio da cabeça, então a primeira palavra da cena
   * cai um pouco antes do primeiro quadro. Sem travar em zero, a entrada do
   * primeiro trecho de cada cena já chegaria pronta e ele apareceria de
   * estalo, no meio do corte.
   */
  const startsAt = Math.max(0, chunk.words[0].start - LEAD);
  const appear = spring({
    frame: frame - Math.round(startsAt * fps),
    fps,
    config: { damping: 200, mass: 0.45 },
    durationInFrames: captions.enterFrames ?? 8,
  });

  /**
   * O trecho também sai de cena, e não some no talho: some subindo nos últimos
   * quadros antes do próximo entrar. O último trecho da cena não tem próximo,
   * então usa a última palavra como referência — se o corte chegar primeiro,
   * ele corta a saída, e isso não faz mal.
   */
  const next = chunks[index + 1];
  const lastWord = chunk.words[chunk.words.length - 1];
  const endsAt = next ? next.words[0].start - LEAD : lastWord.end + 0.35;

  /**
   * A saída só cabe no silêncio entre um trecho e o seguinte. Quando eles vêm
   * colados — que é o caso na maior parte da fala —, animar a saída apagaria a
   * última palavra enquanto ela ainda está sendo dita. Aí o trecho simplesmente
   * dá lugar ao próximo, e é a entrada dele que carrega o movimento.
   */
  const slack = Math.max(0, endsAt - lastWord.end);
  const exitSeconds = Math.min((captions.exitFrames ?? 0) / fps, slack);
  const leaving =
    exitSeconds > 0
      ? interpolate(t, [endsAt - exitSeconds, endsAt], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const alive = appear * (1 - leaving);

  const anchor =
    captions.anchor === "top"
      ? { top: captions.offset }
      : { bottom: captions.offset };

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        ...anchor,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `0px ${Math.round(captions.fontSize * 0.22)}px`,
        opacity: captions.reveal === "reveal" ? 1 - leaving : alive,
        transform: [
          `translateY(${
            (captions.reveal === "reveal"
              ? 0
              : interpolate(appear, [0, 1], [22, 0])) -
            leaving * 24
          }px)`,
          `scale(${1 - leaving * 0.04})`,
        ].join(" "),
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < w.end;
        const spoken = t >= w.start;

        // no modo `reveal` cada palavra tem a própria entrada, de 5 quadros
        const own =
          captions.reveal === "reveal"
            ? spring({
                frame: frame - Math.round(w.start * fps),
                fps,
                config: { damping: 200, mass: 0.4 },
                durationInFrames: 5,
              })
            : 1;
        if (captions.reveal === "reveal" && own === 0) return null;

        const pill = captions.highlight === "pill" && active;
        const dim =
          captions.reveal === "preview" && !spoken
            ? 0.58
            : captions.reveal === "reveal"
              ? own
              : 1;

        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: captions.fontWeight,
              fontSize: captions.fontSize,
              lineHeight: captions.lineHeight,
              letterSpacing: -1,
              textTransform: captions.lowercase ? "lowercase" : undefined,
              color: pill
                ? colors.white
                : captions.highlight === "pill" && w.hl
                  ? colors.primaryLight
                  : colors.white,
              background: pill ? colors.primary : "transparent",
              borderRadius: 14,
              padding: captions.highlight === "pill" ? "2px 14px" : "0 2px",
              opacity: dim,
              textShadow: pill
                ? "none"
                : "0 4px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.7)",
              transform: `scale(${pill ? 1.04 : 1})`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
