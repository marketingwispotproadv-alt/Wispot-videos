import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../BrandContext";
import { SAFE_X } from "../layout";
import type { NewsImage } from "../types";

/**
 * Recorte de notícia, numa placa branca que sobe do pé da tela.
 *
 * Existe para o bloco em que a locução cita um caso: dizer "um caso recente no
 * Brasil" é uma coisa, mostrar a manchete é outra. A placa é branca e o resto
 * da peça é escuro, então ela chama o olho sozinha, sem precisar de cromo.
 *
 * O recorte entra como imagem, e não como texto remontado: manchete redigitada
 * vira texto nosso: perde o crédito e passa a soar como afirmação da marca.
 * Em imagem continua sendo o que é — o que o veículo publicou.
 *
 * Por isso também a linha de fonte embaixo. Ela não é enfeite: é o crédito, e
 * é o que separa citar de se apropriar.
 *
 * Nas cenas em que a placa está em cena a legenda sai (`hideCaptions` no
 * overlay). A manchete já é texto, e texto contra texto na mesma tela faz quem
 * assiste não ler nenhum dos dois — a mesma regra das bolinhas.
 */
export const NewsCard: React.FC<{ image: NewsImage; top?: number }> = ({
  image,
  top = 1040,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, fontFamily } = useBrand();

  const at = image.at ?? 0;
  const enter = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: 14,
  });
  if (enter <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: SAFE_X,
        right: SAFE_X,
        padding: "26px 28px 20px",
        borderRadius: 28,
        background: colors.white,
        boxShadow: "0 26px 70px rgba(0, 0, 0, 0.45)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        transformOrigin: "center bottom",
      }}
    >
      <Img
        src={staticFile(image.src)}
        style={{ width: "100%", display: "block" }}
      />
      {image.source ? (
        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: `2px solid ${colors.primary}33`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily,
            fontSize: 26,
            fontWeight: 600,
            color: colors.neutral,
            letterSpacing: 0.2,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: colors.primary,
            }}
          />
          {image.source}
        </div>
      ) : null}
    </div>
  );
};
