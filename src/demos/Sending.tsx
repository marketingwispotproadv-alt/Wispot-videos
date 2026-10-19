import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  AreaChart,
  BarRow,
  Browser,
  Button,
  Caret,
  Cursor,
  Field,
  INK,
  interpolateColor,
  Kpi,
  Label,
  LINE,
  MUTED,
  ramp,
  rise,
  text,
  Toast,
  typed,
  usePop,
  useT,
} from "./kit";
import type { DemoConfig } from "./DemoVideo";
import { PRODUCTS, Product } from "./ProductMark";

/**
 * Sending — segmentação da base que veio do Wi-Fi, mensagem personalizada,
 * agendamento do disparo e os relatórios. O painel segue as gravações do
 * Sending no Drive (menu Dashboard / Database / Campanhas, gráfico "Uso de
 * E-mail / SMS"), sem os dados da conta que aparece nelas.
 */

const P = PRODUCTS.sending;
/** o amarelo do Sending não tem contraste para texto sobre branco */
const DARK = "#A86F00";
const EMAIL = "#2F6FDE";

/* Passo 1 ------------------------------------------------------------ */

const CONTACTS = [
  { name: "Ana Souza", visits: 7, last: "ontem", keep: true },
  { name: "Bruno Lima", visits: 1, last: "há 2 meses", keep: false },
  { name: "Carla Mendes", visits: 4, last: "há 3 dias", keep: true },
  { name: "Diego Rocha", visits: 2, last: "há 45 dias", keep: false },
  { name: "Elisa Prado", visits: 9, last: "hoje", keep: true },
  { name: "Fábio Nunes", visits: 5, last: "há 1 semana", keep: true },
  { name: "Gabriela Reis", visits: 1, last: "há 5 meses", keep: false },
  { name: "Henrique Alves", visits: 3, last: "há 12 dias", keep: true },
];

const FILTERS = [
  { label: "Visitou 3+ vezes", at: 1.5 },
  { label: "Últimos 30 dias", at: 2.1 },
  { label: "Aceita SMS", at: 2.7 },
];
const STEPS = [12480, 5932, 4107, 3216];

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const Publico: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  // a contagem desce a cada filtro aplicado
  let total = STEPS[0];
  FILTERS.forEach((f, i) => {
    total += (STEPS[i + 1] - STEPS[i]) * ramp(t, f.at + 0.05, f.at + 0.6);
  });
  const prune = ramp(t, 2.8, 3.3);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1220}
        title="Sending · Database"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, top: 30, right: 36, display: "flex", alignItems: "flex-end" }}>
          <div>
            <Label>Contatos captados no Wi-Fi</Label>
            <div style={text(64, 900, INK, { letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" })}>
              {fmt(total)}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, paddingBottom: 12 }}>
            <Pill color={product.accent} dark>
              SMS
            </Pill>
            <Pill color={EMAIL}>E-mail</Pill>
          </div>
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 170, display: "flex", gap: 14 }}>
          {FILTERS.map((f) => {
            const on = ramp(t, f.at, f.at + 0.15);
            return (
              <div
                key={f.label}
                style={{
                  padding: "14px 24px",
                  borderRadius: 999,
                  border: `3px solid ${on > 0 ? product.accent : LINE}`,
                  background: interpolateColor(on, "#FFFFFF", product.accent),
                  ...text(23, 700, INK),
                }}
              >
                {on > 0.5 ? "✓ " : "+ "}
                {f.label}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 270 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 160px 220px",
              padding: "0 18px 14px",
              borderBottom: `2px solid ${LINE}`,
              ...text(20, 700, MUTED, { letterSpacing: 1 }),
            }}
          >
            <span>NOME</span>
            <span>VISITAS</span>
            <span style={{ textAlign: "right" }}>ÚLTIMA VISITA</span>
          </div>
          {CONTACTS.map((c, i) => {
            const k = c.keep ? 1 : 1 - prune;
            return (
              <div
                key={c.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px 220px",
                  alignItems: "center",
                  height: 92 * k,
                  overflow: "hidden",
                  opacity: k * ramp(t, 0.3 + i * 0.06, 0.6 + i * 0.06),
                  padding: "0 18px",
                  borderBottom: k > 0.05 ? `1px solid ${LINE}` : "none",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 16, ...text(25, 700) }}>
                  <Avatar name={c.name} />
                  {c.name}
                </span>
                <span style={text(25, 800, c.visits >= 3 ? DARK : MUTED)}>{c.visits}×</span>
                <span style={{ textAlign: "right", ...text(23, 600, MUTED) }}>{c.last}</span>
              </div>
            );
          })}
        </div>
        <Button
          color={product.accent}
          textColor={product.onAccent}
          t={t}
          pressAt={4.3}
          style={{ position: "absolute", right: 36, bottom: 36, width: 340 }}
        >
          Salvar segmento
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 760, y: 900 },
            { t: 1.45, x: 150, y: 206 },
            { t: 2.05, x: 410, y: 206 },
            { t: 2.65, x: 640, y: 206 },
            { t: 4.25, x: 760, y: 1092 },
          ]}
          clicks={[1.5, 2.1, 2.7, 4.3]}
          from={0.6}
        />
      </Browser>
      <Toast at={4.5} color={product.accent} style={{ left: 170, top: 1790 }}>
        Clientes fiéis · 3.216 contatos
      </Toast>
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ children: React.ReactNode; color: string; dark?: boolean }> = ({ children, color, dark }) => (
  <span
    style={{
      padding: "8px 18px",
      borderRadius: 999,
      background: color,
      ...text(20, 800, dark ? P.onAccent : "#fff"),
    }}
  >
    {children}
  </span>
);

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 50 }) => {
  const hue = (name.charCodeAt(0) * 47 + name.charCodeAt(1) * 13) % 360;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: `hsl(${hue} 60% 92%)`,
        color: `hsl(${hue} 50% 35%)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...text(size * 0.42, 800, `hsl(${hue} 50% 35%)`),
      }}
    >
      {name[0]}
    </span>
  );
};

/* Passo 2 ------------------------------------------------------------ */

const MESSAGE = "Olá, {nome}! Nossa campanha é válida até amanhã: mostre este SMS no caixa e ganhe 15% OFF.";
const MSG_START = 1.3;
const MSG_CPS = 34;

/** Texto digitado com a variável {nome} virando etiqueta. */
const withToken = (s: string, accent: string, as?: string) =>
  s.split("{nome}").flatMap((part, i, all) => {
    const out: React.ReactNode[] = [part];
    if (i < all.length - 1)
      out.push(
        as ? (
          <b key={i}>{as}</b>
        ) : (
          <span
            key={i}
            style={{
              padding: "2px 12px",
              borderRadius: 10,
              background: `${accent}33`,
              color: DARK,
              fontWeight: 800,
            }}
          >
            nome
          </span>
        ),
      );
    return out;
  });

const Mensagem: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const card = usePop(1.0);
  const sms = ramp(t, 0.8, 0.95);
  // só mostra a variável quando ela estiver digitada por inteiro
  const raw = typed(MESSAGE, t, MSG_START, MSG_CPS);
  const msg = raw.replace(/\{[a-z]*$/, "");
  const len = raw.replace("{nome}", "Ana").length;

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={700}
        title="Sending · Nova campanha"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, top: 30, display: "flex", gap: 14 }}>
          {["SMS", "E-mail"].map((c, i) => {
            const on = i === 0 ? sms : 0;
            return (
              <div
                key={c}
                style={{
                  width: 170,
                  height: 62,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `3px solid ${on ? product.accent : LINE}`,
                  background: interpolateColor(on, "#FFFFFF", product.accent),
                  ...text(25, 800, INK),
                }}
              >
                {c}
              </div>
            );
          })}
          <div
            style={{
              marginLeft: 210,
              alignSelf: "center",
              padding: "10px 20px",
              borderRadius: 12,
              border: `2px dashed ${product.accent}`,
              ...text(22, 700, DARK),
              opacity: ramp(t, 1.0, 1.3),
            }}
          >
            + variável: nome
          </div>
        </div>
        <Label style={{ position: "absolute", left: 36, top: 126 }}>Mensagem</Label>
        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 164,
            height: 300,
            borderRadius: 18,
            border: `2px solid ${t > 1.1 ? product.accent : LINE}`,
            boxShadow: t > 1.1 ? `0 0 0 5px ${product.accent}22` : "none",
            padding: "22px 26px",
            ...text(30, 600, INK, { lineHeight: 1.5 }),
          }}
        >
          {withToken(msg, product.accent)}
          <Caret t={t} from={1.1} to={5.0} />
        </div>
        <div style={{ position: "absolute", right: 36, top: 478, ...text(22, 700, len > 150 ? "#E5484D" : MUTED) }}>
          {len}/160
        </div>
        <Button
          color={product.accent}
          textColor={product.onAccent}
          t={t}
          pressAt={5.0}
          style={{ position: "absolute", right: 36, bottom: 36, width: 260 }}
        >
          Continuar
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 700, y: 560 },
            { t: 0.75, x: 110, y: 62 },
            { t: 1.05, x: 400, y: 300 },
            { t: 4.95, x: 800, y: 569 },
          ]}
          clicks={[0.8, 1.1, 5.0]}
          from={0.3}
        />
      </Browser>

      {/* pré-visualização no celular de um cliente */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1310,
          width: 840,
          borderRadius: 40,
          background: "#fff",
          padding: "28px 34px 36px",
          boxShadow: "0 30px 60px rgba(16,30,54,0.18)",
          ...rise(card, 50),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 22, borderBottom: `1px solid ${LINE}` }}>
          <Avatar name="Ana Souza" size={64} />
          <div>
            <div style={text(28, 800)}>Ana Souza</div>
            <div style={text(21, 600, MUTED)}>Pré-visualização · SMS</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 640,
            minHeight: 60,
            borderRadius: "30px 30px 30px 8px",
            background: "#E9E9EB",
            padding: "20px 26px",
            ...text(28, 500, INK, { lineHeight: 1.4 }),
            opacity: msg.length ? 1 : 0.4,
          }}
        >
          {msg.length ? withToken(msg, product.accent, "Ana") : "…"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Passo 3 ------------------------------------------------------------ */

const RECIPIENTS = [
  { name: "Ana", at: 3.1 },
  { name: "Carla", at: 3.45 },
  { name: "Elisa", at: 3.8 },
];

const Disparo: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const date = ramp(t, 1.0, 1.2);
  const hour = ramp(t, 1.6, 1.8);
  const sending = ramp(t, 2.6, 4.4);
  const started = t > 2.45;

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={690}
        title="Sending · Agendamento"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, right: 36, top: 30, display: "flex", gap: 20 }}>
          {[
            { k: "Público", v: "Clientes fiéis · 3.216" },
            { k: "Canal", v: "SMS" },
          ].map((r) => (
            <div key={r.k} style={{ flex: r.k === "Canal" ? 0.5 : 1, padding: "18px 22px", borderRadius: 18, background: "#F6F8FB" }}>
              <div style={text(20, 600, MUTED)}>{r.k}</div>
              <div style={{ marginTop: 4, ...text(28, 800) }}>{r.v}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 190, display: "flex", gap: 20 }}>
          <Field label="Data" accent={product.accent} style={{ flex: 1 }} focused={t > 0.9 && t < 1.5} placeholder="Escolha a data">
            {date > 0 ? <span style={{ opacity: date }}>Sexta, 21/11</span> : ""}
          </Field>
          <Field label="Horário" accent={product.accent} style={{ flex: 1 }} focused={t > 1.5 && t < 2.1} placeholder="--:--">
            {hour > 0 ? <span style={{ opacity: hour }}>18:00</span> : ""}
          </Field>
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 340, opacity: ramp(t, 2.45, 2.7) }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...text(25, 800) }}>
            <span>{sending < 1 ? "Enviando…" : "Campanha enviada"}</span>
            <span style={{ color: DARK, fontVariantNumeric: "tabular-nums" }}>
              {fmt(3216 * sending)} / 3.216
            </span>
          </div>
          <div style={{ marginTop: 14, height: 22, borderRadius: 99, background: "#EDF0F4", overflow: "hidden" }}>
            <div style={{ width: `${sending * 100}%`, height: 22, borderRadius: 99, background: product.accent }} />
          </div>
        </div>
        <Button
          color={product.accent}
          textColor={product.onAccent}
          t={t}
          pressAt={2.3}
          style={{
            position: "absolute",
            right: 36,
            bottom: 36,
            width: 330,
            opacity: started ? interpolate(t, [2.45, 2.7], [1, 0.5], { extrapolateRight: "clamp" }) : 1,
          }}
        >
          Agendar envio
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 700, y: 560 },
            { t: 0.95, x: 240, y: 280 },
            { t: 1.55, x: 700, y: 280 },
            { t: 2.25, x: 780, y: 559 },
          ]}
          clicks={[1.0, 1.6, 2.3]}
          from={0.3}
          until={3.0}
        />
      </Browser>
      {RECIPIENTS.map((r, i) => (
        <SmsBanner key={r.name} at={r.at} name={r.name} top={1300 + i * 170} accent={product.accent} />
      ))}
    </AbsoluteFill>
  );
};

const SmsBanner: React.FC<{ at: number; name: string; top: number; accent: string }> = ({ at, name, top, accent }) => {
  const p = usePop(at, true);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top,
        height: 140,
        borderRadius: 34,
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 20px 44px rgba(16,30,54,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 26px",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "#34C759",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...text(20, 900, "#fff"),
        }}
      >
        SMS
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 12, ...text(20, 700, MUTED) }}>
          <span>MENSAGENS</span>
          <span>· agora</span>
        </div>
        <div style={{ marginTop: 4, ...text(26, 600, INK, { whiteSpace: "nowrap" }) }}>
          <b>Olá, {name}!</b> Nossa campanha é válida até amanhã…
        </div>
      </div>
      <span style={{ marginLeft: "auto", width: 14, height: 14, borderRadius: 99, background: accent, flexShrink: 0 }} />
    </div>
  );
};

/* Passo 4 ------------------------------------------------------------ */

const Resultados: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const k = ramp(t, 0.6, 2.2);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="Sending · Dashboard"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 30, right: 30, top: 30, display: "flex", gap: 20 }}>
          <Kpi label="Enviados" value={fmt(3216 * k)} accent={INK} style={{ flex: 1 }} />
          <Kpi label="Entregues" value={`${(98.7 * k).toFixed(1).replace(".", ",")}%`} accent={DARK} style={{ flex: 1 }} />
          <Kpi label="Cliques" value={`${(24.1 * k).toFixed(1).replace(".", ",")}%`} accent={INK} style={{ flex: 1 }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 230,
            height: 470,
            borderRadius: 20,
            border: `1px solid ${LINE}`,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", ...text(26, 800) }}>
            Uso de E-mail / SMS
            <span style={{ marginLeft: "auto", display: "flex", gap: 22, ...text(21, 700, MUTED) }}>
              <Legend color={product.accent}>SMS</Legend>
              <Legend color={EMAIL}>E-mail</Legend>
            </span>
          </div>
          <div style={{ position: "relative", marginTop: 16, height: 360 }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <AreaChart
                values={[0.1, 0.22, 0.18, 0.4, 0.3, 0.52, 0.45, 0.9, 0.6, 0.48]}
                labels={["01/11", "05/11", "10/11", "15/11", "21/11"]}
                width={866}
                height={360}
                color={product.accent}
                p={ramp(t, 0.8, 3.0)}
              />
            </div>
            <div style={{ position: "absolute", inset: 0 }}>
              <AreaChart
                values={[0.06, 0.1, 0.14, 0.12, 0.2, 0.18, 0.26, 0.34, 0.28, 0.3]}
                width={866}
                height={330}
                color={EMAIL}
                p={ramp(t, 1.0, 3.2)}
              />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 740 }}>
          <div style={{ ...text(26, 800), marginBottom: 22 }}>Funil da campanha · Clientes fiéis</div>
          {[
            { l: "Entregues", v: 99 },
            { l: "Abertos", v: 41 },
            { l: "Cliques", v: 24 },
          ].map((r, i) => (
            <BarRow
              key={r.l}
              label={r.l}
              pct={r.v}
              p={ramp(t, 2.2 + i * 0.35, 3.2 + i * 0.35)}
              color={i === 0 ? product.accent : i === 1 ? "#E0A000" : DARK}
              style={{ marginBottom: 26 }}
            />
          ))}
        </div>
      </Browser>
    </AbsoluteFill>
  );
};

const Legend: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 16, height: 16, borderRadius: 99, background: color }} />
    {children}
  </span>
);

export const sendingConfig: DemoConfig = {
  product: P,
  tagline: (
    <>
      Campanhas de SMS e e-mail
      <br />
      no momento certo.
    </>
  ),
  steps: [
    { title: "Escolha o público", subtitle: "A base que veio do Wi-Fi, segmentada em segundos.", seconds: 6.0, Scene: Publico },
    { title: "Escreva a mensagem", subtitle: "SMS ou e-mail, com o nome de cada cliente.", seconds: 6.2, Scene: Mensagem },
    { title: "Agende e dispare", subtitle: "Escolha a hora — o Sending faz o resto.", seconds: 5.8, Scene: Disparo },
    { title: "Meça os resultados", subtitle: "Entregas, aberturas e cliques de cada campanha.", seconds: 5.6, Scene: Resultados },
  ],
  benefits: [
    { title: "Automação inteligente", text: "Menos trabalho manual a cada campanha." },
    { title: "Maior engajamento", text: "Mensagem personalizada, na hora certa." },
    { title: "Insights estratégicos", text: "Relatórios e métricas de cada envio." },
    { title: "Expansão de alcance", text: "SMS e e-mail integrados num só lugar." },
  ],
  endLine: (
    <>
      A mensagem certa,
      <br />
      para o público certo.
    </>
  ),
};
