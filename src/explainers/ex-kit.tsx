import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { FONT_FAMILY } from "../brand";
import { INK, MUTED, ramp, text, usePop, useT } from "../demos/kit";

/**
 * Peças do estilo "explainer" (16:9), tiradas do vídeo institucional antigo
 * da Wispot: fundo azul-marinho com brilho, fundo cinza de estúdio para os
 * aparelhos, cartões de perfil em pílula azul, "Painel de Controle" com
 * ícones em quadrados azuis e fechamento com tópicos em ícones de contorno.
 */

export const NAVY = "#0B3F8F";
export const NAVY_DEEP = "#072A63";
export const PILL = "#1C7FD6";

export const NavyBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 70% 30%, #1A5FC0 0%, ${NAVY} 45%, ${NAVY_DEEP} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const StudioBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 55% 25%, #FFFFFF 0%, #EEF0F3 40%, #CDD2D9 100%)",
    }}
  >
    {/* reflexo do chão */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 260,
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(176,184,194,0.35) 100%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/* Logos ------------------------------------------------------------- */

export type LogoId = "hora-premiada" | "myguest" | "sending" | "wimap" | "wiquest";

/** os logos que têm versão branca (o Sending só existe colorido) */
const HAS_WHITE: LogoId[] = ["hora-premiada", "myguest", "wimap", "wiquest"];

export const ProductLogo: React.FC<{
  id: LogoId;
  white?: boolean;
  height: number;
  style?: React.CSSProperties;
}> = ({ id, white, height, style }) => (
  <Img
    src={staticFile(`brand/products/${id}${white && HAS_WHITE.includes(id) ? "-white" : ""}.png`)}
    style={{ height, display: "block", ...style }}
  />
);

export const WispotLogo: React.FC<{ width: number; white?: boolean; style?: React.CSSProperties }> = ({
  width,
  white = true,
  style,
}) => <Img src={staticFile(`brand/logo-${white ? "white" : "blue"}.png`)} style={{ width, display: "block", ...style }} />;

/* Legenda da narração ------------------------------------------------ */

export type Line = { at: number; until: number; text: React.ReactNode };

/**
 * Faz o papel da locução do vídeo antigo: uma frase por vez, no pé da tela,
 * em caixa escura para valer tanto sobre o azul quanto sobre o estúdio.
 */
export const Caption: React.FC<{ lines: Line[]; big?: boolean }> = ({ lines, big }) => {
  const t = useT();
  const cur = lines.find((l) => t >= l.at - 0.05 && t < l.until + 0.3);
  if (!cur) return null;
  const p = ramp(t, cur.at, cur.at + 0.35) * (1 - ramp(t, cur.until, cur.until + 0.3));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: big ? 70 : 54,
        display: "flex",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: big ? "22px 44px" : "16px 36px",
          borderRadius: 18,
          background: "rgba(8,22,48,0.80)",
          textAlign: "center",
          ...text(big ? 50 : 38, 700, "#fff", { lineHeight: 1.3, letterSpacing: -0.3 }),
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

/* Ícones ------------------------------------------------------------- */

export type IconName =
  | "wifi"
  | "dollar"
  | "chart"
  | "ticket"
  | "mail"
  | "sms"
  | "clock"
  | "users"
  | "pin"
  | "bell"
  | "lock"
  | "image"
  | "palette"
  | "link"
  | "send"
  | "heat"
  | "download"
  | "list"
  | "star"
  | "calendar"
  | "shield"
  | "layers"
  | "question";

export const Icon: React.FC<{ name: IconName; size: number; color?: string; stroke?: number }> = ({
  name,
  size,
  color = "#fff",
  stroke = 2,
}) => {
  const s = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const paths: Record<IconName, React.ReactNode> = {
    wifi: (
      <>
        <path d="M2.5 9 A14 14 0 0 1 21.5 9" {...s} />
        <path d="M6 12.6 A9 9 0 0 1 18 12.6" {...s} />
        <path d="M9.4 16 A4.5 4.5 0 0 1 14.6 16" {...s} />
        <circle cx={12} cy={19.2} r={1.3} fill={color} />
      </>
    ),
    dollar: (
      <>
        <path d="M12 3 V21" {...s} />
        <path d="M16.5 7 C15.5 5.5 13.8 5 12 5 C9.5 5 7.5 6.2 7.5 8.3 C7.5 13 16.5 10.5 16.5 15.6 C16.5 17.8 14.5 19 12 19 C9.8 19 8 18.2 7 16.6" {...s} />
      </>
    ),
    chart: (
      <>
        <path d="M3.5 20.5 H20.5" {...s} />
        <path d="M6.5 17 V12 M11 17 V7 M15.5 17 V10 M20 17 V5" {...s} />
      </>
    ),
    ticket: (
      <>
        <path d="M3 8 V5.5 H21 V8 A2.5 2.5 0 0 0 21 13 V18.5 H3 V13 A2.5 2.5 0 0 0 3 8 Z" {...s} />
        <path d="M14 6 V18" {...s} strokeDasharray="2 2.2" />
      </>
    ),
    mail: (
      <>
        <rect x={3} y={5.5} width={18} height={13} rx={2} {...s} />
        <path d="M3.5 7 L12 13 L20.5 7" {...s} />
      </>
    ),
    sms: (
      <>
        <path d="M4 5 H20 A1.5 1.5 0 0 1 21.5 6.5 V15 A1.5 1.5 0 0 1 20 16.5 H10 L5.5 20 V16.5 H4 A1.5 1.5 0 0 1 2.5 15 V6.5 A1.5 1.5 0 0 1 4 5 Z" {...s} />
        <circle cx={8} cy={10.8} r={1} fill={color} />
        <circle cx={12} cy={10.8} r={1} fill={color} />
        <circle cx={16} cy={10.8} r={1} fill={color} />
      </>
    ),
    clock: (
      <>
        <circle cx={12} cy={12} r={9} {...s} />
        <path d="M12 7 V12 L15.5 14" {...s} />
      </>
    ),
    users: (
      <>
        <circle cx={9} cy={8} r={3.5} {...s} />
        <path d="M2.5 20 C2.5 15.5 5.5 13.5 9 13.5 C12.5 13.5 15.5 15.5 15.5 20" {...s} />
        <circle cx={17} cy={9} r={2.6} {...s} />
        <path d="M17 13.6 C19.8 13.6 21.5 15.4 21.5 18.5" {...s} />
      </>
    ),
    pin: (
      <>
        <path d="M12 21.5 C12 21.5 5 15 5 9.6 A7 7 0 0 1 19 9.6 C19 15 12 21.5 12 21.5 Z" {...s} />
        <circle cx={12} cy={9.6} r={2.6} {...s} />
      </>
    ),
    bell: (
      <>
        <path d="M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18 H4.5 Z" {...s} />
        <path d="M10 20.5 A2 2 0 0 0 14 20.5" {...s} />
      </>
    ),
    lock: (
      <>
        <rect x={4.5} y={10.5} width={15} height={10} rx={2.2} {...s} />
        <path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5" {...s} />
      </>
    ),
    image: (
      <>
        <rect x={3} y={4.5} width={18} height={15} rx={2} {...s} />
        <circle cx={9} cy={10} r={1.8} {...s} />
        <path d="M3.5 17.5 L9.5 12.5 L13.5 16 L16.5 13.5 L20.5 17" {...s} />
      </>
    ),
    palette: (
      <>
        <path d="M12 3 A9 9 0 0 0 12 21 C13.5 21 13.8 19.8 13.2 18.8 C12.4 17.5 13.2 16 14.8 16 H17 A4.5 4.5 0 0 0 21 11.5 C21 6.7 17 3 12 3 Z" {...s} />
        <circle cx={7.5} cy={11} r={1.2} fill={color} />
        <circle cx={10.5} cy={7} r={1.2} fill={color} />
        <circle cx={15.5} cy={7.5} r={1.2} fill={color} />
      </>
    ),
    link: (
      <>
        <path d="M10 14 A4 4 0 0 0 15.7 14 L18.8 10.9 A4 4 0 0 0 13.1 5.2 L11.6 6.7" {...s} />
        <path d="M14 10 A4 4 0 0 0 8.3 10 L5.2 13.1 A4 4 0 0 0 10.9 18.8 L12.4 17.3" {...s} />
      </>
    ),
    send: (
      <>
        <path d="M3.5 11.2 L20.5 3.8 L15.5 20.2 L11.4 13 Z" {...s} />
        <path d="M11.4 13 L20.5 3.8" {...s} />
      </>
    ),
    heat: (
      <>
        <circle cx={12} cy={12} r={3} {...s} />
        <circle cx={12} cy={12} r={6.2} {...s} opacity={0.7} />
        <circle cx={12} cy={12} r={9.4} {...s} opacity={0.4} />
      </>
    ),
    download: (
      <>
        <path d="M12 3.5 V15 M7.5 10.5 L12 15 L16.5 10.5" {...s} />
        <path d="M4 17.5 V20 H20 V17.5" {...s} />
      </>
    ),
    list: (
      <>
        <path d="M9 6.5 H20 M9 12 H20 M9 17.5 H20" {...s} />
        <circle cx={4.8} cy={6.5} r={1.2} fill={color} />
        <circle cx={4.8} cy={12} r={1.2} fill={color} />
        <circle cx={4.8} cy={17.5} r={1.2} fill={color} />
      </>
    ),
    star: <path d="M12 3.5 L14.6 9 L20.5 9.6 L16 13.6 L17.3 19.5 L12 16.4 L6.7 19.5 L8 13.6 L3.5 9.6 L9.4 9 Z" {...s} />,
    calendar: (
      <>
        <rect x={3.5} y={5} width={17} height={15.5} rx={2} {...s} />
        <path d="M3.5 10 H20.5 M8 3 V7 M16 3 V7" {...s} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 L19.5 6 V11.5 C19.5 16 16.3 19.6 12 21 C7.7 19.6 4.5 16 4.5 11.5 V6 Z" {...s} />
        <path d="M8.8 12 L11.2 14.4 L15.5 10" {...s} />
      </>
    ),
    layers: (
      <>
        <path d="M12 3.5 L21 8.2 L12 13 L3 8.2 Z" {...s} />
        <path d="M3 12.5 L12 17.3 L21 12.5" {...s} />
      </>
    ),
    question: (
      <>
        <circle cx={12} cy={12} r={9} {...s} />
        <path d="M9.4 9.4 A2.7 2.7 0 1 1 12.6 12 C12 12.3 12 12.8 12 13.6" {...s} />
        <circle cx={12} cy={16.8} r={1.1} fill={color} />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

/* Notebook ----------------------------------------------------------- */

export const LAPTOP_SCREEN = { w: 1280, h: 800 } as const;

/**
 * Notebook prateado, como no vídeo antigo. O conteúdo da tela é desenhado em
 * 1280 × 800 e escalado para caber.
 */
export const Laptop: React.FC<{ left: number; top: number; width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  left,
  top,
  width,
  children,
  style,
}) => {
  const bezel = 26;
  const scale = (width - bezel * 2) / LAPTOP_SCREEN.w;
  const screenH = LAPTOP_SCREEN.h * scale;
  return (
    <div style={{ position: "absolute", left, top, width, ...style }}>
      <div
        style={{
          width,
          height: screenH + bezel * 2,
          borderRadius: "28px 28px 8px 8px",
          background: "#16191E",
          padding: bezel,
          boxSizing: "border-box",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 3px #3A3F47",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 10, left: "50%", marginLeft: -5, width: 10, height: 10, borderRadius: 99, background: "#30353D" }} />
        <div style={{ width: LAPTOP_SCREEN.w * scale, height: screenH, overflow: "hidden", background: "#fff", borderRadius: 4 }}>
          <div style={{ width: LAPTOP_SCREEN.w, height: LAPTOP_SCREEN.h, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}>
            {children}
          </div>
        </div>
      </div>
      <div
        style={{
          width: width * 1.12,
          marginLeft: -width * 0.06,
          height: 30,
          borderRadius: "0 0 40px 40px",
          background: "linear-gradient(180deg, #E4E7EB 0%, #B8BEC6 100%)",
          boxShadow: "0 18px 30px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", marginLeft: -90, width: 180, height: 12, borderRadius: "0 0 14px 14px", background: "#A4ABB4" }} />
      </div>
    </div>
  );
};

/* Cartões e painel ---------------------------------------------------- */

/** Avatar ilustrado (busto em círculo), no mesmo traço dos personagens. */
export const Avatar: React.FC<{ size: number; skin: string; hair: "short" | "long" | "bun" | "curly"; hairColor: string; top: string; bg?: string }> = ({
  size,
  skin,
  hair,
  hairColor,
  top,
  bg = "#DCEBF7",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: 999, flexShrink: 0, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
    <circle cx={50} cy={50} r={50} fill={bg} />
    <clipPath id={`av-${size}-${skin}-${hair}`}>
      <circle cx={50} cy={50} r={50} />
    </clipPath>
    <g clipPath={`url(#av-${size}-${skin}-${hair})`}>
      {hair === "long" && <rect x={27} y={24} width={46} height={58} rx={20} fill={hairColor} />}
      <ellipse cx={50} cy={104} rx={38} ry={30} fill={top} />
      <rect x={44} y={58} width={12} height={18} fill={skin} />
      <circle cx={50} cy={46} r={21} fill={skin} />
      <path d="M28 48 C26 18 74 18 72 48 C66 36 46 32 28 48 Z" fill={hairColor} />
      {hair === "bun" && <circle cx={50} cy={22} r={10} fill={hairColor} />}
      {hair === "curly" && [-18, -9, 0, 9, 18].map((d) => <circle key={d} cx={50 + d} cy={30 + Math.abs(d) * 0.4} r={9} fill={hairColor} />)}
      <circle cx={43} cy={48} r={2.3} fill="#22252B" />
      <circle cx={57} cy={48} r={2.3} fill="#22252B" />
      <path d="M44 56 Q50 60 56 56" fill="none" stroke="#22252B" strokeWidth={2} strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Cartão de perfil do vídeo antigo: avatar redondo e uma pílula azul com o
 * nome, um detalhe e estrelas. Entra deslizando da direita.
 */
export const ProfileCard: React.FC<{
  at: number;
  left: number;
  top: number;
  avatar: React.ReactNode;
  title: string;
  sub: string;
  stars?: number;
  color?: string;
  icon?: IconName;
}> = ({ at, left, top, avatar, title, sub, stars, color = PILL, icon }) => {
  const p = usePop(at, true);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity: Math.min(1, p * 1.4),
        transform: `translateX(${interpolate(p, [0, 1], [160, 0])}px)`,
      }}
    >
      {avatar}
      <div
        style={{
          position: "relative",
          width: 620,
          padding: "18px 28px",
          borderRadius: 14,
          background: color,
          boxShadow: `0 14px 30px ${color}55`,
        }}
      >
        <div style={{ position: "absolute", left: -12, top: "50%", marginTop: -12, width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderRight: `12px solid ${color}` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={text(30, 800, "#fff")}>{title}</span>
          {stars !== undefined && (
            <span style={{ ...text(24, 900, "#FFD54A"), letterSpacing: 2 }}>{"★".repeat(stars)}</span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={text(24, 600, "rgba(255,255,255,0.9)")}>{sub}</span>
          {icon && (
            <span style={{ width: 36, height: 36, borderRadius: 99, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={icon} size={22} color={color} stroke={2.4} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/** Título fino "Painel de Controle", como no vídeo antigo. */
export const PanelTitle: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 0.2 }) => {
  const p = usePop(at);
  return <div style={{ ...text(54, 400, "#59626F", { letterSpacing: -0.5 }), opacity: p, transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)` }}>{children}</div>;
};

/** Seção do painel: ícone em quadrado azul + rótulo em caixa alta + conteúdo. */
export const PanelSection: React.FC<{
  icon: IconName;
  title: string;
  at: number;
  children?: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ icon, title, at, children, color = "#1565C0", style }) => {
  const p = usePop(at);
  return (
    <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 50, height: 50, borderRadius: 12, background: color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={30} />
        </span>
        <span style={text(26, 800, "#2F3743", { letterSpacing: 1.5 })}>{title.toUpperCase()}</span>
      </div>
      {children && <div style={{ marginTop: 18 }}>{children}</div>}
    </div>
  );
};

/** Bloco de recurso sobre o fundo desfocado. */
export const FeatureTile: React.FC<{ icon: IconName; label: string; at: number; color: string }> = ({ icon, label, at, color }) => {
  const p = usePop(at, true);
  return (
    <div
      style={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
      }}
    >
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: 34,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 24px 50px rgba(0,0,0,0.35), inset 0 -8px 0 rgba(0,0,0,0.12)`,
        }}
      >
        <Icon name={icon} size={110} stroke={1.8} />
      </div>
      <div style={{ marginTop: 28, textAlign: "center", ...text(32, 900, "#fff", { lineHeight: 1.15, letterSpacing: 1, textShadow: "0 4px 16px rgba(0,0,0,0.4)" }) }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
};

/** Tópico do fechamento: ícone em círculo de contorno + título + texto. */
export const Bullet: React.FC<{ icon: IconName; title: string; text: string; at: number }> = ({ icon, title, text: body, at }) => {
  const p = usePop(at);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)` }}>
      <span
        style={{
          width: 92,
          height: 92,
          borderRadius: 99,
          border: "4px solid rgba(255,255,255,0.9)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={50} stroke={2.2} />
      </span>
      <div>
        <div style={text(38, 800, "#fff")}>{title}</div>
        <div style={text(32, 400, "rgba(255,255,255,0.88)")}>{body}</div>
      </div>
    </div>
  );
};

/* Painel web dentro do notebook --------------------------------------- */

/**
 * Casca do painel web, como a do vídeo antigo: barra azul com o logo da
 * Wispot e menu lateral com ícones. O conteúdo ocupa 1080 × 736.
 */
export const DashboardShell: React.FC<{
  logo: LogoId;
  menu: { icon: IconName; label: string }[];
  active: number;
  title: string;
  children: React.ReactNode;
}> = ({ logo, menu, active, title, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "#F2F4F7", fontFamily: FONT_FAMILY }}>
    <div style={{ height: 64, background: NAVY, display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between" }}>
      <WispotLogo width={130} />
      <ProductLogo id={logo} white height={38} />
    </div>
    <div style={{ position: "absolute", top: 64, left: 0, bottom: 0, width: 180, background: "#fff", borderRight: "1px solid #E1E5EB" }}>
      {menu.map((m, i) => (
        <div
          key={m.label}
          style={{
            height: 92,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: i === active ? "#EAF2FC" : "transparent",
            borderLeft: i === active ? `5px solid ${NAVY}` : "5px solid transparent",
          }}
        >
          <Icon name={m.icon} size={30} color={i === active ? NAVY : "#8A94A3"} stroke={2.2} />
          <span style={text(17, 700, i === active ? NAVY : "#8A94A3")}>{m.label}</span>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", top: 64, left: 180, right: 0, bottom: 0, padding: "24px 30px" }}>
      <div style={{ ...text(30, 800, INK), marginBottom: 18 }}>{title}</div>
      <div style={{ position: "relative", height: 736 - 24 - 54 }}>{children}</div>
    </div>
  </div>
);

export const Muted: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={text(20, 600, MUTED)}>{children}</span>;

/* Controles do painel -------------------------------------------------- */

/** Campo compacto do painel: rótulo à esquerda, valor à direita. */
export const PanelBox: React.FC<{ label: string; value: React.ReactNode; focused?: boolean; width: number; accent: string }> = ({
  label,
  value,
  focused,
  width,
  accent,
}) => (
  <div
    style={{
      width,
      height: 66,
      borderRadius: 12,
      background: "#fff",
      border: `3px solid ${focused ? accent : "#E3E8EE"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      boxSizing: "border-box",
    }}
  >
    <span style={text(22, 600, MUTED)}>{label}</span>
    <span style={text(28, 900, INK)}>{value}</span>
  </div>
);

/** Linha com rótulo e chave liga/desliga. `on` vai de 0 a 1. */
export const ToggleRow: React.FC<{ label: string; on: number; accent: string; width?: number }> = ({ label, on, accent, width = 430 }) => (
  <div style={{ width, height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E3E8EE", ...text(26, 700, "#2F3743") }}>
    {label}
    <div style={{ width: 64, height: 36, borderRadius: 99, background: on > 0.5 ? accent : "#D3D9E0", position: "relative" }}>
      <div style={{ position: "absolute", top: 4, left: 4 + on * 28, width: 28, height: 28, borderRadius: 99, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} />
    </div>
  </div>
);

/** Etiqueta que liga e desliga (filtros). */
export const Chip: React.FC<{ label: string; on: boolean; accent: string }> = ({ label, on, accent }) => (
  <span
    style={{
      padding: "12px 22px",
      borderRadius: 999,
      border: `3px solid ${on ? accent : "#D3D9E0"}`,
      background: on ? accent : "#fff",
      ...text(22, 800, on ? "#fff" : "#2F3743"),
      whiteSpace: "nowrap",
    }}
  >
    {on ? "✓ " : "+ "}
    {label}
  </span>
);

/** Controle deslizante com valor. `f` vai de 0 a 1. */
export const PanelSlider: React.FC<{ label: string; value: string; f: number; accent: string; width?: number; active?: boolean }> = ({
  label,
  value,
  f,
  accent,
  width = 520,
  active,
}) => (
  <div style={{ width, marginBottom: 26 }}>
    <div style={{ display: "flex", justifyContent: "space-between", ...text(24, 700, "#2F3743") }}>
      <span>{label}</span>
      <span style={{ color: accent, fontWeight: 900 }}>{value}</span>
    </div>
    <div style={{ position: "relative", marginTop: 18, height: 10, borderRadius: 99, background: "#DCE1E7" }}>
      <div style={{ width: `${f * 100}%`, height: 10, borderRadius: 99, background: accent }} />
      <div
        style={{
          position: "absolute",
          top: -14,
          left: f * width - 19,
          width: 38,
          height: 38,
          borderRadius: 99,
          background: "#fff",
          border: `4px solid ${accent}`,
          boxSizing: "border-box",
          boxShadow: active ? `0 0 0 9px ${accent}33` : "0 3px 8px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  </div>
);

/** Fileira de cores; a escolhida ganha anel. */
export const Swatches: React.FC<{ colors: string[]; selected: string }> = ({ colors, selected }) => (
  <div style={{ display: "flex", gap: 18 }}>
    {colors.map((c) => (
      <div
        key={c}
        style={{
          width: 66,
          height: 66,
          borderRadius: 14,
          background: c,
          boxShadow: c === selected ? `0 0 0 5px #fff, 0 0 0 9px ${c}` : "0 4px 10px rgba(0,0,0,0.15)",
        }}
      />
    ))}
  </div>
);

/** Botão do painel. */
export const PanelButton: React.FC<{ children: React.ReactNode; color: string; pressed?: boolean; width?: number }> = ({ children, color, pressed, width = 300 }) => (
  <div
    style={{
      width,
      height: 64,
      borderRadius: 14,
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      boxShadow: `0 10px 22px ${color}55`,
      transform: `scale(${pressed ? 0.95 : 1})`,
      ...text(24, 800, "#fff"),
    }}
  >
    {children}
  </div>
);
