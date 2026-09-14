import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SAFE_X } from "../brand";
import type { CaptionChunk } from "../data/script";

/**
 * `footage` = legenda sobre a imagem: texto branco, palavra ativa em azul.
 * `brand` = legenda sobre o degradê da marca, onde azul sobre azul sumiria:
 * a palavra ativa inverte para pílula branca com texto azul.
 */
export type CaptionVariant = "footage" | "brand";

/**
 * Legenda sincronizada palavra a palavra. Mostra um trecho por vez e realça a
 * palavra que está sendo dita; termos-chave (`hl`) recebem destaque.
 */
export const Captions: React.FC<{
  chunks: CaptionChunk[];
  variant?: CaptionVariant;
}> = ({ chunks, variant = "footage" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const index = chunks.findIndex(
    (c, i) =>
      t >= c.words[0].start - 0.18 &&
      (i === chunks.length - 1 || t < chunks[i + 1].words[0].start - 0.18),
  );
  if (index === -1) return null;

  const chunk = chunks[index];
  const appear = spring({
    frame: frame - Math.round((chunk.words[0].start - 0.18) * fps),
    fps,
    config: { damping: 200, mass: 0.5 },
    durationInFrames: 9,
  });
  const onBrand = variant === "brand";

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        bottom: 250,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px 14px",
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [26, 0])}px)`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < w.end;
        const spoken = t >= w.start;
        const color = active
          ? onBrand
            ? COLORS.blueDeep
            : COLORS.white
          : w.hl && !onBrand
            ? COLORS.blue
            : COLORS.white;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 68,
              lineHeight: 1.16,
              letterSpacing: -1,
              color,
              background: active
                ? onBrand
                  ? COLORS.white
                  : COLORS.blue
                : "transparent",
              borderRadius: 16,
              padding: "2px 14px",
              // palavras ainda não ditas ficam levemente recuadas
              opacity: spoken ? 1 : onBrand ? 0.66 : 0.55,
              textShadow: active
                ? "none"
                : onBrand
                  ? "0 3px 14px rgba(0,0,0,0.3)"
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
