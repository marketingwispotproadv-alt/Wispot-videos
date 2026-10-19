import React from "react";
import { FONT_FAMILY } from "../brand";
import { AreaChart, MUTED } from "../demos/kit";
import { NavyBg } from "../explainers/ex-kit";
import { SKINS } from "../explainers/people";
import { DUR, EASE, Kinetic, Tag, tween, useSeconds } from "./motion";
import { CountCard, IllustratedShot, QuestionMarks, SoftBg, StatChip, StingShot, StoryConfig } from "./story-kit";
import { HeatTowers3D } from "./three3d";

/**
 * Wimap — "O mistério da vitrine".
 *
 * A Paula caprichou na vitrine nova, mas as vendas não mudaram. O Wimap mostra
 * o que ela não via: muita gente passa, poucos entram — e quase ninguém chega
 * ao fundo da loja. Ela leva a promoção para lá e, uma semana depois, o mapa
 * de calor se espalha e a conversão sobe.
 */

const PURPLE = "#941F91";
const LIGHT = "#E07ADC";
const INKC = "#1B2430";

const PAULA = { skin: SKINS[1], hair: "long" as const, hairColor: "#2A1C14", top: "#1B2430", bottom: "#2E3440", dress: true };

/** vitrine nova: manequins, faixa e brilhos */
const Display: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={508} y={458} width={524} height={384} fill="#F4E8F6" />
    <rect x={540} y={478} width={460} height={60} rx={10} fill={PURPLE} />
    <text x={770} y={520} textAnchor="middle" fontFamily={FONT_FAMILY} fontWeight={900} fontSize={34} fill="#fff" letterSpacing={4}>
      NOVA COLEÇÃO
    </text>
    {[640, 900].map((x, i) => (
      <g key={x}>
        <circle cx={x} cy={600} r={24} fill="#EADBC8" />
        <path d={`M${x - 46} 640 L${x + 46} 640 L${x + 70} 800 L${x - 70} 800 Z`} fill={i ? "#F2B33D" : "#E25D6A"} />
        <rect x={x - 4} y={800} width={8} height={40} fill="#3B4048" />
      </g>
    ))}
    {[
      [560, 580],
      [770, 650],
      [990, 590],
      [700, 760],
      [840, 560],
    ].map(([x, y], i) => {
      const s = Math.max(0, Math.sin(t * 4 + i * 1.7));
      return <path key={i} d={`M${x} ${y - 18 * s} L${x + 5 * s} ${y} L${x} ${y + 18 * s} L${x - 5 * s} ${y} Z`} fill="#FFD84A" />;
    })}
  </g>
);

/* 1 · a vitrine nova ------------------------------------------------------- */

const Vitrine: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="street"
      sign="LOJA DA PAULA"
      accent={PURPLE}
      back={<Display t={t} />}
      cast={[
        { x: 1300, y: 1000, scale: 1.2, ...PAULA, mood: "happy", pose: "wave" },
        { x: -120, y: 1030, scale: 1.2, skin: SKINS[0], hair: "short", hairColor: "#3A2A1E", top: "#5876C4", bottom: "#2E3440", to: { x: 900, from: 0.2, until: 3.0 } },
        { x: 2050, y: 1020, scale: 1.18, skin: SKINS[4], hair: "bun", hairColor: "#8A5A35", top: "#2FA37A", bottom: "#3B3F4A", to: { x: 1600, from: 0, until: 3.0 } },
      ]}
      keys={[
        { t: 0, x: 770, y: 650, z: 1.7 },
        { t: 2.4, x: 960, y: 620, z: 1.1 },
      ]}
    >
      <Kinetic lines={["A Paula caprichou", "na *vitrine* nova."]} at={0.3} until={2.8} size={84} accent={PURPLE} color={INKC} shadow={false} plate="#fff" top={790} />
    </IllustratedShot>
  );
};

/* 2 · as vendas não mudam ---------------------------------------------------- */

const Flat: React.FC = () => {
  const t = useSeconds();
  const p = tween(t, 0.1, DUR.std);
  return (
    <SoftBg accent={PURPLE}>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 230,
          width: 820,
          height: 560,
          borderRadius: 34,
          background: "#fff",
          boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
          padding: "34px 40px",
          opacity: p,
          transform: `translateY(${(1 - p) * 40}px)`,
          fontFamily: FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, fontSize: 36, color: INKC }}>Vendas da semana</span>
          <span style={{ fontWeight: 900, fontSize: 44, color: MUTED }}>+0%</span>
        </div>
        <div style={{ marginTop: 30 }}>
          <AreaChart values={[0.42, 0.45, 0.4, 0.44, 0.41, 0.43, 0.42]} labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]} width={740} height={380} color="#9AA3AE" p={tween(t, 0.2, 1.4, EASE.move)} />
        </div>
      </div>
      <Kinetic lines={["As vendas?", "*Iguais*."]} at={0.7} size={120} accent={PURPLE} color={INKC} shadow={false} align="left" left={1120} top={350} width={760} />
    </SoftBg>
  );
};

/* 3 · a dúvida ------------------------------------------------------------------ */

const Doubt: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="street"
      sign="LOJA DA PAULA"
      accent={PURPLE}
      back={<Display t={t} />}
      cast={[{ x: 1300, y: 1000, scale: 1.2, ...PAULA, mood: [[0, "sad"], [1.0, "surprised"]] }]}
      keys={[
        { t: 0, x: 1300, y: 640, z: 2.1 },
        { t: 2.9, x: 1300, y: 640, z: 2.35 },
      ]}
    >
      <QuestionMarks at={0.5} color={PURPLE} spots={[[560, 380], [1240, 330], [1360, 600], [470, 640]]} />
      <Kinetic lines={["Quantos olham? Quantos entram?", "Pra *onde* eles vão?"]} at={0.25} until={2.7} size={70} accent={PURPLE} color={INKC} shadow={false} plate="#fff" top={60} />
    </IllustratedShot>
  );
};

/* 5 · o que o Wimap mostra --------------------------------------------------------- */

const Towers: React.FC = () => (
  <NavyBg>
    <HeatTowers3D balance={0} />
    <StatChip at={0.7} value="3.420" label="passaram na frente" accent={PURPLE} top={110} />
    <StatChip at={1.2} value="12%" label="entraram" accent={PURPLE} top={240} />
    <StatChip at={1.7} value="4%" label="chegaram ao fundo da loja" accent="#E5484D" top={370} />
    <Tag text="Mapa de calor · Loja da Paula" at={0.3} accent={LIGHT} dark left={90} top={960} />
  </NavyBg>
);

/* 6 · a virada ------------------------------------------------------------------- */

const Insight: React.FC = () => (
  <NavyBg>
    <Kinetic lines={["A vitrine funcionava."]} at={0.1} until={1.15} size={110} accent={LIGHT} top={420} />
    <Kinetic lines={["O problema era", "*lá dentro*."]} at={1.35} size={110} accent={LIGHT} top={340} />
  </NavyBg>
);

/* 7 · a promoção vai pro fundo -------------------------------------------------------- */

const MovePromo: React.FC = () => {
  const t = useSeconds();
  const move = tween(t, 0.5, 1.2, EASE.move);
  const x = 470;
  const y = 700 - move * 430;
  return (
    <SoftBg accent={PURPLE}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(120 120)">
          <rect x={0} y={0} width={700} height={820} rx={24} fill="#fff" stroke={INKC} strokeWidth={10} />
          <rect x={260} y={812} width={180} height={20} fill="#F4F6F8" />
          <text x={350} y={880} textAnchor="middle" fontFamily={FONT_FAMILY} fontWeight={800} fontSize={30} fill={MUTED} letterSpacing={3}>
            ENTRADA
          </text>
          {[
            [40, 40, 280, 220, "Provadores"],
            [380, 40, 280, 220, "Fundo da loja"],
            [40, 300, 620, 220, "Corredores"],
            [440, 560, 220, 220, "Caixas"],
          ].map(([zx, zy, w, h, l]) => (
            <g key={l as string}>
              <rect x={zx as number} y={zy as number} width={w as number} height={h as number} rx={16} fill={`${PURPLE}12`} stroke={`${PURPLE}55`} strokeWidth={3} />
              <text x={(zx as number) + 20} y={(zy as number) + 40} fontFamily={FONT_FAMILY} fontWeight={800} fontSize={26} fill={INKC}>
                {l}
              </text>
            </g>
          ))}
          <path d="M350 790 C350 620 520 520 520 260" fill="none" stroke={PURPLE} strokeWidth={8} strokeDasharray="18 16" strokeDashoffset={-t * 60} opacity={tween(t, 1.6, DUR.std)} />
          <g transform={`translate(${x + move * 50} ${y})`}>
            <rect x={-90} y={-46} width={180} height={92} rx={18} fill={PURPLE} />
            <text x={0} y={14} textAnchor="middle" fontFamily={FONT_FAMILY} fontWeight={900} fontSize={38} fill="#fff">
              PROMO
            </text>
          </g>
        </g>
      </svg>
      <Kinetic lines={["Ela levou a promoção", "pro *fundo* da loja."]} at={0.4} size={84} accent={PURPLE} color={INKC} shadow={false} align="left" left={980} top={380} width={900} />
    </SoftBg>
  );
};

/* 8 · uma semana depois ----------------------------------------------------------- */

const After: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <HeatTowers3D balance={tween(t, 0.3, 1.6, EASE.move)} at={-1} />
      <Tag text="Uma semana depois" at={0.2} accent={LIGHT} dark left={90} top={70} />
      <CountCard label="Entraram na loja" to={19} suffix="%" at={1.2} accent={PURPLE} left={90} top={170} />
      <StatChip at={1.9} value="+13 min" label="de permanência" accent={PURPLE} top={400} />
      <Kinetic lines={["Agora a loja *inteira* vende."]} at={2.0} size={64} accent={LIGHT} top={920} />
    </NavyBg>
  );
};

export const wimapStory: StoryConfig = {
  logo: "wimap",
  narration: "wimap",
  title: ["O mistério", "da *vitrine*"],
  sector: "Shoppings",
  name: "Wimap",
  accent: PURPLE,
  logoColor: LIGHT,
  slogan: ["Pare de adivinhar.", "Comece a *enxergar*."],
  sectors: ["Shoppings", "Varejo", "Aeroportos", "Feiras e eventos", "Espaços públicos"],
  shots: [
    { seconds: 3.0, node: <Vitrine /> },
    { seconds: 2.6, cut: "whip", node: <Flat /> },
    { seconds: 2.9, cut: "zoom", node: <Doubt /> },
    { seconds: 2.5, cut: "flash", node: <StingShot logo="wimap" color={LIGHT} line={["Enxergue quem passa, entra e volta."]} /> },
    { seconds: 3.8, cut: "whip", node: <Towers /> },
    { seconds: 2.7, cut: "zoom", node: <Insight /> },
    { seconds: 3.0, cut: "whip", node: <MovePromo /> },
    { seconds: 3.6, cut: "flash", node: <After /> },
  ],
};

