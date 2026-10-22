import React from "react";
import { FONT_FAMILY } from "../brand";
import { Cursor, INK, MUTED, Phone } from "../demos/kit";
import { DashboardShell, Laptop, NavyBg } from "../explainers/ex-kit";
import { VoucherPortal } from "../explainers/ExMyGuest";
import { SKINS } from "../explainers/people";
import { SuccessScreen } from "../explainers/screens";
import { DUR, EASE, Kinetic, pop, Tag, tween, useSeconds } from "./motion";
import { IllustratedShot, ReviewCard, SoftBg, StingShot, StoryConfig } from "./story-kit";
import { VoucherFan3D } from "./three3d";

/**
 * MyGuest — "A senha no post-it".
 *
 * No Hotel Central a senha do Wi-Fi vivia num post-it no balcão. Em uma
 * semana a rua inteira usava a rede, e o hóspede que pagou a diária ficou
 * sem internet. Com o MyGuest cada hóspede recebe um voucher no check-in, o
 * painel mostra quem está na rede e quem não é hóspede fica de fora.
 */

const RED = "#C42627";
const INKC = "#1B2430";
const GUEST = { skin: SKINS[0], hair: "short" as const, hairColor: "#3A2A1E", top: "#3C8DBC", bottom: "#2E3440", glasses: true };
const CLERK = { skin: SKINS[1], hair: "bun" as const, hairColor: "#2A1C14", top: "#2F3E5C", bottom: "#2F3E5C", tie: RED };

/** post-it colado na frente do balcão */
const PostIt: React.FC = () => (
  <g transform="translate(1460 690) rotate(-6)">
    <rect x={0} y={0} width={130} height={120} fill="#FFE45C" />
    <rect x={0} y={0} width={130} height={18} fill="#F5D33A" />
    <text x={14} y={56} fontFamily="'Comic Sans MS', 'Marker Felt', cursive" fontSize={22} fontWeight={700} fill="#3B2F00">
      Wi-Fi:
    </text>
    <text x={14} y={90} fontFamily="'Comic Sans MS', 'Marker Felt', cursive" fontSize={24} fontWeight={700} fill="#3B2F00">
      hotel123
    </text>
  </g>
);

/* 1 · a senha no post-it -------------------------------------------------- */

const PostItShot: React.FC = () => (
  <IllustratedShot
    place="hotel"
    accent={RED}
    cast={[{ x: 1330, y: 800, scale: 1.05, ...CLERK, mood: "neutral", behind: true }]}
    keys={[
      { t: 0, x: 1525, y: 750, z: 3.0 },
      { t: 1.2, x: 1525, y: 750, z: 2.8 },
      { t: 2.2, x: 1200, y: 600, z: 1.2 },
    ]}
    front={<PostIt />}
  >
    <Kinetic lines={["A senha do Wi-Fi?"]} at={0.15} until={1.2} size={110} accent={RED} color={INKC} shadow={false} plate="#fff" top={80} />
    <Kinetic lines={["Num *post-it*, no balcão."]} at={1.5} until={3.0} size={92} accent={RED} color={INKC} shadow={false} plate="#fff" top={840} />
    <Tag text="Hotel Central" at={1.6} accent={RED} />
  </IllustratedShot>
);

/* 2 · a rua inteira na rede ----------------------------------------------- */

const SPOTS: [number, number][] = [
  [180, 420], [470, 330], [1420, 330], [1640, 450], [980, 600], [300, 660], [1500, 640], [760, 520],
];

const Spread: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="street"
      sign="HOTEL CENTRAL"
      accent={RED}
      cast={[
        { x: 280, y: 1010, scale: 1.15, skin: SKINS[0], hair: "short", hairColor: "#3A2A1E", top: "#5876C4", bottom: "#2E3440", pose: "phone", wifiAt: 0.3 },
        { x: 640, y: 990, scale: 1.12, skin: SKINS[3], hair: "long", hairColor: "#1B1410", top: "#C94F7C", bottom: "#4B5D78", pose: "phone", wifiAt: 0.5, flip: true, dress: true },
        { x: 1500, y: 1000, scale: 1.18, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#F2B33D", bottom: "#2E3440", pose: "phone", wifiAt: 0.7 },
        { x: 1780, y: 1020, scale: 1.22, skin: SKINS[4], hair: "short", hairColor: "#7A4B2A", top: "#2FA37A", bottom: "#3B3F4A", pose: "phone", wifiAt: 0.9, flip: true, glasses: true },
        { x: 1100, y: 1030, scale: 1.2, skin: SKINS[2], hair: "curly", hairColor: "#1F1A17", top: "#E36B4C", bottom: "#2E3440", pose: "phone", wifiAt: 1.1 },
      ]}
      keys={[
        { t: 0, x: 960, y: 560, z: 1.25 },
        { t: 3.0, x: 960, y: 560, z: 1.05 },
      ]}
    >
      {SPOTS.map(([x, y], i) => {
        const p = pop(t, 0.3 + i * 0.12);
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              padding: "10px 18px",
              background: "#FFE45C",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
              fontWeight: 700,
              fontSize: 30,
              color: "#3B2F00",
              transform: `scale(${p}) rotate(${(i % 2 ? 1 : -1) * 7}deg)`,
              zIndex: 50,
            }}
          >
            hotel123
          </div>
        );
      })}
      <Kinetic lines={["Em uma semana, a *rua inteira*", "usava a sua rede."]} at={1.0} until={2.9} size={78} accent={RED} color={INKC} shadow={false} plate="#fff" top={70} />
    </IllustratedShot>
  );
};

/* 3 · o hóspede sem internet ---------------------------------------------- */

/** arco do medidor entre dois ângulos (0° = para cima) */
const arc = (a0: number, a1: number, r = 140) => {
  const p = (a: number) => `${(Math.sin((a * Math.PI) / 180) * r).toFixed(1)} ${(-Math.cos((a * Math.PI) / 180) * r).toFixed(1)}`;
  return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};

const SpeedMeter: React.FC<{ from: number; to: number; at: number; left: number; top: number }> = ({ from, to, at, left, top }) => {
  const t = useSeconds();
  const p = tween(t, at, 1.2, EASE.out);
  const v = from + (to - from) * p;
  const angle = -120 + (v / 25) * 240;
  const color = v < 5 ? "#E5484D" : "#1E9B4B";
  return (
    <div style={{ position: "absolute", left, top, width: 420, padding: "28px 30px", borderRadius: 30, background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", zIndex: 60, fontFamily: FONT_FAMILY, textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: 26, color: MUTED }}>Wi-Fi do hotel</div>
      <svg width={360} height={200} viewBox="-180 -170 360 200">
        <path d={arc(-120, 120)} fill="none" stroke="#EDF0F4" strokeWidth={26} strokeLinecap="round" />
        <path d={arc(-120, -72)} fill="none" stroke="#E5484D" strokeWidth={26} strokeLinecap="round" />
        <g transform={`rotate(${angle})`}>
          <rect x={-5} y={-140} width={10} height={140} rx={5} fill={INKC} />
        </g>
        <circle r={16} fill={INKC} />
      </svg>
      <div style={{ fontWeight: 900, fontSize: 72, color, letterSpacing: -2, lineHeight: 1 }}>{v.toFixed(1).replace(".", ",")} Mbps</div>
    </div>
  );
};

const Slow: React.FC = () => (
  <IllustratedShot
    place="hotel"
    accent={RED}
    cast={[
      { x: 1330, y: 800, scale: 1.05, ...CLERK, behind: true },
      { x: 560, y: 990, scale: 1.3, ...GUEST, pose: "phone", mood: [[0, "neutral"], [0.9, "angry"]] },
    ]}
    keys={[
      { t: 0, x: 560, y: 620, z: 2.0 },
      { t: 2.8, x: 600, y: 620, z: 2.25 },
    ]}
    punch={[0.9]}
  >
    <SpeedMeter from={20} to={1.2} at={0.2} left={1300} top={180} />
    <Kinetic lines={["E quem pagou a diária", "ficou *sem internet*."]} at={0.7} until={2.7} size={74} accent={RED} color={INKC} shadow={false} plate="#fff" align="left" left={80} top={760} width={1200} />
  </IllustratedShot>
);

/* 5 · voucher no check-in ---------------------------------------------------- */

const CODES = ["WSP-7350", "WSP-1964", "WSP-5502", "WSP-3187", "WSP-9046", "WSP-2618", "WSP-8473"];

const CheckIn: React.FC = () => (
  <NavyBg>
    <VoucherFan3D accent={RED} faces={CODES.map((c) => ({ title: "24H", big: c, small: "2 aparelhos · 20 Mbps" }))} hero={{ title: "24H", big: "WSP-4821", small: "Quarto 204 · 2 aparelhos" }} />
    <Kinetic lines={["No check-in, um *voucher*", "para cada hóspede."]} at={0.6} size={70} accent="#FF6B6B" top={60} />
  </NavyBg>
);

/* 6 · quem não é hóspede, fica de fora ------------------------------------------ */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "wispot" as const, label: "Rede" },
  { icon: "ticket" as const, label: "Vouchers" },
];

const DEVICES = [
  { who: "Quarto 204 · Ana", tag: "WSP-4821", guest: true },
  { who: "Desconhecido", tag: "sem voucher", guest: false },
  { who: "Quarto 118 · Carlos", tag: "WSP-7350", guest: true },
  { who: "Desconhecido", tag: "sem voucher", guest: false },
  { who: "Desconhecido", tag: "sem voucher", guest: false },
  { who: "Quarto 307 · Júlia", tag: "WSP-1964", guest: true },
];
const BLOCK = 1.6;

const NetworkScreen: React.FC = () => {
  const t = useSeconds();
  const out = tween(t, BLOCK + 0.1, DUR.std, EASE.in);
  const speed = 1.2 + 18.8 * tween(t, BLOCK + 0.3, 1.0, EASE.out);
  let y = 0;
  return (
    <DashboardShell logo="myguest" menu={MENU} active={1} title="Dispositivos na rede · agora">
      <div style={{ position: "absolute", right: 0, top: -64, display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 26, color: speed < 5 ? "#E5484D" : "#1E9B4B" }}>{speed.toFixed(1).replace(".", ",")} Mbps</span>
        <span
          style={{
            padding: "12px 24px",
            borderRadius: 14,
            background: t > BLOCK ? "#EDF0F4" : RED,
            color: t > BLOCK ? MUTED : "#fff",
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 22,
            transform: `scale(${t > BLOCK && t < BLOCK + 0.15 ? 0.95 : 1})`,
          }}
        >
          {t > BLOCK ? "✓ Bloqueados" : "Bloquear sem voucher"}
        </span>
      </div>
      {DEVICES.map((d, i) => {
        const k = d.guest ? 1 : 1 - out;
        const top = y;
        y += 86 * k;
        if (k <= 0.01) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top,
              height: 74 * k,
              overflow: "hidden",
              borderRadius: 16,
              background: d.guest ? "#fff" : "#FDECEC",
              border: `2px solid ${d.guest ? "#E3E8EE" : "#F5B5B7"}`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 24px",
              opacity: k,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: 99, background: d.guest ? "#1E9B4B" : "#E5484D" }} />
            <span style={{ fontWeight: 800, fontSize: 26, color: INK }}>{d.who}</span>
            <span style={{ marginLeft: "auto", padding: "6px 16px", borderRadius: 999, background: d.guest ? "#E7F6EC" : "#fff", fontWeight: 800, fontSize: 22, color: d.guest ? "#1E9B4B" : "#E5484D" }}>{d.tag}</span>
          </div>
        );
      })}
      <Cursor keys={[{ t: 0, x: 700, y: 500 }, { t: BLOCK - 0.05, x: 930, y: -40 }]} clicks={[BLOCK]} from={0.3} />
    </DashboardShell>
  );
};

const Network: React.FC = () => (
  <NavyBg>
    <Laptop left={310} top={60} width={1300}>
      <NetworkScreen />
    </Laptop>
    <Tag text="Quem não é hóspede, fica de fora" at={0.3} accent="#FF6B6B" dark left={90} top={960} />
  </NavyBg>
);

/* 7 · digitou, conectou --------------------------------------------------------- */

const Connect: React.FC = () => {
  const t = useSeconds();
  return (
    <SoftBg accent={RED}>
      <Phone left={330} top={90} scale={0.78} screen="#fff" style={{ transform: `scale(0.78) translateY(${(1 - tween(t, 0, DUR.std)) * 60}px)` }}>
        <VoucherPortal
          theme="hotel"
          code={"WSP-4821".slice(0, Math.max(0, Math.floor((t - 0.3) * 14)))}
          caret={[0.2, 1.0]}
          t={t}
          hours={24}
          mbps={20}
          logins={[{ kind: "voucher", p: 1 }]}
          pressAt={1.2}
          connecting={t > 1.25}
        />
        <SuccessScreen color={RED} title="Acesso liberado" detail="24h · 2 aparelhos · 20 Mbps" t={t} at={1.6} />
      </Phone>
      <Kinetic lines={["Digitou o voucher,", "*conectou*."]} at={0.5} size={92} accent={RED} color={INKC} shadow={false} align="left" left={860} top={360} width={1000} />
    </SoftBg>
  );
};

/* 8 · cinco estrelas ------------------------------------------------------------- */

const Review: React.FC = () => (
  <IllustratedShot
    place="hotel"
    accent={RED}
    cast={[
      { x: 1330, y: 800, scale: 1.05, ...CLERK, mood: "happy", pose: "wave", behind: true },
      { x: 560, y: 990, scale: 1.3, ...GUEST, pose: "phone", mood: "happy", wifiAt: 0.2 },
    ]}
    keys={[
      { t: 0, x: 700, y: 620, z: 1.5 },
      { t: 3.2, x: 960, y: 560, z: 1.1 },
    ]}
  >
    <ReviewCard at={0.5} stars={5} name="Ricardo M." text="Wi-Fi rápido e sem complicação. Volto com certeza!" left={980} top={110} scale={0.9} />
  </IllustratedShot>
);

export const myGuestStory: StoryConfig = {
  logo: "myguest",
  narration: "myguest",
  title: ["Seu hóspede chegou.", "E o acesso", "à *internet*?"],
  sector: "Hotéis",
  name: "MyGuest",
  accent: RED,
  logoColor: "#FF5A5A",
  slogan: ["Cada hóspede,", "o seu *acesso*."],
  sectors: ["Hotéis", "Feiras e eventos", "Coworkings", "Clínicas", "Instituições de ensino"],
  shots: [
    { seconds: 3.2, node: <PostItShot /> },
    { seconds: 3.0, cut: "whip", node: <Spread /> },
    { seconds: 2.9, cut: "zoom", node: <Slow /> },
    { seconds: 2.5, cut: "flash", node: <StingShot logo="myguest" color={RED} line={["Wi-Fi de hóspede, sob controle."]} /> },
    { seconds: 2.9, cut: "whip", node: <CheckIn /> },
    { seconds: 3.4, cut: "whip", node: <Network /> },
    { seconds: 2.9, cut: "zoom", node: <Connect /> },
    { seconds: 3.3, cut: "whip", node: <Review /> },
  ],
};

