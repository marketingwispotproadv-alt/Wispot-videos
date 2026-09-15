import "./index.css";
import { Composition } from "remotion";
import { VIDEO } from "./brand";
import { MyGuest, totalFrames } from "./MyGuest";
import { EndCard } from "./components/EndCard";
import {
  ProAdvanced,
  totalFrames as proAdvancedFrames,
} from "./proadv/ProAdvanced";
import { EndCard as ProAdvancedEndCard } from "./proadv/components/EndCard";

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

      {/* Cartão final isolado, para reaproveitar em outras peças. */}
      <Composition
        id="CartaoFinal"
        component={EndCard}
        durationInFrames={Math.round(VIDEO.fps * 3.6)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Firewall gerenciado — ProAdvanced, vertical 9:16.
          Render: npx remotion render ProAdvanced out/proadvanced.mp4 */}
      <Composition
        id="ProAdvanced"
        component={ProAdvanced}
        durationInFrames={proAdvancedFrames(VIDEO.fps)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      <Composition
        id="ProAdvancedCartaoFinal"
        component={ProAdvancedEndCard}
        durationInFrames={Math.round(VIDEO.fps * 4)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
