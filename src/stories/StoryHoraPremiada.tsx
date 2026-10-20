import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../brand";
import { Cursor, INK, MUTED } from "../demos/kit";
import { DashboardShell, Laptop, NavyBg } from "../explainers/ex-kit";
import { Counter, SKINS } from "../explainers/people";
import { DUR, EASE, Kinetic, pop, Tag, tween, useSeconds } from "./motion";
import { CountCard, Confetti, IllustratedShot, LockPhone, SoftBg, StingShot, StoryConfig, WallClock } from "./story-kit";
import { CouponBurst3D } from "./three3d";

/**
 * Hora Premiada — "15h, loja vazia".
 *
 * Marina tem uma loja de roupas. Às 15h ela está vazia, enquanto lá fora
 * passa gente o tempo todo — muita dela já conectou no Wi-Fi da loja um dia.
 * Com o Hora Premiada ela cria uma oferta só para a hora parada, dispara para
 * quem já passou pelo Wi-Fi, e a loja enche antes das 17h.
 */

const GREEN = "#6DAA1F";
const LOGO = "#89C831";
const INKC = "#1B2430";

const MARINA = { skin: SKINS[0], hair: "long" as const, hairColor: "#5A3825", top: "#E25D6A", bottom: "#2E4A7A", dress: true };

/** balcão da loja por cima de quem fica atrás dele */
const StoreCounter = () => (
  <g>
    <Counter x={1000} y={700} w={380} h={160} color="#7A8B6A" topColor="#5E6E50" />
    <rect x={1220} y={620} width={100} height={70} rx={8} fill="#3B4048" />
  </g>
);

/* 1 · 15h, loja vazia ----------------------------------------------------- */

const EmptyStore: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="store"
      accent={GREEN}
      cast={[{ x: 1120, y: 846, scale: 1.1, ...MARINA, mood: "sad", behind: true }]}
      keys={[
        { t: 0, x: 240, y: 300, z: 2.4 },
        { t: 1.3, x: 240, y: 300, z: 2.2 },
        { t: 2.1, x: 960, y: 560, z: 1.0 },
      ]}
      back={<WallClock x={240} y={300} h={15} m={0} t={t} />}
      front={<StoreCounter />}
    >
      <Kinetic lines={["15h."]} at={0.15} until={1.2} size={220} accent={GREEN} color={INKC} shadow={false} plate="#FFFFFF" top={700} />
      <Kinetic lines={["Terça-feira. Loja *vazia*."]} at={1.9} until={3.1} size={96} accent={GREEN} color={INKC} shadow={false} plate="#FFFFFF" top={860} />
    </IllustratedShot>
  );
};

/* 2 · lá fora, gente passando ---------------------------------------------- */

const Street: React.FC = () => (
  <IllustratedShot
    place="street"
    accent={GREEN}
    cast={[
      { x: -100, y: 1010, scale: 1.15, skin: SKINS[0], hair: "short", hairColor: "#3A2A1E", top: "#5876C4", bottom: "#2E3440", to: { x: 1300, from: 0, until: 3.2 } },
      { x: 2000, y: 1030, scale: 1.2, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#F2B33D", bottom: "#2E3440", to: { x: 700, from: 0, until: 3.2 } },
      { x: 640, y: 990, scale: 1.12, skin: SKINS[3], hair: "long", hairColor: "#1B1410", top: "#C94F7C", bottom: "#4B5D78", pose: "phone", wifiAt: 0.5, flip: true, dress: true },
      { x: 1500, y: 1000, scale: 1.18, skin: SKINS[4], hair: "short", hairColor: "#7A4B2A", top: "#2FA37A", bottom: "#3B3F4A", pose: "phone", wifiAt: 0.9, glasses: true },
      { x: 300, y: 1040, scale: 1.25, skin: SKINS[2], hair: "curly", hairColor: "#1F1A17", top: "#E36B4C", bottom: "#2E3440", to: { x: 1100, from: 0.4, until: 3.2 } },
      { x: 1800, y: 1015, scale: 1.2, skin: SKINS[0], hair: "long", hairColor: "#C99A5B", top: "#3F8FD0", bottom: "#2E3440", pose: "phone", wifiAt: 1.3, flip: true, dress: true },
    ]}
    keys={[
      { t: 0, x: 760, y: 600, z: 1.12 },
      { t: 3.0, x: 1160, y: 600, z: 1.12 },
    ]}
  >
    <Kinetic lines={["Lá fora, gente passando", "o tempo *todo*."]} at={0.25} until={2.7} size={84} accent={GREEN} color={INKC} shadow={false} plate="#FFFFFF" top={60} />
  </IllustratedShot>
);

/* 3 · a ideia --------------------------------------------------------------- */

const Idea: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="store"
      accent={GREEN}
      cast={[{ x: 1120, y: 846, scale: 1.1, ...MARINA, mood: [[0, "sad"], [1.2, "surprised"]], behind: true }]}
      keys={[
        { t: 0, x: 1120, y: 470, z: 2.3 },
        { t: 2.8, x: 1120, y: 470, z: 2.6 },
      ]}
      punch={[1.2]}
      back={<WallClock x={240} y={300} h={15} m={4} t={t} />}
      front={<StoreCounter />}
    >
      <Kinetic lines={["E se essa gente soubesse", "de uma *oferta*… agora?"]} at={0.3} until={2.5} size={74} accent={GREEN} color={INKC} shadow={false} plate="#FFFFFF" top={70} />
    </IllustratedShot>
  );
};

/* 5 · três cliques no painel -------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "ticket" as const, label: "Campanhas" },
  { icon: "users" as const, label: "Clientes" },
];
const CLICK = { hour: 0.6, off: 1.2, who: 1.8, go: 2.6 };

const StepCard: React.FC<{ n: number; label: string; value: string; on: number; left: number }> = ({ n, label, value, on, left }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 30,
      width: 320,
      height: 300,
      borderRadius: 24,
      background: "#fff",
      border: `4px solid ${on > 0 ? GREEN : "#E3E8EE"}`,
      boxShadow: on > 0 ? `0 18px 40px ${GREEN}33` : "0 6px 16px rgba(0,0,0,0.05)",
      padding: "26px 28px",
      boxSizing: "border-box",
      transform: `scale(${1 + Math.max(0, pop(on, 0) - 1) * 0.3})`,
    }}
  >
    <div style={{ width: 54, height: 54, borderRadius: 99, background: on > 0 ? GREEN : "#E3E8EE", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 28 }}>
      {on > 0 ? "✓" : n}
    </div>
    <div style={{ marginTop: 26, fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 24, color: MUTED }}>{label}</div>
    <div style={{ marginTop: 8, fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 40, lineHeight: 1.1, color: on > 0 ? INK : "#C3CAD3" }}>{value}</div>
  </div>
);

const CreateScreen: React.FC = () => {
  const t = useSeconds();
  const sent = t > CLICK.go + 0.15;
  return (
    <DashboardShell logo="hora-premiada" menu={MENU} active={1} title="Nova Hora Premiada">
      <StepCard n={1} label="Horário" value="15h às 17h" on={t > CLICK.hour ? t - CLICK.hour : 0} left={0} />
      <StepCard n={2} label="Desconto" value="20% OFF" on={t > CLICK.off ? t - CLICK.off : 0} left={350} />
      <StepCard n={3} label="Para quem" value="2.340 clientes do Wi-Fi" on={t > CLICK.who ? t - CLICK.who : 0} left={700} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          height: 110,
          borderRadius: 24,
          background: sent ? "#EAF6DD" : GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 44,
          color: sent ? GREEN : "#fff",
          transform: `scale(${t > CLICK.go && t < CLICK.go + 0.15 ? 0.96 : 1})`,
          boxShadow: sent ? "none" : `0 18px 40px ${GREEN}55`,
        }}
      >
        {sent ? "✓ Oferta disparada" : "Disparar agora"}
      </div>
      <div style={{ position: "absolute", left: 0, top: 530, fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 24, color: MUTED }}>
        Envio por SMS, e-mail e no portal do Wi-Fi · integrado ao Sending
      </div>
      <Cursor
        keys={[
          { t: 0, x: 900, y: 600 },
          { t: CLICK.hour - 0.05, x: 160, y: 180 },
          { t: CLICK.off - 0.05, x: 510, y: 180 },
          { t: CLICK.who - 0.05, x: 860, y: 180 },
          { t: CLICK.go - 0.05, x: 540, y: 440 },
        ]}
        clicks={[CLICK.hour, CLICK.off, CLICK.who, CLICK.go]}
        from={0.2}
      />
    </DashboardShell>
  );
};

const Create: React.FC = () => {
  const t = useSeconds();
  const z = 1 + tween(t, 0, 3.6, EASE.move) * 0.08;
  return (
    <NavyBg>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Laptop left={310} top={60} width={1300}>
          <CreateScreen />
        </Laptop>
      </AbsoluteFill>
      <Tag text="3 cliques" at={0.3} accent={LOGO} dark left={90} top={70} />
    </NavyBg>
  );
};

/* 6 · os cupons saem ------------------------------------------------------- */

const Burst: React.FC = () => (
  <NavyBg>
    <CouponBurst3D accent={GREEN} face={{ title: "15H", big: "20% OFF", small: "até as 17h · Loja da Marina" }} />
    <Kinetic lines={["Direto no celular de quem", "já passou pelo seu *Wi-Fi*."]} at={0.7} size={68} accent={LOGO} top={780} />
  </NavyBg>
);

/* 7 · os celulares tocam -------------------------------------------------- */

const WALLS = ["linear-gradient(160deg, #3A2A5C, #14122A)", "linear-gradient(160deg, #1B3B5F, #0B1524)", "linear-gradient(160deg, #5C2A3A, #2A1218)"];

const Phones: React.FC = () => (
  <SoftBg accent={GREEN}>
    {[0, 1, 2].map((i) => (
      <LockPhone
        key={i}
        left={330 + i * 460}
        top={150 + (i === 1 ? -30 : 20)}
        scale={0.62}
        wallpaper={WALLS[i]}
        at={0.25 + i * 0.3}
        app="Mensagens"
        glyph={<span style={{ fontSize: 20 }}>SMS</span>}
        color="#34C759"
        title="Loja da Marina"
        body="Hora Premiada! 20% OFF até as 17h. Só hoje."
      />
    ))}
    <Kinetic lines={["*Plim.* Na hora certa."]} at={1.3} until={3.0} size={80} accent={GREEN} color={INKC} shadow={false} plate="#FFFFFF" top={880} />
  </SoftBg>
);

/* 8 · a loja enche ------------------------------------------------------------ */

const FullStore: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="store"
      accent={GREEN}
      cast={[
        { x: 1120, y: 846, scale: 1.1, ...MARINA, mood: "happy", pose: "wave", behind: true },
        { x: 2050, y: 990, scale: 1.25, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#F2B33D", bottom: "#4B5D78", mood: "happy", to: { x: 760, from: 0, until: 2.0 } },
        { x: 2200, y: 1010, scale: 1.3, skin: SKINS[2], hair: "short", hairColor: "#1F1A17", top: "#2FA37A", bottom: "#3B3F4A", mood: "happy", to: { x: 1500, from: 0.3, until: 2.2 } },
        { x: 470, y: 980, scale: 1.2, skin: SKINS[0], hair: "long", hairColor: "#5A3825", top: "#5876C4", bottom: "#2E4A7A", pose: "phone", mood: "happy", dress: true },
        { x: 2300, y: 1000, scale: 1.22, skin: SKINS[4], hair: "curly", hairColor: "#8A5A35", top: "#C94F7C", bottom: "#2E3440", mood: "happy", to: { x: 1720, from: 0.6, until: 2.6 } },
        { x: 300, y: 1000, scale: 1.2, skin: SKINS[3], hair: "short", hairColor: "#1B1410", top: "#E8A33D", bottom: "#2E3440", pose: "phone", mood: "happy", flip: true },
      ]}
      keys={[
        { t: 0, x: 1100, y: 560, z: 1.18 },
        { t: 3.2, x: 960, y: 560, z: 1.0 },
      ]}
      back={<WallClock x={240} y={300} h={16} m={20} t={t} />}
      front={<StoreCounter />}
    >
      <CountCard label="Cupons resgatados" to={87} at={0.5} accent={GREEN} left={1360} top={60} />
      <Confetti at={2.0} colors={[GREEN, "#F2B33D", "#E25D6A", "#5876C4"]} />
    </IllustratedShot>
  );
};

/* 9 · o resultado ----------------------------------------------------------------- */

const HOURS = ["9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"];
const BEFORE = [0.35, 0.45, 0.5, 0.8, 0.7, 0.4, 0.15, 0.18, 0.3, 0.6, 0.75, 0.5];
const AFTER = [0.35, 0.45, 0.5, 0.8, 0.7, 0.4, 0.92, 0.98, 0.55, 0.6, 0.75, 0.5];

const ResultScreen: React.FC = () => {
  const t = useSeconds();
  const swap = tween(t, 0.5, DUR.slow, EASE.out);
  return (
    <DashboardShell logo="hora-premiada" menu={MENU} active={0} title="Movimento por hora · hoje">
      <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 520, display: "flex", alignItems: "flex-end", gap: 18 }}>
        {HOURS.map((h, i) => {
          const promo = i === 6 || i === 7;
          const v = BEFORE[i] + (AFTER[i] - BEFORE[i]) * swap;
          return (
            <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: "100%", height: 440 * v, borderRadius: 12, background: promo ? GREEN : "#C9D2DD" }} />
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 22, color: promo ? GREEN : MUTED }}>{h}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 395, top: 0, padding: "10px 18px", borderRadius: 12, background: GREEN, color: "#fff", fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 22, opacity: tween(t, 1.0, DUR.std) }}>
        Hora Premiada · 15h às 17h
      </div>
    </DashboardShell>
  );
};

const Result: React.FC = () => (
  <NavyBg>
    <Laptop left={310} top={40} width={1300}>
      <ResultScreen />
    </Laptop>
    <Kinetic lines={["A hora mais parada virou a mais *cheia*."]} at={1.1} size={64} accent={LOGO} top={940} />
  </NavyBg>
);

export const horaPremiadaStory: StoryConfig = {
  logo: "hora-premiada",
  narration: "horaPremiada",
  title: ["Loja vazia", "às *15h*"],
  sector: "Varejo",
  name: "Hora Premiada",
  accent: GREEN,
  logoColor: LOGO,
  slogan: ["Transforme horas paradas", "em horas *premiadas*."],
  sectors: ["Varejo", "Shoppings", "Restaurantes", "Cafeterias", "Academias"],
  shots: [],
};

horaPremiadaStory.shots = [
  { seconds: 3.3, node: <EmptyStore /> },
  { seconds: 3.1, cut: "whip", node: <Street /> },
  { seconds: 2.8, cut: "zoom", node: <Idea /> },
  { seconds: 2.5, cut: "flash", node: <StingShot logo="hora-premiada" color={GREEN} line={["A sua hora mais parada pode vender."]} /> },
  { seconds: 3.6, cut: "whip", node: <Create /> },
  { seconds: 2.7, cut: "flash", node: <Burst /> },
  { seconds: 3.1, cut: "whip", node: <Phones /> },
  { seconds: 3.5, cut: "zoom", node: <FullStore /> },
  { seconds: 2.9, cut: "whip", node: <Result /> },
];
