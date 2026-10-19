import React from "react";
import { FONT_FAMILY } from "../brand";
import { MyGuestLogo } from "../components/MyGuestLogo";
import { INK } from "./kit";

export type ProductId = "horaPremiada" | "myguest" | "sending" | "wimap" | "wiquest";

export type Product = {
  id: ProductId;
  name: string;
  /** cor de destaque do produto, a mesma das artes de celular do Drive */
  accent: string;
  /** cor de texto sobre o destaque */
  onAccent: string;
};

/**
 * Cores de destaque por produto. Hora Premiada, MyGuest, Wimap e Wiquest
 * seguem as artes de celular da pasta "Celular" do Drive; o Sending usa o
 * amarelo do próprio painel dele, porque o azul da arte se confunde com o
 * azul institucional da Wispot.
 */
export const PRODUCTS: Record<ProductId, Product> = {
  horaPremiada: { id: "horaPremiada", name: "Hora Premiada", accent: "#1E9B4B", onAccent: "#FFFFFF" },
  myguest: { id: "myguest", name: "MyGuest", accent: "#C8203F", onAccent: "#FFFFFF" },
  sending: { id: "sending", name: "Sending", accent: "#F2A900", onAccent: "#2B2100" },
  wimap: { id: "wimap", name: "Wimap", accent: "#7B3FD0", onAccent: "#FFFFFF" },
  wiquest: { id: "wiquest", name: "Wiquest", accent: "#F26B1D", onAccent: "#FFFFFF" },
};

/** Ícone de cada produto, desenhado em linha branca para ir sobre o destaque. */
export const ProductGlyph: React.FC<{ id: ProductId; size: number; color?: string }> = ({
  id,
  size,
  color = "#fff",
}) => {
  const s = { fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {id === "horaPremiada" && (
        <>
          <circle cx={12} cy={13} r={7.5} {...s} />
          <path d="M12 9.5 V13 L14.6 14.6" {...s} />
          <path d="M5 5.5 L7.5 3.5 M19 5.5 L16.5 3.5" {...s} />
        </>
      )}
      {id === "myguest" && (
        <>
          <rect x={4} y={10.5} width={16} height={10} rx={2.5} {...s} />
          <path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5" {...s} />
          <circle cx={12} cy={15.5} r={1.4} fill={color} />
        </>
      )}
      {id === "sending" && (
        <>
          <path d="M3.5 11.2 L20.5 3.8 L15.5 20.2 L11.4 13 Z" {...s} />
          <path d="M11.4 13 L20.5 3.8" {...s} />
        </>
      )}
      {id === "wimap" && (
        <>
          <path d="M12 21 C12 21 5.5 14.6 5.5 9.6 A6.5 6.5 0 0 1 18.5 9.6 C18.5 14.6 12 21 12 21 Z" {...s} />
          <circle cx={12} cy={9.6} r={2.4} {...s} />
        </>
      )}
      {id === "wiquest" && (
        <>
          <path d="M4 5.5 A2.5 2.5 0 0 1 6.5 3 H17.5 A2.5 2.5 0 0 1 20 5.5 V13.5 A2.5 2.5 0 0 1 17.5 16 H10 L5.5 20 V16 A1.5 1.5 0 0 1 4 14.5 Z" {...s} />
          <path d="M10 7.6 A2 2 0 1 1 12.6 9.5 C12 9.8 12 10.3 12 11" {...s} />
          <circle cx={12} cy={13.1} r={0.9} fill={color} />
        </>
      )}
    </svg>
  );
};

/** Ícone do produto em azulejo com a cor de destaque. */
export const ProductTile: React.FC<{ product: Product; size: number }> = ({ product, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: product.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 ${size * 0.12}px ${size * 0.3}px ${product.accent}55`,
      flexShrink: 0,
    }}
  >
    <ProductGlyph id={product.id} size={size * 0.62} color={product.onAccent} />
  </div>
);

/**
 * Marca do produto sobre placa branca. O MyGuest tem logo próprio; os demais
 * não têm arquivo de logo no projeto, então usam o ícone + o nome em
 * Montserrat — troque aqui quando chegarem os logos em vetor.
 */
export const ProductMark: React.FC<{ product: Product; scale?: number }> = ({
  product,
  scale = 1,
}) => {
  if (product.id === "myguest") return <MyGuestLogo width={520 * scale} />;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 30 * scale,
        padding: `${40 * scale}px ${56 * scale}px`,
        borderRadius: 44 * scale,
        background: "#fff",
        boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
      }}
    >
      <ProductTile product={product} size={120 * scale} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 92 * scale,
          letterSpacing: -2.5 * scale,
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        {product.name}
      </span>
    </div>
  );
};
