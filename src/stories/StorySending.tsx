import React from "react";
import { FONT_FAMILY } from "../brand";
import { Caret, Cursor, INK, MUTED } from "../demos/kit";
import { Avatar, DashboardShell, Laptop, NavyBg } from "../explainers/ex-kit";
import { SKINS } from "../explainers/people";
import { DUR, Kinetic, pop, Tag, tween, useSeconds } from "./motion";
import { CountCard, FlipCalendar, IllustratedShot, LockPhone, SoftBg, StingShot, StoryConfig } from "./story-kit";
import { MessageFlight3D } from "./three3d";

/**
 * Sending — "A cliente que sumiu".
 *
 * A Ana tomou um café no Café da Esquina, adorou… e nunca mais voltou. Mas
 * ela entrou no Wi-Fi, e o contato dela ficou. O Lucas separa quem não volta
 * há 30 dias, escreve uma mensagem com o nome de cada um e agenda o envio.
 * Na sexta de manhã, a Ana lê, sorri — e volta.
 */

const ORANGE = "#F46904";
const YELLOW = "#FCD800";
const INKC = "#1B2430";

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
const CLICK = { filter: 0.5, text: 1.1, send: 3.2 };

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const typedMsg = (t: number) => {
  const raw = MSG.slice(0, Math.max(0, Math.floor((t - CLICK.text - 0.1) * 40)));
  return raw.replace(/\{[a-z]*$/, "");
};

const NameToken = () => (
  <span style={{ padding: "2px 12px", borderRadius: 10, background: YELLOW, color: "#4A3A00", fontWeight: 800 }}>nome</span>
);

const SendScreen: React.FC = () => {
  const t = useSeconds();
  const n = 12480 + (412 - 12480) * tween(t, CLICK.filter + 0.05, DUR.slow);
  const msg = typedMsg(t);
  const parts = msg.split("{nome}");
  const sent = t > CLICK.send + 0.15;
  return (
    <DashboardShell logo="sending" menu={MENU} active={2} title="Nova campanha · SMS">
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
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 370,
          width: 460,
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
          { t: CLICK.send - 0.05, x: 850, y: 416 },
        ]}
        clicks={[CLICK.filter, CLICK.text, CLICK.send]}
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

const Flight: React.FC = () => (
  <NavyBg>
    <MessageFlight3D accent={ORANGE} dot={YELLOW} />
    <Kinetic lines={["*412* mensagens.", "Cada uma com um nome."]} at={0.4} size={72} accent={YELLOW} top={860} />
  </NavyBg>
);

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
        app="Mensagens"
        glyph={<span style={{ fontSize: 20 }}>SMS</span>}
        color="#34C759"
        title="Café da Esquina"
        body="Olá, Ana! Sentimos sua falta. O próximo cappuccino é por nossa conta."
      />
      <div style={{ position: "absolute", left: 1110, top: 170, transform: `scale(${Math.max(0, a)})` }}>
        <Avatar size={300} skin={ANA.skin} hair="long" hairColor={ANA.hairColor} top={ANA.top} bg="#FFE2C7" />
      </div>
      <Kinetic lines={["Sexta, 8h. A Ana leu.", "E *sorriu*."]} at={1.3} size={76} accent={ORANGE} color={INKC} shadow={false} align="left" left={960} top={560} width={950} />
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
  title: ["A cliente", "que *sumiu*"],
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
    { seconds: 2.5, cut: "flash", node: <StingShot logo="sending" color={YELLOW} line={["SMS e e-mail para quem já conhece você."]} /> },
    { seconds: 3.8, cut: "whip", node: <Panel /> },
    { seconds: 2.8, cut: "flash", node: <Flight /> },
    { seconds: 3.0, cut: "whip", node: <Read /> },
    { seconds: 3.3, cut: "zoom", node: <Return /> },
  ],
};
