import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import "../fonts";
import TEMPOS from "./narracao-tempos.json";
import { Ripples } from "../components/Ripples";
import { FONT_FAMILY } from "../brand";
import { MusicBed } from "../components/MusicBed";
import { Phone, PhoneNotification } from "../demos/kit";
import { Icon, IconName, LogoId, NavyBg, ProductLogo, WispotLogo } from "../explainers/ex-kit";
import { Backdrop, Front, Mood, Person, PersonProps, Place, WispotWifi } from "../explainers/people";
import { Camera, CamKey, cut, CutKind, DUR, EASE, Kinetic, pop, tween, useSeconds } from "./motion";
import { WaveSting3D } from "./three3d";

/* ------------------------------------------------------------------ */
/* Esqueleto da história                                               */
/* ------------------------------------------------------------------ */

export type Shot = { seconds: number; cut?: CutKind; node: React.ReactNode };

export type NarrationKey = keyof typeof TEMPOS;

export type StoryConfig = {
  logo: LogoId;
  name: string;
  accent: string;
  /** cor do logo, para a vinheta 3D */
  logoColor: string;
  /** chave da história em narracao.json / narracao-tempos.json */
  narration: NarrationKey;
  /** título da capa de abertura (aceita *destaque*) */
  title: string[];
  /** setor em que a história se passa */
  sector: string;
  shots: Shot[];
  slogan: string[];
  sectors: string[];
};

/** emendas curtas: 9 quadros (0,3 s), dentro da faixa de troca de contexto */
const CUT_FRAMES = 9;
export const END_SECONDS = 4.4;
const COVER_SECONDS = 4;
const SIGN_OFF_SECONDS = 4.4;
/** a fala entra 0,2 s depois do corte e termina antes da emenda seguinte */
const VO_LEAD = 0.2;
const VO_TAIL = 0.45;

type Beat = { key: string; seconds: number; cut?: CutKind; node: React.ReactNode };

/** planos da história com capa, fechamento e assinatura, já esticados para caber a fala */
const beats = (c: StoryConfig): Beat[] => {
  const vo = TEMPOS[c.narration] as Record<string, number>;
  const fit = (key: string, seconds: number) => Math.max(seconds, VO_LEAD + (vo[key] ?? 0) + VO_TAIL);
  return [
    { key: "capa", seconds: fit("capa", COVER_SECONDS), node: <OpeningCover c={c} /> },
    ...c.shots.map((s, i) => ({ key: String(i), seconds: fit(String(i), s.seconds), cut: s.cut, node: s.node })),
    { key: "fim", seconds: fit("fim", END_SECONDS), cut: "zoom" as CutKind, node: <EndShot c={c} /> },
    { key: "assinatura", seconds: fit("assinatura", SIGN_OFF_SECONDS), cut: "whip" as CutKind, node: <ClosingCover c={c} /> },
  ];
};

export const storyFrames = (c: StoryConfig, fps: number) =>
  beats(c).reduce((a, b) => a + Math.round(b.seconds * fps), 0) - (beats(c).length - 1) * CUT_FRAMES;

export const StoryVideo: React.FC<{ config: StoryConfig }> = ({ config: c }) => {
  const { fps } = useVideoConfig();
  const total = storyFrames(c, fps);
  const items: React.ReactNode[] = [];
  beats(c).forEach((b, i) => {
    if (i) items.push(<TransitionSeries.Transition key={`t${i}`} presentation={cut(b.cut ?? "whip")} timing={linearTiming({ durationInFrames: CUT_FRAMES })} />);
    items.push(
      <TransitionSeries.Sequence key={b.key} durationInFrames={Math.round(b.seconds * fps)}>
        {b.node}
        <Sequence from={Math.round(VO_LEAD * fps)} layout="none">
          <Audio src={staticFile(`audio/narracao/${c.narration}/${b.key}.mp3`)} />
        </Sequence>
      </TransitionSeries.Sequence>,
    );
  });
  return (
    <AbsoluteFill style={{ background: "#25A8E0" }}>
      <WispotWifi.Provider value>
        <TransitionSeries>{items}</TransitionSeries>
      </WispotWifi.Provider>
      {/* trilha baixa sob a voz; sobe no último segundo, depois da assinatura */}
      <MusicBed totalFrames={total} endCardFrom={total - Math.round(1.9 * fps)} fps={fps} level={0.16} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Capas                                                               */
/* ------------------------------------------------------------------ */

/** Capa de abertura: "conheça", o título e o produto. Serve de thumbnail. */
export const OpeningCover: React.FC<{ c: StoryConfig }> = ({ c }) => {
  const t = useSeconds();
  const logo = tween(t, 0.05, DUR.std);
  const label = tween(t, 0.15, DUR.std);
  const product = pop(t, 0.75);
  const chip = tween(t, 1.0, DUR.std);
  return (
    <NavyBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples size={1100} opacity={0.22} speed={0.35} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 70, opacity: logo, transform: `translateY(${(1 - logo) * -20}px)` }}>
        <WispotLogo width={230} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 10,
          color: "rgba(255,255,255,0.9)",
          opacity: label,
        }}
      >
        CONHEÇA
      </div>
      <Kinetic lines={c.title} at={0.25} size={c.title.length > 2 ? 100 : 128} accent={c.accent} top={c.title.length > 2 ? 365 : 390} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 170 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `scale(${Math.max(0, product)})` }}>
          <ProductLogo id={c.logo} white height={c.logo === "sending" ? 130 : 110} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 80,
          padding: "12px 28px",
          borderRadius: 999,
          border: "3px solid rgba(255,255,255,0.85)",
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 30,
          color: "#fff",
          opacity: chip,
          transform: `translateX(${(1 - chip) * 30}px)`,
        }}
      >
        {c.sector}
      </div>
    </NavyBg>
  );
};

const FAMILY: LogoId[] = ["hora-premiada", "myguest", "sending", "wimap", "wiquest"];

/** Capa de fechamento: assinatura da Wispot, contato e as outras ferramentas. */
export const ClosingCover: React.FC<{ c: StoryConfig }> = ({ c }) => {
  const t = useSeconds();
  const logo = pop(t, 0.1);
  const line = tween(t, 0.5, DUR.std);
  const contact = tween(t, 0.8, DUR.std);
  const others = FAMILY.filter((f) => f !== c.logo);
  return (
    <NavyBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples size={1000} opacity={0.2} speed={0.3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
        <div style={{ transform: `scale(${Math.max(0, logo)})` }}>
          <WispotLogo width={560} />
        </div>
        <div style={{ marginTop: 36, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 36, letterSpacing: 7, color: "#fff", opacity: line, transform: `translateY(${(1 - line) * 20}px)` }}>
          INTERAÇÃO E EXPERIÊNCIA EM WI-FI
        </div>
        <div style={{ marginTop: 34, display: "flex", gap: 22, opacity: contact, transform: `translateY(${(1 - contact) * 20}px)` }}>
          {["wispot.com.br"].map((s) => (
            <span key={s} style={{ padding: "14px 30px", borderRadius: 999, background: "#fff", fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 32, color: "#0B91C1" }}>
              {s}
            </span>
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: "rgba(255,255,255,0.85)", opacity: tween(t, 1.1, DUR.std) }}>CONHEÇA TAMBÉM</div>
        <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
          {others.map((id, i) => {
            const p = tween(t, 1.2 + i * 0.08, DUR.std);
            return (
              <div key={id} style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <ProductLogo id={id} white height={id === "sending" ? 56 : 44} />
              </div>
            );
          })}
        </div>
      </div>
    </NavyBg>
  );
};

/** Vinheta do produto: ondas de Wi-Fi em 3D e o logo surgindo no centro. */
export const StingShot: React.FC<{ logo: LogoId; color: string; line: string[] }> = ({ logo: id, color, line }) => {
  const t = useSeconds();
  const logo = tween(t, 0.35, DUR.slow);
  return (
    <NavyBg>
      <WaveSting3D accent={color} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            marginTop: -60,
            opacity: logo,
            transform: `scale(${0.82 + logo * 0.18})`,
            padding: "28px 46px",
            filter: `blur(${(1 - logo) * 14}px) drop-shadow(0 10px 30px rgba(0,60,110,0.35))`,
          }}
        >
          <ProductLogo id={id} white height={id === "sending" ? 200 : 150} />
        </div>
      </AbsoluteFill>
      <Kinetic lines={line} at={0.9} size={54} weight={800} accent={color} top={720} />
    </NavyBg>
  );
};

/** Fechamento: logo, frase, setores atendidos, serviços Wispot e o logo. */
const EndShot: React.FC<{ c: StoryConfig }> = ({ c }) => {
  const t = useSeconds();
  const logo = tween(t, 0.1, DUR.std);
  const services: { icon: IconName; label: string }[] = [
    { icon: "wispot", label: "Captive portal com a sua marca" },
    { icon: "shield", label: "Dados de acordo com a LGPD" },
    { icon: "link", label: "Integração com os seus sistemas" },
  ];
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 140, top: 120, opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }}>
        <ProductLogo id={c.logo} white height={c.logo === "sending" ? 150 : 110} />
      </div>
      <Kinetic lines={c.slogan} at={0.3} size={76} align="left" left={140} top={c.logo === "sending" ? 310 : 280} width={1200} accent={c.logoColor} />
      <div style={{ position: "absolute", left: 140, top: 560, display: "flex", gap: 16, width: 1700 }}>
        {c.sectors.map((s, i) => {
          const p = tween(t, 1.0 + i * 0.06, DUR.std);
          return (
            <span
              key={s}
              style={{
                padding: "12px 26px",
                borderRadius: 999,
                border: "3px solid rgba(255,255,255,0.75)",
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 30,
                color: "#fff",
                opacity: p,
                transform: `translateY(${(1 - p) * 24}px)`,
              }}
            >
              {s}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 140, top: 680, display: "flex", gap: 40 }}>
        {services.map((s, i) => {
          const p = tween(t, 1.5 + i * 0.08, DUR.std);
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              <span style={{ width: 58, height: 58, borderRadius: 99, border: "3px solid #fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={32} />
              </span>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 27, color: "rgba(255,255,255,0.92)", width: 270, lineHeight: 1.2 }}>{s.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 110, textAlign: "right", opacity: tween(t, 2.0, DUR.std) }}>
        <WispotLogo width={300} style={{ marginLeft: "auto" }} />
      </div>
    </NavyBg>
  );
};

/* ------------------------------------------------------------------ */
/* Cena ilustrada com câmera                                           */
/* ------------------------------------------------------------------ */

export type Actor = Omit<PersonProps, "t" | "mood" | "pose"> & {
  pose?: PersonProps["pose"];
  /** caminhada: anda até `to.x` entre `from` e `until` */
  to?: { x: number; from: number; until: number };
  /** expressão fixa ou que muda ao longo da cena */
  mood?: Mood | [number, Mood][];
  behind?: boolean;
};

const moodAt = (m: Actor["mood"], t: number): Mood => {
  if (!m) return "neutral";
  if (typeof m === "string") return m;
  let cur: Mood = m[0][1];
  m.forEach(([at, mm]) => {
    if (t >= at) cur = mm;
  });
  return cur;
};

export const IllustratedShot: React.FC<{
  place: Place;
  accent: string;
  cast: Actor[];
  keys: CamKey[];
  punch?: number[];
  back?: React.ReactNode;
  front?: React.ReactNode;
  children?: React.ReactNode;
  tint?: string;
  /** texto da fachada, no cenário da rua */
  sign?: string;
}> = ({ place, accent, cast, keys, punch, back, front, children, tint, sign }) => {
  const t = useSeconds();
  const draw = (behind: boolean) =>
    cast.map((a, i) => {
      if (!!a.behind !== behind) return null;
      let x = a.x;
      let pose = a.pose ?? "stand";
      let flip = a.flip;
      if (a.to) {
        const p = interpolate(t, [a.to.from, a.to.until], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        x = a.x + (a.to.x - a.x) * p;
        if (p > 0 && p < 1) pose = "walk";
        flip = a.to.x < a.x;
      }
      const rest: Partial<Actor> = { ...a };
      delete rest.to;
      delete rest.behind;
      return <Person key={i} {...(rest as PersonProps)} x={x} flip={flip} pose={pose} mood={moodAt(a.mood, t)} t={t} phase={i * 1.3} wifiColor={accent} />;
    });
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <Camera keys={keys} punch={punch}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <Backdrop place={place} accent={accent} sign={sign} />
          {back}
          {draw(true)}
          <Front place={place} />
          {draw(false)}
          {front}
        </svg>
      </Camera>
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />}
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Adereços                                                            */
/* ------------------------------------------------------------------ */

/** Relógio de parede; os ponteiros andam a partir de `h:m`. */
export const WallClock: React.FC<{ x: number; y: number; r?: number; h: number; m: number; speed?: number; t: number }> = ({ x, y, r = 70, h, m, speed = 0, t }) => {
  const minutes = h * 60 + m + t * speed;
  const ma = ((minutes % 60) / 60) * 360;
  const ha = (((minutes / 60) % 12) / 12) * 360;
  const sa = (t * 360) % 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 8} fill="#3B4048" />
      <circle r={r} fill="#fff" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-2} y={-r + 6} width={4} height={i % 3 ? 8 : 14} fill="#3B4048" transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-4} y={-r * 0.5} width={8} height={r * 0.5} rx={4} fill="#1B2430" transform={`rotate(${ha})`} />
      <rect x={-3} y={-r * 0.78} width={6} height={r * 0.78} rx={3} fill="#1B2430" transform={`rotate(${ma})`} />
      <rect x={-1} y={-r * 0.85} width={2} height={r * 0.95} fill="#E5484D" transform={`rotate(${sa})`} />
      <circle r={6} fill="#1B2430" />
    </g>
  );
};

/** Confete leve caindo (camada ambiente das comemorações). */
export const Confetti: React.FC<{ at: number; colors: string[]; count?: number }> = ({ at, colors, count = 40 }) => {
  const t = useSeconds();
  if (t < at) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 65 }}>
      {Array.from({ length: count }, (_, i) => {
        const seed = Math.sin(i * 91.7) * 10000;
        const r = seed - Math.floor(seed);
        const x = (i / count) * 1920 + Math.sin(i * 3.1) * 60;
        const fall = (t - at) * (260 + r * 220);
        const y = -40 + fall - r * 300;
        if (y > 1100) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(t * 3 + i) * 30,
              top: y,
              width: 14,
              height: 22,
              borderRadius: 3,
              background: colors[i % colors.length],
              transform: `rotate(${t * 300 + i * 40}deg)`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Cartão com número que sobe — o placar da história. */
export const CountCard: React.FC<{ label: string; to: number; at: number; dur?: number; accent: string; left?: number; top?: number; suffix?: string; prefix?: string }> = ({
  label,
  to,
  at,
  dur = 1.6,
  accent,
  left = 1340,
  top = 70,
  suffix = "",
  prefix = "",
}) => {
  const t = useSeconds();
  const p = pop(t, at);
  const v = Math.round(to * tween(t, at + 0.1, dur, EASE.out));
  if (t < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 70,
        padding: "22px 34px",
        borderRadius: 26,
        background: "#fff",
        boxShadow: `0 24px 50px rgba(0,0,0,0.25), 0 0 0 4px ${accent}`,
        transform: `scale(${Math.max(0, p)})`,
        transformOrigin: "top right",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 26, color: "#6B7684" }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 84, letterSpacing: -2, color: accent, lineHeight: 1.05 }}>
        {prefix}
        {new Intl.NumberFormat("pt-BR").format(v)}
        {suffix}
      </div>
    </div>
  );
};

/** Celular com tela de bloqueio recebendo uma notificação. */
export const LockPhone: React.FC<{
  left: number;
  top: number;
  scale: number;
  wallpaper: string;
  at: number;
  app: string;
  glyph: React.ReactNode;
  color: string;
  title: string;
  body: string;
  time?: string;
}> = ({ left, top, scale, wallpaper, at, app, glyph, color, title, body, time = "15:02" }) => {
  const t = useSeconds();
  const shake = t > at && t < at + 0.35 ? Math.sin((t - at) * 70) * 3 : 0;
  return (
    <Phone left={left} top={top} scale={scale} darkStatus={false} screen="#000" style={{ transform: `scale(${scale}) rotate(${shake}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: wallpaper, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 130 }}>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.85)" }}>terça-feira</div>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 130, letterSpacing: -4, color: "#fff", lineHeight: 1.1 }}>{time}</div>
      </div>
      <PhoneNotification at={at} top={420} app={app} glyph={glyph} color={color} title={title} body={body} />
    </Phone>
  );
};

/** Fundo de estúdio colorido com brilho, para os planos de produto. */
export const SoftBg: React.FC<{ accent: string; children?: React.ReactNode }> = ({ accent, children }) => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #EEF1F5 50%, #D3D9E1 100%)", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: 999,
          left: 900 + Math.sin(t * 0.6) * 60,
          top: -700 + Math.cos(t * 0.5) * 40,
          background: `radial-gradient(circle, ${accent}40 0%, ${accent}00 65%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export { EASE, DUR, tween, pop, Kinetic };

/** Cartão de avaliação (estilo Google), com estrelas acendendo. */
export const ReviewCard: React.FC<{
  at: number;
  stars: number;
  text: string;
  name: string;
  left?: number;
  top?: number;
  scale?: number;
  bad?: boolean;
}> = ({ at, stars, text, name, left = 560, top = 330, scale = 1, bad }) => {
  const t = useSeconds();
  const p = pop(t, at);
  if (t < at) return null;
  const shake = bad && t - at < 0.5 ? Math.sin((t - at) * 60) * 8 * (1 - (t - at) / 0.5) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 800,
        zIndex: 60,
        padding: "34px 40px",
        borderRadius: 30,
        background: "#fff",
        boxShadow: bad ? "0 30px 70px rgba(229,72,77,0.35), 0 0 0 4px #E5484D" : "0 30px 70px rgba(0,0,0,0.25)",
        transform: `translateX(${shake}px) scale(${Math.max(0, p) * scale})`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 64, height: 64, borderRadius: 99, background: bad ? "#E5484D" : "#1E9B4B", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30 }}>
          {name[0]}
        </span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 30, color: "#1B2430" }}>{name}</div>
          <div style={{ fontWeight: 600, fontSize: 22, color: "#6B7684" }}>avaliação no Google · agora</div>
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 52, letterSpacing: 6 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const on = i < stars && t > at + 0.15 + i * 0.08;
          return (
            <span key={i} style={{ color: on ? "#FBBC04" : "#D3D9E0", display: "inline-block", transform: `scale(${on ? 1 + Math.max(0, 1 - (t - at - 0.15 - i * 0.08) * 5) * 0.4 : 1})` }}>
              ★
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: "#2F3743" }}>{text}</div>
    </div>
  );
};

/** Calendário que vira páginas (passagem de tempo). */
export const FlipCalendar: React.FC<{ pages: string[]; at: number; step?: number; accent: string; left?: number; top?: number }> = ({
  pages,
  at,
  step = 0.55,
  accent,
  left = 710,
  top = 230,
}) => {
  const t = useSeconds();
  const idx = Math.max(0, Math.min(pages.length - 1, Math.floor((t - at) / step)));
  const local = (t - at - idx * step) / step;
  const flip = idx < pages.length - 1 ? tween(local, 0.55, 0.45, EASE.in) : 0;
  return (
    <div style={{ position: "absolute", left, top, width: 500, height: 520, perspective: 1400, fontFamily: FONT_FAMILY }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "34px 34px 0 0", background: accent }} />
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", top: -20, left: 130 + k * 200, width: 36, height: 70, borderRadius: 18, background: "#3B4048" }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "top center",
          transform: `rotateX(${flip * 95}deg)`,
          opacity: 1 - flip * 0.8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 170, letterSpacing: -6, color: "#1B2430", lineHeight: 1 }}>{pages[idx].split(" ")[0]}</div>
        <div style={{ fontWeight: 800, fontSize: 48, color: "#6B7684" }}>{pages[idx].split(" ").slice(1).join(" ")}</div>
      </div>
    </div>
  );
};

/** Pontos de interrogação surgindo em volta de alguém (dúvida). */
export const QuestionMarks: React.FC<{ at: number; spots: [number, number][]; color: string }> = ({ at, spots, color }) => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 55 }}>
      {spots.map(([x, y], i) => {
        const p = pop(t, at + i * 0.12);
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + Math.sin(t * 3 + i) * 8,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 120,
              color,
              transform: `scale(${p}) rotate(${(i % 2 ? 1 : -1) * 12}deg)`,
              textShadow: "0 10px 24px rgba(0,0,0,0.2)",
            }}
          >
            ?
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Chip de dado (número + rótulo) que entra da esquerda. */
export const StatChip: React.FC<{ at: number; value: string; label: string; accent: string; left?: number; top: number }> = ({ at, value, label, accent, left = 90, top }) => {
  const t = useSeconds();
  const p = tween(t, at, DUR.std);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 60,
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        padding: "18px 30px",
        borderRadius: 22,
        background: "rgba(255,255,255,0.96)",
        boxShadow: `0 18px 40px rgba(0,0,0,0.25), inset 6px 0 0 ${accent}`,
        opacity: p,
        transform: `translateX(${(1 - p) * -80}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <span style={{ fontWeight: 900, fontSize: 60, letterSpacing: -1.5, color: accent }}>{value}</span>
      <span style={{ fontWeight: 700, fontSize: 30, color: "#2F3743" }}>{label}</span>
    </div>
  );
};
