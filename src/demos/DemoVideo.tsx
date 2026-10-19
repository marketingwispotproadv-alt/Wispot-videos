import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import "../fonts";
import { COLORS, FONT_FAMILY, GRADIENT, SAFE_X } from "../brand";
import { EndCard } from "../components/EndCard";
import { MusicBed } from "../components/MusicBed";
import { Ripples } from "../components/Ripples";
import { DemoBackdrop, INK, MUTED, ramp, rise, useT, usePop } from "./kit";
import { Product, ProductLogoImg, ProductMark } from "./ProductMark";

/**
 * Esqueleto comum das demos: abertura com a marca do produto, um passo por
 * cena mostrando a plataforma em uso, os benefícios e o cartão final.
 */

export type Step = {
  title: string;
  subtitle: string;
  /** duração da cena em segundos (já contando a emenda de entrada) */
  seconds: number;
  Scene: React.FC<{ product: Product }>;
};

export type DemoConfig = {
  product: Product;
  tagline: React.ReactNode;
  steps: Step[];
  benefits: { title: string; text: string }[];
  endLine: React.ReactNode;
};

export const INTRO_SECONDS = 3.2;
export const BENEFITS_SECONDS = 4.6;
export const END_SECONDS = 3.6;
const T = 15;

const sceneSeconds = (c: DemoConfig) => [
  INTRO_SECONDS,
  ...c.steps.map((s) => s.seconds),
  BENEFITS_SECONDS,
  END_SECONDS,
];

export const demoFrames = (c: DemoConfig, fps: number) =>
  sceneSeconds(c).reduce((a, s) => a + Math.round(s * fps), 0) -
  (sceneSeconds(c).length - 1) * T;

export const DemoVideo: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const { fps } = useVideoConfig();
  const { product, steps } = config;
  const total = demoFrames(config, fps);

  const children: React.ReactNode[] = [];
  const push = (key: string, seconds: number, node: React.ReactNode) => {
    if (children.length) {
      children.push(
        <TransitionSeries.Transition
          key={`${key}-t`}
          presentation={key === "end" ? fade() : slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence key={key} durationInFrames={Math.round(seconds * fps)}>
        {node}
      </TransitionSeries.Sequence>,
    );
  };

  push("intro", INTRO_SECONDS, <Intro config={config} />);
  steps.forEach((s, i) =>
    push(
      `step${i}`,
      s.seconds,
      <AbsoluteFill>
        <StepHeader n={i + 1} title={s.title} subtitle={s.subtitle} product={product} />
        <s.Scene product={product} />
      </AbsoluteFill>,
    ),
  );
  push("benefits", BENEFITS_SECONDS, <Benefits config={config} />);
  push(
    "end",
    END_SECONDS,
    <EndCard product={<ProductMark product={product} scale={0.72} />} line={config.endLine} />,
  );

  return (
    <AbsoluteFill style={{ background: "#EEF3F8" }}>
      <DemoBackdrop accent={product.accent} />
      <TopBar product={product} />
      <TransitionSeries>{children}</TransitionSeries>
      <MusicBed
        totalFrames={total}
        endCardFrom={total - Math.round(END_SECONDS * fps)}
        fps={fps}
        level={0.5}
      />
    </AbsoluteFill>
  );
};

/** Logo da Wispot e o produto, fixos no topo das cenas claras. */
const TopBar: React.FC<{ product: Product }> = ({ product }) => (
  <div
    style={{
      position: "absolute",
      top: 82,
      left: SAFE_X,
      right: SAFE_X,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Img src={staticFile("brand/logo-blue.png")} style={{ width: 200 }} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 28px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: "0 8px 24px rgba(16,30,54,0.10)",
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: 30,
        color: INK,
      }}
    >
      <ProductLogoImg product={product} height={product.id === "sending" ? 62 : 46} />
    </div>
  </div>
);

const StepHeader: React.FC<{
  n: number;
  title: string;
  subtitle: string;
  product: Product;
}> = ({ n, title, subtitle, product }) => {
  const a = usePop(0.25);
  const b = usePop(0.4);
  const c = usePop(0.55);
  return (
    <div style={{ position: "absolute", top: 210, left: SAFE_X, right: SAFE_X }}>
      <div
        style={{
          display: "inline-block",
          padding: "8px 22px",
          borderRadius: 999,
          background: product.accent,
          color: product.onAccent,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 3,
          ...rise(a, 20),
        }}
      >
        PASSO {n}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.05,
          letterSpacing: -2,
          color: INK,
          ...rise(b),
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.3,
          color: MUTED,
          ...rise(c),
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const Intro: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const logo = usePop(0.1);
  const mark = usePop(0.45, true);
  const line = usePop(0.95);
  return (
    <AbsoluteFill style={{ background: GRADIENT }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Ripples size={820} opacity={0.24} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: SAFE_X }}>
        <Img src={staticFile("brand/logo-white.png")} style={{ width: 230, ...rise(logo) }} />
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.8)",
            ...rise(logo),
          }}
        >
          APRESENTA
        </div>
        <div
          style={{
            marginTop: 70,
            opacity: Math.min(1, mark * 1.3),
            transform: `scale(${interpolate(mark, [0, 1], [0.7, 1])})`,
          }}
        >
          <ProductMark product={config.product} scale={0.8} />
        </div>
        <div
          style={{
            marginTop: 70,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.2,
            letterSpacing: -1,
            textAlign: "center",
            color: COLORS.white,
            textShadow: "0 6px 24px rgba(0,0,0,0.2)",
            ...rise(line),
          }}
        >
          {config.tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Benefits: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const { product } = config;
  const t = useT();
  const head = usePop(0.3);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: SAFE_X, right: SAFE_X }}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 5,
            color: product.id === "sending" ? "#9A6B00" : product.accent,
            ...rise(head, 20),
          }}
        >
          POR QUE USAR
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 80,
            letterSpacing: -2,
            color: INK,
            ...rise(head),
          }}
        >
          {product.name}?
        </div>
      </div>
      {config.benefits.map((b, i) => {
        const at = 0.7 + i * 0.35;
        const p = ramp(t, at, at + 0.5);
        return (
          <div
            key={b.title}
            style={{
              position: "absolute",
              left: SAFE_X,
              right: SAFE_X,
              top: 560 + i * 285,
              height: 250,
              borderRadius: 32,
              background: "#fff",
              boxShadow: "0 20px 50px rgba(16,30,54,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 44px",
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [120, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 30,
                background: product.accent,
                color: product.onAccent,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 46,
              }}
            >
              0{i + 1}
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 44,
                  letterSpacing: -0.5,
                  color: INK,
                }}
              >
                {b.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 31,
                  lineHeight: 1.3,
                  color: MUTED,
                }}
              >
                {b.text}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
