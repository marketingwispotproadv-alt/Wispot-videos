import React from "react";
import { AbsoluteFill, Freeze, interpolate, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import "../fonts";
import { MusicBed } from "../components/MusicBed";
import { Ripples } from "../components/Ripples";
import { blurWhip } from "../transitions/blurWhip";
import { Phone, ramp, rise, text, usePop, useT } from "../demos/kit";
import {
  Bullet,
  Caption,
  FeatureTile,
  IconName,
  Laptop,
  Line,
  LogoId,
  NavyBg,
  ProductLogo,
  StudioBg,
  WispotLogo,
} from "./ex-kit";
import { Place, PlaceScene } from "./people";

/**
 * Esqueleto dos vídeos no estilo do institucional antigo da Wispot (16:9):
 *
 * 1. cena ilustrada com pessoas num lugar do dia a dia + a pergunta-gancho;
 * 2. o logo do produto se revelando no azul;
 * 3. o celular do cliente no estúdio cinza, com cartões ao lado;
 * 4. o "Painel de Controle", mudando o que aparece no celular;
 * 5. o painel web num notebook, sobre o azul;
 * 6. os recursos em blocos, sobre o painel desfocado;
 * 7. o fechamento com tópicos e o site;
 * 8. o cartão final da Wispot.
 *
 * Sem locução: a narração do vídeo antigo vira legenda (`Caption`).
 */

export type ExplainerConfig = {
  logo: LogoId;
  name: string;
  accent: string;
  place: Place;
  hook: Line[];
  tagline: React.ReactNode;
  phone: { Screen: React.FC; Side: React.FC; caption: Line[]; screenBg?: string; darkStatus?: boolean };
  panel: { Screen: React.FC; Panel: React.FC; caption: Line[]; screenBg?: string };
  laptop: { Screen: React.FC; caption: Line[] };
  tiles: { icon: IconName; label: string }[];
  bullets: { icon: IconName; title: string; text: string }[];
  OutroScreen: React.FC;
};

const SECONDS = {
  hook: 7.5,
  reveal: 3.6,
  phone: 8.2,
  panel: 8.4,
  laptop: 7.6,
  tiles: 4.8,
  outro: 6.4,
  final: 3.6,
};
const T = 15;

export const explainerFrames = (fps: number) =>
  Object.values(SECONDS).reduce((a, s) => a + Math.round(s * fps), 0) - (Object.keys(SECONDS).length - 1) * T;

export const ExplainerVideo: React.FC<{ config: ExplainerConfig }> = ({ config: c }) => {
  const { fps } = useVideoConfig();
  const total = explainerFrames(fps);
  const scenes: [keyof typeof SECONDS, React.ReactNode][] = [
    ["hook", <Hook key="h" c={c} />],
    ["reveal", <Reveal key="r" c={c} />],
    ["phone", <PhoneScene key="p" c={c} />],
    ["panel", <PanelScene key="pa" c={c} />],
    ["laptop", <LaptopScene key="l" c={c} />],
    ["tiles", <Tiles key="ti" c={c} />],
    ["outro", <Outro key="o" c={c} />],
    ["final", <Final key="f" c={c} />],
  ];

  const children: React.ReactNode[] = [];
  scenes.forEach(([k, node], i) => {
    if (i)
      children.push(
        k === "final" ? (
          <TransitionSeries.Transition key={`${k}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        ) : (
          <TransitionSeries.Transition
            key={`${k}-t`}
            presentation={blurWhip({ maxBlur: 30, zoom: 0.06 })}
            timing={linearTiming({ durationInFrames: T })}
          />
        ),
      );
    children.push(
      <TransitionSeries.Sequence key={k} durationInFrames={Math.round(SECONDS[k] * fps)}>
        {node}
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ background: "#072A63" }}>
      <TransitionSeries>{children}</TransitionSeries>
      <MusicBed totalFrames={total} endCardFrom={total - Math.round(SECONDS.final * fps)} fps={fps} level={0.5} />
    </AbsoluteFill>
  );
};

/* 1 · cena ilustrada ---------------------------------------------------- */

const Hook: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const t = useT();
  const zoom = interpolate(t, [0, SECONDS.hook], [1, 1.07]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 70%" }}>
        <PlaceScene place={c.place} t={t} accent={c.accent} />
      </AbsoluteFill>
      <Caption lines={c.hook} big />
    </AbsoluteFill>
  );
};

/* 2 · revelação do logo -------------------------------------------------- */

const Reveal: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const t = useT();
  const wipe = ramp(t, 0.3, 1.1);
  const by = usePop(1.2);
  const line = usePop(1.6);
  return (
    <NavyBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples size={900} opacity={0.16} speed={0.35} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            clipPath: `inset(-20% ${(1 - wipe) * 100}% -20% 0)`,
            transform: `scale(${interpolate(wipe, [0, 1], [0.94, 1])})`,
          }}
        >
          <ProductLogo id={c.logo} white height={c.logo === "sending" ? 250 : 190} />
        </div>
        <div style={{ marginTop: 46, display: "flex", alignItems: "center", gap: 18, ...rise(by, 16) }}>
          <span style={text(30, 600, "rgba(255,255,255,0.8)", { letterSpacing: 2 })}>uma solução</span>
          <WispotLogo width={170} />
        </div>
        <div style={{ marginTop: 44, ...text(44, 700, "#fff", { textAlign: "center", lineHeight: 1.25 }), ...rise(line, 20) }}>
          {c.tagline}
        </div>
      </AbsoluteFill>
    </NavyBg>
  );
};

/* 3 · celular no estúdio ------------------------------------------------- */

const PHONE_SCALE = 0.72;

const PhoneScene: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const enter = usePop(0.1);
  const { Screen, Side } = c.phone;
  return (
    <StudioBg>
      <Phone
        left={260}
        top={92}
        scale={PHONE_SCALE}
        screen={c.phone.screenBg ?? "#fff"}
        darkStatus={c.phone.darkStatus ?? true}
        style={{ opacity: enter, transform: `scale(${PHONE_SCALE}) translateY(${interpolate(enter, [0, 1], [60, 0])}px)` }}
      >
        <Screen />
      </Phone>
      <Side />
      <Caption lines={c.phone.caption} />
    </StudioBg>
  );
};

/* 4 · painel de controle ------------------------------------------------- */

const PanelScene: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const enter = usePop(0.1);
  const { Screen, Panel } = c.panel;
  return (
    <StudioBg>
      <Phone
        left={150}
        top={92}
        scale={PHONE_SCALE}
        screen={c.panel.screenBg ?? "#fff"}
        style={{ opacity: enter, transform: `scale(${PHONE_SCALE}) translateY(${interpolate(enter, [0, 1], [60, 0])}px)` }}
      >
        <Screen />
      </Phone>
      <Panel />
      <Caption lines={c.panel.caption} />
    </StudioBg>
  );
};

/* 5 · notebook ----------------------------------------------------------- */

const LAPTOP = { left: 310, top: 70, width: 1300 };

const LaptopScene: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const enter = usePop(0.1);
  const { Screen } = c.laptop;
  return (
    <NavyBg>
      <Laptop {...LAPTOP} style={{ opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [80, 0])}px)` }}>
        <Screen />
      </Laptop>
      <Caption lines={c.laptop.caption} />
    </NavyBg>
  );
};

/* 6 · recursos ------------------------------------------------------------ */

const Tiles: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const { fps } = useVideoConfig();
  const { Screen } = c.laptop;
  const head = usePop(0.2);
  return (
    <NavyBg>
      {/* o mesmo painel da cena anterior, parado no fim e desfocado */}
      <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.06)" }}>
        <Laptop {...LAPTOP}>
          <Freeze frame={Math.round(SECONDS.laptop * fps) - 1}>
            <Screen />
          </Freeze>
        </Laptop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(7,30,72,0.62)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...text(46, 900, "#fff", { letterSpacing: 4 }), ...rise(head, 20) }}>O QUE O {c.name.toUpperCase()} OFERECE</div>
        <div style={{ marginTop: 70, display: "flex", gap: 90 }}>
          {c.tiles.map((tile, i) => (
            <FeatureTile key={tile.label} icon={tile.icon} label={tile.label} at={0.5 + i * 0.3} color={c.accent} />
          ))}
        </div>
      </AbsoluteFill>
    </NavyBg>
  );
};

/* 7 · fechamento ------------------------------------------------------------ */

const Outro: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const phone = usePop(0.1);
  const logo = usePop(0.4);
  const url = usePop(1.8);
  const { OutroScreen } = c;
  const s = 0.66;
  return (
    <NavyBg>
      <Phone
        left={330}
        top={150}
        scale={s}
        frame="#F4F6F8"
        style={{ opacity: phone, transform: `scale(${s}) translateY(${interpolate(phone, [0, 1], [80, 0])}px)` }}
      >
        <OutroScreen />
      </Phone>
      <div style={{ position: "absolute", left: 860, top: 200, width: 960 }}>
        <div style={rise(logo, 20)}>
          <ProductLogo id={c.logo} white height={c.logo === "sending" ? 150 : 110} />
        </div>
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 44 }}>
          {c.bullets.map((b, i) => (
            <Bullet key={b.title} icon={b.icon} title={b.title} text={b.text} at={0.8 + i * 0.4} />
          ))}
        </div>
        <div style={{ marginTop: 56, ...rise(url, 16) }}>
          <div style={{ width: 70, height: 5, borderRadius: 9, background: "#fff" }} />
          <div style={{ marginTop: 26, ...text(36, 800, "#fff", { letterSpacing: 6 }) }}>WWW.WISPOT.COM.BR</div>
        </div>
      </div>
    </NavyBg>
  );
};

/* 8 · cartão final ----------------------------------------------------------- */

const Final: React.FC<{ c: ExplainerConfig }> = ({ c }) => {
  const logo = usePop(0.15);
  const line = usePop(0.6);
  return (
    <NavyBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples size={1000} opacity={0.14} speed={0.3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.9, 1])})` }}>
          <WispotLogo width={560} />
        </div>
        <div style={{ marginTop: 40, ...text(34, 700, "#fff", { letterSpacing: 6 }), ...rise(line, 16) }}>
          INTERAÇÃO E EXPERIÊNCIA EM WI-FI
        </div>
        <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 22, ...rise(line, 16) }}>
          <span style={text(26, 600, "rgba(255,255,255,0.75)", { letterSpacing: 2 })}>conheça o</span>
          <ProductLogo id={c.logo} white height={c.logo === "sending" ? 90 : 64} />
        </div>
      </AbsoluteFill>
    </NavyBg>
  );
};
