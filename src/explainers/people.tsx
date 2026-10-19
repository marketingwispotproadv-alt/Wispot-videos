import React from "react";
import { FONT_FAMILY } from "../brand";

/**
 * Personagens e cenários em ilustração chapada, no espírito do vídeo
 * institucional antigo da Wispot (pessoas simples, cores lisas, ambientes do
 * dia a dia). Tudo em SVG, no espaço de 1920 × 1080.
 *
 * Coordenadas do personagem: origem entre os pés, para cima é negativo. Um
 * personagem em escala 1 tem ~340 de altura.
 */

export type Hair = "short" | "long" | "bun" | "curly" | "none";
export type Pose = "stand" | "phone" | "sit" | "walk" | "wave";
export type Mood = "neutral" | "happy" | "sad" | "surprised" | "angry";

export type PersonProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skin: string;
  hair: Hair;
  hairColor: string;
  top: string;
  bottom: string;
  pose?: Pose;
  /** tempo da cena em segundos, para o balanço e a caminhada */
  t: number;
  phase?: number;
  tie?: string;
  glasses?: boolean;
  dress?: boolean;
  /** instante em que aparece o balão de Wi-Fi sobre a cabeça */
  wifiAt?: number;
  wifiColor?: string;
  /** expressão do rosto (sobrancelhas e boca) */
  mood?: Mood;
};

const SHOE = "#2B2F36";

export const Person: React.FC<PersonProps> = ({
  x,
  y,
  scale = 1,
  flip,
  skin,
  hair,
  hairColor,
  top,
  bottom,
  pose = "stand",
  t,
  phase = 0,
  tie,
  glasses,
  dress,
  wifiAt,
  wifiColor = "#25A8E0",
  mood = "neutral",
}) => {
  const bob = pose === "walk" ? Math.abs(Math.sin(t * 6 + phase)) * -4 : Math.sin(t * 1.6 + phase) * 1.6;
  const swing = pose === "walk" ? Math.sin(t * 6 + phase) * 20 : 0;
  const sit = pose === "sit";
  const body = sit ? 52 : 0; // o tronco desce quando está sentado

  const legs = sit ? (
    <g>
      {[-12, 10].map((dx, i) => (
        <g key={i}>
          <path
            d={`M${dx} -100 L${dx + 52} -100 L${dx + 52} -10`}
            fill="none"
            stroke={bottom}
            strokeWidth={19}
            strokeLinejoin="round"
          />
          <ellipse cx={dx + 62} cy={-5} rx={15} ry={7} fill={SHOE} />
        </g>
      ))}
    </g>
  ) : (
    <g>
      {[-1, 1].map((s) => (
        <g key={s} transform={`rotate(${swing * s} 0 -150)`}>
          <rect x={s < 0 ? -22 : 4} y={-152} width={18} height={146} rx={8} fill={bottom} />
          <ellipse cx={s * 14 + (flip ? -4 : 4)} cy={-5} rx={16} ry={7} fill={SHOE} />
        </g>
      ))}
    </g>
  );

  const arm = (side: -1 | 1) => {
    const sx = side * 31;
    const sy = -252 + body;
    let path = `M${sx} ${sy} L${side * 40} ${-172 + body}`;
    let hand: [number, number] = [side * 40, -170 + body];
    if (pose === "walk") {
      const a = (-swing * side * Math.PI) / 180;
      const hx = sx + Math.sin(a) * 80;
      const hy = sy + Math.cos(a) * 80;
      path = `M${sx} ${sy} L${hx} ${hy}`;
      hand = [hx, hy];
    }
    if ((pose === "phone" || sit) && side === 1) {
      path = `M${sx} ${sy} L${38} ${-200 + body} L${10} ${-218 + body}`;
      hand = [10, -218 + body];
    }
    if (pose === "wave" && side === 1) {
      const w = Math.sin(t * 7 + phase) * 10;
      path = `M${sx} ${sy} L${58} ${-300 + body + w * 0.3} L${62 + w} ${-350 + body}`;
      hand = [62 + w, -352 + body];
    }
    return (
      <g key={side}>
        <path d={path} fill="none" stroke={top} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={hand[0]} cy={hand[1]} r={8} fill={skin} />
      </g>
    );
  };

  const holdsPhone = pose === "phone" || sit;
  const headY = -306 + body;

  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={0} rx={52} ry={9} fill="rgba(0,0,0,0.10)" />
      {legs}
      {/* tronco */}
      {dress ? (
        <path d={`M-32 ${-262 + body} L32 ${-262 + body} L46 ${-120 + body} L-46 ${-120 + body} Z`} fill={top} />
      ) : (
        <rect x={-34} y={-266 + body} width={68} height={124} rx={22} fill={top} />
      )}
      {tie && <path d={`M0 ${-258 + body} L7 ${-232 + body} L0 ${-200 + body} L-7 ${-232 + body} Z`} fill={tie} />}
      {arm(-1)}
      {holdsPhone && (
        <g>
          <rect x={-4} y={-240 + body} width={22} height={36} rx={4} fill="#1F232A" />
          <rect
            x={-1}
            y={-237 + body}
            width={16}
            height={28}
            rx={2}
            fill="#8FDBFF"
            opacity={0.75 + Math.sin(t * 3 + phase) * 0.2}
          />
        </g>
      )}
      {arm(1)}
      {/* cabeça */}
      {hair === "long" && <rect x={-29} y={headY - 18} width={58} height={74} rx={24} fill={hairColor} />}
      <rect x={-7} y={headY + 20} width={14} height={20} fill={skin} />
      <circle cx={0} cy={headY} r={26} fill={skin} />
      {hair !== "none" && (
        <path
          d={`M-27 ${headY + 2} C-30 ${headY - 34} 30 ${headY - 34} 27 ${headY + 2} C20 ${headY - 12} -6 ${headY - 16} -27 ${headY + 2} Z`}
          fill={hairColor}
        />
      )}
      {hair === "bun" && <circle cx={0} cy={headY - 32} r={12} fill={hairColor} />}
      {hair === "curly" &&
        [-22, -11, 0, 11, 22].map((dx) => <circle key={dx} cx={dx} cy={headY - 20 + Math.abs(dx) * 0.4} r={11} fill={hairColor} />)}
      <circle cx={-9} cy={headY + 1} r={2.8} fill="#22252B" />
      <circle cx={9} cy={headY + 1} r={2.8} fill="#22252B" />
      <Face headY={headY} mood={mood} />
      {glasses && (
        <g fill="none" stroke="#22252B" strokeWidth={2.4}>
          <circle cx={-10} cy={headY + 1} r={8} />
          <circle cx={10} cy={headY + 1} r={8} />
          <path d={`M-2 ${headY + 1} L2 ${headY + 1}`} />
        </g>
      )}
      {wifiAt !== undefined && t > wifiAt && (
        <WifiBubble x={flip ? -10 : 10} y={headY - 74} p={Math.min(1, (t - wifiAt) / 0.3)} t={t} color={wifiColor} flip={flip} />
      )}
    </g>
  );
};

/** boca e sobrancelhas de cada expressão */
const Face: React.FC<{ headY: number; mood: Mood }> = ({ headY: h, mood }) => {
  const ink = { fill: "none", stroke: "#22252B", strokeWidth: 2.4, strokeLinecap: "round" } as const;
  return (
    <g>
      {mood === "happy" && <path d={`M-9 ${h + 9} Q0 ${h + 21} 9 ${h + 9} Z`} fill="#22252B" />}
      {mood === "neutral" && <path d={`M-7 ${h + 11} Q0 ${h + 16} 7 ${h + 11}`} {...ink} />}
      {mood === "sad" && (
        <>
          <path d={`M-7 ${h + 15} Q0 ${h + 9} 7 ${h + 15}`} {...ink} />
          <path d={`M-14 ${h - 6} L-5 ${h - 10} M14 ${h - 6} L5 ${h - 10}`} {...ink} />
        </>
      )}
      {mood === "surprised" && (
        <>
          <ellipse cx={0} cy={h + 13} rx={4.5} ry={6} fill="#22252B" />
          <path d={`M-14 ${h - 11} Q-9 ${h - 15} -4 ${h - 11} M4 ${h - 11} Q9 ${h - 15} 14 ${h - 11}`} {...ink} />
        </>
      )}
      {mood === "angry" && (
        <>
          <path d={`M-6 ${h + 13} L6 ${h + 13}`} {...ink} />
          <path d={`M-14 ${h - 10} L-4 ${h - 5} M14 ${h - 10} L4 ${h - 5}`} {...ink} strokeWidth={3} />
        </>
      )}
    </g>
  );
};

const WifiBubble: React.FC<{ x: number; y: number; p: number; t: number; color: string; flip?: boolean }> = ({
  x,
  y,
  p,
  t,
  color,
  flip,
}) => {
  const s = p < 1 ? p * 1.15 : 1 + Math.sin(t * 4) * 0.04;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`} opacity={Math.min(1, p * 2)}>
      <circle r={30} fill="#fff" stroke={color} strokeWidth={3} />
      <path d="M-10 26 L0 36 L10 26" fill="#fff" stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <rect x={-10} y={22} width={20} height={8} fill="#fff" />
      <g fill="none" stroke={color} strokeWidth={4} strokeLinecap="round">
        <path d="M-15 -3 A21 21 0 0 1 15 -3" />
        <path d="M-8 4 A11 11 0 0 1 8 4" />
      </g>
      <circle cx={0} cy={11} r={3.6} fill={color} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Mobiliário                                                           */
/* ------------------------------------------------------------------ */

export const Txt: React.FC<{ x: number; y: number; size: number; color: string; children: React.ReactNode; weight?: number; anchor?: "start" | "middle" | "end"; ls?: number }> = ({
  x,
  y,
  size,
  color,
  children,
  weight = 800,
  anchor = "middle",
  ls = 0,
}) => (
  <text x={x} y={y} fontFamily={FONT_FAMILY} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} letterSpacing={ls}>
    {children}
  </text>
);

export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-40, -15, 10, 35].map((r, i) => (
      <ellipse key={i} cx={Math.sin((r * Math.PI) / 180) * 50} cy={-110 - Math.cos((r * Math.PI) / 180) * 30} rx={22} ry={58} fill={i % 2 ? "#3E9B5F" : "#53B373"} transform={`rotate(${r} ${Math.sin((r * Math.PI) / 180) * 50} ${-110 - Math.cos((r * Math.PI) / 180) * 30})`} />
    ))}
    <path d="M-36 -64 L36 -64 L28 0 L-28 0 Z" fill="#E7E2DA" />
    <rect x={-40} y={-72} width={80} height={12} rx={4} fill="#D6CFC4" />
  </g>
);

export const PendantLamp: React.FC<{ x: number; y: number; color?: string; len?: number }> = ({ x, y, color = "#2F3640", len = 120 }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y + len} stroke="#2F3640" strokeWidth={3} />
    <path d={`M${x - 40} ${y + len + 40} Q${x} ${y + len - 12} ${x + 40} ${y + len + 40} Z`} fill={color} />
    <ellipse cx={x} cy={y + len + 42} rx={18} ry={6} fill="#FFE9A8" />
  </g>
);

export const WifiSign: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = "#25A8E0" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-50} width={140} height={100} rx={10} fill="#fff" stroke="#C9CED6" strokeWidth={4} />
    <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round">
      <path d="M-22 -14 A30 30 0 0 1 22 -14" />
      <path d="M-11 -2 A15 15 0 0 1 11 -2" />
    </g>
    <circle cx={0} cy={9} r={5} fill={color} />
    <Txt x={0} y={38} size={20} color="#2F3640" ls={2}>
      Wi-Fi ZONE
    </Txt>
  </g>
);

export const Shelf: React.FC<{ x: number; y: number; w: number; h: number; colors: string[] }> = ({ x, y, w, h, colors }) => {
  const rows = 4;
  const rh = h / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#C9A982" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill="#E9DCCB" />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          {Array.from({ length: Math.floor((w - 30) / 46) }, (_, i) => {
            const bh = rh * (0.45 + ((i * 7 + r * 3) % 5) * 0.08);
            return (
              <rect
                key={i}
                x={x + 18 + i * 46}
                y={y + (r + 1) * rh - bh - 4}
                width={38}
                height={bh}
                rx={4}
                fill={colors[(i + r * 2) % colors.length]}
              />
            );
          })}
          <rect x={x + 6} y={y + (r + 1) * rh - 6} width={w - 12} height={10} fill="#B58F64" />
        </g>
      ))}
    </g>
  );
};

export const Counter: React.FC<{ x: number; y: number; w: number; h: number; color: string; topColor: string }> = ({ x, y, w, h, color, topColor }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={color} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => (
      <rect key={i} x={x + 12 + i * 60} y={y + 18} width={8} height={h - 30} fill="rgba(0,0,0,0.08)" />
    ))}
    <rect x={x - 12} y={y - 16} width={w + 24} height={20} rx={4} fill={topColor} />
  </g>
);

export const Table: React.FC<{ x: number; y: number; w?: number; top?: string }> = ({ x, y, w = 170, top = "#FFFFFF" }) => (
  <g>
    <rect x={x - 6} y={y} width={12} height={110} fill="#5B4A3A" />
    <rect x={x - 40} y={y + 104} width={80} height={10} rx={5} fill="#5B4A3A" />
    <ellipse cx={x} cy={y} rx={w / 2} ry={16} fill={top} />
    <ellipse cx={x} cy={y + 4} rx={w / 2} ry={14} fill="rgba(0,0,0,0.06)" />
  </g>
);

export const Chair: React.FC<{ x: number; y: number; color: string; flip?: boolean }> = ({ x, y, color, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <rect x={-34} y={-150} width={14} height={110} rx={6} fill={color} />
    <rect x={-34} y={-58} width={80} height={16} rx={6} fill={color} />
    <rect x={-30} y={-44} width={8} height={44} fill="#4A4F57" />
    <rect x={34} y={-44} width={8} height={44} fill="#4A4F57" />
  </g>
);

export const Frame: React.FC<{ x: number; y: number; w: number; h: number; c1: string; c2: string }> = ({ x, y, w, h, c1, c2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#fff" stroke="#3B4048" strokeWidth={6} />
    <circle cx={x + w * 0.35} cy={y + h * 0.4} r={h * 0.18} fill={c1} />
    <path d={`M${x + 10} ${y + h - 10} L${x + w * 0.45} ${y + h * 0.45} L${x + w - 10} ${y + h - 10} Z`} fill={c2} />
  </g>
);

export const Luggage: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <rect x={x - 6} y={y - 150} width={12} height={40} fill="#4A4F57" />
    <rect x={x - 34} y={y - 116} width={68} height={104} rx={12} fill={color} />
    {[-14, 0, 14].map((d) => (
      <rect key={d} x={x + d - 2} y={y - 110} width={4} height={92} fill="rgba(0,0,0,0.12)" />
    ))}
    <circle cx={x - 22} cy={y - 6} r={7} fill="#2B2F36" />
    <circle cx={x + 22} cy={y - 6} r={7} fill="#2B2F36" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Cenários                                                             */
/* ------------------------------------------------------------------ */

export type Place = "store" | "hotel" | "cafe" | "street" | "restaurant";

export const SKINS = ["#F2C7A5", "#D9A27A", "#A86E4B", "#7A4A30", "#F6D3BC"];

type Cast = Omit<PersonProps, "t"> & {
  /** fica atrás do balcão (desenhado antes da camada da frente) */
  behind?: boolean;
};

/** quem aparece em cada cenário; o balão de Wi-Fi entra em sequência */
const CAST: Record<Place, Cast[]> = {
  store: [
    { x: 520, y: 980, scale: 1.25, skin: SKINS[0], hair: "long", hairColor: "#5A3825", top: "#E25D6A", bottom: "#2E4A7A", pose: "phone", wifiAt: 1.2, dress: true },
    { x: 860, y: 960, scale: 1.18, skin: SKINS[2], hair: "short", hairColor: "#1F1A17", top: "#2FA37A", bottom: "#3B3F4A", pose: "stand", flip: true, glasses: true },
    { x: 1240, y: 990, scale: 1.3, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#F2B33D", bottom: "#4B5D78", pose: "phone", wifiAt: 1.6 },
    { x: 1880, y: 1000, scale: 1.32, skin: SKINS[4], hair: "short", hairColor: "#7A4B2A", top: "#5876C4", bottom: "#2E3440", pose: "walk", flip: true },
  ],
  hotel: [
    { x: 1330, y: 800, scale: 1.05, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#2F3E5C", bottom: "#2F3E5C", pose: "wave", tie: "#C42627", behind: true },
    { x: 560, y: 990, scale: 1.3, skin: SKINS[0], hair: "short", hairColor: "#3A2A1E", top: "#3C8DBC", bottom: "#2E3440", pose: "phone", wifiAt: 1.3, glasses: true },
    { x: 860, y: 970, scale: 1.24, skin: SKINS[3], hair: "curly", hairColor: "#1B1410", top: "#E8A33D", bottom: "#4B5D78", pose: "stand", flip: true },
    { x: 1700, y: 1000, scale: 1.3, skin: SKINS[4], hair: "long", hairColor: "#C99A5B", top: "#C94F7C", bottom: "#2E3440", pose: "phone", wifiAt: 1.8, flip: true, dress: true },
  ],
  cafe: [
    { x: 470, y: 960, scale: 1.18, skin: SKINS[0], hair: "long", hairColor: "#4A2F20", top: "#3F8FD0", bottom: "#2E3440", pose: "sit", wifiAt: 1.1 },
    { x: 900, y: 960, scale: 1.18, skin: SKINS[2], hair: "short", hairColor: "#1F1A17", top: "#E36B4C", bottom: "#3B3F4A", pose: "sit", flip: true, wifiAt: 1.5 },
    { x: 1500, y: 960, scale: 1.18, skin: SKINS[4], hair: "bun", hairColor: "#8A5A35", top: "#4FAE84", bottom: "#4B5D78", pose: "sit", wifiAt: 1.9 },
    { x: 1250, y: 800, scale: 0.95, skin: SKINS[1], hair: "short", hairColor: "#2A1C14", top: "#FFFFFF", bottom: "#2E3440", pose: "stand", tie: "#7A4B2A", behind: true },
  ],
  street: [
    { x: 280, y: 1010, scale: 1.2, skin: SKINS[0], hair: "short", hairColor: "#3A2A1E", top: "#5876C4", bottom: "#2E3440", pose: "walk", phase: 0 },
    { x: 640, y: 990, scale: 1.16, skin: SKINS[3], hair: "long", hairColor: "#1B1410", top: "#E25D6A", bottom: "#4B5D78", pose: "phone", wifiAt: 1.4, dress: true, flip: true },
    { x: 1500, y: 1000, scale: 1.2, skin: SKINS[1], hair: "bun", hairColor: "#2A1C14", top: "#F2B33D", bottom: "#2E3440", pose: "walk", phase: 1.5, flip: true },
    { x: 1780, y: 1020, scale: 1.24, skin: SKINS[4], hair: "short", hairColor: "#7A4B2A", top: "#2FA37A", bottom: "#3B3F4A", pose: "phone", wifiAt: 2.0, flip: true, glasses: true },
  ],
  restaurant: [
    { x: 430, y: 960, scale: 1.16, skin: SKINS[1], hair: "long", hairColor: "#2A1C14", top: "#C94F7C", bottom: "#2E3440", pose: "sit", wifiAt: 1.2 },
    { x: 840, y: 960, scale: 1.16, skin: SKINS[0], hair: "short", hairColor: "#5A3825", top: "#3F8FD0", bottom: "#3B3F4A", pose: "sit", flip: true },
    { x: 1640, y: 990, scale: 1.26, skin: SKINS[2], hair: "short", hairColor: "#1F1A17", top: "#FFFFFF", bottom: "#2E3440", pose: "stand", flip: true, tie: "#2F3640" },
    { x: 1260, y: 960, scale: 1.16, skin: SKINS[4], hair: "curly", hairColor: "#8A5A35", top: "#4FAE84", bottom: "#4B5D78", pose: "sit", wifiAt: 1.7 },
  ],
};

export const Backdrop: React.FC<{ place: Place; accent: string; sign?: string }> = ({ place, accent, sign = "SUA LOJA" }) => {
  switch (place) {
    case "store":
      return (
        <g>
          <rect width={1920} height={1080} fill="#E7F0DA" />
          <rect y={860} width={1920} height={220} fill="#CFDDB8" />
          <rect y={852} width={1920} height={12} fill="#B9C9A0" />
          <Shelf x={90} y={420} w={300} h={440} colors={["#E25D6A", "#F2B33D", "#5876C4", "#4FAE84"]} />
          <Shelf x={1500} y={420} w={340} h={440} colors={["#F2B33D", "#4FAE84", "#C94F7C", "#3F8FD0"]} />
          <rect x={640} y={150} width={420} height={110} rx={14} fill={accent} />
          <Txt x={850} y={225} size={58} color="#fff" ls={4}>
            OFERTAS
          </Txt>
          <line x1={700} y1={60} x2={700} y2={150} stroke="#3B4048" strokeWidth={4} />
          <line x1={1000} y1={60} x2={1000} y2={150} stroke="#3B4048" strokeWidth={4} />
          <Counter x={1000} y={700} w={380} h={160} color="#7A8B6A" topColor="#5E6E50" />
          <rect x={1220} y={620} width={100} height={70} rx={8} fill="#3B4048" />
          <WifiSign x={1240} y={330} color={accent} />
          <Plant x={1440} y={860} s={0.9} />
        </g>
      );
    case "hotel":
      return (
        <g>
          <rect width={1920} height={1080} fill="#E9DED5" />
          <rect y={860} width={1920} height={220} fill="#CDB9A8" />
          <rect y={852} width={1920} height={12} fill="#B9A491" />
          <rect x={1060} y={180} width={540} height={90} rx={10} fill="#3B4048" />
          <Txt x={1330} y={240} size={46} color="#fff" ls={8}>
            RECEPÇÃO
          </Txt>
          {[1140, 1330, 1520].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy={370} r={46} fill="#fff" stroke="#3B4048" strokeWidth={6} />
              <line x1={cx} y1={370} x2={cx} y2={340} stroke="#3B4048" strokeWidth={5} />
              <line x1={cx} y1={370} x2={cx + 18 + i * 4} y2={378} stroke="#3B4048" strokeWidth={5} />
            </g>
          ))}
          <WifiSign x={620} y={300} color={accent} />
          <Frame x={160} y={240} w={220} h={160} c1="#F2B33D" c2="#4FAE84" />
          <Plant x={1780} y={860} />
          <Luggage x={300} y={990} color="#C98B3D" />
          <Luggage x={1000} y={980} color={accent} />
        </g>
      );
    case "cafe":
      return (
        <g>
          <rect width={1920} height={1080} fill="#F6E6C6" />
          <rect y={860} width={1920} height={220} fill="#E0C795" />
          <rect y={852} width={1920} height={12} fill="#CDB07A" />
          <rect x={980} y={200} width={420} height={260} rx={12} fill="#3B4048" />
          <Txt x={1190} y={262} size={40} color="#fff" ls={6}>
            MENU
          </Txt>
          {["Espresso", "Cappuccino", "Latte"].map((m, i) => (
            <g key={m}>
              <Txt x={1020} y={322 + i * 46} size={28} color="#F6E6C6" anchor="start" weight={600}>
                {m}
              </Txt>
              <Txt x={1360} y={322 + i * 46} size={28} color="#F6E6C6" anchor="end" weight={600}>
                {`R$ ${8 + i * 2},00`}
              </Txt>
            </g>
          ))}
          <PendantLamp x={300} y={0} color={accent} len={140} />
          <PendantLamp x={1700} y={0} color={accent} len={140} />
          <WifiSign x={600} y={300} color={accent} />
          <Table x={600} y={830} />
          <Chair x={470} y={960} color="#7A5233" />
          <Chair x={900} y={960} color="#7A5233" flip />
          <Table x={1650} y={830} />
          <Chair x={1500} y={960} color="#7A5233" />
        </g>
      );
    case "street":
      return (
        <g>
          <rect width={1920} height={1080} fill="#9AD7F2" />
          <rect y={880} width={1920} height={200} fill="#D2DCE6" />
          <rect y={872} width={1920} height={12} fill="#B4C1CE" />
          {/* prédios ao fundo */}
          <rect x={0} y={260} width={420} height={620} fill="#E6EEF4" />
          <rect x={1500} y={220} width={420} height={660} fill="#E6EEF4" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={(i < 6 ? 40 : 1540) + (i % 3) * 120} y={310 + Math.floor((i % 6) / 3) * 140} width={80} height={90} fill="#BFD6E6" />
          ))}
          {/* a loja */}
          <rect x={460} y={300} width={1000} height={580} fill="#FFFFFF" />
          <rect x={460} y={300} width={1000} height={110} fill={accent} />
          <Txt x={960} y={375} size={56} color="#fff" ls={6}>
            {sign}
          </Txt>
          <rect x={500} y={450} width={540} height={400} fill="#CFE8F5" stroke="#3B4048" strokeWidth={8} />
          <rect x={1100} y={450} width={320} height={430} fill="#3B4048" />
          <rect x={1114} y={464} width={292} height={416} fill="#A9CFE3" />
          <WifiSign x={770} y={560} color={accent} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={960} cy={360} r={100 + k * 90} fill="none" stroke={accent} strokeWidth={4} opacity={0.18} />
          ))}
          <rect x={150} y={600} width={10} height={280} fill="#3B4048" />
          <circle cx={155} cy={590} r={22} fill="#FFE9A8" stroke="#3B4048" strokeWidth={6} />
        </g>
      );
    case "restaurant":
      return (
        <g>
          <rect width={1920} height={1080} fill="#F6DCCB" />
          <rect y={860} width={1920} height={220} fill="#E2BFA8" />
          <rect y={852} width={1920} height={12} fill="#CFA78D" />
          <Frame x={180} y={220} w={240} h={170} c1="#F2B33D" c2={accent} />
          <Frame x={1450} y={240} w={200} h={150} c1="#3F8FD0" c2="#4FAE84" />
          <WifiSign x={960} y={300} color={accent} />
          <PendantLamp x={630} y={0} color="#2F3640" len={200} />
          <PendantLamp x={1260} y={0} color="#2F3640" len={200} />
          <Table x={630} y={830} w={260} />
          <ellipse cx={590} cy={826} rx={34} ry={9} fill="#fff" stroke="#D8CFC6" strokeWidth={3} />
          <ellipse cx={680} cy={826} rx={34} ry={9} fill="#fff" stroke="#D8CFC6" strokeWidth={3} />
          <Chair x={430} y={960} color="#8A4B32" />
          <Chair x={840} y={960} color="#8A4B32" flip />
          <Table x={1460} y={830} w={200} />
          <Chair x={1260} y={960} color="#8A4B32" />
          <Plant x={120} y={860} s={1.1} />
        </g>
      );
  }
};

/** o que fica na frente de quem trabalha atrás do balcão */
export const Front: React.FC<{ place: Place }> = ({ place }) => {
  if (place === "hotel") return <Counter x={1040} y={640} w={580} h={220} color="#3E5873" topColor="#2D4257" />;
  if (place === "cafe")
    return (
      <g>
        <Counter x={980} y={680} w={420} h={180} color="#9C6B43" topColor="#7A5233" />
        <rect x={1060} y={600} width={90} height={80} rx={8} fill="#3B4048" />
      </g>
    );
  return null;
};

/** Cenário completo com os personagens. `t` em segundos da cena. */
export const PlaceScene: React.FC<{ place: Place; t: number; accent: string; wifiColor?: string }> = ({
  place,
  t,
  accent,
  wifiColor,
}) => {
  const draw = (behind: boolean) =>
    CAST[place].map((c, i) => {
      if (!!c.behind !== behind) return null;
      // quem caminha atravessa a cena devagar
      const dx = c.pose === "walk" ? (c.flip ? -1 : 1) * t * 60 : 0;
      return <Person key={i} {...c} x={c.x + dx} t={t} phase={c.phase ?? i * 1.3} wifiColor={wifiColor ?? accent} />;
    });
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <Backdrop place={place} accent={accent} />
      {draw(true)}
      <Front place={place} />
      {draw(false)}
    </svg>
  );
};
