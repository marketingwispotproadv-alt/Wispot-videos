import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type BlurWhipProps = {
  /** desfoque máximo, no meio da emenda (px) */
  maxBlur?: number;
  /** quanto a cena amplia durante a emenda (0.1 = 10%) */
  zoom?: number;
};

/**
 * Emenda em borrão, para cortar entre dois planos de enquadramento quase igual.
 * As duas cenas se cruzam, mas com desfoque suficiente para virarem rastro em
 * vez de dois rostos sobrepostos — que é o que estraga um fade nesse caso.
 *
 * As cenas entram e saem ampliadas para o desfoque não deixar borda transparente
 * nos cantos.
 */
const BlurWhipPresentation: React.FC<
  TransitionPresentationComponentProps<BlurWhipProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const maxBlur = passedProps.maxBlur ?? 42;
  const zoom = passedProps.zoom ?? 0.1;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  const style = useMemo((): React.CSSProperties => {
    // quem entra chega borrado e vai limpando; quem sai faz o caminho inverso
    const amount = entering ? 1 - p : p;
    return {
      filter: `blur(${(maxBlur * amount).toFixed(2)}px)`,
      transform: `scale(${1 + zoom * amount})`,
      opacity: entering ? p : 1 - p,
    };
  }, [entering, p, maxBlur, zoom]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const blurWhip = (
  props: BlurWhipProps = {},
): TransitionPresentation<BlurWhipProps> => ({
  component: BlurWhipPresentation,
  props,
});
