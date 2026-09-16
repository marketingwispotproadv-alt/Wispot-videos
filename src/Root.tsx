import "./index.css";
import { Composition } from "remotion";
import { VIDEO } from "./brand";
import { Capa } from "./Capa";
import { MyGuest, totalFrames } from "./MyGuest";
import { EndCard } from "./components/EndCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vídeo institucional MyGuest — vertical 9:16 para redes sociais.
          Render: npx remotion render MyGuest out/myguest.mp4 */}
      <Composition
        id="MyGuest"
        component={MyGuest}
        durationInFrames={totalFrames(VIDEO.fps)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Capa do post. Render: npx remotion still Capa out/capa/capa.png */}
      <Composition
        id="Capa"
        component={Capa}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Cartão final isolado, para reaproveitar em outras peças. */}
      <Composition
        id="CartaoFinal"
        component={EndCard}
        durationInFrames={Math.round(VIDEO.fps * 3.6)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
