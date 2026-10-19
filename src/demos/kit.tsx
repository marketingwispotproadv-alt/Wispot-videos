import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_FAMILY } from "../brand";

/**
 * Kit das animações de demonstração. Tudo aqui trabalha em segundos contados
 * a partir do início da cena — cada passo da demo é uma cena própria dentro da
 * TransitionSeries, então `useCurrentFrame` já chega zerado.
 */

export const INK = "#1B2430";
export const MUTED = "#6B7684";
export const LINE = "#E3E8EE";
export const SURFACE = "#F6F8FB";

const OUT = Easing.bezier(0.33, 1, 0.68, 1);

/** Tempo da cena em segundos. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0 → 1 entre `a` e `b` segundos, com saída suave. */
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: OUT,
  });

/** Entrada com mola, a partir de `at` segundos. */
export const usePop = (at: number, bouncy = false) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: bouncy
      ? { damping: 12, mass: 0.6, stiffness: 150 }
      : { damping: 200, mass: 0.7 },
    durationInFrames: bouncy ? undefined : 16,
  });
};

/** Estilo de entrada padrão: sobe e aparece. */
export const rise = (p: number, dist = 30): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${interpolate(p, [0, 1], [dist, 0])}px)`,
});

/** Texto sendo digitado. */
export const typed = (text: string, t: number, start: number, cps = 16) => {
  const n = Math.floor(Math.max(0, t - start) * cps);
  return text.slice(0, Math.min(n, text.length));
};

export const typingEnd = (text: string, start: number, cps = 16) =>
  start + text.length / cps;

const nf = (decimals: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Número subindo de `from` até `to` entre `a` e `b` segundos. */
export const count = (
  t: number,
  a: number,
  b: number,
  to: number,
  { from = 0, decimals = 0 }: { from?: number; decimals?: number } = {},
) => nf(decimals).format(from + (to - from) * ramp(t, a, b));

/** Cursor piscando no fim de um campo enquanto ele está em foco. */
export const Caret: React.FC<{ t: number; from: number; to: number }> = ({
  t,
  from,
  to,
}) => {
  if (t < from || t > to) return null;
  const on = Math.floor((t - from) * 2.4) % 2 === 0 || t < to - 0.4;
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: "1.05em",
        marginLeft: 2,
        verticalAlign: "-0.15em",
        background: "currentColor",
        opacity: on ? 1 : 0,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Ponteiro do mouse e toque no celular                                 */
/* ------------------------------------------------------------------ */

type Key = { t: number; x: number; y: number };

/**
 * Ponteiro que percorre `keys` (cada uma é o ponto e o instante em que ele
 * chega lá) e clica nos instantes de `clicks`. As coordenadas são as do
 * container em que ele é renderizado.
 */
export const Cursor: React.FC<{
  keys: Key[];
  clicks?: number[];
  from?: number;
  until?: number;
}> = ({ keys, clicks = [], from = 0, until = 999 }) => {
  const t = useT();
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const start = Math.max(keys[i - 1].t, keys[i].t - 0.6);
    const p = ramp(t, start, keys[i].t);
    x += (keys[i].x - x) * p;
    y += (keys[i].y - y) * p;
  }
  const vis = ramp(t, from, from + 0.25) * (1 - ramp(t, until, until + 0.25));
  if (vis <= 0) return null;

  const click = clicks.find((c) => t >= c && t < c + 0.5);
  const d = click === undefined ? 1 : t - click;
  const press = click === undefined ? 1 : interpolate(d, [0, 0.08, 0.2], [1, 0.82, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 50,
        opacity: vis,
        pointerEvents: "none",
      }}
    >
      {click !== undefined && (
        <div
          style={{
            position: "absolute",
            left: -34,
            top: -34,
            width: 68,
            height: 68,
            borderRadius: 999,
            border: "4px solid rgba(37,168,224,0.8)",
            opacity: 1 - d / 0.5,
            transform: `scale(${0.4 + d * 1.6})`,
          }}
        />
      )}
      <svg
        width={46}
        height={46}
        viewBox="0 0 24 24"
        style={{
          transform: `scale(${press})`,
          transformOrigin: "4px 3px",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
        }}
      >
        <path
          d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/** Toque de dedo na tela do celular, em `at` segundos. */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const t = useT();
  const d = t - at;
  if (d < -0.25 || d > 0.55) return null;
  const dot = interpolate(d, [-0.25, -0.05, 0.05, 0.3], [0, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring = interpolate(d, [0, 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 50 }}>
      <div
        style={{
          position: "absolute",
          left: -36,
          top: -36,
          width: 72,
          height: 72,
          borderRadius: 999,
          background: "rgba(255,255,255,0.55)",
          border: "3px solid rgba(20,20,20,0.35)",
          opacity: dot,
          transform: `scale(${interpolate(d, [-0.25, 0.05], [1.3, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}
      />
      {d >= 0 && (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: -40,
            width: 80,
            height: 80,
            borderRadius: 999,
            border: "4px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.12)",
            opacity: 1 - ring,
            transform: `scale(${0.6 + ring * 1.2})`,
          }}
        />
      )}
    </div>
  );
};

/** Botão que afunda quando é clicado/tocado em `pressAt`. */
export const pressScale = (t: number, pressAt?: number) =>
  pressAt === undefined
    ? 1
    : interpolate(t - pressAt, [0, 0.08, 0.22], [1, 0.93, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

/* ------------------------------------------------------------------ */
/* Aparelhos                                                            */
/* ------------------------------------------------------------------ */

export const PHONE = { w: 560, h: 1150, bezel: 16 } as const;
export const SCREEN = {
  w: PHONE.w - PHONE.bezel * 2,
  h: PHONE.h - PHONE.bezel * 2,
} as const;

/**
 * Celular desenhado. Os filhos ficam no espaço da tela (SCREEN.w × SCREEN.h),
 * já abaixo da barra de status só se o conteúdo quiser — a barra é sobreposta.
 */
export const Phone: React.FC<{
  children?: React.ReactNode;
  left: number;
  top: number;
  scale?: number;
  screen?: string;
  darkStatus?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  left,
  top,
  scale = 1,
  screen = "#FFFFFF",
  darkStatus = true,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: PHONE.w,
      height: PHONE.h,
      borderRadius: 86,
      background: "#121417",
      padding: PHONE.bezel,
      boxShadow:
        "0 50px 90px rgba(16,30,54,0.28), 0 10px 24px rgba(16,30,54,0.18), inset 0 0 0 3px #2B2F35",
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: 70,
        overflow: "hidden",
        background: screen,
      }}
    >
      {children}
      <StatusBar dark={darkStatus} />
    </div>
  </div>
);

const StatusBar: React.FC<{ dark: boolean }> = ({ dark }) => {
  const c = dark ? "#111" : "#fff";
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          marginLeft: -78,
          width: 156,
          height: 44,
          borderRadius: 999,
          background: "#000",
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 52,
          right: 46,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 26,
          color: c,
          zIndex: 40,
        }}
      >
        <span>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={30} height={20} viewBox="0 0 30 20">
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={i * 8}
                y={14 - i * 4}
                width={5}
                height={6 + i * 4}
                rx={1.5}
                fill={c}
              />
            ))}
          </svg>
          <WifiGlyph size={26} color={c} />
          <svg width={40} height={20} viewBox="0 0 40 20">
            <rect
              x={1}
              y={1}
              width={33}
              height={18}
              rx={5}
              fill="none"
              stroke={c}
              strokeOpacity={0.5}
              strokeWidth={2}
            />
            <rect x={4} y={4} width={25} height={12} rx={3} fill={c} />
            <rect x={36} y={7} width={3} height={6} rx={1} fill={c} opacity={0.5} />
          </svg>
        </span>
      </div>
    </>
  );
};

export const WifiGlyph: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 24 18">
    <path
      d="M12 17.5 L15.2 13.6 A5 5 0 0 0 8.8 13.6 Z"
      fill={color}
    />
    <path
      d="M5.6 10.4 A9 9 0 0 1 18.4 10.4"
      stroke={color}
      strokeWidth={2.6}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M2 6.6 A14 14 0 0 1 22 6.6"
      stroke={color}
      strokeWidth={2.6}
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/** Janela de navegador para as telas do painel. */
export const Browser: React.FC<{
  children?: React.ReactNode;
  left: number;
  top: number;
  width: number;
  height: number;
  title: string;
  accent: string;
  style?: React.CSSProperties;
}> = ({ children, left, top, width, height, title, accent, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 30,
      background: "#FFFFFF",
      overflow: "hidden",
      boxShadow:
        "0 40px 80px rgba(16,30,54,0.20), 0 8px 22px rgba(16,30,54,0.12)",
      ...style,
    }}
  >
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 26px",
        background: "#EEF1F5",
        borderBottom: `1px solid ${LINE}`,
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span
          key={c}
          style={{ width: 16, height: 16, borderRadius: 99, background: c }}
        />
      ))}
      <div
        style={{
          marginLeft: 22,
          flex: 1,
          height: 38,
          borderRadius: 12,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 18px",
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 21,
          color: MUTED,
        }}
      >
        <span
          style={{ width: 12, height: 12, borderRadius: 99, background: accent }}
        />
        {title}
      </div>
    </div>
    <div style={{ position: "relative", height: height - 64 }}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Peças de interface                                                   */
/* ------------------------------------------------------------------ */

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontWeight: 600,
      fontSize: 20,
      color: MUTED,
      marginBottom: 8,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Campo de formulário; fica com a borda da cor de destaque quando em foco. */
export const Field: React.FC<{
  label?: string;
  children?: React.ReactNode;
  focused?: boolean;
  accent: string;
  style?: React.CSSProperties;
  placeholder?: string;
}> = ({ label, children, focused, accent, style, placeholder }) => (
  <div style={style}>
    {label && <Label>{label}</Label>}
    <div
      style={{
        height: 58,
        borderRadius: 14,
        border: `2px solid ${focused ? accent : LINE}`,
        boxShadow: focused ? `0 0 0 5px ${accent}22` : "none",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 25,
        color: INK,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {children}
      {!children && placeholder && (
        <span style={{ color: "#A9B1BB", fontWeight: 500 }}>{placeholder}</span>
      )}
    </div>
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  color: string;
  t: number;
  pressAt?: number;
  outline?: boolean;
  style?: React.CSSProperties;
  textColor?: string;
}> = ({ children, color, t, pressAt, outline, style, textColor }) => (
  <div
    style={{
      height: 62,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "0 28px",
      fontFamily: FONT_FAMILY,
      fontWeight: 800,
      fontSize: 24,
      background: outline ? "#fff" : color,
      color: outline ? color : (textColor ?? "#fff"),
      border: outline ? `3px solid ${color}` : "none",
      boxShadow: outline ? "none" : `0 10px 22px ${color}44`,
      transform: `scale(${pressScale(t, pressAt)})`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Toggle: React.FC<{ on: number; accent: string }> = ({ on, accent }) => (
  <div
    style={{
      width: 64,
      height: 36,
      borderRadius: 99,
      background: interpolateColor(on, "#D3D9E0", accent),
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 4,
        left: 4 + on * 28,
        width: 28,
        height: 28,
        borderRadius: 99,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
    />
  </div>
);

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const interpolateColor = (p: number, a: string, b: string) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(",")})`;
};

/** Selo de confirmação (✓) em círculo. */
export const Check: React.FC<{ size: number; color: string; p?: number; bg?: string }> = ({
  size,
  color,
  p = 1,
  bg,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={11} fill={bg ?? color} />
    <path
      d="M6.8 12.4 L10.4 15.8 L17.4 8.6"
      fill="none"
      stroke={bg ? color : "#fff"}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={20}
      strokeDashoffset={20 * (1 - p)}
    />
  </svg>
);

/** Cartão de indicador com número subindo. */
export const Kpi: React.FC<{
  label: string;
  value: string;
  accent: string;
  style?: React.CSSProperties;
  delta?: string;
}> = ({ label, value, accent, style, delta }) => (
  <div
    style={{
      borderRadius: 20,
      background: "#fff",
      border: `1px solid ${LINE}`,
      padding: "20px 22px",
      boxShadow: "0 8px 20px rgba(16,30,54,0.06)",
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 20,
        color: MUTED,
      }}
    >
      {label}
    </div>
    <div
      style={{
        marginTop: 6,
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize: 46,
        letterSpacing: -1,
        color: accent,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    {delta && (
      <div
        style={{
          marginTop: 2,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 19,
          color: "#1E9B4B",
        }}
      >
        {delta}
      </div>
    )}
  </div>
);

/**
 * Gráfico de linha/área que se desenha da esquerda para a direita conforme
 * `p` vai de 0 a 1. `values` vai de 0 a 1 (fração da altura).
 */
export const AreaChart: React.FC<{
  values: number[];
  width: number;
  height: number;
  color: string;
  p: number;
  labels?: string[];
}> = ({ values, width, height, color, p, labels }) => {
  const pad = 8;
  const pts = values.map((v, i) => [
    pad + (i / (values.length - 1)) * (width - pad * 2),
    pad + (1 - v) * (height - pad * 2 - (labels ? 30 : 0)),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const base = height - (labels ? 30 : 0);
  const area = `${line} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`;
  const id = `g${color.replace("#", "")}${width}`;
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x={0} y={0} width={width * p} height={height} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={0}
          x2={width}
          y1={base * g}
          y2={base * g}
          stroke={LINE}
          strokeWidth={2}
        />
      ))}
      <g clipPath={`url(#${id}c)`}>
        <path d={area} fill={`url(#${id})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
      {labels?.map((l, i) => (
        <text
          key={l}
          x={pad + (i / (labels.length - 1)) * (width - pad * 2)}
          y={height - 4}
          textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
          fontFamily={FONT_FAMILY}
          fontWeight={600}
          fontSize={19}
          fill={MUTED}
        >
          {l}
        </text>
      ))}
    </svg>
  );
};

/** Barra horizontal com rótulo e percentual. */
export const BarRow: React.FC<{
  label: string;
  pct: number;
  p: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ label, pct, p, color, style }) => (
  <div style={style}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: 24,
        color: INK,
        marginBottom: 10,
      }}
    >
      <span>{label}</span>
      <span style={{ color, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(pct * p)}%
      </span>
    </div>
    <div style={{ height: 18, borderRadius: 99, background: "#EDF0F4" }}>
      <div
        style={{
          height: 18,
          width: `${pct * p}%`,
          borderRadius: 99,
          background: color,
        }}
      />
    </div>
  </div>
);

/**
 * Notificação estilo iOS que desce do topo da tela do celular. `app` é o nome
 * que aparece no cabeçalho; `glyph` é o ícone (um ou dois caracteres).
 */
export const PhoneNotification: React.FC<{
  at: number;
  until?: number;
  app: string;
  glyph: React.ReactNode;
  color: string;
  title: string;
  body: string;
  top?: number;
}> = ({ at, until = 999, app, glyph, color, title, body, top = 84 }) => {
  const t = useT();
  const enter = usePop(at, true);
  const leave = ramp(t, until, until + 0.35);
  if (t < at - 0.05 || leave >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        top,
        zIndex: 30,
        borderRadius: 34,
        padding: "20px 22px",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
        display: "flex",
        gap: 18,
        opacity: Math.min(1, enter * 1.4) * (1 - leave),
        transform: `translateY(${interpolate(enter, [0, 1], [-140, 0]) - leave * 120}px)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 30,
        }}
      >
        {glyph}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 19,
            color: MUTED,
            letterSpacing: 0.5,
          }}
        >
          <span>{app.toUpperCase()}</span>
          <span>agora</span>
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 23,
            color: INK,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 2,
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 21,
            lineHeight: 1.3,
            color: "#3B4552",
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};

/** Aviso flutuante (fora dos aparelhos), com ícone de confirmação. */
export const Toast: React.FC<{
  at: number;
  until?: number;
  children: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}> = ({ at, until = 999, children, color, style, icon }) => {
  const t = useT();
  const p = usePop(at, true);
  const leave = ramp(t, until, until + 0.3);
  if (t < at - 0.05 || leave >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 45,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 30px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: `0 20px 44px rgba(16,30,54,0.22), 0 0 0 3px ${color}`,
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: 30,
        color: INK,
        whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.3) * (1 - leave),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        ...style,
      }}
    >
      {icon ?? <Check size={40} color={color} p={ramp(t, at + 0.1, at + 0.45)} />}
      {children}
    </div>
  );
};

/** Fundo claro das cenas de demonstração, com manchas de cor se movendo. */
export const DemoBackdrop: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const a = frame / 90;
  return (
    <AbsoluteFill style={{ background: "#EEF3F8", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: 999,
          left: 380 + Math.sin(a) * 60,
          top: -380 + Math.cos(a * 0.8) * 50,
          background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: 999,
          left: -520 + Math.cos(a * 0.7) * 60,
          top: 1050 + Math.sin(a * 0.9) * 60,
          background: `radial-gradient(circle, ${COLORS.blue}44 0%, ${COLORS.blue}00 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Cartão branco genérico. */
export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 28,
      background: "#fff",
      boxShadow: "0 30px 60px rgba(16,30,54,0.16), 0 6px 16px rgba(16,30,54,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const text = (
  size: number,
  weight = 700,
  color: string = INK,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  fontFamily: FONT_FAMILY,
  fontSize: size,
  fontWeight: weight,
  color,
  ...extra,
});
