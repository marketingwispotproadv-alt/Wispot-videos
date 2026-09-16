import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import "./fonts";
import { COLORS, FONT_FAMILY, SAFE_X } from "./brand";
import { MyGuestLogo } from "./components/MyGuestLogo";
import { Watermark } from "./components/Watermark";

/**
 * Capa do post. Usa um frame do próprio material (8455, aos 0,6 s) em vez de uma
 * imagem à parte, para não duplicar asset.
 *
 * O texto fica no miolo vertical de propósito: no feed a capa é recortada em 4:5,
 * e o que estiver muito no pé some.
 */
export const Capa: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("clips/8455.mp4")}
      trimBefore={18}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />

    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.92) 100%)",
      }}
    />

    <Watermark />

    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        top: 1010,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "14px 28px",
          borderRadius: 999,
          background: COLORS.blue,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 3,
          color: COLORS.white,
        }}
      >
        CONTROLE DE ACESSO
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 1.06,
          letterSpacing: -3,
          color: COLORS.white,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        Todo mundo entra
        <br />
        na sua rede
        <br />
        <span style={{ color: COLORS.blue }}>do mesmo jeito?</span>
      </div>

      <div style={{ marginTop: 44 }}>
        <MyGuestLogo width={300} padding={26} />
      </div>
    </div>
  </AbsoluteFill>
);
