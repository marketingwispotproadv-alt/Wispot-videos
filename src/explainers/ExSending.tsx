import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { AreaChart, BarRow, Caret, Cursor, INK, Kpi, LINE, MUTED, PhoneNotification, ramp, SCREEN, Tap, text, typed, useT } from "../demos/kit";
import {
  Avatar,
  Chip,
  DashboardShell,
  PanelBox,
  PanelButton,
  PanelSection,
  PanelTitle,
  ProfileCard,
  ToggleRow,
} from "./ex-kit";
import type { ExplainerConfig } from "./ExplainerVideo";

/**
 * Sending no estilo do institucional: a mensagem chega no celular de quem já
 * visitou a loja, o lojista segmenta, escreve e agenda no Painel de Controle,
 * e acompanha entregas e cliques no notebook.
 */

const ORANGE = "#F46904";
const YELLOW = "#FCD800";
const EMAIL = "#2F6FDE";

const MESSAGE = "Olá, {nome}! Sua promoção vale até amanhã: 15% OFF no café.";

/** troca {nome} pelo nome, ou por uma etiqueta quando é o editor */
const withName = (s: string, name?: string) =>
  s.split("{nome}").flatMap((part, i, all) =>
    i < all.length - 1
      ? [
          part,
          name ? (
            <b key={i}>{name}</b>
          ) : (
            <span key={i} style={{ padding: "1px 10px", borderRadius: 8, background: `${YELLOW}`, color: "#4A3A00", fontWeight: 800 }}>
              nome
            </span>
          ),
        ]
      : [part],
  );

/* Conversa no app de mensagens ------------------------------------------- */

const Thread: React.FC<{ message: React.ReactNode; reply?: number; typing?: boolean; footer?: React.ReactNode }> = ({ message, reply = 0, typing, footer }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
    <div style={{ height: 230, paddingTop: 96, borderBottom: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", background: "#F7F7F9" }}>
      <div style={{ width: 76, height: 76, borderRadius: 99, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", ...text(26, 900, "#fff") }}>SM</div>
      <div style={{ marginTop: 8, ...text(22, 700, INK) }}>Sua Marca</div>
    </div>
    <div style={{ padding: "30px 28px" }}>
      <div style={{ textAlign: "center", ...text(18, 600, MUTED) }}>Hoje 18:00</div>
      <div style={{ marginTop: 18, maxWidth: 400, borderRadius: "28px 28px 28px 8px", background: "#E9E9EB", padding: "18px 22px", ...text(26, 500, INK, { lineHeight: 1.38 }) }}>
        {message}
        <div style={{ marginTop: 8, color: EMAIL, textDecoration: "underline" }}>suamarca.com.br/oferta</div>
      </div>
      {typing && (
        <div style={{ marginTop: 18, marginLeft: "auto", width: 90, height: 50, borderRadius: 25, background: "#E3EEFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: 99, background: "#7FA6E8" }} />
          ))}
        </div>
      )}
      {reply > 0 && (
        <div
          style={{
            marginTop: 18,
            marginLeft: "auto",
            width: "fit-content",
            maxWidth: 360,
            borderRadius: "28px 28px 8px 28px",
            background: "#1A8CFF",
            padding: "16px 22px",
            opacity: reply,
            transform: `translateY(${interpolate(reply, [0, 1], [20, 0])}px)`,
            ...text(26, 600, "#fff"),
          }}
        >
          Oba! Passo aí amanhã.
        </div>
      )}
      {footer}
    </div>
  </div>
);

/* 3 · celular do cliente ---------------------------------------------------- */

const PhoneScreen: React.FC = () => {
  const t = useT();
  const open = ramp(t, 3.3, 3.7);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, #3A2A5C 0%, #14122A 75%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 120,
        }}
      >
        <div style={text(26, 600, "rgba(255,255,255,0.8)")}>quinta-feira, 20 de novembro</div>
        <div style={text(140, 700, "#fff", { letterSpacing: -4, lineHeight: 1.1 })}>9:41</div>
      </div>
      <PhoneNotification
        at={0.8}
        until={3.3}
        top={420}
        app="Mensagens"
        glyph={<span style={{ fontSize: 20 }}>SMS</span>}
        color="#34C759"
        title="Sua Marca"
        body="Olá, Ana! Sua promoção vale até amanhã: 15% OFF no café."
      />
      <PhoneNotification
        at={1.8}
        until={3.3}
        top={620}
        app="E-mail"
        glyph="@"
        color={EMAIL}
        title="Novidades da semana pra você"
        body="Ana, separamos ofertas especiais."
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - open) * SCREEN.h}px)` }}>
        <Thread message={withName(MESSAGE, "Ana")} typing={t > 4.3 && t < 4.9} reply={ramp(t, 4.9, 5.2)} />
      </div>
      <Tap x={264} y={490} at={3.2} />
    </>
  );
};

const PhoneSide: React.FC = () => (
  <>
    <ProfileCard
      at={1.0}
      left={860}
      top={170}
      avatar={<Avatar size={150} skin="#F2C7A5" hair="long" hairColor="#4A2F20" top="#3F8FD0" />}
      title="Ana Souza, 32 anos"
      sub="7 visitas · recebeu o SMS"
      stars={5}
      icon="sms"
      color={ORANGE}
    />
    <ProfileCard
      at={1.8}
      left={860}
      top={390}
      avatar={<Avatar size={150} skin="#A86E4B" hair="short" hairColor="#1F1A17" top="#E36B4C" />}
      title="Bruno Lima, 27 anos"
      sub="4 visitas · abriu o e-mail"
      stars={4}
      icon="mail"
      color={ORANGE}
    />
    <ProfileCard
      at={2.6}
      left={860}
      top={610}
      avatar={<Avatar size={150} skin="#F6D3BC" hair="bun" hairColor="#8A5A35" top="#4FAE84" />}
      title="Carla Mendes, 41 anos"
      sub="9 visitas · clicou na oferta"
      stars={5}
      icon="star"
      color={ORANGE}
    />
  </>
);

/* 4 · painel de controle ------------------------------------------------------ */

const CLICK = { f1: 0.9, f2: 1.5, email: 2.2, text: 2.75, date: 5.4, hour: 5.9, send: 6.6 };
const MSG_START = 2.9;
const MSG_CPS = 26;
const COUNTS = [12480, 5932, 3216];
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const panelState = (t: number) => {
  const raw = typed(MESSAGE, t, MSG_START, MSG_CPS);
  return {
    count: COUNTS[0] + (COUNTS[1] - COUNTS[0]) * ramp(t, CLICK.f1, CLICK.f1 + 0.5) + (COUNTS[2] - COUNTS[1]) * ramp(t, CLICK.f2, CLICK.f2 + 0.5),
    msg: raw.replace(/\{[a-z]*$/, ""),
    scheduled: t > CLICK.send + 0.15,
  };
};

const PanelPhone: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return (
    <Thread
      message={s.msg ? withName(s.msg, "Ana") : <span style={{ color: MUTED }}>…</span>}
      footer={
        s.scheduled ? (
          <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
            <span style={{ padding: "10px 20px", borderRadius: 999, background: "#FFF1E6", ...text(20, 800, ORANGE) }}>Agendado · sex, 21/11 · 18:00</span>
          </div>
        ) : null
      }
    />
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
      <PanelSection icon="users" title="Público" at={0.5} style={{ position: "absolute", left: 700, top: 200 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <Chip label="Visitou 3+ vezes" on={t > CLICK.f1} accent={ORANGE} />
          <Chip label="Últimos 30 dias" on={t > CLICK.f2} accent={ORANGE} />
        </div>
        <div style={{ marginTop: 18, ...text(44, 900, INK, { letterSpacing: -1 }) }}>
          {fmt(s.count)} <span style={text(24, 600, MUTED)}>contatos</span>
        </div>
      </PanelSection>
      <PanelSection icon="send" title="Canal" at={0.7} style={{ position: "absolute", left: 1300, top: 200 }}>
        <ToggleRow label="SMS" on={1} accent={ORANGE} />
        <ToggleRow label="E-mail" on={ramp(t, CLICK.email, CLICK.email + 0.2)} accent={ORANGE} />
      </PanelSection>
      <PanelSection icon="sms" title="Mensagem" at={0.9} style={{ position: "absolute", left: 700, top: 540 }}>
        <div
          style={{
            width: 520,
            height: 170,
            boxSizing: "border-box",
            borderRadius: 14,
            background: "#fff",
            border: `3px solid ${t > CLICK.text && t < 5.3 ? ORANGE : LINE}`,
            padding: "14px 18px",
            ...text(25, 600, INK, { lineHeight: 1.45 }),
          }}
        >
          {withName(s.msg)}
          <Caret t={t} from={CLICK.text} to={5.3} />
        </div>
      </PanelSection>
      <PanelSection icon="calendar" title="Agendamento" at={1.1} style={{ position: "absolute", left: 1300, top: 540 }}>
        <PanelBox label="Data" value={t > CLICK.date ? "Sex, 21/11" : "—"} focused={t > CLICK.date - 0.1 && t < CLICK.hour} width={340} accent={ORANGE} />
        <div style={{ height: 14 }} />
        <PanelBox label="Hora" value={t > CLICK.hour ? "18:00" : "—"} focused={t > CLICK.hour - 0.1 && t < CLICK.send} width={340} accent={ORANGE} />
        <div style={{ height: 14 }} />
        <PanelButton color={ORANGE} pressed={t > CLICK.send && t < CLICK.send + 0.2} width={340}>
          {s.scheduled ? "✓ Envio agendado" : "Agendar envio"}
        </PanelButton>
      </PanelSection>
      <Cursor
        keys={[
          { t: 0.5, x: 1100, y: 900 },
          { t: 0.85, x: 817, y: 293 },
          { t: 1.45, x: 1075, y: 293 },
          { t: 2.15, x: 1698, y: 361 },
          { t: 2.7, x: 960, y: 680 },
          { t: 5.35, x: 1470, y: 641 },
          { t: 5.85, x: 1470, y: 721 },
          { t: 6.55, x: 1470, y: 800 },
        ]}
        clicks={[CLICK.f1, CLICK.f2, CLICK.email, CLICK.text, CLICK.date, CLICK.hour, CLICK.send]}
        from={0.5}
        until={7.4}
      />
    </AbsoluteFill>
  );
};

/* 5 · notebook ------------------------------------------------------------------ */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "users" as const, label: "Database" },
  { icon: "send" as const, label: "Campanhas" },
  { icon: "layers" as const, label: "Empresa" },
];

const Dashboard: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.2);
  return (
    <DashboardShell logo="sending" menu={MENU} active={0} title="Campanha · Clientes fiéis">
      <div style={{ display: "flex", gap: 20 }}>
        <Kpi label="Enviados" value={fmt(3216 * k)} accent={INK} style={{ flex: 1 }} />
        <Kpi label="Entregues" value={`${(98.7 * k).toFixed(1).replace(".", ",")}%`} accent={ORANGE} style={{ flex: 1 }} />
        <Kpi label="Cliques" value={`${(24.1 * k).toFixed(1).replace(".", ",")}%`} accent={INK} style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 650, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", ...text(24, 800) }}>
          Uso de E-mail / SMS
          <span style={{ marginLeft: "auto", display: "flex", gap: 18, ...text(18, 700, MUTED) }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 99, background: ORANGE }} />
              SMS
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 99, background: EMAIL }} />
              E-mail
            </span>
          </span>
        </div>
        <div style={{ position: "relative", marginTop: 12, height: 260 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <AreaChart values={[0.1, 0.22, 0.18, 0.4, 0.3, 0.52, 0.45, 0.9, 0.6, 0.48]} labels={["01/11", "08/11", "15/11", "21/11"]} width={600} height={260} color={ORANGE} p={ramp(t, 0.8, 3.0)} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <AreaChart values={[0.06, 0.1, 0.14, 0.12, 0.2, 0.18, 0.26, 0.34, 0.28, 0.3]} width={600} height={230} color={EMAIL} p={ramp(t, 1.0, 3.2)} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 670, top: 150, right: 0, height: 340, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={{ ...text(24, 800), marginBottom: 22 }}>Funil da campanha</div>
        {[
          { l: "Entregues", v: 99 },
          { l: "Abertos", v: 41 },
          { l: "Cliques", v: 24 },
        ].map((r, i) => (
          <BarRow key={r.l} label={r.l} pct={r.v} p={ramp(t, 1.4 + i * 0.35, 2.6 + i * 0.35)} color={i === 2 ? "#C25300" : ORANGE} style={{ marginBottom: 22 }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 512,
          height: 70,
          borderRadius: 14,
          background: "#fff",
          border: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
          opacity: ramp(t, 2.6, 3.0),
        }}
      >
        <span style={{ padding: "6px 14px", borderRadius: 999, background: "#FFF1E6", ...text(18, 800, ORANGE) }}>SMS</span>
        <span style={text(21, 800)}>Clientes fiéis · 15% OFF no café</span>
        <span style={{ marginLeft: "auto", ...text(19, 600, MUTED) }}>sex, 21/11 · 18:00</span>
        <span style={{ padding: "6px 14px", borderRadius: 999, background: "#E7F6EC", ...text(18, 800, "#1E9B4B") }}>Enviada</span>
      </div>
      <Cursor keys={[{ t: 3.4, x: 900, y: 600 }, { t: 4.6, x: 540, y: 200 }]} from={3.4} />
    </DashboardShell>
  );
};

/* 7 · celular do fechamento ------------------------------------------------------ */

const OutroScreen: React.FC = () => <Thread message={withName(MESSAGE, "Ana")} reply={1} />;

export const sendingExplainer: ExplainerConfig = {
  logo: "sending",
  name: "Sending",
  accent: ORANGE,
  place: "cafe",
  hook: [
    { at: 0.4, until: 3.6, text: "Seus clientes se conectaram ao seu Wi-Fi…" },
    { at: 3.9, until: 7.2, text: "…e depois? Que tal falar com eles de novo?" },
  ],
  tagline: "SMS e e-mail para quem já conhece a sua marca.",
  phone: {
    Screen: PhoneScreen,
    Side: PhoneSide,
    screenBg: "#14122A",
    caption: [
      { at: 0.4, until: 3.9, text: "Com o Sending, a sua mensagem chega por SMS e e-mail." },
      { at: 4.2, until: 7.9, text: "Personalizada, para quem já visitou a sua loja." },
    ],
  },
  panel: {
    Screen: PanelPhone,
    Panel,
    caption: [
      { at: 0.4, until: 4.3, text: "No Painel de Controle, você escolhe o público e escreve a mensagem." },
      { at: 4.5, until: 8.1, text: "E agenda o envio para a hora certa." },
    ],
  },
  laptop: {
    Screen: Dashboard,
    caption: [{ at: 0.4, until: 7.3, text: "Depois, acompanha entregas, aberturas e cliques de cada campanha." }],
  },
  tiles: [
    { icon: "send", label: "Envio automatizado" },
    { icon: "users", label: "Segmentação avançada" },
    { icon: "chart", label: "Relatórios detalhados" },
  ],
  bullets: [
    { icon: "users", title: "Mais engajamento", text: "a mensagem certa, na hora certa" },
    { icon: "layers", title: "Tudo num só lugar", text: "SMS e e-mail integrados ao seu Wi-Fi" },
  ],
  OutroScreen,
};
