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
  const { colors, fontFamily } = useBrand();
  const { captions } = useStyle();
  const t = frame / fps;
  const LEAD = captions.reveal === "reveal" ? 0.05 : 0.16;

  const index = chunks.findIndex(
    (c, i) =>
      t >= c.words[0].start - LEAD &&
      (i === chunks.length - 1 || t < chunks[i + 1].words[0].start - LEAD),
  );
  if (index === -1) return null;

  const chunk = chunks[index];
  const appear = spring({
    frame: frame - Math.round((chunk.words[0].start - LEAD) * fps),
    fps,
    config: { damping: 200, mass: 0.45 },
    durationInFrames: 8,
  });

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
        opacity: captions.reveal === "reveal" ? 1 : appear,
        transform:
          captions.reveal === "reveal"
            ? undefined
            : `translateY(${interpolate(appear, [0, 1], [22, 0])}px)`,
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
