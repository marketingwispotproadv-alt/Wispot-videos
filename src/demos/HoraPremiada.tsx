import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  AreaChart,
  Browser,
  Button,
  Caret,
  Check,
  Cursor,
  Field,
  INK,
  interpolateColor,
  Kpi,
  Label,
  LINE,
  MUTED,
  Phone,
  PhoneNotification,
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
} from "./kit";
import type { DemoConfig } from "./DemoVideo";
import { PRODUCTS, Product } from "./ProductMark";

/**
 * Hora Premiada — criação de campanha e de cupom no painel, o cupom chegando
 * ao cliente por SMS/e-mail e o acompanhamento dos resgates.
 * Os passos seguem as gravações "criar campanha" e "editar cupom" do Drive,
 * com marca genérica no lugar dos clientes que aparecem nelas.
 */

const P = PRODUCTS.horaPremiada;
const WINE = "#8E1B3A";

/* Passo 1 ------------------------------------------------------------ */

const NAME = "Black Friday";
const SWATCHES = ["#B9C0C8", WINE, P.accent, "#16181C", "#2F6FDE"];

const CriarCampanha: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const nameStart = 0.95;
  const name = typed(NAME, t, nameStart, 14);
  const dates = ramp(t, 2.0, 2.3);
  const color = ramp(t, 2.6, 2.9);
  const email = ramp(t, 3.3, 3.5);
  const phone = ramp(t, 3.8, 4.0);
  const header = interpolateColor(color, "#B9C0C8", product.accent);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1240}
        title="Hora Premiada · Criar campanha"
        accent={product.accent}
        style={rise(win, 60)}
      >
        {/* formulário */}
        <div style={{ position: "absolute", left: 36, top: 34, width: 448 }}>
          <Field label="Nome da campanha" accent={product.accent} focused={t > 0.8 && t < 2.2}>
            {name}
            <Caret t={t} from={0.8} to={2.2} />
          </Field>
          <div style={{ display: "flex", gap: 20, marginTop: 26, opacity: interpolate(dates, [0, 1], [0.35, 1]) }}>
            <Field label="Início" accent={product.accent} style={{ flex: 1 }} placeholder="dd/mm">
              {dates > 0 ? "20/11" : ""}
            </Field>
            <Field label="Fim" accent={product.accent} style={{ flex: 1 }} placeholder="dd/mm">
              {dates > 0 ? "30/11" : ""}
            </Field>
          </div>

          <Label style={{ marginTop: 34 }}>Cor do portal</Label>
          <div style={{ display: "flex", gap: 22 }}>
            {SWATCHES.map((c, i) => (
              <div
                key={c}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 99,
                  background: c,
                  boxShadow:
                    i === 2 && color > 0
                      ? `0 0 0 5px #fff, 0 0 0 ${5 + 4 * color}px ${c}`
                      : "0 0 0 1px rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>

          <Label style={{ marginTop: 40 }}>Campos do cadastro</Label>
          {[
            { k: "Nome", on: 1 },
            { k: "E-mail", on: email },
            { k: "Telefone", on: phone },
            { k: "CPF", on: 0 },
          ].map((r) => (
            <div
              key={r.k}
              style={{
                height: 76,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${LINE}`,
                ...text(26, 600),
              }}
            >
              {r.k}
              <Toggle on={r.on} accent={product.accent} />
            </div>
          ))}

          <div
            style={{
              marginTop: 40,
              padding: "22px 24px",
              borderRadius: 20,
              background: "#F4F7FA",
              ...text(22, 600, MUTED, { lineHeight: 1.4 }),
            }}
          >
            <span style={{ color: INK, fontWeight: 800 }}>Integração com Sending</span>
            <br />
            dispara o cupom por e-mail e SMS.
          </div>
        </div>

        <Button
          color={product.accent}
          t={t}
          pressAt={4.9}
          style={{ position: "absolute", left: 36, top: 1060, width: 448 }}
        >
          Salvar campanha
        </Button>

        {/* pré-visualização do portal */}
        <div style={{ position: "absolute", left: 540, top: 34, width: 404 }}>
          <Label>Pré-visualização</Label>
          <div
            style={{
              height: 1010,
              borderRadius: 40,
              border: "10px solid #16181C",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <div
              style={{
                height: 360,
                background: header,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 50,
              }}
            >
              <div
                style={{
                  padding: "10px 26px",
                  border: "3px dashed rgba(255,255,255,0.8)",
                  borderRadius: 14,
                  ...text(20, 800, "#fff", { letterSpacing: 2 }),
                }}
              >
                SUA MARCA
              </div>
              <div style={{ marginTop: 40, ...text(24, 700, "rgba(255,255,255,0.9)") }}>PARTICIPE DA</div>
              <div style={{ marginTop: 6, height: 60, ...text(46, 900, "#fff", { letterSpacing: -1 }) }}>
                {name.toUpperCase()}
              </div>
              <div style={{ marginTop: 10, ...text(20, 600, "rgba(255,255,255,0.85)") }}>
                e ganhe um cupom exclusivo
              </div>
            </div>
            <div style={{ padding: "34px 30px" }}>
              {[
                { k: "Nome", p: 1 },
                { k: "E-mail", p: email },
                { k: "Telefone", p: phone },
              ].map((f) =>
                f.p > 0 ? (
                  <div
                    key={f.k}
                    style={{
                      height: 64,
                      marginBottom: 18 * f.p,
                      borderRadius: 14,
                      border: `2px solid ${LINE}`,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 18px",
                      ...text(22, 500, "#A9B1BB"),
                      opacity: f.p,
                      transform: `scaleY(${f.p})`,
                      maxHeight: 64 * f.p,
                    }}
                  >
                    {f.k}
                  </div>
                ) : null,
              )}
              <div
                style={{
                  marginTop: 14,
                  height: 66,
                  borderRadius: 16,
                  background: header,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...text(24, 800, "#fff"),
                }}
              >
                Resgatar cupom
              </div>
            </div>
          </div>
        </div>

        <Cursor
          keys={[
            { t: 0, x: 760, y: 1150 },
            { t: 0.75, x: 300, y: 120 },
            { t: 2.5, x: 284, y: 330 },
            { t: 3.25, x: 452, y: 548 },
            { t: 3.75, x: 452, y: 624 },
            { t: 4.8, x: 300, y: 1090 },
          ]}
          clicks={[0.8, 2.6, 3.3, 3.8, 4.9]}
          from={0.3}
        />
      </Browser>
      <Toast at={5.1} color={product.accent} style={{ left: 300, top: 1800 }}>
        Campanha criada
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 2 ------------------------------------------------------------ */

const CHANNELS = ["E-mail", "SMS", "Portal Wi-Fi"];

const Coupon: React.FC<{ value: string; code: string; reveal: number }> = ({ value, code, reveal }) => (
  <div
    style={{
      width: 640,
      height: 520,
      borderRadius: 40,
      background: "#141518",
      padding: "44px 50px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
    }}
  >
    <div style={text(36, 800, "#fff", { letterSpacing: 3 })}>BLACK FRIDAY</div>
    <div style={{ height: 190, ...text(190, 900, "#fff", { letterSpacing: -8, lineHeight: 1.05 }) }}>
      {value ? `${value}%` : ""}
    </div>
    <div style={{ marginTop: 6, ...text(52, 900, P.accent, { letterSpacing: 4 }) }}>OFF</div>
    <div style={{ marginTop: 28, borderTop: "4px dashed rgba(255,255,255,0.35)" }} />
    <div style={{ marginTop: 24, ...text(34, 700, "rgba(255,255,255,0.85)", { letterSpacing: 2 }) }}>
      CUPOM: <span style={{ color: "#fff", fontWeight: 900 }}>{code}</span>
    </div>
    {/* brilho que passa quando o cupom é gerado */}
    <div
      style={{
        position: "absolute",
        top: -100,
        bottom: -100,
        width: 160,
        left: interpolate(reveal, [0, 1], [-260, 900]),
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))",
        transform: "rotate(18deg)",
      }}
    />
  </div>
);

const MontarCupom: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const value = typed("30", t, 1.0, 8);
  const code = typed("BLACK30", t, 1.55, 12);
  const validity = ramp(t, 2.3, 2.5);
  const chips = [2.75, 3.05, 3.35].map((c) => ramp(t, c, c + 0.15));
  const card = usePop(0.4);
  const gen = usePop(3.95, true);
  const shine = ramp(t, 4.0, 4.7);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={530}
        width={980}
        height={590}
        title="Hora Premiada · Novo cupom"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, top: 30, right: 36 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <Field label="Tipo" accent={product.accent} style={{ flex: 1 }}>
              Desconto (%) <span style={{ marginLeft: "auto", color: MUTED }}>▾</span>
            </Field>
            <Field label="Valor" accent={product.accent} style={{ flex: 1 }} focused={t > 0.9 && t < 1.45}>
              {value}
              <Caret t={t} from={0.9} to={1.45} />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            <Field label="Código" accent={product.accent} style={{ flex: 1 }} focused={t > 1.45 && t < 2.25}>
              {code}
              <Caret t={t} from={1.45} to={2.25} />
            </Field>
            <Field label="Validade" accent={product.accent} style={{ flex: 1 }} placeholder="Escolha">
              {validity > 0 ? <span style={{ opacity: validity }}>Hoje até 22h</span> : ""}
            </Field>
          </div>
          <Label style={{ marginTop: 26 }}>Canais de envio</Label>
          <div style={{ display: "flex", gap: 16 }}>
            {CHANNELS.map((c, i) => (
              <div
                key={c}
                style={{
                  padding: "14px 26px",
                  borderRadius: 999,
                  border: `3px solid ${chips[i] > 0 ? product.accent : LINE}`,
                  background: interpolateColor(chips[i], "#FFFFFF", product.accent),
                  ...text(23, 700, chips[i] > 0.5 ? "#fff" : INK),
                }}
              >
                {chips[i] > 0.5 ? "✓ " : ""}
                {c}
              </div>
            ))}
          </div>
        </div>
        <Button
          color={product.accent}
          t={t}
          pressAt={3.9}
          style={{ position: "absolute", right: 36, top: 430, width: 300 }}
        >
          Gerar cupom
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 800, y: 520 },
            { t: 0.85, x: 700, y: 92 },
            { t: 1.4, x: 230, y: 206 },
            { t: 2.7, x: 110, y: 340 },
            { t: 3.0, x: 260, y: 340 },
            { t: 3.3, x: 430, y: 340 },
            { t: 3.85, x: 790, y: 462 },
          ]}
          clicks={[0.9, 1.45, 2.75, 3.05, 3.35, 3.9]}
          from={0.3}
          until={4.6}
        />
      </Browser>

      <div
        style={{
          position: "absolute",
          left: 220,
          top: 1190,
          opacity: interpolate(card, [0, 1], [0, 0.35]) + gen * 0.65,
          transform: `scale(${interpolate(gen, [0, 1], [0.9, 1])})`,
          filter: `saturate(${gen})`,
        }}
      >
        <Coupon value={value} code={code} reveal={shine} />
      </div>
      <Toast
        at={4.3}
        color={product.accent}
        style={{ left: 640, top: 1150 }}
        icon={<span style={{ ...text(30, 900, product.accent) }}>◷</span>}
      >
        Só hoje até 22h
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 3 ------------------------------------------------------------ */

const ChannelChip: React.FC<{ at: number; label: string; left: number; top: number; color: string }> = ({
  at,
  label,
  left,
  top,
  color,
}) => {
  const p = usePop(at, true);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 20,
        padding: "16px 28px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: `0 16px 36px rgba(16,30,54,0.18), 0 0 0 3px ${color}`,
        ...text(28, 800),
        opacity: Math.min(1, p * 1.3),
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
      }}
    >
      {label}
    </div>
  );
};

const Distribuir: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const phoneIn = usePop(0.1);
  const open = ramp(t, 2.75, 3.15);
  const redeemed = ramp(t, 4.45, 4.7);

  return (
    <AbsoluteFill>
      <Phone left={260} top={560} screen="#0E1A2B" darkStatus={open > 0.5} style={rise(phoneIn, 80)}>
        {/* tela de bloqueio */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, #1B3B5F 0%, #0B1524 70%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 120,
          }}
        >
          <div style={text(28, 600, "rgba(255,255,255,0.8)")}>sexta-feira, 28 de novembro</div>
          <div style={text(150, 700, "#fff", { letterSpacing: -4, lineHeight: 1.1 })}>9:41</div>
        </div>
        <PhoneNotification
          at={0.8}
          until={2.75}
          top={420}
          app="Mensagens"
          glyph={<span style={{ fontSize: 20 }}>SMS</span>}
          color="#34C759"
          title="Hora Premiada"
          body="Seu cupom BLACK30 chegou: 30% OFF só hoje até 22h!"
        />
        <PhoneNotification
          at={1.6}
          until={2.75}
          top={610}
          app="E-mail"
          glyph="@"
          color="#2F6FDE"
          title="Black Friday: 30% OFF pra você"
          body="Toque para resgatar seu cupom."
        />
        {/* página do cupom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            transform: `translateY(${(1 - open) * SCREEN.h}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 120,
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
          <div style={{ marginTop: 40, transform: "scale(0.72)", transformOrigin: "top center", height: 380 }}>
            <Coupon value="30" code="BLACK30" reveal={0} />
          </div>
          <div style={{ marginTop: 20, ...text(24, 600, MUTED) }}>Válido hoje até 22h</div>
          <div
            style={{
              marginTop: 40,
              width: 420,
              height: 84,
              borderRadius: 999,
              background: interpolateColor(redeemed, product.accent, "#E9F6EE"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              transform: `scale(${t > 4.3 && t < 4.6 ? 0.94 : 1})`,
              ...text(30, 800, redeemed > 0.5 ? product.accent : "#fff"),
            }}
          >
            {redeemed > 0.5 && <Check size={38} color={product.accent} p={ramp(t, 4.6, 4.9)} />}
            {redeemed > 0.5 ? "Cupom resgatado" : "Resgatar cupom"}
          </div>
        </div>
        <Tap x={264} y={690} at={2.6} />
        <Tap x={264} y={870} at={4.35} />
      </Phone>
      <ChannelChip at={0.6} label="✉ E-mail" left={60} top={760} color={product.accent} />
      <ChannelChip at={0.9} label="SMS" left={800} top={980} color={product.accent} />
      <ChannelChip at={1.2} label="Portal Wi-Fi" left={40} top={1300} color={product.accent} />
    </AbsoluteFill>
  );
};

/* Passo 4 ------------------------------------------------------------ */

const FEED = [
  { at: 2.5, who: "Loja Centro", code: "BLACK30" },
  { at: 3.1, who: "Loja Shopping", code: "BLACK30" },
  { at: 3.7, who: "Loja Centro", code: "BLACK30" },
  { at: 4.3, who: "Loja Aeroporto", code: "BLACK30" },
];

const Acompanhar: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const live = FEED.filter((f) => t >= f.at).length;
  const redeemed = t < 2.4 ? Number(count0(t)) : 1284 + live;

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={530}
        width={980}
        height={1250}
        title="Hora Premiada · Relatórios"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 30, right: 30, top: 30, display: "flex", gap: 20 }}>
          <Kpi label="Cupons enviados" value={fmt(4820 * ramp(t, 0.6, 2.2))} accent={INK} style={{ flex: 1 }} />
          <Kpi label="Resgatados" value={fmt(redeemed)} accent={product.accent} style={{ flex: 1 }} />
          <Kpi
            label="Conversão"
            value={`${(26.6 * ramp(t, 0.6, 2.2)).toFixed(1).replace(".", ",")}%`}
            accent={INK}
            style={{ flex: 1 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 230,
            height: 440,
            borderRadius: 20,
            border: `1px solid ${LINE}`,
            padding: "24px 26px",
          }}
        >
          <div style={text(26, 800)}>Resgates por hora</div>
          <div style={{ marginTop: 16 }}>
            <AreaChart
              values={[0.08, 0.18, 0.32, 0.28, 0.46, 0.62, 0.55, 0.78, 0.92]}
              labels={["10h", "12h", "14h", "16h", "18h", "20h", "22h"]}
              width={866}
              height={330}
              color={product.accent}
              p={ramp(t, 0.8, 3.0)}
            />
          </div>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, ...text(26, 800) }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 99,
                background: "#E5484D",
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 4)),
              }}
            />
            Ao vivo
          </div>
          {FEED.slice(0, live)
            .reverse()
            .map((f, i) => (
              <FeedRow key={f.at} at={f.at} y={i} who={f.who} code={f.code} accent={product.accent} />
            ))}
        </div>
      </Browser>
    </AbsoluteFill>
  );
};

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));
const count0 = (t: number) => Math.round(1284 * ramp(t, 0.6, 2.2));

const FeedRow: React.FC<{ at: number; y: number; who: string; code: string; accent: string }> = ({
  at,
  y,
  who,
  code,
  accent,
}) => {
  const p = usePop(at);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 56 + y * 100,
        height: 84,
        borderRadius: 18,
        background: y === 0 ? `${accent}14` : "#F6F8FB",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 22px",
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
      }}
    >
      <Check size={40} color={accent} />
      <span style={text(25, 800)}>Cupom {code} resgatado</span>
      <span style={{ marginLeft: "auto", ...text(22, 600, MUTED) }}>{who}</span>
    </div>
  );
};

export const horaPremiadaConfig: DemoConfig = {
  product: P,
  tagline: (
    <>
      Cupons que trazem
      <br />o cliente de volta.
    </>
  ),
  steps: [
    { title: "Crie a campanha", subtitle: "Nome, período e visual do portal em poucos cliques.", seconds: 6.6, Scene: CriarCampanha },
    { title: "Monte o cupom", subtitle: "Desconto, código, validade e canais de envio.", seconds: 6.0, Scene: MontarCupom },
    { title: "O cupom chega na hora", subtitle: "Por e-mail, SMS e no portal Wi-Fi da sua loja.", seconds: 6.2, Scene: Distribuir },
    { title: "Acompanhe ao vivo", subtitle: "Cada resgate aparece no painel em tempo real.", seconds: 5.8, Scene: Acompanhar },
  ],
  benefits: [
    { title: "Maior fidelização", text: "Promoções que fazem o cliente voltar." },
    { title: "Controle em tempo real", text: "Ajuste a campanha enquanto ela acontece." },
    { title: "Agilidade", text: "Crie e distribua cupons em minutos." },
    { title: "Insights estratégicos", text: "Relatórios do impacto de cada promoção." },
  ],
  endLine: (
    <>
      Promoções que fidelizam,
      <br />
      resultado em tempo real.
    </>
  ),
};
