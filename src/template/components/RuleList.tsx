import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { GRAPHICS_TOP, SAFE_X } from "../layout";
import type { RuleItem, Tone } from "../types";

const GLYPH: Record<Tone, string> = { ok: "✓", question: "?", risk: "!" };

const Row: React.FC<{ item: RuleItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, fontFamily } = useBrand();
  const tone = item.tone ?? "ok";

  // sem `at`, a ficha vem da cena anterior e não deve reanimar no corte
  const enter =
    item.at === undefined
      ? 1
      : spring({
          frame: frame - Math.round(item.at * fps),
          fps,
          config: { damping: 200, mass: 0.6 },
          durationInFrames: 15,
        });

  if (enter === 0) return null;

  const risk = tone === "risk";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "22px 34px",
        borderRadius: 22,
        background: risk ? `${colors.ink}9E` : `${colors.primary}E0`,
        border: risk
          ? "2px dashed rgba(255,255,255,0.45)"
          : "2px solid rgba(255,255,255,0.18)",
        boxShadow: risk ? "none" : "0 14px 38px rgba(0,0,0,0.3)",
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-46, 0])}px)`,
      }}
    >
      <span
        style={{
          flex: "0 0 auto",
          width: 52,
          height: 52,
          borderRadius: 999,
          background: risk ? colors.neutral : colors.white,
          color: risk ? colors.white : colors.primary,
          fontFamily,
          fontWeight: 800,
          fontSize: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {GLYPH[tone]}
      </span>
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.16,
          letterSpacing: -0.5,
          color: colors.white,
        }}
      >
        {item.text}
      </span>
    </div>
  );
};

/**
 * Fichas que vão se acumulando ao longo de um bloco do roteiro.
 *
 * Um manual de marca raramente tem cor de alerta. O risco aqui não é vermelho:
 * é a mesma ficha escurecida, de borda tracejada, como algo que saiu do padrão.
 * A cor da marca fica reservada para o que está sob controle, e a diferença
 * entre as duas se lê sozinha.
 */
export const RuleList: React.FC<{ items: RuleItem[]; top?: number }> = ({
  items,
  top = GRAPHICS_TOP,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: SAFE_X,
      right: SAFE_X,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 18,
    }}
  >
    {items.map((item) => (
      <Row key={item.text} item={item} />
    ))}
  </div>
);
