import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Caret, Check, Cursor, INK, Kpi, LINE, MUTED, ramp, SCREEN, Tap, text, typed, useT, WifiGlyph } from "../demos/kit";
import {
  Avatar,
  DashboardShell,
  PanelButton,
  PanelSection,
  PanelSlider,
  PanelTitle,
  ProfileCard,
  ToggleRow,
} from "./ex-kit";
import type { ExplainerConfig } from "./ExplainerVideo";
import { BrandSlot, LoginButton, LoginKind, SuccessScreen, ThemeArt, ThemeId } from "./screens";

/**
 * MyGuest no estilo do institucional: o hóspede entra com o voucher, o
 * gestor define planos e formas de acesso no Painel de Controle e acompanha
 * quem está online no notebook.
 */

const RED = "#C42627";

/* Portal de voucher ------------------------------------------------------ */

const VoucherPortal: React.FC<{
  theme: ThemeId;
  code: string;
  t: number;
  caret?: [number, number];
  hours: number;
  mbps: number;
  logins: { kind: LoginKind; p: number }[];
  pressAt?: number;
  connecting?: boolean;
}> = ({ theme, code, t, caret, hours, mbps, logins, pressAt, connecting }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 520, overflow: "hidden" }}>
      <ThemeArt theme={theme} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BrandSlot />
      <div style={{ marginTop: 34, ...text(24, 700, "rgba(255,255,255,0.9)", { letterSpacing: 3 }) }}>BEM-VINDO</div>
      <div style={{ marginTop: 6, ...text(54, 900, "#fff", { letterSpacing: -1.5 }) }}>Wi-Fi do Hotel</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, bottom: 0, background: "#fff", borderRadius: "40px 40px 0 0", padding: "40px 46px 0" }}>
      <div style={text(24, 800, RED, { letterSpacing: 2 })}>VOUCHER DE ACESSO</div>
      <div
        style={{
          marginTop: 16,
          height: 92,
          borderRadius: 18,
          border: `4px dashed ${RED}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...text(42, 900, RED, { letterSpacing: 3 }),
        }}
      >
        {code || <span style={text(28, 600, "#D7A7A8")}>Digite o código</span>}
        {caret && <Caret t={t} from={caret[0]} to={caret[1]} />}
      </div>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px" }}>
        {[`Válido por ${hours}h`, "2 dispositivos", `${mbps} Mbps`, "Franquia 5 GB"].map((l) => (
          <div key={l.slice(0, 5)} style={{ display: "flex", alignItems: "center", gap: 10, height: 44, ...text(23, 700, INK) }}>
            <Check size={28} color={RED} />
            {l}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
        {logins.map((l, i) =>
          l.p > 0 ? (
            <div key={l.kind} style={{ opacity: l.p, maxHeight: 90 * l.p, transform: `scale(${interpolate(l.p, [0, 1], [0.9, 1])})` }}>
              {i === 0 ? (
                <div
                  style={{
                    height: 80,
                    borderRadius: 18,
                    background: RED,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 10px 22px ${RED}55`,
                    transform: `scale(${pressAt !== undefined && t > pressAt && t < pressAt + 0.2 ? 0.95 : 1})`,
                    ...text(28, 800, "#fff"),
                  }}
                >
                  {connecting ? "Conectando…" : "Conectar"}
                </div>
              ) : (
                <LoginButton kind={l.kind} t={t} />
              )}
            </div>
          ) : null,
        )}
      </div>
    </div>
  </div>
);

/* 3 · celular do hóspede ------------------------------------------------- */

const NETWORKS = ["Rede_Corporativa", "WIFI_HOTEL_HOSPEDES", "Visitantes_2G"];
const CODE = "WSP-4821";

const PhoneScreen: React.FC = () => {
  const t = useT();
  const portal = ramp(t, 1.5, 1.9);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#F2F2F7", padding: "120px 30px 0" }}>
        <div style={text(52, 800, INK, { letterSpacing: -1 })}>Wi-Fi</div>
        <div style={{ marginTop: 30, borderRadius: 24, background: "#fff", overflow: "hidden" }}>
          {NETWORKS.map((n, i) => (
            <div
              key={n}
              style={{
                height: 92,
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                borderTop: i ? `1px solid ${LINE}` : "none",
                background: i === 1 && t > 1.0 ? "#EAF2FF" : "#fff",
                ...text(26, 600),
              }}
            >
              {n}
              <span style={{ marginLeft: "auto" }}>
                <WifiGlyph size={30} color="#3A3A3C" />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - portal) * SCREEN.h}px)` }}>
        <VoucherPortal
          theme="hotel"
          code={typed(CODE, t, 2.2, 10)}
          caret={[2.0, 3.2]}
          t={t}
          hours={24}
          mbps={20}
          logins={[{ kind: "voucher", p: 1 }]}
          pressAt={3.8}
          connecting={t > 3.85}
        />
      </div>
      <SuccessScreen color={RED} title="Acesso liberado" detail="24h · 2 dispositivos · 20 Mbps" t={t} at={4.4} />
      <Tap x={264} y={350} at={1.0} />
      <Tap x={264} y={571} at={2.0} />
      <Tap x={264} y={803} at={3.8} />
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
      title="Ana Souza · Quarto 204"
      sub="voucher WSP-4821 · 24h"
      icon="lock"
      color={RED}
    />
    <ProfileCard
      at={1.8}
      left={860}
      top={390}
      avatar={<Avatar size={150} skin="#D9A27A" hair="short" hairColor="#2A1C14" top="#3C8DBC" />}
      title="Carlos Lima · Evento"
      sub="voucher EVT-1180 · 4h"
      icon="ticket"
      color={RED}
    />
    <ProfileCard
      at={2.6}
      left={860}
      top={610}
      avatar={<Avatar size={150} skin="#A86E4B" hair="curly" hairColor="#1B1410" top="#E8A33D" />}
      title="Júlia Prado · Pix aprovado"
      sub="acesso de 7 dias · 2 aparelhos"
      icon="dollar"
      color={RED}
    />
  </>
);

/* 4 · painel de controle -------------------------------------------------- */

const SLIDE = { hours: [1.0, 1.6], mbps: [1.9, 2.5] } as const;
const CLICK = { gen: 3.0, pix: 4.6, fb: 5.2, art: 6.2 };
const CODES = ["WSP-4821", "WSP-7350", "WSP-1964", "WSP-5502", "WSP-3187", "WSP-9046"];
const THUMBS: { id: ThemeId; label: string }[] = [
  { id: "hotel", label: "Piscina" },
  { id: "night", label: "Noite" },
  { id: "summer", label: "Verão" },
];

const panelState = (t: number) => {
  const h = ramp(t, SLIDE.hours[0], SLIDE.hours[1]);
  const m = ramp(t, SLIDE.mbps[0], SLIDE.mbps[1]);
  return {
    hf: 0.1 + 0.4 * h,
    hours: Math.round(2 + 22 * h),
    mf: 0.1 + 0.3 * m,
    mbps: Math.round(5 + 15 * m),
    pix: ramp(t, CLICK.pix, CLICK.pix + 0.25),
    fb: ramp(t, CLICK.fb, CLICK.fb + 0.25),
    theme: (t < CLICK.art ? "hotel" : "night") as ThemeId,
  };
};

const PanelPhone: React.FC = () => {
  const t = useT();
  const s = panelState(t);
  return (
    <VoucherPortal
      theme={s.theme}
      code=""
      t={t}
      hours={s.hours}
      mbps={s.mbps}
      logins={[
        { kind: "voucher", p: 1 },
        { kind: "pix", p: s.pix },
        { kind: "facebook", p: s.fb },
      ]}
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
      <PanelSection icon="clock" title="Plano de acesso" at={0.5} style={{ position: "absolute", left: 700, top: 200 }}>
        <PanelSlider label="Validade" value={`${s.hours}h`} f={s.hf} accent={RED} active={t > 0.9 && t < 1.7} />
        <PanelSlider label="Velocidade" value={`${s.mbps} Mbps`} f={s.mf} accent={RED} active={t > 1.8 && t < 2.6} />
      </PanelSection>
      <PanelSection icon="ticket" title="Vouchers" at={0.7} style={{ position: "absolute", left: 1300, top: 200 }}>
        <PanelButton color={RED} pressed={t > CLICK.gen && t < CLICK.gen + 0.2} width={360}>
          Gerar 50 vouchers
        </PanelButton>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 12 }}>
          {CODES.map((c, i) => {
            const p = ramp(t, CLICK.gen + 0.2 + i * 0.1, CLICK.gen + 0.45 + i * 0.1);
            return (
              <div
                key={c}
                style={{
                  height: 52,
                  borderRadius: 10,
                  border: `3px dashed ${p > 0 ? RED : "#D3D9E0"}`,
                  background: p > 0 ? "#FCEDED" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: interpolate(p, [0, 1], [0.35, 1]),
                  ...text(21, 900, p > 0 ? RED : "#B5BDC7", { letterSpacing: 1 }),
                }}
              >
                {p > 0 ? c : "····"}
              </div>
            );
          })}
        </div>
      </PanelSection>
      <PanelSection icon="lock" title="Formas de acesso" at={0.9} style={{ position: "absolute", left: 700, top: 540 }}>
        <ToggleRow label="Voucher" on={1} accent={RED} />
        <ToggleRow label="Pix e cartão" on={s.pix} accent={RED} />
        <ToggleRow label="Facebook" on={s.fb} accent={RED} />
      </PanelSection>
      <PanelSection icon="image" title="Arte do portal" at={1.1} style={{ position: "absolute", left: 1300, top: 540 }}>
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
                  boxShadow: th.id === s.theme ? `0 0 0 5px #fff, 0 0 0 9px ${RED}` : "0 6px 14px rgba(0,0,0,0.18)",
                }}
              >
                <ThemeArt theme={th.id} />
              </div>
              <div style={{ marginTop: 10, textAlign: "center", ...text(20, 700, "#4A5360") }}>{th.label}</div>
            </div>
          ))}
        </div>
      </PanelSection>
      <Cursor
        keys={[
          { t: 0.5, x: 1100, y: 900 },
          { t: 1.0, x: 752, y: 321 },
          { t: 1.6, x: 960, y: 321 },
          { t: 1.9, x: 752, y: 405 },
          { t: 2.5, x: 908, y: 405 },
          { t: 2.95, x: 1480, y: 300 },
          { t: 4.55, x: 1098, y: 701 },
          { t: 5.15, x: 1098, y: 763 },
          { t: 6.15, x: 1545, y: 663 },
        ]}
        clicks={[1.0, 1.9, CLICK.gen, CLICK.pix, CLICK.fb, CLICK.art]}
        from={0.5}
        until={7.4}
      />
    </AbsoluteFill>
  );
};

/* 5 · notebook -------------------------------------------------------------- */

const MENU = [
  { icon: "chart" as const, label: "Dashboard" },
  { icon: "wifi" as const, label: "Wispots" },
  { icon: "ticket" as const, label: "Vouchers" },
  { icon: "users" as const, label: "Visitantes" },
];

const ROWS = [
  { code: "WSP-4821", who: "Quarto 204", use: 0.42, status: "Ativo" },
  { code: "WSP-7350", who: "Quarto 118", use: 0.78, status: "Ativo" },
  { code: "EVT-1180", who: "Sala de eventos", use: 0.94, status: "Ativo" },
  { code: "WSP-1964", who: "Quarto 307", use: 0.25, status: "Ativo" },
  { code: "WSP-5502", who: "Quarto 221", use: 1, status: "Expirado" },
];
const BLOCK_AT = 4.6;

const Dashboard: React.FC = () => {
  const t = useT();
  const k = ramp(t, 0.6, 2.0);
  return (
    <DashboardShell logo="myguest" menu={MENU} active={2} title="Vouchers · Hotel Centro">
      <div style={{ display: "flex", gap: 20 }}>
        <Kpi label="Online agora" value={String(Math.round(128 * k))} accent={RED} style={{ flex: 1 }} />
        <Kpi label="Vouchers ativos" value={String(Math.round(342 * k))} accent={INK} style={{ flex: 1 }} />
        <Kpi label="Tráfego hoje" value={`${Math.round(684 * k)} GB`} accent={INK} style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, padding: "0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "170px 220px 1fr 150px", height: 50, alignItems: "center", borderBottom: `2px solid ${LINE}`, ...text(17, 800, MUTED, { letterSpacing: 1 }) }}>
          <span>VOUCHER</span>
          <span>HÓSPEDE</span>
          <span>CONSUMO</span>
          <span style={{ textAlign: "right" }}>STATUS</span>
        </div>
        {ROWS.map((r, i) => {
          const p = ramp(t, 0.8 + i * 0.12, 2.4 + i * 0.12);
          const blocked = i === 2 && t > BLOCK_AT;
          const status = blocked ? "Bloqueado" : r.status;
          const c = status === "Ativo" ? "#1E9B4B" : status === "Bloqueado" ? RED : MUTED;
          return (
            <div
              key={r.code}
              style={{
                display: "grid",
                gridTemplateColumns: "170px 220px 1fr 150px",
                height: 72,
                alignItems: "center",
                borderBottom: i < ROWS.length - 1 ? `1px solid ${LINE}` : "none",
                background: i === 2 && t > 3.6 ? "#FCEFEF" : "transparent",
              }}
            >
              <span style={text(21, 900, INK, { letterSpacing: 1 })}>{r.code}</span>
              <span style={text(20, 600, MUTED)}>{r.who}</span>
              <div style={{ paddingRight: 30 }}>
                <div style={{ height: 12, borderRadius: 99, background: "#EDF0F4" }}>
                  <div style={{ height: 12, width: `${r.use * p * 100}%`, borderRadius: 99, background: r.use > 0.85 ? "#E5484D" : RED, opacity: blocked ? 0.35 : 1 }} />
                </div>
                <div style={{ marginTop: 4, ...text(16, 600, MUTED) }}>{(r.use * p * 5).toFixed(1).replace(".", ",")} de 5 GB</div>
              </div>
              <span style={{ justifySelf: "end", padding: "6px 16px", borderRadius: 999, background: `${c}1A`, ...text(18, 800, c) }}>{status}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 590,
          padding: "16px 22px",
          borderRadius: 14,
          background: "#fff",
          border: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: ramp(t, 2.4, 2.8),
          ...text(20, 600, MUTED),
        }}
      >
        <Check size={30} color="#1E9B4B" />
        Registros de acesso guardados conforme a LGPD e o Marco Civil da Internet.
      </div>
      <Cursor keys={[{ t: 3.0, x: 700, y: 560 }, { t: 4.5, x: 980, y: 380 }]} clicks={[BLOCK_AT]} from={3.0} />
    </DashboardShell>
  );
};

/* 7 · celular do fechamento --------------------------------------------------- */

const OutroScreen: React.FC = () => (
  <VoucherPortal theme="hotel" code={CODE} t={0} hours={24} mbps={20} logins={[{ kind: "voucher", p: 1 }, { kind: "pix", p: 1 }]} />
);

export const myGuestExplainer: ExplainerConfig = {
  logo: "myguest",
  name: "MyGuest",
  accent: RED,
  place: "hotel",
  hook: [
    { at: 0.4, until: 3.6, text: "Seus hóspedes querem Wi-Fi assim que chegam." },
    { at: 3.9, until: 7.2, text: "Mas quem controla quem usa a sua rede?" },
  ],
  tagline: "Acesso à internet com vouchers, sob controle.",
  phone: {
    Screen: PhoneScreen,
    Side: PhoneSide,
    screenBg: "#F2F2F7",
    caption: [
      { at: 0.4, until: 4.0, text: "Com o MyGuest, o hóspede entra na rede com um voucher." },
      { at: 4.3, until: 7.9, text: "Ou paga o acesso na hora, com Pix ou cartão." },
    ],
  },
  panel: {
    Screen: PanelPhone,
    Panel,
    caption: [
      { at: 0.4, until: 4.3, text: "No Painel de Controle, você define validade e velocidade de cada plano." },
      { at: 4.5, until: 8.1, text: "Gera vouchers em lote e escolhe como liberar o acesso." },
    ],
  },
  laptop: {
    Screen: Dashboard,
    caption: [{ at: 0.4, until: 7.3, text: "E vê quem está online e quanto cada voucher já consumiu." }],
  },
  tiles: [
    { icon: "ticket", label: "Vouchers em lote" },
    { icon: "dollar", label: "Pagamento online" },
    { icon: "shield", label: "Conformidade LGPD" },
  ],
  bullets: [
    { icon: "lock", title: "Acesso sob controle", text: "validade, velocidade e franquia por voucher" },
    { icon: "wifi", title: "Sua marca no portal", text: "uma conexão com a cara do seu negócio" },
  ],
  OutroScreen,
};
