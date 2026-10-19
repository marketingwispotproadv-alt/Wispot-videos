import React, { useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { FONT_FAMILY } from "../brand";
import { OnBlue } from "../explainers/ex-kit";

/**
 * Identidade de movimento das histórias, montada com a skill de motion design
 * da LottieFiles (.claude/skills/motion-design):
 *
 * - personalidade "Energetic" na narrativa e "Corporate" nas telas de produto;
 * - curva-assinatura: expo de saída para entradas, aceleração para saídas e
 *   in-out para movimentos de câmera — nunca linear em deslocamento;
 * - paleta de durações: rápida 0,25 s · padrão 0,4 s · lenta 0,7 s;
 * - entrada padrão: sobe por trás de uma máscara, com stagger abaixo de 0,5 s.
 */

export const EASE = {
  /** entradas: começa rápido e pousa suave (expo out) */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** saídas: começa devagar e acelera */
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** câmera e deslocamentos em cena */
  move: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const DUR = { quick: 0.25, std: 0.4, slow: 0.7 } as const;

/** 0 → 1 entre `a` e `a + d` segundos com a curva escolhida. */
export const tween = (t: number, a: number, d: number = DUR.std, ease = EASE.out) =>
  interpolate(t, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** mola com ~15% de passagem, para estouros de sucesso (Energetic) */
export const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  if (x <= 0) return 0;
  return 1 - Math.exp(-x * 9) * Math.cos(x * 15);
};

export const useSeconds = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ------------------------------------------------------------------ */
/* Tipografia cinética                                                  */
/* ------------------------------------------------------------------ */

/**
 * Frases que entram palavra por palavra, subindo por trás de uma máscara.
 * `*palavra*` vira destaque na cor do produto, com um traço que corre por
 * baixo logo depois que ela pousa (ação secundária).
 */
export const Kinetic: React.FC<{
  lines: string[];
  at: number;
  until?: number;
  size?: number;
  color?: string;
  accent: string;
  align?: "left" | "center";
  left?: number;
  top?: number;
  width?: number;
  weight?: number;
  shadow?: boolean;
  /** tarja atrás de cada linha; abre antes das palavras (ação secundária) */
  plate?: string;
}> = ({ lines, at, until = 999, size = 110, color = "#fff", accent, align = "center", left = 0, top = 380, width = 1920, weight = 900, shadow = true, plate }) => {
  const t = useSeconds();
  const onBlue = useContext(OnBlue);
  if (t < at - 0.05 || t > until + DUR.quick + 0.05) return null;
  const words = lines.map((l) => l.split(" "));
  const ink = readable(accent);
  const total = words.flat().length;
  // stagger dentro do orçamento de 0,5 s da skill
  const step = Math.min(0.07, 0.45 / Math.max(1, total));
  let k = 0;
  return (
    <div style={{ position: "absolute", left, top, width, textAlign: align, zIndex: 70 }}>
      {words.map((ws, li) => (
        <div key={li} style={{ marginBottom: plate ? size * 0.14 : -size * 0.06 }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: size * 0.12,
              padding: plate ? `${size * 0.1}px ${size * 0.3}px ${size * 0.16}px ${size * 0.3}px` : undefined,
            }}
          >
          {plate && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: size * 0.18,
                background: plate,
                boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
                transform: `scaleX(${tween(t, at - 0.1 + li * 0.08, DUR.std) * (1 - tween(t, until + 0.05, DUR.quick, EASE.in))})`,
                transformOrigin: align === "center" ? "center" : "left center",
              }}
            />
          )}
          {ws.map((w, wi) => {
            const i = k++;
            const isAccent = w.startsWith("*") && w.replace(/[.,!?…]+$/, "").endsWith("*");
            const clean = w.replace(/\*/g, "");
            const enter = tween(t, at + i * step, DUR.std);
            const leave = tween(t, until + i * 0.015, DUR.quick, EASE.in);
            const y = (1 - enter) * 110 - leave * 110;
            const line = tween(t, at + i * step + 0.25, DUR.quick);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  position: "relative",
                  marginRight: wi < ws.length - 1 ? size * 0.26 : 0,
                  transform: `translateY(${y}%) rotate(${(1 - enter) * 4}deg)`,
                  fontFamily: FONT_FAMILY,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: 1.05,
                  letterSpacing: -size * 0.03,
                  color: isAccent ? (onBlue ? ink : accent) : color,
                  textShadow: shadow && !(isAccent && onBlue) ? "0 8px 30px rgba(0,0,0,0.25)" : "none",
                  ...(isAccent && onBlue
                    ? { background: "#fff", padding: `0 ${size * 0.16}px`, borderRadius: size * 0.16, boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }
                    : {}),
                }}
              >
                {clean}
                {isAccent && !onBlue && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -size * 0.04,
                      height: size * 0.09,
                      borderRadius: 99,
                      background: accent,
                      transform: `scaleX(${line})`,
                      transformOrigin: "left center",
                    }}
                  />
                )}
              </span>
            );
          })}
          </div>
        </div>
      ))}
    </div>
  );
};

/** escurece cores claras demais para serem lidas sobre branco */
const readable = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum < 0.5) return hex;
  const k = 0.5 / lum;
  return `rgb(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)})`;
};

/** Etiqueta pequena (lugar, hora) no canto, como legenda de cena. */
export const Tag: React.FC<{ text: string; at: number; until?: number; accent: string; left?: number; top?: number; dark?: boolean }> = ({
  text,
  at,
  until = 999,
  accent,
  left = 80,
  top = 70,
  dark,
}) => {
  const t = useSeconds();
  const p = tween(t, at, DUR.std) * (1 - tween(t, until, DUR.quick, EASE.in));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px 12px 16px",
        borderRadius: 999,
        background: dark ? "rgba(8,22,48,0.85)" : "#fff",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: 30,
        color: dark ? "#fff" : "#1B2430",
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: 99, background: accent }} />
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Câmera                                                               */
/* ------------------------------------------------------------------ */

export type CamKey = { t: number; x: number; y: number; z: number };

/**
 * Câmera sobre uma cena de 1920 × 1080: cada chave diz para onde ela olha
 * (x, y) e o zoom (z). Entre chaves anda em ease-in-out (pose a pose), e por
 * cima corre uma deriva bem pequena, para o quadro nunca ficar morto (camada
 * ambiente). `punch` dá um tranco curto de zoom num impacto.
 */
export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode; punch?: number[] }> = ({ keys, children, punch = [] }) => {
  const t = useSeconds();
  let { x, y } = keys[0];
  let z = keys[0].z;
  for (let i = 1; i < keys.length; i++) {
    const p = interpolate(t, [keys[i - 1].t, keys[i].t], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.move });
    x += (keys[i].x - x) * p;
    y += (keys[i].y - y) * p;
    z += (keys[i].z - z) * p;
  }
  const kick = punch.reduce((acc, at) => {
    const d = t - at;
    return d < 0 || d > 0.35 ? acc : acc + Math.sin((d / 0.35) * Math.PI) * 0.04;
  }, 0);
  const zz = z * (1 + kick);
  // nunca mostra fora da cena de 1920 × 1080
  x = Math.min(Math.max(x, 960 / zz + 6), 1920 - 960 / zz - 6);
  y = Math.min(Math.max(y, 540 / zz + 6), 1080 - 540 / zz - 6);
  const dx = Math.sin(t * 0.8) * 4;
  const dy = Math.cos(t * 0.6) * 3;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${960 - x * zz + dx}px, ${540 - y * zz + dy}px) scale(${zz}) rotate(${Math.sin(t * 0.5) * 0.25}deg)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Emendas                                                              */
/* ------------------------------------------------------------------ */

export type CutKind = "whip" | "zoom" | "flash";

/**
 * Emendas curtas (8–10 quadros): chicote lateral com borrão de movimento,
 * mergulho de zoom e clarão branco (para entrar nas cenas 3D).
 */
const CutPresentation: React.FC<TransitionPresentationComponentProps<{ kind: CutKind }>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const entering = presentationDirection === "entering";
  const e = EASE.move(p);
  let style: React.CSSProperties = {};
  if (passedProps.kind === "whip") {
    const blur = Math.sin(e * Math.PI) * 26;
    style = entering
      ? { transform: `translateX(${(1 - e) * 600}px)`, filter: `blur(${blur}px)`, opacity: Math.min(1, e * 2) }
      : { transform: `translateX(${-e * 600}px)`, filter: `blur(${blur}px)`, opacity: Math.min(1, (1 - e) * 2) };
  } else if (passedProps.kind === "zoom") {
    style = entering
      ? { transform: `scale(${0.8 + 0.2 * e})`, filter: `blur(${(1 - e) * 18}px)`, opacity: e }
      : { transform: `scale(${1 + e * 0.6})`, filter: `blur(${e * 18}px)`, opacity: 1 - e };
  } else {
    style = entering ? { opacity: e > 0.5 ? 1 : 0 } : { opacity: e > 0.5 ? 0 : 1 };
  }
  return (
    <AbsoluteFill style={style}>
      {children}
      {passedProps.kind === "flash" && entering && (
        <AbsoluteFill style={{ background: "#fff", opacity: 1 - Math.abs(p - 0.5) * 2 }} />
      )}
    </AbsoluteFill>
  );
};

export const cut = (kind: CutKind): TransitionPresentation<{ kind: CutKind }> => ({
  component: CutPresentation,
  props: { kind },
});
