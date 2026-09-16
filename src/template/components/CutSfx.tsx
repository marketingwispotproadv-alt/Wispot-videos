import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

export type SfxConfig = {
  /** caminho em `public/` */
  src: string;
  volume?: number;
  /**
   * Onde está o pico do arquivo, em segundos. O som entra adiantado desse
   * tanto para o pico cair exatamente no quadro do corte — um efeito de
   * transição que começa no corte chega tarde ao ouvido.
   */
  peakAt?: number;
  /** duração do arquivo, em segundos */
  length?: number;
};

/** Efeito curto em cada corte, um por cena. */
export const CutSfx: React.FC<{ cuts: number[]; config: SfxConfig }> = ({
  cuts,
  config,
}) => {
  const { fps } = useVideoConfig();
  const { src, volume = 0.3, peakAt = 0.12, length = 0.34 } = config;
  const lead = Math.round(peakAt * fps);
  const frames = Math.ceil(length * fps) + 1;

  return (
    <>
      {cuts.map((cut) => (
        <Sequence
          key={cut}
          from={Math.max(0, cut - lead)}
          durationInFrames={frames}
          name={`Efeito · corte ${cut}`}
        >
          <Audio src={staticFile(src)} volume={volume} />
        </Sequence>
      ))}
    </>
  );
};
