import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { SAFE_X } from "../layout";
import type { RuleItem } from "../types";

/**
 * Lista que sobe pela parte de baixo da tela, uma bolinha por item.
 *
 * As outras duas listas do template são estáticas: a ficha aparece no lugar
 * onde vai ficar. Aqui o item entra **por baixo da borda** e sobe até o seu
 * lugar, e os que já estão em cena são empurrados para cima — a lista é
 * ancorada pelo pé, então crescer para cima sai de graça do próprio layout.
 *
 * Serve o bloco em que o roteiro enumera: enquanto a voz lista uma exigência
 * atrás da outra, a tela vai juntando as bolinhas, e no fim do bloco a lista
 * inteira está lá para ser lida de uma vez. Nesse bloco a legenda sai de cena
 * (`hideCaptions` no overlay), senão os dois textos disputam a mesma leitura.
 */
export const BubbleList: React.FC<{ items: RuleItem[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, gradient, fontFamily } = useBrand();

  const shown = items.filter(
    (i) => i.at === undefined || frame >= Math.round(i.at * fps),
  );
  const newest = shown.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: SAFE_X,
        right: SAFE_X,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      {shown.map((item, i) => {
        const at = item.at === undefined ? 0 : Math.round(item.at * fps);
        // Sem `at` a bolinha veio do take anterior: já está em cena e não
        // reanima no corte, senão a lista inteira pula a cada emenda.
        const enter =
          item.at === undefined
            ? 1
            : spring({
                frame: frame - at,
                fps,
                config: { damping: 14, mass: 0.7, stiffness: 120 },
                durationInFrames: 22,
              });

        // Balanço lento depois de assentar. Amplitude de três pixels: o
        // suficiente para a bolinha não parecer colada na tela, e pouco demais
        // para alguém reparar que há uma animação rodando.
        const bob = Math.sin((frame - at) / fps + i * 1.7) * 3 * enter;

        return (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 36px",
              borderRadius: 999,
              background: gradient,
              boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 0 2px ${colors.primaryLight}33`,
              opacity: enter * (i === newest ? 1 : 0.7),
              transform: [
                `translateY(${(interpolate(enter, [0, 1], [130, 0]) + bob).toFixed(2)}px)`,
                `scale(${interpolate(enter, [0, 1], [0.86, 1]).toFixed(3)})`,
              ].join(" "),
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: colors.white,
                opacity: 0.9,
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily,
                fontWeight: 700,
                // A bolinha é de uma linha só (`whiteSpace: nowrap`), então o
                // corpo tem teto: medida no quadro renderizado, a maior da peça
                // — "Backups protegidos e testados" — vai de x=78 a x=882, e a
                // margem útil termina em 1004. Sobram 122 px. Corpo muito maior
                // faz o texto passar da borda em vez de quebrar.
                fontSize: 48,
                lineHeight: 1.1,
                letterSpacing: -0.3,
                color: colors.white,
                whiteSpace: "nowrap",
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
