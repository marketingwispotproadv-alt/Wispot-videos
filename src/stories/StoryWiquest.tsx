import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../brand";
import { INK, Phone, Tap } from "../demos/kit";
import { NavyBg } from "../explainers/ex-kit";
import { SKINS } from "../explainers/people";
import { BrandSlot } from "../explainers/screens";
import { Kinetic, Tag, useSeconds } from "./motion";
import { IllustratedShot, LockPhone, ReviewCard, SoftBg, StingShot, StoryConfig, WallClock } from "./story-kit";
import { Stars3D } from "./three3d";

/**
 * Wiquest — "A estrela que faltava".
 *
 * Sexta, 22h: o Rafael recebe uma avaliação de 1 estrela de uma cliente que
 * esperou 40 minutos — e só fica sabendo quando ela já foi embora. Com a
 * Wiquest, a cliente responde uma pesquisa rápida no Wi-Fi, a nota baixa vira
 * alerta no celular dele na hora, ele resolve na mesa — e a mesma cliente
 * deixa 5 estrelas.
 */

const ORANGE = "#F46904";
const LIGHT = "#FF8A3D";
const INKC = "#1B2430";

const BIA = { skin: SKINS[1], hair: "long" as const, hairColor: "#2A1C14", top: "#C94F7C", bottom: "#2E3440" };
const RAFAEL = { skin: SKINS[2], hair: "short" as const, hairColor: "#1F1A17", top: "#FFFFFF", bottom: "#2E3440", tie: "#2F3640" };

/* 1 · a avaliação de 1 estrela ------------------------------------------------ */

const BadReview: React.FC = () => (
  <SoftBg accent="#E5484D">
    <Tag text="Sexta, 22h · Restaurante do Rafael" at={0.1} accent="#E5484D" />
    <ReviewCard at={0.3} stars={1} bad name="Bia S." text="Esperei 40 minutos pelo prato. Não volto mais." left={500} top={250} scale={1.15} />
    <Kinetic lines={["Uma avaliação de *1 estrela*."]} at={1.1} size={70} accent="#E5484D" color={INKC} shadow={false} top={790} />
  </SoftBg>
);

/* 2 · tarde demais ------------------------------------------------------------- */

const TooLate: React.FC = () => (
  <IllustratedShot
    place="restaurant"
    accent={ORANGE}
    cast={[{ x: 1300, y: 990, scale: 1.26, ...RAFAEL, pose: "phone", mood: [[0, "surprised"], [1.0, "sad"]] }]}
    keys={[
      { t: 0, x: 1180, y: 600, z: 2.0 },
      { t: 2.6, x: 1180, y: 600, z: 2.2 },
    ]}
  >
    <Kinetic lines={["Ele só ficou sabendo", "quando já era *tarde*."]} at={0.3} until={2.4} size={76} accent={ORANGE} color={INKC} shadow={false} plate="#fff" align="left" left={80} top={760} width={1200} />
  </IllustratedShot>
);

/* 3 · e se desse para voltar? ------------------------------------------------- */

const Rewind: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <WallClock x={960} y={360} r={170} h={22} m={0} speed={-1500} t={t} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 1220,
          top: 300,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 120,
          color: "#fff",
          opacity: 0.5 + Math.abs(Math.sin(t * 6)) * 0.5,
        }}
      >
        ◀◀
      </div>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)" }} />
      <Kinetic lines={["E se desse pra saber", "*antes* dela ir embora?"]} at={0.4} size={84} accent={LIGHT} top={640} />
    </NavyBg>
  );
};

/* 5 · a pesquisa na mesa -------------------------------------------------------- */

const NOTE_AT = 1.5;

const SurveyScreen: React.FC = () => {
  const t = useSeconds();
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${ORANGE}22 0%, ${ORANGE}08 100%)`, padding: "110px 46px 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT_FAMILY }}>
      <BrandSlot dark />
      <div style={{ marginTop: 40, width: "100%", fontWeight: 800, fontSize: 22, color: ORANGE, letterSpacing: 1 }}>PESQUISA RÁPIDA · 1 DE 2</div>
      <div style={{ marginTop: 40, width: "100%", fontWeight: 900, fontSize: 46, lineHeight: 1.15, color: INK, letterSpacing: -1 }}>Como está o seu atendimento?</div>
      <div style={{ marginTop: 50, width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {Array.from({ length: 11 }, (_, i) => {
          const sel = i === 3 && t > NOTE_AT;
          return (
            <div
              key={i}
              style={{
                height: 84,
                borderRadius: 20,
                border: `3px solid ${sel ? "#E5484D" : "#F3C8AE"}`,
                background: sel ? "#E5484D" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 32,
                color: sel ? "#fff" : INK,
              }}
            >
              {i}
            </div>
          );
        })}
      </div>
      <Tap x={432} y={471} at={NOTE_AT} />
    </div>
  );
};

const Survey: React.FC = () => (
  <IllustratedShot
    place="restaurant"
    accent={ORANGE}
    cast={[{ x: 430, y: 960, scale: 1.16, ...BIA, pose: "sit", mood: [[0, "neutral"], [1.4, "sad"]], wifiAt: 0.2 }]}
    keys={[
      { t: 0, x: 560, y: 720, z: 1.6 },
      { t: 3.4, x: 620, y: 720, z: 1.75 },
    ]}
  >
    <Phone left={1180} top={70} scale={0.66} style={{ transform: "scale(0.66) rotate(3deg)" }}>
      <SurveyScreen />
    </Phone>
    <Tag text="Mesa 7 · logo depois de conectar no Wi-Fi" at={0.3} accent={ORANGE} left={80} top={960} />
  </IllustratedShot>
);

/* 6 · alerta na hora ------------------------------------------------------------ */

const Alert: React.FC = () => (
  <SoftBg accent={ORANGE}>
    <LockPhone
      left={330}
      top={110}
      scale={0.76}
      wallpaper="linear-gradient(160deg, #1B3B5F, #0B1524)"
      at={0.3}
      time="21:24"
      app="Wiquest"
      glyph="W"
      color={ORANGE}
      title="Mesa 7 deu nota 3"
      body="Motivo: tempo de espera. Agora há pouco."
    />
    <Kinetic lines={["Alerta", "*na hora*."]} at={0.7} size={150} accent={ORANGE} color={INKC} shadow={false} align="left" left={980} top={330} width={900} />
  </SoftBg>
);

/* 7 · resolvido na mesa ------------------------------------------------------------- */

const Rescue: React.FC = () => (
  <IllustratedShot
    place="restaurant"
    accent={ORANGE}
    cast={[
      { x: 430, y: 960, scale: 1.16, ...BIA, pose: "sit", mood: [[0, "sad"], [2.0, "happy"]] },
      { x: 1640, y: 990, scale: 1.26, ...RAFAEL, mood: "happy", to: { x: 820, from: 0.1, until: 1.7 } },
    ]}
    keys={[
      { t: 0, x: 1250, y: 620, z: 1.25 },
      { t: 1.8, x: 700, y: 640, z: 1.55 },
      { t: 3.4, x: 680, y: 640, z: 1.6 },
    ]}
  >
    <Tag text="Pedido de desculpas + sobremesa por conta da casa" at={1.8} accent={ORANGE} left={80} top={960} />
  </IllustratedShot>
);

/* 8 · cinco estrelas -------------------------------------------------------------- */

const FiveStars: React.FC = () => (
  <NavyBg>
    <Stars3D lit={[0.25, 0.4, 0.55, 0.7, 0.85]} />
    <Kinetic lines={["*5 estrelas*.", "A mesma cliente."]} at={1.0} size={84} accent={LIGHT} top={70} />
    <Kinetic lines={["“Tiveram um problema, mas resolveram na hora.”"]} at={1.7} size={44} weight={600} accent={LIGHT} top={880} />
  </NavyBg>
);

export const wiquestStory: StoryConfig = {
  logo: "wiquest",
  narration: "wiquest",
  title: ["A estrela", "que *faltava*"],
  sector: "Restaurantes",
  name: "Wiquest",
  accent: ORANGE,
  logoColor: LIGHT,
  slogan: ["Ouça antes que", "vire *avaliação*."],
  sectors: ["Restaurantes", "Hotéis", "Clínicas", "Varejo", "Instituições de ensino"],
  shots: [
    { seconds: 3.0, node: <BadReview /> },
    { seconds: 2.6, cut: "zoom", node: <TooLate /> },
    { seconds: 2.6, cut: "whip", node: <Rewind /> },
    { seconds: 2.5, cut: "flash", node: <StingShot logo="wiquest" color={LIGHT} line={["Ouça seus clientes em tempo real."]} /> },
    { seconds: 3.4, cut: "whip", node: <Survey /> },
    { seconds: 2.7, cut: "zoom", node: <Alert /> },
    { seconds: 3.4, cut: "whip", node: <Rescue /> },
    { seconds: 2.9, cut: "flash", node: <FiveStars /> },
  ],
};
