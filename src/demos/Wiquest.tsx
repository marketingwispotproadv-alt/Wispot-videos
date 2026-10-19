import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  Browser,
  Button,
  Caret,
  Check,
  Cursor,
  INK,
  interpolateColor,
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
  typed,
  usePop,
  useT,
  WifiGlyph,
} from "./kit";
import type { DemoConfig } from "./DemoVideo";
import { PRODUCTS, Product } from "./ProductMark";

/**
 * Wiquest — montagem da pesquisa, a pesquisa com a cara da marca (as cores
 * trocando como na peça "Use a sua marca" do Drive), o cliente respondendo
 * depois de se conectar e os resultados em tempo real.
 */

const P = PRODUCTS.wiquest;

/* Passo 1 ------------------------------------------------------------ */

const Q1 = "Você voltaria a nos visitar?";
const Q2 = "Que nota você dá para o atendimento?";
const Q3 = "Conte o que podemos melhorar";

const TYPES = ["Sim / Não", "Nota 0–10", "Texto livre"];

const QuestionCard: React.FC<{
  n: number;
  at: number;
  top: number;
  title: React.ReactNode;
  kind: string;
  accent: string;
  children: React.ReactNode;
}> = ({ n, at, top, title, kind, accent, children }) => {
  const p = usePop(at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 36,
        right: 36,
        top,
        borderRadius: 22,
        border: `2px solid ${LINE}`,
        borderLeft: `8px solid ${accent}`,
        padding: "22px 26px",
        background: "#fff",
        ...rise(p, 40),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", ...text(20, 700, MUTED, { letterSpacing: 1 }) }}>
        <span>PERGUNTA {n}</span>
        <span>{kind.toUpperCase()}</span>
      </div>
      <div style={{ marginTop: 10, minHeight: 40, ...text(31, 800) }}>{title}</div>
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  );
};

const Criar: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const q1 = typed(Q1, t, 1.15, 24);
  const q2 = typed(Q2, t, 2.95, 28);
  const opt = (label: string, filled: boolean) => (
    <span
      key={label}
      style={{
        padding: "10px 30px",
        borderRadius: 999,
        border: `3px solid ${product.accent}`,
        background: filled ? product.accent : "#fff",
        ...text(23, 800, filled ? "#fff" : product.accent),
      }}
    >
      {label}
    </span>
  );

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="Wiquest · Nova pesquisa"
        accent={product.accent}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 36, right: 36, top: 30, display: "flex", gap: 16 }}>
          {TYPES.map((k, i) => {
            const hit = [0.85, 2.7, 4.45][i];
            const on = t > hit && t < hit + 0.35;
            return (
              <div
                key={k}
                style={{
                  flex: 1,
                  height: 72,
                  borderRadius: 18,
                  border: `3px dashed ${on ? product.accent : "#CBD2DB"}`,
                  background: on ? `${product.accent}14` : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...text(24, 800, on ? product.accent : INK),
                }}
              >
                + {k}
              </div>
            );
          })}
        </div>

        <QuestionCard
          n={1}
          at={0.95}
          top={140}
          kind="Sim / Não"
          accent={product.accent}
          title={
            <>
              {q1}
              <Caret t={t} from={1.0} to={2.6} />
            </>
          }
        >
          <div style={{ display: "flex", gap: 14 }}>{[opt("Sim", true), opt("Não", false)]}</div>
        </QuestionCard>
        <QuestionCard
          n={2}
          at={2.8}
          top={372}
          kind="Nota 0–10"
          accent={product.accent}
          title={
            <>
              {q2}
              <Caret t={t} from={2.85} to={4.4} />
            </>
          }
        >
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 11 }, (_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 54,
                  borderRadius: 12,
                  background: interpolateColor(i / 10, "#FDE7DA", product.accent),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...text(22, 800, i > 5 ? "#fff" : INK),
                }}
              >
                {i}
              </span>
            ))}
          </div>
        </QuestionCard>
        <QuestionCard n={3} at={4.55} top={612} kind="Texto livre" accent={product.accent} title={Q3}>
          <div
            style={{
              height: 90,
              borderRadius: 14,
              border: `2px solid ${LINE}`,
              padding: "14px 18px",
              ...text(22, 500, "#A9B1BB"),
            }}
          >
            Resposta aberta…
          </div>
        </QuestionCard>

        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 52,
            display: "flex",
            gap: 14,
            alignItems: "center",
            ...text(22, 700, MUTED),
          }}
        >
          <WifiGlyph size={30} color={MUTED} />
          Exibir após a conexão ao Wi-Fi
        </div>
        <Button
          color={product.accent}
          t={t}
          pressAt={5.35}
          style={{ position: "absolute", right: 36, bottom: 36, width: 260 }}
        >
          Publicar
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 700, y: 900 },
            { t: 0.8, x: 160, y: 66 },
            { t: 2.65, x: 470, y: 66 },
            { t: 4.4, x: 770, y: 66 },
            { t: 5.3, x: 800, y: 1089 },
          ]}
          clicks={[0.85, 2.7, 4.45, 5.35]}
          from={0.3}
        />
      </Browser>
      <Toast at={5.55} color={product.accent} style={{ left: 290, top: 1790 }}>
        Pesquisa publicada
      </Toast>
    </AbsoluteFill>
  );
};

/* Passo 2 ------------------------------------------------------------ */

/** paleta da peça "Use a sua marca" do Drive, terminando no laranja da Wiquest */
const BRAND_COLORS = ["#E2556B", "#2BA3E0", "#2E9E6A", "#7B52D6", P.accent];
const SWITCH = [0.9, 1.75, 2.6, 3.45, 4.3];
const DOT = 74;
const DOT_GAP = 40;
const DOTS_LEFT = (1080 - (BRAND_COLORS.length * DOT + (BRAND_COLORS.length - 1) * DOT_GAP)) / 2;
const DOTS_TOP = 1755;

const Marca: React.FC<{ product: Product }> = () => {
  const t = useT();
  const phoneIn = usePop(0.1);
  // cor atual: interpola entre a anterior e a próxima a cada clique
  let color = "#9AA3AE";
  BRAND_COLORS.forEach((c, i) => {
    color = interpolateColor(ramp(t, SWITCH[i], SWITCH[i] + 0.35), toHex(color), c);
  });
  const logo = ramp(t, 2.0, 2.4);

  return (
    <AbsoluteFill>
      <Phone
        left={260}
        top={555}
        style={rise(phoneIn, 80)}
        screen="#fff"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${color}26 0%, ${color}0A 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 130,
          }}
        >
          <div
            style={{
              padding: "12px 30px",
              borderRadius: 14,
              border: `3px dashed ${color}`,
              ...text(22, 800, color, { letterSpacing: 2 }),
            }}
          >
            SUA MARCA
          </div>
          <div style={{ marginTop: 40, width: 440, ...text(22, 700, color, { letterSpacing: 1 }) }}>
            PESQUISA RÁPIDA · 1 DE 3
          </div>
          <div style={{ marginTop: 14, width: 440, height: 10, borderRadius: 99, background: `${color}33` }}>
            <div style={{ width: "33%", height: 10, borderRadius: 99, background: color }} />
          </div>
          <div style={{ marginTop: 60, width: 440, ...text(48, 900, INK, { lineHeight: 1.15, letterSpacing: -1 }) }}>
            {Q1}
          </div>
          <div
            style={{
              marginTop: 70,
              width: 440,
              height: 92,
              borderRadius: 999,
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...text(32, 800, "#fff"),
            }}
          >
            Sim
          </div>
          <div
            style={{
              marginTop: 22,
              width: 440,
              height: 92,
              borderRadius: 999,
              border: `4px solid ${color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...text(32, 800, color),
            }}
          >
            Não
          </div>
          <div style={{ marginTop: 90, opacity: logo, ...text(20, 600, MUTED) }}>Pesquisa por Wiquest</div>
        </div>
      </Phone>

      {BRAND_COLORS.map((c, i) => {
        const sel = t >= SWITCH[i] && (i === BRAND_COLORS.length - 1 || t < SWITCH[i + 1]);
        const p = ramp(t, 0.4 + i * 0.08, 0.75 + i * 0.08);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: DOTS_LEFT + i * (DOT + DOT_GAP),
              top: DOTS_TOP,
              width: DOT,
              height: DOT,
              borderRadius: 99,
              background: c,
              boxShadow: sel ? `0 0 0 7px #fff, 0 0 0 12px ${c}` : "0 6px 14px rgba(0,0,0,0.15)",
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
            }}
          />
        );
      })}
      <Cursor
        keys={[
          { t: 0, x: 900, y: 1500 },
          ...SWITCH.map((s, i) => ({ t: s - 0.05, x: DOTS_LEFT + i * (DOT + DOT_GAP) + DOT / 2, y: DOTS_TOP + DOT / 2 })),
        ]}
        clicks={SWITCH}
        from={0.4}
        until={5.0}
      />
    </AbsoluteFill>
  );
};

const toHex = (rgb: string) => {
  if (rgb.startsWith("#")) return rgb;
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/* Passo 3 ------------------------------------------------------------ */

const Responder: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const phoneIn = usePop(0.1);
  const A = product.accent;
  // 0 = conectado, 1 = pergunta 1, 2 = pergunta 2, 3 = obrigado
  const pos = ramp(t, 1.0, 1.4) + ramp(t, 2.75, 3.15) + ramp(t, 4.45, 4.85);
  const yes = t > 2.3;
  const nine = t > 3.95;
  const thanks = ramp(t, 4.7, 5.2);

  const screen = (i: number, node: React.ReactNode) => (
    <div
      key={i}
      style={{
        position: "absolute",
        top: 0,
        width: SCREEN.w,
        height: SCREEN.h,
        left: (i - pos) * SCREEN.w,
        padding: "130px 46px 0",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {node}
    </div>
  );

  const progress = (n: number) => (
    <>
      <div style={{ width: "100%", ...text(22, 700, A, { letterSpacing: 1 }) }}>PESQUISA RÁPIDA · {n} DE 2</div>
      <div style={{ marginTop: 14, width: "100%", height: 10, borderRadius: 99, background: `${A}33` }}>
        <div style={{ width: `${n * 50}%`, height: 10, borderRadius: 99, background: A }} />
      </div>
    </>
  );

  return (
    <AbsoluteFill>
      <Phone left={260} top={560} screen={`#FFF7F2`} style={rise(phoneIn, 80)}>
        {screen(
          0,
          <>
            <div
              style={{
                marginTop: 180,
                width: 200,
                height: 200,
                borderRadius: 99,
                background: "#2BA3E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 40px rgba(43,163,224,0.35)",
              }}
            >
              <WifiGlyph size={110} color="#fff" />
            </div>
            <div style={{ marginTop: 46, ...text(48, 900) }}>Conectado</div>
            <div style={{ marginTop: 10, ...text(28, 600, MUTED) }}>Wi-Fi da loja</div>
          </>,
        )}
        {screen(
          1,
          <>
            {progress(1)}
            <div style={{ marginTop: 80, width: "100%", ...text(48, 900, INK, { lineHeight: 1.15, letterSpacing: -1 }) }}>
              {Q1}
            </div>
            {["Sim", "Não"].map((o, i) => {
              const sel = i === 0 && yes;
              return (
                <div
                  key={o}
                  style={{
                    marginTop: i ? 22 : 80,
                    width: "100%",
                    height: 96,
                    borderRadius: 999,
                    border: `4px solid ${A}`,
                    background: sel ? A : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    ...text(32, 800, sel ? "#fff" : A),
                  }}
                >
                  {sel && <Check size={34} color={A} bg="#fff" p={ramp(t, 2.3, 2.55)} />}
                  {o}
                </div>
              );
            })}
          </>,
        )}
        {screen(
          2,
          <>
            {progress(2)}
            <div style={{ marginTop: 80, width: "100%", ...text(44, 900, INK, { lineHeight: 1.15, letterSpacing: -1 }) }}>
              {Q2}
            </div>
            <div
              style={{
                marginTop: 70,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
              }}
            >
              {Array.from({ length: 11 }, (_, i) => {
                const sel = i === 9 && nine;
                return (
                  <div
                    key={i}
                    style={{
                      height: 84,
                      borderRadius: 20,
                      border: `3px solid ${sel ? A : "#F3C8AE"}`,
                      background: sel ? A : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${sel ? interpolate(t, [3.95, 4.05, 4.2], [1, 1.12, 1], { extrapolateRight: "clamp" }) : 1})`,
                      ...text(32, 900, sel ? "#fff" : INK),
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
          </>,
        )}
        {screen(
          3,
          <>
            <div style={{ marginTop: 200, transform: `scale(${0.6 + thanks * 0.4})` }}>
              <Check size={220} color={A} p={ramp(t, 4.85, 5.3)} />
            </div>
            <div style={{ marginTop: 50, textAlign: "center", ...text(46, 900, INK, { lineHeight: 1.2 }) }}>
              Obrigado pela
              <br />
              sua opinião!
            </div>
          </>,
        )}
        <Tap x={282} y={499} at={2.3} />
        <Tap x={221} y={721} at={3.95} />
      </Phone>
    </AbsoluteFill>
  );
};

/* Passo 4 ------------------------------------------------------------ */

const NOTES = [1, 0, 1, 2, 1, 3, 5, 8, 14, 19, 12];

const Resultados: React.FC<{ product: Product }> = ({ product }) => {
  const t = useT();
  const win = usePop(0.15);
  const k = ramp(t, 0.6, 2.2);
  const A = product.accent;
  const bars = ramp(t, 0.9, 2.4);

  return (
    <AbsoluteFill>
      <Browser
        left={50}
        top={540}
        width={980}
        height={1230}
        title="Wiquest · Resultados"
        accent={A}
        style={rise(win, 60)}
      >
        <div style={{ position: "absolute", left: 30, right: 30, top: 30, display: "flex", gap: 20 }}>
          <Kpi
            label="Respostas"
            value={new Intl.NumberFormat("pt-BR").format(Math.round(1284 * k + Math.max(0, t - 2.2) * 3))}
            accent={A}
            style={{ flex: 1 }}
          />
          <Kpi label="Nota média" value={(8.7 * k).toFixed(1).replace(".", ",")} accent={INK} style={{ flex: 1 }} />
          <Kpi label="Voltariam" value={`${Math.round(82 * k)}%`} accent={INK} style={{ flex: 1 }} />
        </div>

        <div style={{ position: "absolute", left: 30, top: 230, width: 400, height: 520, borderRadius: 20, border: `1px solid ${LINE}`, padding: "24px 26px" }}>
          <div style={text(25, 800, INK, { lineHeight: 1.25 })}>{Q1}</div>
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 30, height: 340, display: "flex", alignItems: "flex-end", gap: 50, justifyContent: "center" }}>
            {[
              { l: "Sim", v: 82, c: A },
              { l: "Não", v: 18, c: "#CBD2DB" },
            ].map((b) => (
              <div key={b.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={text(30, 900, b.l === "Sim" ? A : MUTED)}>{Math.round(b.v * bars)}%</div>
                <div style={{ width: 110, height: 250 * (b.v / 100) * bars, borderRadius: 18, background: b.c }} />
                <div style={text(24, 700, MUTED)}>{b.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 450, right: 30, top: 230, height: 520, borderRadius: 20, border: `1px solid ${LINE}`, padding: "24px 26px" }}>
          <div style={text(25, 800)}>Notas do atendimento</div>
          <div style={{ position: "absolute", left: 26, right: 26, bottom: 30, height: 380, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {NOTES.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: "100%",
                    height: (v / 19) * 300 * ramp(t, 1.0 + i * 0.07, 2.2 + i * 0.07),
                    borderRadius: 8,
                    background: interpolateColor(i / 10, "#FAD3BC", A),
                  }}
                />
                <div style={text(19, 700, MUTED)}>{i}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 790,
            padding: "22px 26px",
            borderRadius: 20,
            background: "#F6F8FB",
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: ramp(t, 2.4, 2.7),
          }}
        >
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "#2F6FDE", display: "flex", alignItems: "center", justifyContent: "center", ...text(30, 900, "#fff") }}>
            @
          </div>
          <div>
            <div style={text(25, 800)}>Alerta enviado por e-mail</div>
            <div style={text(21, 600, MUTED)}>Nova resposta com nota baixa · Loja Centro</div>
          </div>
        </div>

        <Button
          color={A}
          t={t}
          pressAt={3.9}
          outline
          style={{ position: "absolute", right: 30, bottom: 36, width: 300 }}
        >
          Exportar CSV
        </Button>
        <Cursor
          keys={[
            { t: 0, x: 600, y: 1000 },
            { t: 3.85, x: 800, y: 1089 },
          ]}
          clicks={[3.9]}
          from={3.0}
        />
      </Browser>
      <Toast at={4.2} color={A} style={{ left: 250, top: 1790 }}>
        resultados.csv exportado
      </Toast>
    </AbsoluteFill>
  );
};

export const wiquestConfig: DemoConfig = {
  product: P,
  tagline: (
    <>
      Ouça seus clientes
      <br />
      em tempo real.
    </>
  ),
  steps: [
    { title: "Crie a pesquisa", subtitle: "Sim ou não, nota ou texto livre — do seu jeito.", seconds: 6.3, Scene: Criar },
    { title: "Use a sua marca", subtitle: "Cores e logo da sua empresa na pesquisa.", seconds: 5.6, Scene: Marca },
    { title: "O cliente responde", subtitle: "No celular, logo depois de se conectar ao Wi-Fi.", seconds: 6.0, Scene: Responder },
    { title: "Resultados na hora", subtitle: "Painéis ao vivo, alertas e exportação.", seconds: 5.8, Scene: Resultados },
  ],
  benefits: [
    { title: "Decisões mais rápidas", text: "Insights prontos para ação." },
    { title: "Engajamento", text: "Pesquisas curtas e com a sua marca." },
    { title: "Análises poderosas", text: "Respostas viram gráficos na hora." },
    { title: "Automação completa", text: "Alertas por SMS e e-mail, e API." },
  ],
  endLine: (
    <>
      Feedback na hora,
      <br />
      decisões mais rápidas.
    </>
  ),
};
