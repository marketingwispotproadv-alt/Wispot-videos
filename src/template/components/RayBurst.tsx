import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

/**
 * O símbolo da ProAdvanced é um cadeado cercado de raios. Aqui os raios viram
 * fundo: giram devagar atrás do conteúdo, para a tela de marca ter movimento
 * sem disputar atenção com a legenda.
 */
export const RayBurst: React.FC<{
  size?: number;
  opacity?: number;
  /** voltas por minuto */
  speed?: number;
  rays?: number;
}> = ({ size = 1400, opacity = 0.16, speed = 1.1, rays = 28 }) => {
  const frame = useCurrentFrame();
  const angle = (frame / 30) * (speed * 6);

  const spokes = useMemo(
    () =>
      Array.from({ length: rays }, (_, i) => ({
        rot: (360 / rays) * i,
        // comprimentos alternados, como no símbolo
        len: i % 3 === 0 ? 0.3 : i % 3 === 1 ? 0.19 : 0.24,
        thick: i % 3 === 0 ? 26 : 18,
      })),
    [rays],
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `rotate(${angle}deg)`,
        opacity,
      }}
    >
      {spokes.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: s.thick,
            height: size * s.len,
            marginLeft: -s.thick / 2,
            borderRadius: 999,
            background: "#FFFFFF",
            transformOrigin: "50% 0",
            transform: `rotate(${s.rot}deg) translateY(${size * 0.17}px)`,
          }}
        />
      ))}
    </div>
  );
};
