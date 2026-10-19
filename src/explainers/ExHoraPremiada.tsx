import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  AreaChart,
  BarRow,
  Check,
  Cursor,
  INK,
  interpolateColor,
  Kpi,
  LINE,
  MUTED,
  ramp,
  SCREEN,
  Tap,
  text,
  typed,
  usePop,
  useT,
} from "../demos/kit";
import { Avatar, DashboardShell, PanelBox, PanelSection, PanelTitle, ProfileCard, Swatches, ToggleRow } from "./ex-kit";
import type { ExplainerConfig } from "./ExplainerVideo";
import { BrandSlot, DiscountBadge, PortalScreen, ThemeArt, ThemeId } from "./screens";

/**
 * Hora Premiada no estilo do institucional: o cliente ganha o cupom ao se
 * conectar, o lojista monta a campanha no Painel de Controle e acompanha os
 * resgates no notebook.
 */

const GREEN = "#6DAA1F"; // verde do logo (#89C831), um tom abaixo para o branco ler bem
const LOGO_GREEN = "#89C831";
const WINE = "#8E1B3A";

/* Cupom ----------------------------------------------------------------- */

const Coupon: React.FC<{ value?: string; code?: string; scale?: number }> = ({ value = "30%", code = "BLACK30", scale = 1 }) => (
  <div
    style={{
      width: 440 * scale,
      borderRadius: 30 * scale,
      background: "#141518",
      padding: `${30 * scale}px ${36 * scale}px`,
      boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
    }}
  >
    <div style={text(26 * scale, 800, "#fff", { letterSpacing: 3 })}>BLACK FRIDAY</div>
    <div style={text(130 * scale, 900, "#fff", { letterSpacing: -6 * scale, lineHeight: 1.05 })}>{value}</div>
    <div style={text(38 * scale, 900, LOGO_GREEN, { letterSpacing: 4 })}>OFF</div>
    <div style={{ marginTop: 18 * scale, borderTop: "3px dashed rgba(255,255,255,0.35)" }} />
    <div style={{ marginTop: 16 * scale, ...text(25 * scale, 700, "rgba(255,255,255,0.85)", { letterSpacing: 2 }) }}>
      CUPOM: <b style={{ color: "#fff" }}>{code}</b>
    </div>
  </div>
);

/* 3 · celular do cliente ------------------------------------------------- */

const PhoneScreen: React.FC = () => {
  const t = useT();
  const badge = usePop(0.5, true);
  const page = ramp(t, 1.6, 2.1);
  const done = ramp(t, 4.4, 4.6);
  return (
    <>
      <PortalScreen
        theme="black"
        eyebrow="PARTICIPE DA"
        title="BLACK FRIDAY"
        badge={<DiscountBadge value="30%" color={GREEN} p={badge} />}
        logins={["email", "google"]}
        buttonColor={GREEN}
        t={t}
        pressAt={1.3}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          transform: `translateY(${(1 - page) * SCREEN.h}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 120,
        }}
      >
        <BrandSlot dark />
        <div style={{ marginTop: 30, ...text(40, 900, INK) }}>Seu cupom chegou!</div>
        <div style={{ marginTop: 30 }}>
          <Coupon />
        </div>
        <div style={{ marginTop: 20, ...text(24, 600, MUTED) }}>Válido hoje até 22h</div>
        <div
          style={{
            marginTop: 40,
            width: 420,
            height: 84,
            borderRadius: 999,
            background: interpolateColor(done, GREEN, "#EAF6DD"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            transform: `scale(${t > 4.3 && t < 4.5 ? 0.94 : 1})`,
            ...text(30, 800, done > 0.5 ? GREEN : "#fff"),
          }}
        >
          {done > 0.5 && <Check size={38} color={GREEN} p={ramp(t, 4.6, 4.9)} />}
          {done > 0.5 ? "Cupom resgatado" : "Resgatar cupom"}
        </div>
      </div>
      <Tap x={264} y={898} at={1.3} />
      <Tap x={264} y={772} at={4.3} />
    </>
  );
};

const PhoneSide: React.FC = () => (
  <>
    <ProfileCard
      at={1.0}
      left={860}
      top={170}
      avatar={<Avatar size={150} skin="#F2C7A5" hair="long" hairColor="#5A3825" top="#E25D6A" />}
      title="Renata Alves, 32 anos"
      sub="9 visitas · resgatou 3 cupons"
      stars={4}
      icon="mail"
      color={GREEN}
    />
    <ProfileCard
      at={1.8}
      left={860}
      top={390}
      avatar={<Avatar size={150} skin="#D9A27A" hair="bun" hairColor="#2A1C14" top="#F2B33D" />}
      title="Luciana Dias, 18 anos"
      sub="13 visitas · cupom por SMS"
      stars={5}
      icon="sms"
      color={GREEN}
    />
    <ProfileCard
      at={2.6}
      left={860}
      top={610}
      avatar={<Avatar size={150} skin="#A86E4B" hair="short" hairColor="#1F1A17" top="#2FA37A" />}
      title="Diego Oliveira, 23 anos"
      sub="10 visitas · cupom no Wi-Fi"
      stars={4}
      icon="wifi"
      color={GREEN}
    />
  </>
);

/* 4 · painel de controle --------------------------------------------------- */

const SWATCHES = [WINE, GREEN, "#16181C", "#2F6FDE", "#F46904"];
const THUMBS: { id: ThemeId; label: string }[] = [
  { id: "black", label: "Black Friday" },
  { id: "summer", label: "Verão" },
  { id: "xmas", label: "Natal" },
];
const CLICK = { wine: 2.4, green: 3.4, art: 4.6, email: 5.7, sms: 6.2 };

/** o que o lojista escolheu até o instante `t` */
const panelState = (t: number) => ({
  color: t < CLICK.wine ? "#2F6FDE" : t < CLICK.green ? WINE : GREEN,
  theme: (t < CLICK.art ? "summer" : "black") as ThemeId,
  value: typed("30%", t, 1.0, 8),
  code: typed("BLACK30", t, 1.4, 12),
});

const PanelPhone: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  const fade = 1 - 0.7 * ramp(t, CLICK.art, CLICK.art + 0.1) + 0.7 * ramp(t, CLICK.art + 0.1, CLICK.art + 0.45);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      <PortalScreen
        theme={s.theme}
        eyebrow="PARTICIPE DA"
        title="BLACK FRIDAY"
        badge={s.value ? <DiscountBadge value={s.value} color={s.color} /> : <div style={{ height: 200 }} />}
        logins={["email", "google"]}
        buttonColor={s.color}
        t={t}
      />
    </div>
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
      <PanelSection icon="ticket" title="Cupom" at={0.5} style={{ position: "absolute", left: 700, top: 210 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <PanelBox label="Desconto" value={s.value} focused={t > 0.85 && t < 1.35} width={250} accent={GREEN} />
          <PanelBox label="Código" value={s.code} focused={t > 1.35 && t < 2.1} width={280} accent={GREEN} />
        </div>
      </PanelSection>
      <PanelSection icon="palette" title="Cores" at={0.7} style={{ position: "absolute", left: 1300, top: 210 }}>
        <Swatches colors={SWATCHES} selected={s.color} />
      </PanelSection>
      <PanelSection icon="image" title="Arte da campanha" at={0.9} style={{ position: "absolute", left: 700, top: 540 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {THUMBS.map((th) => (
            <div key={th.id} style={{ width: 150 }}>
              <div
                style={{
                  position: "relative",
                  width: 150,
                  height: 110,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: th.id === s.theme ? `0 0 0 5px #fff, 0 0 0 9px ${GREEN}` : "0 6px 14px rgba(0,0,0,0.18)",
                }}
              >
                <ThemeArt theme={th.id} />
              </div>
              <div style={{ marginTop: 10, textAlign: "center", ...text(20, 700, "#4A5360") }}>{th.label}</div>
            </div>
          ))}
        </div>
      </PanelSection>
      <PanelSection icon="send" title="Canais de envio" at={1.1} style={{ position: "absolute", left: 1300, top: 540 }}>
        {[
          { k: "Portal Wi-Fi", on: 1 },
          { k: "E-mail", on: ramp(t, CLICK.email, CLICK.email + 0.2) },
          { k: "SMS", on: ramp(t, CLICK.sms, CLICK.sms + 0.2) },
        ].map((r) => (
          <ToggleRow key={r.k} label={r.k} on={r.on} accent={GREEN} />
        ))}
      </PanelSection>
      <Cursor
        keys={[
          { t: 0.4, x: 1100, y: 900 },
          { t: 0.9, x: 830, y: 310 },
          { t: 1.35, x: 1100, y: 310 },
          { t: 2.35, x: 1333, y: 311 },
          { t: 3.35, x: 1417, y: 311 },
          { t: 4.55, x: 775, y: 663 },
          { t: 5.65, x: 1698, y: 639 + 62 },
          { t: 6.15, x: 1698, y: 639 + 124 },
        ]}
        clicks={[0.9, 1.4, CLICK.wine, CLICK.green, CLICK.art, CLICK.email, CLICK.sms]}
        from={0.4}
        until={7.3}
      />
    </AbsoluteFill>
  );
};

/* 5 · notebook ------------------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "ticket" as const, label: "Campanhas" },
  { icon: "list" as const, label: "Cupons" },
  { icon: "users" as const, label: "Clientes" },
];

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const Dashboard: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.2);
  const feed = [3.2, 4.2].filter((a) => t >= a).length;
  const tip = ramp(t, 4.8, 5.1);
  return (
    <DashboardShell logo="hora-premiada" menu={MENU} active={0} title="Black Friday · Resultados">
      <div style={{ display: "flex", gap: 20 }}>
        <Kpi label="Cupons enviados" value={fmt(4820 * k)} accent={INK} style={{ flex: 1 }} />
        <Kpi label="Resgatados" value={fmt(1284 * k + feed)} accent={GREEN} style={{ flex: 1 }} />
        <Kpi label="Conversão" value={`${(26.6 * k).toFixed(1).replace(".", ",")}%`} accent={INK} style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 650, height: 330, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={text(24, 800)}>Resgates por hora</div>
        <div style={{ marginTop: 12 }}>
          <AreaChart
            values={[0.08, 0.18, 0.32, 0.28, 0.46, 0.62, 0.55, 0.78, 0.92]}
            labels={["10h", "12h", "14h", "16h", "18h", "20h", "22h"]}
            width={600}
            height={250}
            color={GREEN}
            p={ramp(t, 0.8, 3.0)}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 405,
            top: 62,
            padding: "10px 16px",
            borderRadius: 10,
            background: INK,
            opacity: tip,
            ...text(19, 700, "#fff"),
          }}
        >
          20h · 212 resgates
        </div>
      </div>
      <div style={{ position: "absolute", left: 670, top: 150, right: 0, height: 330, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "20px 22px" }}>
        <div style={{ ...text(24, 800), marginBottom: 22 }}>Resgates por canal</div>
        {[
          { l: "Portal Wi-Fi", v: 46 },
          { l: "E-mail", v: 31 },
          { l: "SMS", v: 23 },
        ].map((r, i) => (
          <BarRow key={r.l} label={r.l} pct={r.v} p={ramp(t, 1.2 + i * 0.3, 2.4 + i * 0.3)} color={GREEN} style={{ marginBottom: 20 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500 }}>
        {[4.2, 3.2]
          .filter((a) => t >= a)
          .map((a, i) => (
            <FeedRow key={a} at={a} y={i} who={a > 4 ? "Loja Shopping" : "Loja Centro"} />
          ))}
      </div>
      <Cursor keys={[{ t: 0, x: 900, y: 600 }, { t: 4.7, x: 545, y: 255 }]} from={3.6} />
    </DashboardShell>
  );
};

const FeedRow: React.FC<{ at: number; y: number; who: string }> = ({ at, y, who }) => {
  const p = usePop(at);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y * 76,
        height: 64,
        borderRadius: 14,
        background: y === 0 ? "#EEF7E3" : "#fff",
        border: `1px solid ${LINE}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 20px",
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
      }}
    >
      <Check size={34} color={GREEN} />
      <span style={text(22, 800)}>Cupom BLACK30 resgatado</span>
      <span style={{ marginLeft: "auto", ...text(20, 600, MUTED) }}>{who} · agora</span>
    </div>
  );
};

/* 7 · celular do fechamento ------------------------------------------------- */

const OutroScreen: React.FC = () => (
  <PortalScreen
    theme="black"
    eyebrow="PARTICIPE DA"
    title="BLACK FRIDAY"
    badge={<DiscountBadge value="30%" color={GREEN} />}
    logins={["email", "google"]}
    buttonColor={GREEN}
    t={0}
  />
);

export const horaPremiadaExplainer: ExplainerConfig = {
  logo: "hora-premiada",
  name: "Hora Premiada",
  accent: GREEN,
  place: "store",
  hook: [
    { at: 0.4, until: 3.6, text: "Seu cliente entrou, olhou… e saiu sem comprar?" },
    { at: 3.9, until: 7.2, text: "E se uma oferta chegasse a ele na hora certa?" },
  ],
  tagline: "Cupons que trazem o cliente de volta.",
  phone: {
    Screen: PhoneScreen,
    Side: PhoneSide,
    caption: [
      { at: 0.4, until: 4.0, text: "Com o Hora Premiada, o cliente ganha um cupom ao se conectar ao seu Wi-Fi." },
      { at: 4.3, until: 7.9, text: "E as ofertas chegam também por e-mail e SMS." },
    ],
  },
  panel: {
    Screen: PanelPhone,
    Panel,
    screenBg: "#16181C",
    caption: [
      { at: 0.4, until: 4.3, text: "No Painel de Controle, você cria o cupom com a cara da sua marca." },
      { at: 4.5, until: 8.1, text: "Escolha a arte da campanha e os canais de envio." },
    ],
  },
  laptop: {
    Screen: Dashboard,
    caption: [{ at: 0.4, until: 7.3, text: "E acompanha cada resgate, em tempo real." }],
  },
  tiles: [
    { icon: "ticket", label: "Cupons personalizados" },
    { icon: "calendar", label: "Agendamento de campanhas" },
    { icon: "chart", label: "Relatórios em tempo real" },
  ],
  bullets: [
    { icon: "star", title: "Clientes mais fiéis", text: "promoções que trazem o cliente de volta" },
    { icon: "clock", title: "Controle em tempo real", text: "ajuste a campanha enquanto ela acontece" },
  ],
  OutroScreen,
};
