import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { CAPTION_BOTTOM, SAFE_X } from "../layout";
import type { CaptionChunk } from "../types";

/**
 * Legenda sincronizada palavra a palavra: mostra um trecho por vez e acende a
 * palavra que está sendo dita. Os trechos são curtos de propósito — a peça é
 * feita de muitos takes emendados, e linha curta deixa o corte respirar.
 *
 * A palavra ativa vira pílula da cor da marca; os termos que carregam o
 * sentido (`hl`) já entram coloridos antes de serem ditos, para o olho pegar a
 * ideia mesmo com o vídeo mudo — que é como a maior parte das pessoas assiste.
 */
export const Captions: React.FC<{ chunks: CaptionChunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, fontFamily } = useBrand();
  const t = frame / fps;
  const LEAD = 0.16;

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

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        bottom: CAPTION_BOTTOM,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px 14px",
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [22, 0])}px)`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < w.end;
        const spoken = t >= w.start;
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.14,
              letterSpacing: -1,
              color: active
                ? colors.white
                : w.hl
                  ? colors.primaryLight
                  : colors.white,
              background: active ? colors.primary : "transparent",
              borderRadius: 14,
              padding: "2px 14px",
              opacity: spoken ? 1 : 0.58,
              textShadow: active
                ? "none"
                : "0 4px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.7)",
              transform: `scale(${active ? 1.04 : 1})`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
