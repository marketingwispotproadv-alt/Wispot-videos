import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Check, Cursor, INK, interpolateColor, Kpi, LINE, MUTED, ramp, SCREEN, Tap, text, useT, WifiGlyph } from "../demos/kit";
import {
  Avatar,
  DashboardShell,
  PanelButton,
  PanelSection,
  PanelTitle,
  ProfileCard,
  Swatches,
  ToggleRow,
} from "./ex-kit";
import type { ExplainerConfig } from "./ExplainerVideo";
import { BrandSlot } from "./screens";

/**
 * Wiquest no estilo do institucional: o cliente responde a pesquisa logo
 * depois de se conectar, o lojista monta a pesquisa com a marca dele no
 * Painel de Controle e vê os resultados chegando no notebook.
 */

const ORANGE = "#F46904";
const Q1 = "Você voltaria a nos visitar?";
const Q2 = "Que nota você dá para o atendimento?";

/* Telas da pesquisa ------------------------------------------------------- */

const Progress: React.FC<{ n: number; of: number; color: string }> = ({ n, of, color }) => (
  <>
    <div style={{ width: "100%", ...text(22, 700, color, { letterSpacing: 1 }) }}>
      PESQUISA RÁPIDA · {n} DE {of}
    </div>
    <div style={{ marginTop: 14, width: "100%", height: 10, borderRadius: 99, background: `${color}33` }}>
      <div style={{ width: `${(n / of) * 100}%`, height: 10, borderRadius: 99, background: color }} />
    </div>
  </>
);

const YesNo: React.FC<{ color: string; yes?: number; brand?: React.ReactNode; of?: number }> = ({ color, yes = 0, brand, of = 2 }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${color}22 0%, ${color}08 100%)`, padding: "110px 46px 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {brand ?? <BrandSlot dark />}
    <div style={{ height: 34 }} />
    <Progress n={1} of={of} color={color} />
    <div style={{ marginTop: 56, width: "100%", ...text(48, 900, INK, { lineHeight: 1.15, letterSpacing: -1 }) }}>{Q1}</div>
    {["Sim", "Não"].map((o, i) => {
      const sel = i === 0 && yes > 0;
      return (
        <div
          key={o}
          style={{
            marginTop: i ? 22 : 70,
            width: "100%",
            height: 96,
            borderRadius: 999,
            border: `4px solid ${color}`,
            background: sel ? color : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            ...text(32, 800, sel ? "#fff" : color),
          }}
        >
          {sel && <Check size={34} color={color} bg="#fff" p={yes} />}
          {o}
        </div>
      );
    })}
  </div>
);

/* 3 · celular do cliente ---------------------------------------------------- */

const PhoneScreen: React.FC = () => {
  const t = useT();
  // 0 = conectado, 1 = pergunta 1, 2 = pergunta 2, 3 = obrigado
  const pos = ramp(t, 1.0, 1.4) + ramp(t, 2.75, 3.15) + ramp(t, 4.45, 4.85);
  const nine = t > 3.95;
  const thanks = ramp(t, 4.7, 5.2);
  const at = (i: number): React.CSSProperties => ({ position: "absolute", top: 0, width: SCREEN.w, height: SCREEN.h, left: (i - pos) * SCREEN.w });

  return (
    <>
      <div style={{ ...at(0), background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 300 }}>
        <div style={{ width: 200, height: 200, borderRadius: 99, background: "#2BA3E0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(43,163,224,0.35)" }}>
          <WifiGlyph size={110} color="#fff" />
        </div>
        <div style={{ marginTop: 46, ...text(48, 900) }}>Conectado</div>
        <div style={{ marginTop: 10, ...text(28, 600, MUTED) }}>Wi-Fi do restaurante</div>
      </div>
      <div style={at(1)}>
        <YesNo color={ORANGE} yes={ramp(t, 2.3, 2.55)} />
      </div>
      <div style={{ ...at(2), background: `linear-gradient(180deg, ${ORANGE}22 0%, ${ORANGE}08 100%)`, padding: "110px 46px 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BrandSlot dark />
        <div style={{ height: 34 }} />
        <Progress n={2} of={2} color={ORANGE} />
        <div style={{ marginTop: 56, width: "100%", ...text(44, 900, INK, { lineHeight: 1.15, letterSpacing: -1 }) }}>{Q2}</div>
        <div style={{ marginTop: 50, width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {Array.from({ length: 11 }, (_, i) => {
            const sel = i === 9 && nine;
            return (
              <div
                key={i}
                style={{
                  height: 84,
                  borderRadius: 20,
                  border: `3px solid ${sel ? ORANGE : "#F3C8AE"}`,
                  background: sel ? ORANGE : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${sel ? interpolate(t, [3.95, 4.05, 4.2], [1, 1.12, 1], { extrapolateRight: "clamp" }) : 1})`,
                  ...text(32, 900, sel ? "#fff" : INK),
                }}
              >
                {i}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ ...at(3), background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 300 }}>
        <div style={{ transform: `scale(${0.6 + thanks * 0.4})` }}>
          <Check size={220} color={ORANGE} p={ramp(t, 4.85, 5.3)} />
        </div>
        <div style={{ marginTop: 50, textAlign: "center", ...text(46, 900, INK, { lineHeight: 1.2 }) }}>
          Obrigado pela
          <br />
          sua opinião!
        </div>
      </div>
      <Tap x={264} y={535} at={2.3} />
      <Tap x={208} y={747} at={3.95} />
    </>
  );
};

const PhoneSide: React.FC = () => (
  <>
    <ProfileCard
      at={1.0}
      left={860}
      top={170}
      avatar={<Avatar size={150} skin="#F2C7A5" hair="long" hairColor="#5A3825" top="#C94F7C" />}
      title="Renata Alves, 32 anos"
      sub="voltaria · nota 9"
      stars={5}
      icon="star"
      color={ORANGE}
    />
    <ProfileCard
      at={1.8}
      left={860}
      top={390}
      avatar={<Avatar size={150} skin="#A86E4B" hair="short" hairColor="#1F1A17" top="#3F8FD0" />}
      title="Diego Oliveira, 23 anos"
      sub="voltaria · nota 8"
      stars={4}
      icon="star"
      color={ORANGE}
    />
    <ProfileCard
      at={2.6}
      left={860}
      top={610}
      avatar={<Avatar size={150} skin="#D9A27A" hair="bun" hairColor="#2A1C14" top="#4FAE84" />}
      title="Luciana Dias, 18 anos"
      sub="não voltaria · nota 4 · alerta"
      stars={2}
      icon="bell"
      color={ORANGE}
    />
  </>
);

/* 4 · painel de controle ---------------------------------------------------- */

const COLORS = ["#E2556B", "#2BA3E0", "#2E9E6A", "#7B52D6", ORANGE];
const CLICK = { q: [0.8, 1.4, 2.0], blue: 2.8, green: 3.6, orange: 4.4, logo: 5.2, sms: 6.0, mail: 6.5 };
const QUESTIONS = ["Você voltaria? · Sim/Não", "Nota do atendimento · 0 a 10", "O que podemos melhorar? · Texto"];

const panelState = (t: number) => {
  let color = "#9AA3AE";
  [
    [CLICK.blue, COLORS[1]],
    [CLICK.green, COLORS[2]],
    [CLICK.orange, COLORS[4]],
  ].forEach(([at, c]) => {
    color = interpolateColor(ramp(t, at as number, (at as number) + 0.3), toHex(color), c as string);
  });
  return {
    color,
    selected: t < CLICK.blue ? "" : t < CLICK.green ? COLORS[1] : t < CLICK.orange ? COLORS[2] : COLORS[4],
    questions: CLICK.q.filter((a) => t > a).length,
    logo: ramp(t, CLICK.logo, CLICK.logo + 0.3),
  };
};

const toHex = (rgb: string) => {
  if (rgb.startsWith("#")) return rgb;
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** logo genérico do cliente, depois do envio */
const ClientLogo: React.FC<{ color: string; p: number }> = ({ color, p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>
    <span style={{ width: 54, height: 54, borderRadius: 16, background: color, display: "inline-flex", alignItems: "center", justifyContent: "center", ...text(26, 900, "#fff") }}>S</span>
    <span style={text(30, 900, INK, { letterSpacing: -0.5 })}>Sua Marca</span>
  </div>
);

const PanelPhone: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return <YesNo color={s.color} of={Math.max(1, s.questions)} brand={s.logo > 0 ? <ClientLogo color={s.color} p={s.logo} /> : undefined} />;
};

const Panel: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 700, top: 86 }}>
        <PanelTitle>Painel de Controle</PanelTitle>
      </div>
      <PanelSection icon="list" title="Perguntas" at={0.4} style={{ position: "absolute", left: 700, top: 200 }}>
        <PanelButton color={ORANGE} pressed={CLICK.q.some((a) => t > a && t < a + 0.2)} width={300}>
          + Adicionar pergunta
        </PanelButton>
        <div style={{ marginTop: 14 }}>
          {QUESTIONS.map((q, i) => {
            const p = ramp(t, CLICK.q[i] + 0.05, CLICK.q[i] + 0.35);
            return p > 0 ? (
              <div
                key={q}
                style={{
                  width: 520,
                  height: 58,
                  marginBottom: 10,
                  borderRadius: 12,
                  background: "#fff",
                  borderLeft: `6px solid ${ORANGE}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
                  ...text(22, 700, "#2F3743"),
                }}
              >
                {i + 1}. {q}
              </div>
            ) : null;
          })}
        </div>
      </PanelSection>
      <PanelSection icon="palette" title="Cores da marca" at={0.6} style={{ position: "absolute", left: 1300, top: 200 }}>
        <Swatches colors={COLORS} selected={s.selected} />
      </PanelSection>
      <PanelSection icon="image" title="Logotipo" at={0.8} style={{ position: "absolute", left: 1300, top: 420 }}>
        <div
          style={{
            width: 440,
            height: 100,
            borderRadius: 14,
            border: `3px dashed ${s.logo > 0 ? "#1E9B4B" : "#B5BDC7"}`,
            background: s.logo > 0 ? "#EEF8F1" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...text(24, 800, s.logo > 0 ? "#1E9B4B" : MUTED),
          }}
        >
          {s.logo > 0 ? "✓ logo-sua-marca.png" : "Enviar logotipo"}
        </div>
      </PanelSection>
      <PanelSection icon="bell" title="Alertas" at={1.0} style={{ position: "absolute", left: 1300, top: 640 }}>
        <ToggleRow label="Nota baixa por SMS" on={ramp(t, CLICK.sms, CLICK.sms + 0.2)} accent={ORANGE} />
        <ToggleRow label="Resumo por e-mail" on={ramp(t, CLICK.mail, CLICK.mail + 0.2)} accent={ORANGE} />
      </PanelSection>
      <Cursor
        keys={[
          { t: 0.4, x: 1100, y: 900 },
          { t: 0.75, x: 850, y: 300 },
          { t: 2.6, x: 1417, y: 301 },
          { t: 3.55, x: 1501, y: 301 },
          { t: 4.35, x: 1669, y: 301 },
          { t: 5.15, x: 1520, y: 538 },
          { t: 5.95, x: 1698, y: 739 },
          { t: 6.45, x: 1698, y: 801 },
        ]}
        clicks={[...CLICK.q, CLICK.blue, CLICK.green, CLICK.orange, CLICK.logo, CLICK.sms, CLICK.mail]}
        from={0.4}
        until={7.3}
      />
    </AbsoluteFill>
  );
};

/* 5 · notebook ---------------------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Resultados" },
  { icon: "list" as const, label: "Pesquisas" },
  { icon: "bell" as const, label: "Alertas" },
  { icon: "link" as const, label: "Integração" },
];
const NOTES = [1, 0, 1, 2, 1, 3, 5, 8, 14, 19, 12];
const EXPORT_AT = 5.0;

const Dashboard: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.2);
  const bars = ramp(t, 0.9, 2.4);
  return (
    <DashboardShell logo="wiquest" menu={MENU} active={0} title="Pesquisa de satisfação · Hoje">
      <div style={{ display: "flex", gap: 20 }}>
        <Kpi label="Respostas" value={new Intl.NumberFormat("pt-BR").format(Math.round(1284 * k + Math.max(0, t - 2.2) * 3))} accent={ORANGE} style={{ flex: 1 }} />
        <Kpi label="Nota média" value={(8.7 * k).toFixed(1).replace(".", ",")} accent={INK} style={{ flex: 1 }} />
        <Kpi label="Voltariam" value={`${Math.round(82 * k)}%`} accent={INK} style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 400, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={text(22, 800)}>{Q1}</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 24, height: 250, display: "flex", alignItems: "flex-end", gap: 50, justifyContent: "center" }}>
          {[
            { l: "Sim", v: 82, c: ORANGE },
            { l: "Não", v: 18, c: "#CBD2DB" },
          ].map((b) => (
            <div key={b.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={text(26, 900, b.l === "Sim" ? ORANGE : MUTED)}>{Math.round(b.v * bars)}%</div>
              <div style={{ width: 96, height: 170 * (b.v / 100) * bars, borderRadius: 14, background: b.c }} />
              <div style={text(20, 700, MUTED)}>{b.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 420, top: 150, right: 0, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={text(22, 800)}>Notas do atendimento</div>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 20, height: 260, display: "flex", alignItems: "flex-end", gap: 8 }}>
          {NOTES.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", height: (v / 19) * 210 * ramp(t, 1.0 + i * 0.07, 2.2 + i * 0.07), borderRadius: 6, background: interpolateColor(i / 10, "#FAD3BC", ORANGE) }} />
              <div style={text(17, 700, MUTED)}>{i}</div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 330,
          top: 512,
          height: 74,
          borderRadius: 14,
          background: "#fff",
          border: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 20px",
          opacity: ramp(t, 2.6, 3.0),
        }}
      >
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "#34C759", display: "inline-flex", alignItems: "center", justifyContent: "center", ...text(14, 900, "#fff") }}>SMS</span>
        <span style={text(20, 800)}>Alerta enviado: nota 4</span>
        <span style={{ marginLeft: "auto", ...text(18, 600, MUTED) }}>Loja Centro · agora</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 517 }}>
        <div
          style={{
            width: 300,
            height: 64,
            borderRadius: 14,
            border: `3px solid ${ORANGE}`,
            background: t > EXPORT_AT + 0.2 ? ORANGE : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${t > EXPORT_AT && t < EXPORT_AT + 0.2 ? 0.95 : 1})`,
            ...text(22, 800, t > EXPORT_AT + 0.2 ? "#fff" : ORANGE),
          }}
        >
          {t > EXPORT_AT + 0.2 ? "✓ resultados.csv" : "Exportar CSV"}
        </div>
      </div>
      <Cursor keys={[{ t: 3.6, x: 600, y: 620 }, { t: 4.9, x: 930, y: 552 }]} clicks={[EXPORT_AT]} from={3.6} />
    </DashboardShell>
  );
};

/* 7 · celular do fechamento ---------------------------------------------------- */

const OutroScreen: React.FC = () => <YesNo color={ORANGE} brand={<ClientLogo color={ORANGE} p={1} />} of={3} />;

export const wiquestExplainer: ExplainerConfig = {
  logo: "wiquest",
  name: "Wiquest",
  accent: ORANGE,
  place: "restaurant",
  hook: [
    { at: 0.4, until: 3.6, text: "Você sabe o que seus clientes acharam da visita?" },
    { at: 3.9, until: 7.2, text: "Pergunte — enquanto eles ainda estão aí." },
  ],
  tagline: "Ouça seus clientes em tempo real.",
  phone: {
    Screen: PhoneScreen,
    Side: PhoneSide,
    caption: [
      { at: 0.4, until: 4.0, text: "Com a Wiquest, o cliente responde pelo celular, logo depois de se conectar." },
      { at: 4.3, until: 7.9, text: "Em poucos segundos, sem baixar nada." },
    ],
  },
  panel: {
    Screen: PanelPhone,
    Panel,
    caption: [
      { at: 0.4, until: 4.3, text: "No Painel de Controle, você monta a pesquisa com as cores da sua marca." },
      { at: 4.5, until: 8.1, text: "E escolhe quando quer ser avisado." },
    ],
  },
  laptop: {
    Screen: Dashboard,
    caption: [{ at: 0.4, until: 7.3, text: "As respostas viram gráficos na hora — prontos para exportar." }],
  },
  tiles: [
    { icon: "question", label: "Pesquisas personalizadas" },
    { icon: "bell", label: "Alertas por SMS e e-mail" },
    { icon: "link", label: "Integração via API" },
  ],
  bullets: [
    { icon: "chart", title: "Decisões mais rápidas", text: "insights prontos para ação" },
    { icon: "users", title: "Clientes ouvidos", text: "pesquisas curtas, com a sua marca" },
  ],
  OutroScreen,
};
