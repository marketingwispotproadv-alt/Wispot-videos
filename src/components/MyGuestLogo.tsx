import React from "react";
import { Img, staticFile } from "remotion";

/**
 * Logo do MyGuest sobre placa branca.
 *
 * A placa não é enfeite: o quadrado azul do logo é quase o mesmo azul
 * institucional da Wispot, e solto sobre o degradê ele some. O material de
 * origem também é JPEG de fundo branco — recortado, sobra franja de compressão
 * nas bordas, que contra branco desaparece.
 */
export const MyGuestLogo: React.FC<{
  /** largura do logo em si, sem a placa */
  width: number;
  /** espaço entre o logo e a borda da placa */
  padding?: number;
  style?: React.CSSProperties;
}> = ({ width, padding = 46, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${padding}px ${padding * 1.15}px`,
      borderRadius: padding * 0.9,
      background: "#FFFFFF",
      boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
      ...style,
    }}
  >
    <Img
      src={staticFile("brand/myguest.png")}
      style={{ display: "block", width }}
    />
  </div>
);
