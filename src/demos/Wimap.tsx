import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  AreaChart,
  BarRow,
  Browser,
  INK,
  Kpi,
  LINE,
  MUTED,
  ramp,
  rise,
  text,
  Toast,
  usePop,
  useT,
  WifiGlyph,
} from "./kit";
import type { DemoConfig } from "./DemoVideo";
import { FONT_FAMILY } from "../brand";
import { PRODUCTS, Product } from "./ProductMark";

/**
 * Wimap — planta da loja com os pontos de acesso, quem está por perto (mesmo
 * sem conexão), o mapa de calor e o painel com fluxo, permanência e
 * recorrência. Números e rótulos seguem a arte "03-wimap" do Drive.
 */

const P = PRODUCTS.wimap;

/* Planta ------------------------------------------------------------- */

const W = 908;
const H = 900;

type Zone = { name: string; x: number; y: number; w: number; h: number };

const ZONES: Zone[] = [
  { name: "Provadores", x: 60, y: 60, w: 240, h: 200 },
  { name: "Corredores", x: 330, y: 60, w: 280, h: 420 },
  { name: "Estoque", x: 640, y: 60, w: 208, h: 200 },
  { name: "Vitrine", x: 60, y: 500, w: 240, h: 200 },
  { name: "Entrada", x: 340, y: 560, w: 228, h: 140 },
  { name: "Caixas", x: 640, y: 420, w: 208, h: 280 },
];

const APS = [
  { x: 180, y: 380 },
  { x: 470, y: 300 },
  { x: 744, y: 330 },
];

/** contorno da loja, com o vão da porta embaixo */
const WALL = "M380 720 L40 720 L40 40 L868 40 L868 720 L528 720";
const WALL_LEN = 340 + 680 + 828 + 680 + 340;

const FloorPlan: React.FC<{
  draw?: number;
  zones?: number;
  aps?: number[];
  t: number;
  children?: React.ReactNode;
  accent: string;
}> = ({ draw = 1, zones = 1, aps = [1, 1, 1], t, children, accent }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
    {/* calçada */}
    <rect x={20} y={770} width={868} height={110} rx={18} fill="#F1F3F6" opacity={zones} />
    <text
      x={44}
      y={862}
      fontFamily={FONT_FAMILY}
      fontWeight={700}
      fontSize={22}
      fill={MUTED}
      opacity={zones}
      letterSpacing={2}
    >
      CALÇADA
    </text>
    <rect x={40} y={40} width={828} height={680} fill="#FAFBFD" opacity={draw} />
    {ZONES.map((z, i) => {
      const p = Math.max(0, Math.min(1, zones * ZONES.length - i));
      return (
        <g key={z.name} opacity={p}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={14} fill={`${accent}0F`} stroke={`${accent}44`} strokeWidth={2} />
          <text
            x={z.x + 16}
            y={z.y + 34}
            fontFamily={FONT_FAMILY}
            fontWeight={700}
            fontSize={22}
            fill={INK}
          >
            {z.name}
          </text>
        </g>
      );
    })}
    {/* gôndolas */}
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={360 + i * 82}
        y={140}
        width={34}
        height={300}
        rx={8}
        fill="#DDE2E9"
        opacity={zones}
      />
    ))}
    {/* balcão dos caixas */}
    <rect x={680} y={560} width={130} height={36} rx={8} fill="#DDE2E9" opacity={zones} />
    <path
      d={WALL}
      fill="none"
      stroke={INK}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={WALL_LEN}
      strokeDashoffset={WALL_LEN * (1 - draw)}
    />
    {children}
    {APS.map((a, i) => {
      const p = aps[i];
      if (p <= 0) return null;
      return (
        <g key={i}>
          {[0, 1].map((k) => {
            const r = ((t * 0.6 + k / 2) % 1) * p;
            return (
              <circle
                key={k}
                cx={a.x}
                cy={a.y}
                r={40 + r * 150}
                fill="none"
                stroke={accent}
                strokeWidth={3}
                opacity={(1 - r) * 0.5 * p}
              />
            );
          })}
          <circle cx={a.x} cy={a.y} r={34 * p} fill={accent} />
          <g transform={`translate(${a.x - 16} ${a.y - 14}) scale(${p})`}>
            <WifiGlyph size={32} color="#fff" />
          </g>
        </g>
      );
    })}
  </svg>
);

/* Passo 1 ------------------------------------------------------------ */

const Mapear: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1060}
        title="Wimap · Planta da loja"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, top: 36 }}>
          <FloorPlan
            t={t}
            accent={product.accent}
            draw={ramp(t, 0.4, 1.6)}
            zones={ramp(t, 1.5, 2.7)}
            aps={[2.8, 3.15, 3.5].map((a) => ramp(t, a, a + 0.35))}
          />
        </div>
      </Browser>
      <Toast at={4.1} color={product.accent} style={{ left: 230, top: 1660 }}>
        3 pontos de acesso ativos
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 2 ------------------------------------------------------------ */

/** gerador pseudoaleatório com semente, para os pontos serem sempre os mesmos */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

type Dot = { x: number; y: number; on: boolean; at: number; ph: number };

const DOTS: Dot[] = (() => {
  const r = rng(7);
  const out: Dot[] = [];
  for (let i = 0; i < 36; i++)
    out.push({ x: 80 + r() * 750, y: 80 + r() * 610, on: r() < 0.62, at: 0.6 + r() * 1.8, ph: r() * 6.28 });
  for (let i = 0; i < 22; i++)
    out.push({ x: 50 + r() * 810, y: 790 + r() * 70, on: false, at: 0.6 + r() * 1.8, ph: r() * 6.28 });
  return out;
})();

/** visitante que vem da calçada, entra na loja e se conecta */
const WALKER = [
  { t: 3.2, x: 150, y: 830 },
  { t: 4.0, x: 454, y: 790 },
  { t: 4.7, x: 454, y: 620 },
];

const Detectar: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const k = ramp(t, 0.6, 2.4);
  let wx = WALKER[0].x;
  let wy = WALKER[0].y;
  for (let i = 1; i < WALKER.length; i++) {
    const p = ramp(t, WALKER[i - 1].t, WALKER[i].t);
    wx += (WALKER[i].x - wx) * p;
    wy += (WALKER[i].y - wy) * p;
  }
  const joined = ramp(t, 4.7, 4.9);
  const walker = ramp(t, 3.0, 3.2);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="Wimap · Ao vivo"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, right: 36, top: 26, display: "flex", gap: 20 }}>
          <Kpi label="Por perto" value={String(Math.round(342 * k))} accent={MUTED} style={{ flex: 1 }} />
          <Kpi
            label="Conectados"
            value={String(Math.round(128 * k) + (joined > 0.5 ? 1 : 0))}
            accent={product.accent}
            style={{ flex: 1 }}
          />
          <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            <LegendDot color={product.accent} filled>
              Conectado ao Wi-Fi
            </LegendDot>
            <LegendDot color="#8A94A3">Por perto, sem conexão</LegendDot>
          </div>
        </div>
        <div style={{ position: "absolute", left: 36, top: 210 }}>
          <FloorPlan t={t} accent={product.accent}>
            {DOTS.map((d, i) => {
              const p = ramp(t, d.at, d.at + 0.3);
              const x = d.x + Math.sin(t * 0.9 + d.ph) * 10;
              const y = d.y + Math.cos(t * 0.7 + d.ph) * 8;
              return d.on ? (
                <circle key={i} cx={x} cy={y} r={11 * p} fill={product.accent} opacity={0.9} />
              ) : (
                <circle key={i} cx={x} cy={y} r={10 * p} fill="#fff" stroke="#8A94A3" strokeWidth={4} />
              );
            })}
            {walker > 0 && (
              <g opacity={walker}>
                <circle cx={wx} cy={wy} r={34} fill={`${product.accent}22`} />
                <circle
                  cx={wx}
                  cy={wy}
                  r={15}
                  fill={joined > 0.5 ? product.accent : "#fff"}
                  stroke={joined > 0.5 ? "#fff" : "#8A94A3"}
                  strokeWidth={5}
                />
              </g>
            )}
          </FloorPlan>
        </div>
      </Browser>
      <Toast
        at={4.85}
        color={product.accent}
        style={{ left: 290, top: 1250 }}
        icon={
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 99,
              background: product.accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WifiGlyph size={24} color="#fff" />
          </span>
        }
      >
        Visitante conectado
      </Toast>
    </AbsoluteFill>
  );
};

const LegendDot: React.FC<{ color: string; filled?: boolean; children: React.ReactNode }> = ({
  color,
  filled,
  children,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, ...text(21, 700, INK) }}>
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 99,
        background: filled ? color : "#fff",
        border: filled ? "none" : `4px solid ${color}`,
        boxSizing: "border-box",
      }}
    />
    {children}
  </div>
);

/* Passo 3 ------------------------------------------------------------ */

const HEAT = [
  { x: 454, y: 630, r: 190, k: 1, at: 0.7 },
  { x: 744, y: 560, r: 170, k: 0.85, at: 1.0 },
  { x: 180, y: 600, r: 150, k: 0.7, at: 1.3 },
  { x: 470, y: 270, r: 140, k: 0.5, at: 1.6 },
  { x: 180, y: 160, r: 110, k: 0.45, at: 1.9 },
];

const RANK = [
  { l: "Entrada", v: 38 },
  { l: "Caixas", v: 27 },
  { l: "Vitrine", v: 21 },
  { l: "Provadores", v: 14 },
];

const Calor: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const S = 0.62;
  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="Wimap · Mapa de calor"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div
          style={{
            position: "absolute",
            left: (980 - W * S) / 2,
            top: 24,
            width: W * S,
            height: H * S,
          }}
        >
          <div style={{ transform: `scale(${S})`, transformOrigin: "top left" }}>
            <FloorPlan t={t} accent={product.accent} aps={[0, 0, 0]}>
              <defs>
                <radialGradient id="heat">
                  <stop offset="0%" stopColor="#E5262B" stopOpacity={0.85} />
                  <stop offset="35%" stopColor="#F97316" stopOpacity={0.6} />
                  <stop offset="65%" stopColor="#FACC15" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
                </radialGradient>
              </defs>
              {HEAT.map((h, i) => {
                const p = ramp(t, h.at, h.at + 1.0);
                const breathe = 1 + Math.sin(t * 2 + i) * 0.03;
                return (
                  <circle
                    key={i}
                    cx={h.x}
                    cy={h.y}
                    r={h.r * p * breathe}
                    fill="url(#heat)"
                    opacity={h.k}
                  />
                );
              })}
            </FloorPlan>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: H * S + 40,
            height: 22,
            borderRadius: 99,
            background: "linear-gradient(90deg, #FACC1544, #FACC15, #F97316, #E5262B)",
            opacity: ramp(t, 1.0, 1.4),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: H * S + 72,
            display: "flex",
            justifyContent: "space-between",
            ...text(20, 700, MUTED),
            opacity: ramp(t, 1.0, 1.4),
          }}
        >
          <span>Pouco movimento</span>
          <span>Muito movimento</span>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: H * S + 140 }}>
          {RANK.map((r, i) => (
            <BarRow
              key={r.l}
              label={r.l}
              pct={r.v}
              p={ramp(t, 2.2 + i * 0.3, 3.2 + i * 0.3)}
              color={product.accent}
              style={{ marginBottom: 24 }}
            />
          ))}
        </div>
      </Browser>
    </AbsoluteFill>
  );
};

/* Passo 4 ------------------------------------------------------------ */

const Decidir: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const k = ramp(t, 0.6, 2.2);
  const alert = usePop(3.0, true);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1000}
        title="Wimap · Dashboard"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 30, right: 30, top: 30, display: "flex", gap: 20 }}>
          <Kpi
            label="Conexões"
            value={new Intl.NumberFormat("pt-BR").format(Math.round(1284 * k))}
            accent={product.accent}
            style={{ flex: 1 }}
          />
          <Kpi label="Permanência" value={`${Math.round(42 * k)} min`} accent={INK} style={{ flex: 1 }} />
          <Kpi label="Recorrência" value={`${Math.round(63 * k)}%`} accent={INK} style={{ flex: 1 }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 230,
            height: 470,
            borderRadius: 20,
            border: `1px solid ${LINE}`,
            padding: "24px 26px",
          }}
        >
          <div style={text(26, 800)}>Fluxo de visitantes por hora</div>
          <div style={{ marginTop: 16 }}>
            <AreaChart
              values={[0.12, 0.2, 0.35, 0.55, 0.4, 0.38, 0.5, 0.72, 0.95, 0.6]}
              labels={["9h", "11h", "13h", "15h", "17h", "19h", "21h"]}
              width={866}
              height={360}
              color={product.accent}
              p={ramp(t, 0.8, 2.8)}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 730,
            display: "flex",
            gap: 20,
            opacity: ramp(t, 2.0, 2.4),
          }}
        >
          {[
            { k: "Novos", v: "37%" },
            { k: "Recorrentes", v: "63%" },
            { k: "Pico", v: "18h" },
          ].map((r) => (
            <div key={r.k} style={{ flex: 1, padding: "18px 22px", borderRadius: 18, background: "#F6F8FB" }}>
              <div style={text(20, 600, MUTED)}>{r.k}</div>
              <div style={{ marginTop: 4, ...text(34, 900, INK) }}>{r.v}</div>
            </div>
          ))}
        </div>
      </Browser>

      {/* alerta automático */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1590,
          borderRadius: 32,
          background: "#fff",
          boxShadow: `0 24px 50px rgba(16,30,54,0.2), 0 0 0 3px ${product.accent}`,
          padding: "26px 30px",
          display: "flex",
          gap: 22,
          alignItems: "center",
          opacity: Math.min(1, alert * 1.3),
          transform: `translateY(${interpolate(alert, [0, 1], [60, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: product.accent,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...text(44, 900, "#fff"),
          }}
        >
          !
        </div>
        <div>
          <div style={text(30, 800)}>Pico de movimento na Entrada</div>
          <div style={{ marginTop: 4, ...text(24, 600, MUTED) }}>Alerta automático · 18h12 · +45% vs. média</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const wimapConfig: DemoConfig = {
  product: P,
  tagline: (
    <>
      Enxergue quem passa,
      <br />
      entra e volta.
    </>
  ),
  steps: [
    { title: "Mapeie o seu espaço", subtitle: "A planta da loja, as zonas e os pontos de acesso.", seconds: 5.6, Scene: Mapear },
    { title: "Veja quem está por perto", subtitle: "Inclusive quem ainda não se conectou ao Wi-Fi.", seconds: 6.2, Scene: Detectar },
    { title: "Mapa de calor", subtitle: "Onde as pessoas passam — e onde elas param.", seconds: 5.8, Scene: Calor },
    { title: "Decida com dados", subtitle: "Fluxo, permanência, recorrência e alertas.", seconds: 5.8, Scene: Decidir },
  ],
  benefits: [
    { title: "Eficiência", text: "Equipe e layout ajustados ao movimento real." },
    { title: "Decisões com dados", text: "Insights precisos para cada estratégia." },
    { title: "Segurança", text: "Monitoramento contínuo do ambiente." },
    { title: "Escalabilidade", text: "De uma loja a uma rede inteira." },
  ],
  endLine: (
    <>
      O seu espaço físico,
      <br />
      medido como um site.
    </>
  ),
};
