import React from "react";
import { AbsoluteFill } from "remotion";
import { AreaChart, BarRow, Cursor, INK, Kpi, LINE, MUTED, PhoneNotification, ramp, text, useT } from "../demos/kit";
import { FONT_FAMILY } from "../brand";
import {
  Avatar,
  Chip,
  DashboardShell,
  PanelButton,
  PanelSection,
  PanelTitle,
  ProfileCard,
  ToggleRow,
} from "./ex-kit";
import type { ExplainerConfig } from "./ExplainerVideo";

/**
 * Wimap no estilo do institucional: o app mostra quem está por perto (mesmo
 * sem conexão), o gestor liga zonas, período e alertas no Painel de Controle
 * e vê fluxo, permanência e recorrência no notebook.
 */

const PURPLE = "#941F91";
const GRAY_DOT = "#8A94A3";

/* Planta em miniatura --------------------------------------------------- */

const PW = 468;
const PH = 540;

type Zone = { id: string; x: number; y: number; w: number; h: number; heat: [number, number, number] };

/** zonas e o centro/raio do calor de cada uma, no espaço da miniatura */
const ZONES: Zone[] = [
  { id: "Provadores", x: 14, y: 14, w: 130, h: 110, heat: [79, 75, 70] },
  { id: "Corredores", x: 158, y: 14, w: 150, h: 230, heat: [233, 140, 80] },
  { id: "Estoque", x: 322, y: 14, w: 132, h: 110, heat: [388, 70, 0] },
  { id: "Vitrine", x: 14, y: 258, w: 130, h: 150, heat: [79, 340, 85] },
  { id: "Caixas", x: 322, y: 200, w: 132, h: 208, heat: [388, 320, 95] },
  { id: "Entrada", x: 168, y: 300, w: 130, h: 108, heat: [233, 370, 110] },
];

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

const DOTS = (() => {
  const r = rng(11);
  const out: { x: number; y: number; on: boolean; at: number; ph: number }[] = [];
  for (let i = 0; i < 28; i++) out.push({ x: 24 + r() * 420, y: 24 + r() * 380, on: r() < 0.6, at: 0.6 + r() * 1.8, ph: r() * 6.28 });
  for (let i = 0; i < 16; i++) out.push({ x: 20 + r() * 428, y: 452 + r() * 70, on: false, at: 0.6 + r() * 1.8, ph: r() * 6.28 });
  return out;
})();

const MiniPlan: React.FC<{
  t: number;
  dots?: boolean;
  /** intensidade do calor por zona (0 a 1) */
  heat?: Record<string, number>;
  highlight?: string;
}> = ({ t, dots, heat, highlight }) => (
  <svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`}>
    <defs>
      <radialGradient id="mini-heat">
        <stop offset="0%" stopColor="#E5262B" stopOpacity={0.85} />
        <stop offset="35%" stopColor="#F97316" stopOpacity={0.6} />
        <stop offset="65%" stopColor="#FACC15" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={0} y={438} width={PW} height={102} rx={12} fill="#EEF1F5" />
    <text x={14} y={530} fontFamily={FONT_FAMILY} fontWeight={700} fontSize={15} fill={MUTED} letterSpacing={2}>
      CALÇADA
    </text>
    <rect x={0} y={0} width={PW} height={422} fill="#FAFBFD" />
    {ZONES.map((z) => (
      <g key={z.id}>
        <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill={z.id === highlight ? `${PURPLE}22` : `${PURPLE}0D`} stroke={z.id === highlight ? PURPLE : `${PURPLE}40`} strokeWidth={z.id === highlight ? 3 : 1.5} />
        <text x={z.x + 10} y={z.y + 24} fontFamily={FONT_FAMILY} fontWeight={700} fontSize={16} fill={INK}>
          {z.id}
        </text>
      </g>
    ))}
    {heat &&
      ZONES.map((z) => {
        const k = heat[z.id] ?? 0;
        if (k <= 0 || z.heat[2] === 0) return null;
        return <circle key={z.id} cx={z.heat[0]} cy={z.heat[1]} r={z.heat[2] * (0.4 + 0.6 * k) * (1 + Math.sin(t * 2 + z.x) * 0.03)} fill="url(#mini-heat)" opacity={k} />;
      })}
    <path d="M190 422 L0 422 L0 0 L468 0 L468 422 L278 422" fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {dots &&
      DOTS.map((d, i) => {
        const p = ramp(t, d.at, d.at + 0.3);
        const x = d.x + Math.sin(t * 0.9 + d.ph) * 6;
        const y = d.y + Math.cos(t * 0.7 + d.ph) * 5;
        return d.on ? (
          <circle key={i} cx={x} cy={y} r={8 * p} fill={PURPLE} />
        ) : (
          <circle key={i} cx={x} cy={y} r={7 * p} fill="#fff" stroke={GRAY_DOT} strokeWidth={3} />
        );
      })}
  </svg>
);

const AppHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 180, background: PURPLE, padding: "92px 30px 0", boxSizing: "border-box" }}>
    <div style={text(20, 700, "rgba(255,255,255,0.8)", { letterSpacing: 3 })}>WIMAP · LOJA CENTRO</div>
    <div style={{ marginTop: 4, ...text(36, 900, "#fff") }}>{title}</div>
  </div>
);

/* 3 · celular ---------------------------------------------------------------- */

const PhoneScreen: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.4);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#F4F5F8" }} />
      <AppHeader title="Ao vivo" />
      <div style={{ position: "absolute", left: 30, right: 30, top: 204, display: "flex", gap: 16 }}>
        {[
          { l: "Por perto", v: Math.round(342 * k), c: GRAY_DOT },
          { l: "Conectados", v: Math.round(128 * k) + (t > 3.6 ? 1 : 0), c: PURPLE },
        ].map((b) => (
          <div key={b.l} style={{ flex: 1, padding: "14px 18px", borderRadius: 18, background: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
            <div style={text(19, 600, MUTED)}>{b.l}</div>
            <div style={text(42, 900, b.c)}>{b.v}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 30, top: 360 }}>
        <MiniPlan t={t} dots />
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 920, display: "flex", gap: 24, ...text(19, 700, INK) }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 16, borderRadius: 99, background: PURPLE }} />
          Conectado
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 16, borderRadius: 99, border: `3px solid ${GRAY_DOT}`, boxSizing: "border-box" }} />
          Por perto, sem conexão
        </span>
      </div>
      <PhoneNotification at={3.6} until={6.6} top={84} app="Wimap" glyph="W" color={PURPLE} title="Visitante conectado" body="3ª visita no mês · entrou pela Entrada" />
    </>
  );
};

const PhoneSide: React.FC = () => (
  <>
    <ProfileCard
      at={1.0}
      left={860}
      top={170}
      avatar={<Avatar size={150} skin="#D9A27A" hair="bun" hairColor="#2A1C14" top="#F2B33D" />}
      title="342 pessoas por perto"
      sub="agora · mesmo sem conexão"
      icon="users"
      color={PURPLE}
    />
    <ProfileCard
      at={1.8}
      left={860}
      top={390}
      avatar={<Avatar size={150} skin="#F2C7A5" hair="long" hairColor="#5A3825" top="#E25D6A" />}
      title="Renata Alves, 32 anos"
      sub="3ª visita no mês · 42 min"
      stars={4}
      icon="wifi"
      color={PURPLE}
    />
    <ProfileCard
      at={2.6}
      left={860}
      top={610}
      avatar={<Avatar size={150} skin="#A86E4B" hair="short" hairColor="#1F1A17" top="#2FA37A" />}
      title="Pico de movimento"
      sub="Entrada · hoje às 18h12"
      icon="bell"
      color={PURPLE}
    />
  </>
);

/* 4 · painel de controle -------------------------------------------------------- */

const CLICK = { vitrine: 1.2, provadores: 1.8, period: 2.8, peak: 4.0, recurrent: 4.6, pdf: 5.6 };

const panelState = (t: number) => {
  const boost = 0.65 + 0.35 * ramp(t, CLICK.period, CLICK.period + 0.6);
  return {
    heat: {
      Entrada: ramp(t, 0.6, 1.2) * boost,
      Caixas: ramp(t, 0.8, 1.4) * boost * 0.85,
      Vitrine: ramp(t, CLICK.vitrine, CLICK.vitrine + 0.6) * boost * 0.7,
      Provadores: ramp(t, CLICK.provadores, CLICK.provadores + 0.6) * boost * 0.45,
      Corredores: ramp(t, 1.0, 1.6) * boost * 0.5,
    },
    highlight: t > CLICK.provadores && t < CLICK.period ? "Provadores" : t > CLICK.vitrine && t < CLICK.provadores ? "Vitrine" : undefined,
    period: t > CLICK.period ? 1 : 0,
  };
};

const PanelPhone: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#F4F5F8" }} />
      <AppHeader title="Mapa de calor" />
      <div style={{ position: "absolute", left: 30, top: 220, ...text(22, 700, MUTED) }}>{s.period ? "Últimos 7 dias" : "Hoje"}</div>
      <div style={{ position: "absolute", left: 30, top: 270 }}>
        <MiniPlan t={t} heat={s.heat} highlight={s.highlight} />
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 840, height: 16, borderRadius: 99, background: "linear-gradient(90deg, #FACC1544, #FACC15, #F97316, #E5262B)" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 866, display: "flex", justifyContent: "space-between", ...text(18, 700, MUTED) }}>
        <span>Pouco movimento</span>
        <span>Muito movimento</span>
      </div>
    </>
  );
};

const Panel: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 700, top: 86 }}>
        <PanelTitle>Painel de Controle</PanelTitle>
      </div>
      <PanelSection icon="pin" title="Zonas" at={0.5} style={{ position: "absolute", left: 700, top: 200 }}>
        <ToggleRow label="Entrada" on={1} accent={PURPLE} />
        <ToggleRow label="Caixas" on={1} accent={PURPLE} />
        <ToggleRow label="Vitrine" on={ramp(t, CLICK.vitrine, CLICK.vitrine + 0.2)} accent={PURPLE} />
        <ToggleRow label="Provadores" on={ramp(t, CLICK.provadores, CLICK.provadores + 0.2)} accent={PURPLE} />
      </PanelSection>
      <PanelSection icon="calendar" title="Período" at={0.7} style={{ position: "absolute", left: 1300, top: 200 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <Chip label="Hoje" on={!s.period} accent={PURPLE} />
          <Chip label="7 dias" on={!!s.period} accent={PURPLE} />
          <Chip label="30 dias" on={false} accent={PURPLE} />
        </div>
      </PanelSection>
      <PanelSection icon="bell" title="Alertas automáticos" at={0.9} style={{ position: "absolute", left: 700, top: 590 }}>
        <ToggleRow label="Pico de movimento" on={ramp(t, CLICK.peak, CLICK.peak + 0.2)} accent={PURPLE} />
        <ToggleRow label="Visitante recorrente" on={ramp(t, CLICK.recurrent, CLICK.recurrent + 0.2)} accent={PURPLE} />
      </PanelSection>
      <PanelSection icon="download" title="Relatórios" at={1.1} style={{ position: "absolute", left: 1300, top: 400 }}>
        <PanelButton color={PURPLE} pressed={t > CLICK.pdf && t < CLICK.pdf + 0.2} width={340}>
          Exportar relatório
        </PanelButton>
        <div style={{ marginTop: 16, opacity: ramp(t, CLICK.pdf + 0.2, CLICK.pdf + 0.5), ...text(22, 700, "#1E9B4B") }}>✓ relatorio-loja-centro.pdf</div>
      </PanelSection>
      <Cursor
        keys={[
          { t: 0.5, x: 1100, y: 900 },
          { t: 1.15, x: 1098, y: 423 },
          { t: 1.75, x: 1098, y: 485 },
          { t: 2.75, x: 1505, y: 293 },
          { t: 3.95, x: 1098, y: 689 },
          { t: 4.55, x: 1098, y: 751 },
          { t: 5.55, x: 1470, y: 500 },
        ]}
        clicks={[CLICK.vitrine, CLICK.provadores, CLICK.period, CLICK.peak, CLICK.recurrent, CLICK.pdf]}
        from={0.5}
        until={7.2}
      />
    </AbsoluteFill>
  );
};

/* 5 · notebook ---------------------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "heat" as const, label: "Mapa" },
  { icon: "users" as const, label: "Visitantes" },
  { icon: "bell" as const, label: "Alertas" },
];

const Dashboard: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.2);
  return (
    <DashboardShell logo="wimap" menu={MENU} active={0} title="Loja Centro · Hoje">
      <div style={{ display: "flex", gap: 20 }}>
        <Kpi label="Conexões" value={new Intl.NumberFormat("pt-BR").format(Math.round(1284 * k))} accent={PURPLE} style={{ flex: 1 }} />
        <Kpi label="Permanência média" value={`${Math.round(42 * k)} min`} accent={INK} style={{ flex: 1 }} />
        <Kpi label="Recorrência" value={`${Math.round(63 * k)}%`} accent={INK} style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 650, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={text(24, 800)}>Fluxo de visitantes por hora</div>
        <div style={{ marginTop: 12 }}>
          <AreaChart values={[0.12, 0.2, 0.35, 0.55, 0.4, 0.38, 0.5, 0.72, 0.95, 0.6]} labels={["9h", "12h", "15h", "18h", "21h"]} width={600} height={260} color={PURPLE} p={ramp(t, 0.8, 2.8)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 670, top: 150, right: 0, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={{ ...text(24, 800), marginBottom: 18 }}>Zonas mais visitadas</div>
        {[
          { l: "Entrada", v: 38 },
          { l: "Caixas", v: 27 },
          { l: "Vitrine", v: 21 },
        ].map((r, i) => (
          <BarRow key={r.l} label={r.l} pct={r.v} p={ramp(t, 1.4 + i * 0.3, 2.6 + i * 0.3)} color={PURPLE} style={{ marginBottom: 20 }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 512,
          height: 74,
          borderRadius: 14,
          background: "#fff",
          boxShadow: `0 0 0 3px ${PURPLE}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
          opacity: ramp(t, 3.4, 3.8),
        }}
      >
        <span style={{ width: 44, height: 44, borderRadius: 12, background: PURPLE, display: "inline-flex", alignItems: "center", justifyContent: "center", ...text(26, 900, "#fff") }}>!</span>
        <span style={text(22, 800)}>Pico de movimento na Entrada</span>
        <span style={{ marginLeft: "auto", ...text(19, 600, MUTED) }}>alerta automático · 18h12 · +45% vs. média</span>
      </div>
      <Cursor keys={[{ t: 4.0, x: 900, y: 620 }, { t: 5.0, x: 520, y: 210 }]} from={4.0} />
    </DashboardShell>
  );
};

/* 7 · celular do fechamento -------------------------------------------------------- */

const OutroScreen: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "#F4F5F8" }} />
    <AppHeader title="Mapa de calor" />
    <div style={{ position: "absolute", left: 30, top: 270 }}>
      <MiniPlan t={0} heat={{ Entrada: 1, Caixas: 0.85, Vitrine: 0.7, Provadores: 0.45, Corredores: 0.5 }} />
    </div>
  </>
);

export const wimapExplainer: ExplainerConfig = {
  logo: "wimap",
  name: "Wimap",
  accent: PURPLE,
  place: "street",
  hook: [
    { at: 0.4, until: 3.6, text: "Quantas pessoas passam na frente da sua loja?" },
    { at: 3.9, until: 7.2, text: "E quantas entram… e voltam?" },
  ],
  tagline: "Enxergue quem passa, entra e volta.",
  phone: {
    Screen: PhoneScreen,
    Side: PhoneSide,
    screenBg: "#F4F5F8",
    caption: [
      { at: 0.4, until: 4.0, text: "O Wimap identifica quem está por perto, mesmo sem conexão ao Wi-Fi." },
      { at: 4.3, until: 7.9, text: "E reconhece quem volta à sua loja." },
    ],
  },
  panel: {
    Screen: PanelPhone,
    Panel,
    screenBg: "#F4F5F8",
    caption: [
      { at: 0.4, until: 4.0, text: "No Painel de Controle, você vê o mapa de calor de cada zona." },
      { at: 4.2, until: 8.1, text: "E configura alertas e relatórios automáticos." },
    ],
  },
  laptop: {
    Screen: Dashboard,
    caption: [{ at: 0.4, until: 7.3, text: "Fluxo, permanência e recorrência, em tempo real." }],
  },
  tiles: [
    { icon: "heat", label: "Mapa de calor" },
    { icon: "bell", label: "Alertas automáticos" },
    { icon: "chart", label: "Relatórios personalizados" },
  ],
  bullets: [
    { icon: "chart", title: "Decisões com dados", text: "layout e equipe ajustados ao movimento real" },
    { icon: "layers", title: "Escalável", text: "de uma loja a uma rede inteira" },
  ],
  OutroScreen,
};
