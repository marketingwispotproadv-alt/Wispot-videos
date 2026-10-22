import React from "react";
import { FONT_FAMILY } from "../brand";
import { Caret, Cursor, INK, MUTED } from "../demos/kit";
import { Avatar, DashboardShell, Laptop, NavyBg } from "../explainers/ex-kit";
import { SKINS } from "../explainers/people";
import { DUR, EASE, Kinetic, pop, Tag, tween, useSeconds } from "./motion";
import { CountCard, FlipCalendar, IllustratedShot, LockPhone, SoftBg, StingShot, StoryConfig } from "./story-kit";

/**
 * Sending — "A cliente que sumiu".
 *
 * A Ana tomou um café no Café da Esquina, adorou… e nunca mais voltou. Mas
 * ela entrou no Wi-Fi, e o contato dela ficou. O Lucas separa quem não volta
 * há 30 dias, escreve uma mensagem com o nome de cada um e agenda o envio por
 * SMS, WhatsApp e e-mail. Na sexta de manhã, chega no WhatsApp da Ana — e ela volta.
 */

const ORANGE = "#F46904";
const YELLOW = "#FCD800";
const INKC = "#1B2430";
const WHATSAPP = "#25D366";
const EMAIL = "#2F6FDE";

const ANA = { skin: SKINS[0], hair: "long" as const, hairColor: "#4A2F20", top: "#3F8FD0", bottom: "#2E3440", dress: true };
const LUCAS = { skin: SKINS[2], hair: "short" as const, hairColor: "#1F1A17", top: "#FFFFFF", bottom: "#2E3440", tie: "#7A4B2A" };

/* 1 · a lembrança ---------------------------------------------------------- */

const Memory: React.FC = () => (
  <IllustratedShot
    place="cafe"
    accent={ORANGE}
    tint="rgba(255,205,140,0.45)"
    cast={[
      { x: 1250, y: 800, scale: 0.95, ...LUCAS, mood: "happy", behind: true },
      { x: 470, y: 960, scale: 1.18, ...ANA, pose: "sit", mood: "happy", wifiAt: 0.4 },
    ]}
    keys={[
      { t: 0, x: 540, y: 700, z: 1.9 },
      { t: 3.2, x: 600, y: 680, z: 1.7 },
    ]}
  >
    <Tag text="Março · Café da Esquina" at={0.2} accent={ORANGE} />
    <Kinetic lines={["A Ana veio uma vez."]} at={0.25} until={1.45} size={96} accent={ORANGE} color={INKC} shadow={false} plate="#fff" top={840} />
    <Kinetic lines={["*Amou* o café."]} at={1.7} until={3.1} size={96} accent={ORANGE} color={INKC} shadow={false} plate="#fff" top={840} />
  </IllustratedShot>
);

/* 2 · o tempo passa ---------------------------------------------------------- */

const Calendar: React.FC = () => (
  <SoftBg accent={ORANGE}>
    <FlipCalendar pages={["30 dias", "60 dias", "90 dias"]} at={0.1} step={0.6} accent={ORANGE} left={330} top={260} />
    <Kinetic lines={["E nunca", "mais *voltou*."]} at={0.4} size={112} accent={ORANGE} color={INKC} shadow={false} align="left" left={1000} top={360} width={900} />
  </SoftBg>
);

/* 3 · o Lucas lembra do Wi-Fi ----------------------------------------------- */

const Owner: React.FC = () => (
  <IllustratedShot
    place="cafe"
    accent={ORANGE}
    cast={[{ x: 1250, y: 800, scale: 0.95, ...LUCAS, mood: [[0, "sad"], [1.2, "surprised"]], behind: true }]}
    keys={[
      { t: 0, x: 1250, y: 560, z: 2.3 },
      { t: 2.9, x: 1250, y: 560, z: 2.55 },
    ]}
    punch={[1.2]}
  >
    <Kinetic lines={["Mas ela deixou o contato", "no seu *Wi-Fi*."]} at={0.35} until={2.7} size={74} accent={ORANGE} color={INKC} shadow={false} plate="#fff" top={790} />
  </IllustratedShot>
);

/* 5 · o painel do Sending ---------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "users" as const, label: "Database" },
  { icon: "send" as const, label: "Campanhas" },
];
const MSG = "Olá, {nome}! Sentimos sua falta. O próximo cappuccino é por nossa conta.";
const CLICK = { filter: 0.5, text: 1.4, whatsapp: 4.8, email: 5.35, send: 5.9 };

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const typedMsg = (t: number) => {
  const raw = MSG.slice(0, Math.max(0, Math.floor((t - CLICK.text - 0.1) * 40)));
  return raw.replace(/\{[a-z]*$/, "");
};

const NameToken = () => (
  <span style={{ padding: "2px 12px", borderRadius: 10, background: YELLOW, color: "#4A3A00", fontWeight: 800 }}>nome</span>
);

/** balão de conversa verde, no lugar do ícone do WhatsApp */
const Bubble: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M8.6 7.6c.3-.6 1.1-.6 1.3 0l.7 1.7c.1.3 0 .6-.2.8l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.2-.2.5-.3.8-.2l1.7.7c.6.2.6 1 0 1.3-1.6.9-3.4.5-5.3-1.4s-2.3-3.7-1.9-5.8Z" fill={color} />
  </svg>
);

const Channel: React.FC<{ label: string; on: boolean; color: string; icon?: React.ReactNode }> = ({ label, on, color, icon }) => (
  <span
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 24px",
      borderRadius: 999,
      border: `3px solid ${on ? color : "#D3D9E0"}`,
      background: on ? color : "#fff",
      color: on ? "#fff" : INK,
      fontWeight: 800,
      fontSize: 28,
    }}
  >
    {on ? "✓" : "+"} {icon}
    {label}
  </span>
);

const SendScreen: React.FC = () => {
  const t = useSeconds();
  const n = 12480 + (412 - 12480) * tween(t, CLICK.filter + 0.05, DUR.slow);
  const msg = typedMsg(t);
  const parts = msg.split("{nome}");
  const sent = t > CLICK.send + 0.15;
  return (
    <DashboardShell logo="sending" menu={MENU} active={2} title="Nova campanha · SMS, WhatsApp e e-mail">
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT_FAMILY }}>
        <span
          style={{
            padding: "14px 26px",
            borderRadius: 999,
            border: `3px solid ${t > CLICK.filter ? ORANGE : "#D3D9E0"}`,
            background: t > CLICK.filter ? ORANGE : "#fff",
            color: t > CLICK.filter ? "#fff" : INK,
            fontWeight: 800,
            fontSize: 26,
          }}
        >
          {t > CLICK.filter ? "✓ " : "+ "}Não volta há 30 dias
        </span>
        <span style={{ fontWeight: 900, fontSize: 48, color: INK, letterSpacing: -1 }}>{fmt(n)}</span>
        <span style={{ fontWeight: 600, fontSize: 24, color: MUTED }}>clientes do Wi-Fi</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          height: 220,
          borderRadius: 20,
          background: "#fff",
          border: `3px solid ${t > CLICK.text && t < CLICK.send ? ORANGE : "#E3E8EE"}`,
          padding: "22px 26px",
          boxSizing: "border-box",
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.5,
          color: INK,
        }}
      >
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {p}
            {i < parts.length - 1 && <NameToken />}
          </React.Fragment>
        ))}
        <Caret t={t} from={CLICK.text} to={CLICK.send - 0.2} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 384, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_FAMILY }}>
        <span style={{ fontWeight: 700, fontSize: 26, color: MUTED }}>Enviar por</span>
        <Channel label="SMS" on color={ORANGE} />
        <Channel label="WhatsApp" on={t > CLICK.whatsapp} color={WHATSAPP} icon={<Bubble size={28} color={t > CLICK.whatsapp ? "#fff" : WHATSAPP} />} />
        <Channel label="E-mail" on={t > CLICK.email} color={EMAIL} icon={<span style={{ fontSize: 28, lineHeight: 1 }}>✉</span>} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 490,
          width: 400,
          height: 92,
          borderRadius: 20,
          background: sent ? "#FFF1E6" : ORANGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 32,
          color: sent ? ORANGE : "#fff",
          transform: `scale(${t > CLICK.send && t < CLICK.send + 0.15 ? 0.95 : 1})`,
          boxShadow: sent ? "none" : `0 16px 34px ${ORANGE}55`,
        }}
      >
        {sent ? "✓ Agendado · sexta, 8h" : "Enviar sexta, 8h"}
      </div>
      <Cursor
        keys={[
          { t: 0, x: 700, y: 600 },
          { t: CLICK.filter - 0.05, x: 200, y: 30 },
          { t: CLICK.text - 0.05, x: 500, y: 200 },
          { t: CLICK.whatsapp - 0.05, x: 420, y: 418 },
          { t: CLICK.email - 0.05, x: 640, y: 418 },
          { t: CLICK.send - 0.05, x: 880, y: 536 },
        ]}
        clicks={[CLICK.filter, CLICK.text, CLICK.whatsapp, CLICK.email, CLICK.send]}
        from={0.15}
      />
    </DashboardShell>
  );
};

const Panel: React.FC = () => (
  <NavyBg>
    <Laptop left={310} top={60} width={1300}>
      <SendScreen />
    </Laptop>
    <Tag text="Quem não volta há 30 dias" at={0.3} accent={YELLOW} dark left={90} top={960} />
  </NavyBg>
);

/* 6 · as mensagens saem ------------------------------------------------------ */

const NAMES = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio", "Gabi", "Hugo", "Iara", "João", "Karen", "Léo", "Marina", "Nina", "Otávio", "Paula", "Rafa", "Sofia", "Tiago", "Vera", "Wagner", "Yara", "Caio", "Duda", "Enzo", "Flávia", "Gui", "Helena", "Ícaro", "Júlia"];
const AVATARS = ["#F46904", "#3F8FD0", "#C94F7C", "#2FA37A", "#8A5A35", "#6C5CE7"];
const CARD = { w: 430, h: 104, gap: 18, every: 0.26, bottom: 900 };

/** uma mensagem no feed: avatar, "Olá, {nome}!", canal e os dois tiques de entregue */
const FeedCard: React.FC<{ i: number; t: number; at: number; y: number }> = ({ i, t, at, y }) => {
  const name = NAMES[i % NAMES.length];
  const channel = [
    { label: "SMS", color: ORANGE, icon: null },
    { label: "WhatsApp", color: WHATSAPP, icon: <Bubble size={16} /> },
    { label: "SMS", color: ORANGE, icon: null },
    { label: "WhatsApp", color: WHATSAPP, icon: <Bubble size={16} /> },
    { label: "E-mail", color: EMAIL, icon: <span style={{ fontSize: 16 }}>✉</span> },
  ][i % 5];
  const p = tween(t, at, DUR.std);
  const delivered = t > at + 0.55;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: 22,
        background: "#fff",
        boxShadow: "0 14px 30px rgba(0,60,110,0.22)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 20px",
        boxSizing: "border-box",
        fontFamily: FONT_FAMILY,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + p * 0.1})`,
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 28, background: AVATARS[i % AVATARS.length], color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 24, color: INKC }}>{name}</div>
        <div style={{ fontWeight: 600, fontSize: 18, color: MUTED, whiteSpace: "nowrap" }}>Olá, {name}! Sentimos sua falta.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 999,
            background: channel.color,
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {channel.icon}
          {channel.label}
        </span>
        <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -4, color: delivered ? "#1FA2E0" : "#B8C2CC" }}>✓✓</span>
      </div>
    </div>
  );
};

/** duas colunas de mensagens subindo, uma nova a cada instante */
const Feed: React.FC<{ t: number }> = ({ t }) => {
  const speed = (CARD.h + CARD.gap) / CARD.every;
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 0,
        width: 920,
        height: 1080,
        transform: "perspective(1800px) rotateY(-16deg) rotateX(4deg)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
      }}
    >
      {[0, 1].map((col) => (
        <div key={col} style={{ position: "absolute", left: col * (CARD.w + 30), top: 0 }}>
          {Array.from({ length: 24 }, (_, k) => {
            const i = k * 2 + col;
            // começa já com o feed cheio, as primeiras mensagens no alto
            const at = -1.9 + k * CARD.every + col * CARD.every * 0.5;
            const y = CARD.bottom - (t - at) * speed;
            if (t < at - 0.05 || y < -CARD.h - 40) return null;
            return <FeedCard key={i} i={i} t={t} at={at} y={y} />;
          })}
        </div>
      ))}
    </div>
  );
};

const Flight: React.FC = () => {
  const t = useSeconds();
  const n = tween(t, 0.2, 2.4, EASE.move);
  const big = pop(t, 0.15);
  return (
    <NavyBg>
      <Feed t={t} />
      <div style={{ position: "absolute", left: 110, top: 250, fontFamily: FONT_FAMILY, color: "#fff" }}>
        <div style={{ fontWeight: 900, fontSize: 250, lineHeight: 1, letterSpacing: -8, transform: `scale(${Math.max(0, big)})`, transformOrigin: "left center", textShadow: "0 12px 40px rgba(0,60,110,0.3)" }}>
          {Math.round(412 * n)}
        </div>
        <div style={{ fontWeight: 800, fontSize: 48, marginTop: 6, opacity: tween(t, 0.4, DUR.std) }}>mensagens enviadas</div>
        <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
          {[
            { label: "SMS", n: 186, color: ORANGE, at: 0.7 },
            { label: "WhatsApp", n: 151, color: WHATSAPP, at: 0.8 },
            { label: "E-mail", n: 75, color: EMAIL, at: 0.9 },
          ].map((c) => {
            const p = tween(t, c.at, DUR.std);
            return (
              <span
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "#fff",
                  color: INKC,
                  fontWeight: 800,
                  fontSize: 30,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: 8, background: c.color }} />
                {c.label} · {Math.round(c.n * n)}
              </span>
            );
          })}
        </div>
      </div>
      <Kinetic lines={["Cada uma com um *nome*."]} at={1.6} size={58} accent={YELLOW} align="left" left={110} top={720} width={820} />
    </NavyBg>
  );
};

/* 7 · a Ana lê ------------------------------------------------------------------ */

const Read: React.FC = () => {
  const t = useSeconds();
  const a = pop(t, 1.0);
  return (
    <SoftBg accent={ORANGE}>
      <LockPhone
        left={330}
        top={110}
        scale={0.76}
        wallpaper="linear-gradient(160deg, #3A2A5C, #14122A)"
        at={0.3}
        time="08:00"
        app="WhatsApp"
        glyph={<Bubble size={30} />}
        color={WHATSAPP}
        title="Café da Esquina"
        body="Olá, Ana! Sentimos sua falta. O próximo cappuccino é por nossa conta."
      />
      <div style={{ position: "absolute", left: 1110, top: 170, transform: `scale(${Math.max(0, a)})` }}>
        <Avatar size={300} skin={ANA.skin} hair="long" hairColor={ANA.hairColor} top={ANA.top} bg="#FFE2C7" />
      </div>
      <Kinetic lines={["Sexta, 8h, no *WhatsApp*.", "A Ana leu. E sorriu."]} at={1.3} size={76} accent={ORANGE} color={INKC} shadow={false} align="left" left={960} top={560} width={950} />
    </SoftBg>
  );
};

/* 8 · ela volta -------------------------------------------------------------- */

const Return: React.FC = () => (
  <IllustratedShot
    place="cafe"
    accent={ORANGE}
    cast={[
      { x: 1250, y: 800, scale: 0.95, ...LUCAS, mood: "happy", pose: "wave", behind: true },
      { x: 2150, y: 990, scale: 1.25, ...ANA, mood: "happy", to: { x: 1600, from: 0, until: 1.6 } },
      { x: 470, y: 960, scale: 1.18, skin: SKINS[3], hair: "curly", hairColor: "#1B1410", top: "#E36B4C", bottom: "#3B3F4A", pose: "sit", mood: "happy" },
    ]}
    keys={[
      { t: 0, x: 1400, y: 600, z: 1.35 },
      { t: 3.3, x: 1200, y: 580, z: 1.15 },
    ]}
  >
    <CountCard label="Clientes de volta este mês" to={143} at={1.6} accent={ORANGE} left={80} top={60} />
  </IllustratedShot>
);

export const sendingStory: StoryConfig = {
  logo: "sending",
  narration: "sending",
  title: ["Seu cliente *não* *voltou*.", "O que você fez para", "trazê-lo de volta?"],
  sector: "Cafeterias",
  name: "Sending",
  accent: ORANGE,
  logoColor: YELLOW,
  slogan: ["Quem já veio,", "*volta*."],
  sectors: ["Cafeterias", "Varejo", "Restaurantes", "Academias", "Shoppings"],
  shots: [
    { seconds: 3.2, node: <Memory /> },
    { seconds: 2.5, cut: "whip", node: <Calendar /> },
    { seconds: 2.9, cut: "zoom", node: <Owner /> },
    { seconds: 2.5, cut: "flash", node: <StingShot logo="sending" color={ORANGE} line={["SMS, WhatsApp e e-mail para quem já conhece você."]} /> },
    { seconds: 3.8, cut: "whip", node: <Panel /> },
    { seconds: 2.8, cut: "flash", node: <Flight /> },
    { seconds: 3.0, cut: "whip", node: <Read /> },
    { seconds: 3.3, cut: "zoom", node: <Return /> },
  ],
};
