import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";

/**
 * <image> dentro de um SVG. Diferente do <Img> do Remotion, o <image> do SVG
 * não segura o quadro até a imagem carregar, então este componente segura:
 * o quadro só é capturado depois que a imagem está decodificada.
 */
export const SvgImg: React.FC<{ href: string; x: number; y: number; width: number; height: number }> = ({ href, x, y, width, height }) => {
  const [handle] = useState(() => delayRender(`imagem ${href}`));
  useEffect(() => {
    const img = new Image();
    img.src = href;
    img
      .decode()
      .catch(() => undefined)
      .then(() => continueRender(handle));
  }, [href, handle]);
  return <image href={href} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid meet" />;
};
