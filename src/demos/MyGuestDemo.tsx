import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  Browser,
  Button,
  Caret,
  Check,
  Cursor,
  Field,
  INK,
  Kpi,
  LINE,
  MUTED,
  Phone,
  ramp,
  rise,
  SCREEN,
  Tap,
  text,
  Toast,
  Toggle,
  typed,
  usePop,
  useT,
  WifiGlyph,
} from "./kit";
import type { DemoConfig } from "./DemoVideo";
import { PRODUCTS, Product } from "./ProductMark";

/**
 * MyGuest — plano de acesso, geração de vouchers, o visitante entrando com o
 * voucher no portal e o controle de quem está online.
 * O portal segue a arte "05-myguest" do Drive e o fluxo da gravação
 * "formas de login" (lista de redes → portal → conectado).
 */

const P = PRODUCTS.myguest;

/* Passo 1 ------------------------------------------------------------ */

type Slider = {
  label: string;
  unit: string;
  f0: number;
  f1: number;
  v0: number;
  v1: number;
  at: number;
};

const SLIDERS: Slider[] = [
  { label: "Validade", unit: "h", f0: 0.08, f1: 0.5, v0: 2, v1: 24, at: 2.0 },
  { label: "Dispositivos", unit: "", f0: 0.15, f1: 0.4, v0: 1, v1: 2, at: 2.75 },
  { label: "Velocidade", unit: " Mbps", f0: 0.1, f1: 0.4, v0: 5, v1: 20, at: 3.5 },
  { label: "Franquia", unit: " GB", f0: 0.1, f1: 0.5, v0: 1, v1: 5, at: 4.25 },
];
const TRACK_X = 36;
const TRACK_W = 840;
const ROW0 = 170;
const ROW_H = 132;
const DRAG = 0.55;

const sliderValue = (s: Slider, t: number) => {
  const p = ramp(t, s.at, s.at + DRAG);
  return { f: s.f0 + (s.f1 - s.f0) * p, v: Math.round(s.v0 + (s.v1 - s.v0) * p) };
};

const PLAN = "Hóspede 24h";

const CriarPlano: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const ticket = usePop(0.6);
  const name = typed(PLAN, t, 0.9, 14);
  const vals = SLIDERS.map((s) => sliderValue(s, t));

  // o ponteiro pega cada botão do slider e arrasta junto com ele
  const keys = [{ t: 0, x: 760, y: 900 }, { t: 0.8, x: 300, y: 110 }];
  SLIDERS.forEach((s, i) => {
    const y = ROW0 + i * ROW_H + 62;
    keys.push({ t: s.at, x: TRACK_X + s.f0 * TRACK_W, y });
    keys.push({ t: s.at + DRAG, x: TRACK_X + s.f1 * TRACK_W, y });
  });
  keys.push({ t: 5.15, x: 780, y: 740 });

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={840}
        title="MyGuest · Planos de acesso"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <Field
          label="Nome do plano"
          accent={product.accent}
          focused={t > 0.8 && t < 1.9}
          style={{ position: "absolute", left: 36, top: 30, width: 560 }}
        >
          {name}
          <Caret t={t} from={0.8} to={1.9} />
        </Field>
        {SLIDERS.map((s, i) => {
          const { f, v } = vals[i];
          const active = t > s.at - 0.2 && t < s.at + DRAG + 0.2;
          return (
            <div key={s.label} style={{ position: "absolute", left: TRACK_X, top: ROW0 + i * ROW_H, width: TRACK_W }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...text(25, 700) }}>
                <span>{s.label}</span>
                <span style={{ color: product.accent, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                  {v}
                  {s.unit}
                </span>
              </div>
              <div style={{ position: "relative", marginTop: 30, height: 12, borderRadius: 99, background: "#EDF0F4" }}>
                <div style={{ width: `${f * 100}%`, height: 12, borderRadius: 99, background: product.accent }} />
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: f * TRACK_W - 22,
                    width: 44,
                    height: 44,
                    borderRadius: 99,
                    background: "#fff",
                    border: `4px solid ${product.accent}`,
                    boxShadow: active ? `0 0 0 10px ${product.accent}22` : "0 3px 8px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>
          );
        })}
        <Button
          color={product.accent}
          t={t}
          pressAt={5.2}
          style={{ position: "absolute", right: 36, top: 706, width: 320 }}
        >
          Salvar plano
        </Button>
        <Cursor keys={keys} clicks={[0.85, 5.2]} from={0.3} />
      </Browser>

      {/* o plano como o visitante vai ver, atualizando junto com o formulário */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 1440,
          width: 760,
          borderRadius: 32,
          background: "#fff",
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(16,30,54,0.18)",
          ...rise(ticket, 50),
        }}
      >
        <div style={{ background: product.accent, padding: "20px 34px", ...text(34, 900, "#fff") }}>
          {name || "Novo plano"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", padding: "26px 34px" }}>
          {[
            `Válido por ${vals[0].v}h`,
            `${vals[1].v} dispositivo${vals[1].v > 1 ? "s" : ""}`,
            `${vals[2].v} Mbps`,
            `Franquia ${vals[3].v} GB`,
          ].map((l) => (
            <div key={l.slice(0, 4)} style={{ display: "flex", alignItems: "center", gap: 12, ...text(27, 700) }}>
              <Check size={32} color={product.accent} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <Toast at={5.4} color={product.accent} style={{ left: 340, top: 1690 }}>
        Plano salvo
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 2 ------------------------------------------------------------ */

const CODES = [
  "4821", "7350", "1964", "5502", "3187", "9046", "2618",
  "8473", "6091", "4735", "1289", "7764", "3052", "9910",
  "5638", "2241", "8807", "6375", "1426", "7083", "4590",
];

const GerarVouchers: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const qty = typed("50", t, 1.0, 8);
  const online = ramp(t, 4.75, 4.95);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="MyGuest · Vouchers"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, right: 36, top: 30, display: "flex", gap: 22, alignItems: "flex-end" }}>
          <Field label="Plano" accent={product.accent} style={{ flex: 1.3 }}>
            {PLAN} <span style={{ marginLeft: "auto", color: MUTED }}>▾</span>
          </Field>
          <Field label="Quantidade" accent={product.accent} style={{ flex: 0.8 }} focused={t > 0.9 && t < 1.6}>
            {qty}
            <Caret t={t} from={0.9} to={1.6} />
          </Field>
          <Button color={product.accent} t={t} pressAt={1.9} style={{ width: 230 }}>
            Gerar
          </Button>
        </div>

        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 150,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          {CODES.map((c, i) => {
            const p = ramp(t, 2.05 + i * 0.06, 2.35 + i * 0.06);
            return (
              <div
                key={c}
                style={{
                  height: 104,
                  borderRadius: 18,
                  border: `3px dashed ${p > 0 ? product.accent : LINE}`,
                  background: p > 0 ? `${product.accent}0D` : "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: 22,
                  opacity: interpolate(p, [0, 1], [0.25, 1]),
                  transform: `scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                }}
              >
                <div style={text(30, 900, p > 0 ? product.accent : "#C3CAD3", { letterSpacing: 1.5 })}>
                  {p > 0 ? `WSP-${c}` : "WSP-····"}
                </div>
                <div style={{ marginTop: 2, ...text(19, 600, MUTED) }}>24h · 2 disp. · 20 Mbps</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 36, top: 1012, ...text(23, 600, MUTED) }}>
          + 29 vouchers
        </div>

        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 1060,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Toggle on={online} accent={product.accent} />
          <span style={text(24, 700)}>Venda online (Pix e cartão)</span>
          <Button color={product.accent} t={t} pressAt={4.2} outline style={{ marginLeft: "auto", width: 200 }}>
            Imprimir
          </Button>
        </div>
        <Cursor
          keys={[
            { t: 0, x: 800, y: 600 },
            { t: 0.85, x: 600, y: 92 },
            { t: 1.85, x: 830, y: 92 },
            { t: 4.15, x: 830, y: 1092 },
            { t: 4.7, x: 70, y: 1092 },
          ]}
          clicks={[0.9, 1.9, 4.2, 4.75]}
          from={0.3}
        />
      </Browser>
      <Toast at={3.0} until={5.4} color={product.accent} style={{ left: 290, top: 1780 - 40 }}>
        50 vouchers gerados
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 3 ------------------------------------------------------------ */

const NETWORKS = ["Rede_Corporativa", "WISPOT_GUEST", "Visitantes_2G"];
const CODE = "WSP-4821";

const Conectar: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const phoneIn = usePop(0.1);
  const portal = ramp(t, 1.55, 1.95);
  const code = typed(CODE, t, 2.3, 10);
  const connecting = t > 4.05 && t < 4.75;
  const done = ramp(t, 4.75, 5.05);
  const check = ramp(t, 4.9, 5.4);

  return (
    <AbsoluteFill>
      <Phone left={260} top={560} screen="#F2F2F7" style={rise(phoneIn, 80)}>
        {/* ajustes de Wi-Fi do celular */}
        <div style={{ position: "absolute", inset: 0, padding: "120px 30px 0" }}>
          <div style={text(52, 800, INK, { letterSpacing: -1 })}>Wi-Fi</div>
          <div style={{ marginTop: 30, borderRadius: 24, background: "#fff", overflow: "hidden" }}>
            {NETWORKS.map((n, i) => {
              const sel = i === 1 && t > 1.2;
              return (
                <div
                  key={n}
                  style={{
                    height: 92,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 26px",
                    borderTop: i ? `1px solid ${LINE}` : "none",
                    background: sel ? "#EAF2FF" : "#fff",
                    ...text(28, 600),
                  }}
                >
                  {n}
                  <span style={{ marginLeft: "auto" }}>
                    <WifiGlyph size={30} color="#3A3A3C" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* portal de voucher */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            transform: `translateY(${(1 - portal) * SCREEN.h}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 110,
          }}
        >
          <div
            style={{
              padding: "10px 28px",
              border: `3px dashed ${LINE}`,
              borderRadius: 14,
              ...text(22, 800, "#A9B1BB", { letterSpacing: 2 }),
            }}
          >
            SUA MARCA
          </div>
          <div
            style={{
              marginTop: 34,
              padding: "14px 34px",
              borderRadius: 16,
              background: product.accent,
              transform: "rotate(-3deg)",
              ...text(34, 900, "#fff"),
            }}
          >
            Voucher de acesso
          </div>
          <div
            style={{
              marginTop: 40,
              width: 420,
              height: 96,
              borderRadius: 20,
              border: `4px dashed ${product.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...text(44, 900, product.accent, { letterSpacing: 3 }),
            }}
          >
            {code || <span style={{ color: "#D5BCC2", fontSize: 30, letterSpacing: 0 }}>Digite o código</span>}
            <Caret t={t} from={2.1} to={3.3} />
          </div>
          <div style={{ marginTop: 34, width: 400, opacity: ramp(t, 3.2, 3.5) }}>
            {["Válido por 24h", "2 dispositivos", "20 Mbps", "Franquia 5 GB"].map((l) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 14, height: 54, ...text(27, 600) }}>
                <Check size={30} color={product.accent} />
                {l}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 36,
              width: 420,
              height: 88,
              borderRadius: 999,
              border: `4px solid ${product.accent}`,
              background: connecting ? product.accent : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...text(30, 800, connecting ? "#fff" : product.accent),
            }}
          >
            {connecting ? "Conectando…" : "Conectar"}
          </div>
        </div>
        {/* acesso liberado */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: product.accent,
            opacity: done,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => {
            const r = ((t - 4.8) * 0.7 + i / 3) % 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 330,
                  width: 240,
                  height: 240,
                  borderRadius: 999,
                  border: "3px solid rgba(255,255,255,0.5)",
                  opacity: t > 4.8 ? 1 - r : 0,
                  transform: `scale(${1 + r * 1.2})`,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", top: 330, transform: `scale(${0.6 + check * 0.4})` }}>
            <Check size={240} color={product.accent} bg="#fff" p={check} />
          </div>
          <div style={{ marginTop: 380, ...text(52, 900, "#fff") }}>Acesso liberado</div>
          <div style={{ marginTop: 14, ...text(28, 600, "rgba(255,255,255,0.85)") }}>
            WISPOT_GUEST · 24h · 20 Mbps
          </div>
        </div>
        <Tap x={264} y={350} at={1.2} />
        <Tap x={264} y={353} at={2.1} />
        <Tap x={264} y={778} at={3.95} />
      </Phone>
    </AbsoluteFill>
  );
};

/* Passo 4 ------------------------------------------------------------ */

const ROWS = [
  { code: "4821", plan: "Hóspede 24h", use: 0.42, status: "Ativo" },
  { code: "7350", plan: "Hóspede 24h", use: 0.78, status: "Ativo" },
  { code: "1964", plan: "Evento 4h", use: 0.25, status: "Ativo" },
  { code: "5502", plan: "Hóspede 24h", use: 0.91, status: "Ativo" },
  { code: "3187", plan: "Evento 4h", use: 1, status: "Expirado" },
  { code: "9046", plan: "Hóspede 24h", use: 0.6, status: "Ativo" },
];

const Painel: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const blocked = ramp(t, 3.9, 4.1);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1210}
        title="MyGuest · Painel"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 30, right: 30, top: 30, display: "flex", gap: 20 }}>
          <Kpi
            label="Online agora"
            value={String(Math.round(128 * ramp(t, 0.6, 2.0)))}
            accent={product.accent}
            style={{ flex: 1 }}
          />
          <Kpi label="Vouchers ativos" value={String(Math.round(342 * ramp(t, 0.6, 2.0)))} accent={INK} style={{ flex: 1 }} />
          <Kpi label="Tráfego hoje" value={`${Math.round(684 * ramp(t, 0.6, 2.0))} GB`} accent={INK} style={{ flex: 1 }} />
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 230 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "190px 210px 1fr 170px",
              padding: "0 18px 14px",
              borderBottom: `2px solid ${LINE}`,
              ...text(20, 700, MUTED, { letterSpacing: 1 }),
            }}
          >
            <span>VOUCHER</span>
            <span>PLANO</span>
            <span>CONSUMO</span>
            <span style={{ textAlign: "right" }}>STATUS</span>
          </div>
          {ROWS.map((r, i) => {
            const p = ramp(t, 0.8 + i * 0.12, 2.4 + i * 0.12);
            const isBlocked = i === 3 && blocked > 0.5;
            const status = isBlocked ? "Bloqueado" : r.status;
            const color = status === "Ativo" ? "#1E9B4B" : status === "Bloqueado" ? product.accent : MUTED;
            return (
              <div
                key={r.code}
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 210px 1fr 170px",
                  alignItems: "center",
                  height: 104,
                  padding: "0 18px",
                  borderBottom: `1px solid ${LINE}`,
                  background: i === 3 && t > 3.3 ? `${product.accent}0C` : "transparent",
                  opacity: ramp(t, 0.4 + i * 0.1, 0.8 + i * 0.1),
                }}
              >
                <span style={text(25, 900, INK, { letterSpacing: 1 })}>WSP-{r.code}</span>
                <span style={text(23, 600, MUTED)}>{r.plan}</span>
                <div style={{ paddingRight: 30 }}>
                  <div style={{ height: 14, borderRadius: 99, background: "#EDF0F4" }}>
                    <div
                      style={{
                        height: 14,
                        width: `${r.use * p * 100}%`,
                        borderRadius: 99,
                        background: r.use > 0.85 ? "#E5484D" : product.accent,
                        opacity: isBlocked ? 0.4 : 1,
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 6, ...text(19, 600, MUTED) }}>
                    {(r.use * p * 5).toFixed(1).replace(".", ",")} de 5 GB
                  </div>
                </div>
                <span
                  style={{
                    justifySelf: "end",
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: `${color}1A`,
                    ...text(21, 800, color),
                  }}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            bottom: 30,
            padding: "22px 26px",
            borderRadius: 20,
            background: "#F4F7FA",
            display: "flex",
            alignItems: "center",
            gap: 16,
            ...text(23, 600, MUTED),
            opacity: ramp(t, 2.4, 2.8),
          }}
        >
          <Check size={34} color="#1E9B4B" />
          Registros de acesso guardados conforme a LGPD e o Marco Civil.
        </div>
        <Cursor
          keys={[
            { t: 0, x: 800, y: 1000 },
            { t: 3.3, x: 846, y: 642 },
            { t: 3.85, x: 846, y: 642 },
          ]}
          clicks={[3.9]}
          from={2.6}
        />
      </Browser>
      <Toast at={4.3} color={product.accent} style={{ left: 280, top: 1772 }}>
        Voucher bloqueado
      </Toast>
    </AbsoluteFill>
  );
};

export const myGuestConfig: DemoConfig = {
  product: P,
  tagline: (
    <>
      Internet para visitantes,
      <br />
      com acesso sob controle.
    </>
  ),
  steps: [
    { title: "Crie o plano de acesso", subtitle: "Validade, dispositivos, velocidade e franquia.", seconds: 6.4, Scene: CriarPlano },
    { title: "Gere os vouchers", subtitle: "Em lote, prontos para imprimir ou vender online.", seconds: 6.0, Scene: GerarVouchers },
    { title: "O visitante se conecta", subtitle: "Escolhe a rede, digita o voucher e pronto.", seconds: 6.4, Scene: Conectar },
    { title: "Controle pelo painel", subtitle: "Quem está online, consumo e status de cada voucher.", seconds: 5.8, Scene: Painel },
  ],
  benefits: [
    { title: "Acesso sob controle", text: "Validade, velocidade e franquia por voucher." },
    { title: "Experiência do cliente", text: "Conexão simples, com a sua marca." },
    { title: "Eficiência", text: "Vouchers em lote, sem trabalho manual." },
    { title: "Insights valiosos", text: "Dados de uso para decidir melhor." },
  ],
  endLine: (
    <>
      Controle de acesso que
      <br />
      vira dado estratégico.
    </>
  ),
};
