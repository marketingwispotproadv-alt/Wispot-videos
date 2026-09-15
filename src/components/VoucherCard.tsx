import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Img, staticFile } from "remotion";
import { COLORS, FONT_FAMILY, SAFE_X } from "../brand";

const Row: React.FC<{
  label: string;
  value: string;
  /** quando a linha entra na tela, junto com o card */
  enterAt: number;
  /** quando a locução cita este item e a linha acende */
  activeAt: number;
}> = ({ label, value, enterAt, activeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - Math.round(enterAt * fps),
    fps,
    config: { damping: 200, mass: 0.6 },
    durationInFrames: 12,
  });
  // a linha nasce apagada e acende quando é citada, ficando acesa depois
  const on = interpolate(frame - Math.round(activeAt * fps), [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "26px 32px",
        borderRadius: 22,
        background: `rgba(37,168,224,${0.03 + on * 0.11})`,
        border: `2px solid rgba(37,168,224,${0.14 + on * 0.5})`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 36,
          color: COLORS.gray,
          opacity: 0.55 + on * 0.45,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 38,
          color: on > 0.5 ? COLORS.blueDeep : "rgba(81,77,75,0.4)",
        }}
      >
        {value}
      </span>
    </div>
  );
};

/** Mock do voucher do MyGuest, sincronizado com a locução da cena. */
export const VoucherCard: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(at * fps);
  const enter = spring({
    frame: frame - start,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 20,
  });
  if (frame < start - 2) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        top: 560,
        borderRadius: 44,
        overflow: "hidden",
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 36px 90px rgba(0,0,0,0.34)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [56, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
    >
      {/* o card já é branco, então o logo entra direto, sem placa */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "30px 36px",
          borderBottom: `3px solid rgba(37,168,224,0.28)`,
        }}
      >
        <Img
          src={staticFile("brand/myguest.png")}
          style={{ display: "block", width: 290 }}
        />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 1.6,
            color: COLORS.gray,
            opacity: 0.75,
          }}
        >
          VOUCHER DE ACESSO
        </span>
      </div>

      <div style={{ padding: "42px 36px 44px", display: "grid", gap: 20 }}>
        <div
          style={{
            border: `5px dashed ${COLORS.blue}`,
            borderRadius: 28,
            padding: "34px 0",
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 100,
            letterSpacing: 10,
            color: COLORS.blue,
          }}
        >
          WSP-7K42
        </div>
        <Row
          label="Quem entra"
          value="Visitante"
          enterAt={at + 0.35}
          activeAt={at + 1.35}
        />
        <Row
          label="Permissão"
          value="Navegação básica"
          enterAt={at + 0.5}
          activeAt={at + 3.5}
        />
        <Row
          label="Validade"
          value="4 horas"
          enterAt={at + 0.65}
          activeAt={at + 4.4}
        />
      </div>
    </div>
  );
};
