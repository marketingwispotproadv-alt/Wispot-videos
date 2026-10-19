import React from "react";
import { Img, staticFile } from "remotion";

export type ProductId = "horaPremiada" | "myguest" | "sending" | "wimap" | "wiquest";

export type Product = {
  id: ProductId;
  name: string;
  /** cor de destaque do produto, tirada do logo oficial */
  accent: string;
  /** cor de texto sobre o destaque */
  onAccent: string;
};

/**
 * Cores de destaque por produto, tiradas dos logos oficiais. O verde do Hora
 * Premiada desce um tom (o do logo é #89C831) para o texto branco ler bem; o
 * Sending fica no amarelo do "ing", com texto escuro por cima.
 */
export const PRODUCTS: Record<ProductId, Product> = {
  horaPremiada: { id: "horaPremiada", name: "Hora Premiada", accent: "#6DAA1F", onAccent: "#FFFFFF" },
  myguest: { id: "myguest", name: "MyGuest", accent: "#C42627", onAccent: "#FFFFFF" },
  sending: { id: "sending", name: "Sending", accent: "#F2A900", onAccent: "#2B2100" },
  wimap: { id: "wimap", name: "Wimap", accent: "#941F91", onAccent: "#FFFFFF" },
  wiquest: { id: "wiquest", name: "Wiquest", accent: "#F46904", onAccent: "#FFFFFF" },
};

/** arquivo do logo em public/brand/products */
export const LOGO_FILE: Record<ProductId, string> = {
  horaPremiada: "hora-premiada",
  myguest: "myguest",
  sending: "sending",
  wimap: "wimap",
  wiquest: "wiquest",
};

/** altura do logo para ocupar a mesma largura visual (o do Sending é mais alto) */
const LOGO_HEIGHT: Record<ProductId, number> = {
  horaPremiada: 150,
  myguest: 200,
  sending: 230,
  wimap: 170,
  wiquest: 160,
};

export const ProductLogoImg: React.FC<{ product: Product; height: number }> = ({ product, height }) => (
  <Img src={staticFile(`brand/products/${LOGO_FILE[product.id]}.png`)} style={{ height, display: "block" }} />
);

/** Logo oficial do produto sobre placa branca. */
export const ProductMark: React.FC<{ product: Product; scale?: number }> = ({ product, scale = 1 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${40 * scale}px ${56 * scale}px`,
      borderRadius: 44 * scale,
      background: "#fff",
      boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
    }}
  >
    <ProductLogoImg product={product} height={LOGO_HEIGHT[product.id] * scale} />
  </div>
);
