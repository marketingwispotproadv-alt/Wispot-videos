import React from "react";
import { interpolate } from "remotion";
import { Check, pressScale, SCREEN, text } from "../demos/kit";

/**
 * Telas de celular reaproveitadas pelos explainers, no espaço da tela do
 * `Phone` (SCREEN.w × SCREEN.h).
 */

/** artes de fundo das campanhas (no lugar das fotos do vídeo antigo) */
export const THEMES = {
  black: { bg: "linear-gradient(165deg, #2A2D34 0%, #111317 70%)", dots: "#FFFFFF" },
  summer: { bg: "linear-gradient(165deg, #FFB547 0%, #FF6F61 55%, #2FB3B8 100%)", dots: "#FFF4D6" },
  xmas: { bg: "linear-gradient(165deg, #C7303B 0%, #7A1219 75%)", dots: "#FFE3A3" },
  hotel: { bg: "linear-gradient(165deg, #2E86C1 0%, #1B4F72 60%, #0E2F44 100%)", dots: "#D6EEFF" },
  coffee: { bg: "linear-gradient(165deg, #A9744F 0%, #5B3A24 70%)", dots: "#FFE7C7" },
  night: { bg: "linear-gradient(165deg, #3D2C8D 0%, #1C1446 70%)", dots: "#D9CCFF" },
  sunset: { bg: "linear-gradient(165deg, #F46904 0%, #C2185B 80%)", dots: "#FFE0C2" },
} as const;
export type ThemeId = keyof typeof THEMES;

/** fundo da arte: degradê com bolhas, para não ficar chapado */
export const ThemeArt: React.FC<{ theme: ThemeId; style?: React.CSSProperties }> = ({ theme, style }) => {
  const th = THEMES[theme];
  return (
    <div style={{ position: "absolute", inset: 0, background: th.bg, overflow: "hidden", ...style }}>
      {[
        [80, 200, 160],
        [430, 120, 220],
        [380, 520, 120],
        [60, 640, 90],
      ].map(([x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: 999, background: th.dots, opacity: 0.1 }} />
      ))}
    </div>
  );
};

/** espaço da logo do cliente — o portal é white label */
export const BrandSlot: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    style={{
      padding: "10px 28px",
      border: `3px dashed ${dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.85)"}`,
      borderRadius: 14,
      ...text(22, 800, dark ? "#7B8592" : "#fff", { letterSpacing: 3 }),
    }}
  >
    SUA MARCA
  </div>
);

export type LoginKind = "facebook" | "google" | "email" | "sms" | "voucher" | "pix";

const LOGIN: Record<LoginKind, { label: string; bg: string; fg: string; glyph: string }> = {
  facebook: { label: "Conecte-se com Facebook", bg: "#1877F2", fg: "#fff", glyph: "f" },
  google: { label: "Conecte-se com Google", bg: "#FFFFFF", fg: "#3C4043", glyph: "G" },
  email: { label: "Conecte-se com E-mail", bg: "#FFFFFF", fg: "#3C4043", glyph: "@" },
  sms: { label: "Conecte-se com SMS", bg: "#25A8E0", fg: "#fff", glyph: "✉" },
  voucher: { label: "Tenho um voucher", bg: "#FFFFFF", fg: "#3C4043", glyph: "#" },
  pix: { label: "Pagar com Pix ou cartão", bg: "#32BCAD", fg: "#fff", glyph: "$" },
};

export const LoginButton: React.FC<{ kind: LoginKind; t: number; pressAt?: number; color?: string }> = ({ kind, t, pressAt, color }) => {
  const l = LOGIN[kind];
  const bg = color ?? l.bg;
  return (
    <div
      style={{
        height: 76,
        borderRadius: 18,
        background: bg,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 26px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
        transform: `scale(${pressScale(t, pressAt)})`,
        ...text(24, 800, color ? "#fff" : l.fg),
      }}
    >
      <span style={{ width: 34, textAlign: "center", ...text(30, 900, color ? "#fff" : kind === "google" ? "#4285F4" : l.fg) }}>{l.glyph}</span>
      {l.label}
    </div>
  );
};

/**
 * Portal de entrada (captive portal) com arte de campanha em cima e as opções
 * de login embaixo, no layout das telas reais do Drive.
 */
export const PortalScreen: React.FC<{
  theme: ThemeId;
  eyebrow?: string;
  title: React.ReactNode;
  badge?: React.ReactNode;
  logins: LoginKind[];
  t: number;
  pressAt?: number;
  buttonColor?: string;
}> = ({ theme, eyebrow, title, badge, logins, t, pressAt, buttonColor }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <ThemeArt theme={theme} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BrandSlot />
      {eyebrow && <div style={{ marginTop: 40, ...text(26, 700, "rgba(255,255,255,0.9)", { letterSpacing: 3 }) }}>{eyebrow}</div>}
      <div style={{ marginTop: 8, padding: "0 40px", textAlign: "center", ...text(58, 900, "#fff", { lineHeight: 1.02, letterSpacing: -1.5 }) }}>{title}</div>
      {badge && <div style={{ marginTop: 26 }}>{badge}</div>}
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 90, display: "flex", flexDirection: "column", gap: 16 }}>
      {logins.map((k, i) => (
        <LoginButton key={k} kind={k} t={t} pressAt={i === 0 ? pressAt : undefined} color={i === 0 ? buttonColor : undefined} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center", ...text(17, 600, "rgba(255,255,255,0.8)") }}>
      Termos de uso · Política de privacidade
    </div>
  </div>
);

/** Selo de desconto redondo. */
export const DiscountBadge: React.FC<{ value: string; color: string; p?: number }> = ({ value, color, p = 1 }) => (
  <div
    style={{
      width: 200,
      height: 200,
      borderRadius: 999,
      background: color,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-30, -8])}deg)`,
      opacity: Math.min(1, p * 1.5),
    }}
  >
    <div style={text(70, 900, "#fff", { lineHeight: 1, letterSpacing: -3 })}>{value}</div>
    <div style={text(30, 900, "#fff", { letterSpacing: 4 })}>OFF</div>
  </div>
);

/** Tela de confirmação (check grande, título e detalhe). */
export const SuccessScreen: React.FC<{ color: string; title: string; detail: string; t: number; at: number }> = ({ color, title, detail, t, at }) => {
  const p = interpolate(t, [at, at + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        opacity: p,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[0, 1, 2].map((i) => {
        const r = (((t - at) * 0.7 + i / 3) % 1 + 1) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: SCREEN.h / 2 - 220,
              width: 240,
              height: 240,
              borderRadius: 999,
              border: "3px solid rgba(255,255,255,0.5)",
              opacity: 1 - r,
              transform: `scale(${1 + r * 1.2})`,
            }}
          />
        );
      })}
      <div style={{ marginTop: -100, transform: `scale(${0.6 + p * 0.4})` }}>
        <Check size={240} color={color} bg="#fff" p={interpolate(t, [at + 0.2, at + 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </div>
      <div style={{ marginTop: 50, ...text(50, 900, "#fff") }}>{title}</div>
      <div style={{ marginTop: 12, padding: "0 50px", textAlign: "center", ...text(26, 600, "rgba(255,255,255,0.88)") }}>{detail}</div>
    </div>
  );
};
