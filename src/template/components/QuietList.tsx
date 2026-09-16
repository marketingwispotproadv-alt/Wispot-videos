import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { useStyle } from "../StyleContext";
import { SAFE_X } from "../layout";
import type { RuleItem } from "../types";

/**
 * Lista que se acumula sem cromo em volta.
 *
 * A versão de fichas tem plaquinha, ícone e sombra; aqui só há texto, no mesmo
 * idioma tipográfico da legenda, com um fio na cor da marca à esquerda. O item
 * que acabou de entrar fica cheio e os anteriores recuam para 38% — é o recuo
 * que conta a história, porque a lista cresce enquanto o problema cresce.
 */
export const QuietList: React.FC<{ items: RuleItem[]; top?: number }> = ({
  items,
  top = 1180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, fontFamily } = useBrand();
  const { captions } = useStyle();

  const shown = items.filter(
    (i) => i.at === undefined || frame >= Math.round(i.at * fps),
  );
  const newest = shown.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: SAFE_X,
        right: SAFE_X,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {shown.map((item, i) => {
        const enter =
          item.at === undefined
            ? 1
            : spring({
                frame: frame - Math.round(item.at * fps),
                fps,
                config: { damping: 200, mass: 0.5 },
                durationInFrames: 12,
              });
        const faded = i === newest ? 1 : 0.38;
        return (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: enter * faded,
              transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
            }}
          >
            <span
              style={{
                width: 5,
                height: 40,
                borderRadius: 999,
                background: colors.primaryLight,
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 52,
                lineHeight: 1.1,
                letterSpacing: -0.5,
                color: colors.white,
                textTransform: captions.lowercase ? "lowercase" : undefined,
                textShadow: "0 4px 18px rgba(0,0,0,0.6)",
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
