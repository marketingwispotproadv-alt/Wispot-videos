import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, blueAlpha } from "../../brands/proadvanced";
import { GRAPHICS_TOP, SAFE_X } from "../layout";

/**
 * `ok` = o que o firewall faz, e o que a ProAdvanced faz.
 * `question` = a dúvida da abertura: instalado não quer dizer protegido.
 * `risk` = a regra que envelheceu.
 *
 * O manual da ProAdvanced não tem cor de alerta — só azul, cinza e branco. O
 * risco então não é vermelho: é a mesma ficha escurecida, de borda tracejada,
 * como algo que saiu do padrão. O azul fica reservado para o que está sob
 * controle, e a diferença entre as duas colunas se lê sozinha.
 */
export type Tone = "ok" | "question" | "risk";

export type RuleItem = {
  text: string;
  tone?: Tone;
  /** segundo em que entra; sem isso, já está em cena desde o primeiro quadro */
  at?: number;
};

const GLYPH: Record<Tone, string> = { ok: "✓", question: "?", risk: "!" };

const Row: React.FC<{ item: RuleItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
        background: risk ? "rgba(27,28,28,0.62)" : blueAlpha(0.88),
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
          background: risk ? COLORS.gray : COLORS.white,
          color: risk ? COLORS.white : COLORS.blue,
          fontFamily: FONT_FAMILY,
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
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.16,
          letterSpacing: -0.5,
          color: COLORS.white,
        }}
      >
        {item.text}
      </span>
    </div>
  );
};

/** Fichas que vão se acumulando ao longo de um bloco do roteiro. */
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
