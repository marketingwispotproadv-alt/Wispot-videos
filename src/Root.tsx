import "./index.css";
import { Composition } from "remotion";
import { VIDEO } from "./brand";
import { MyGuest, totalFrames } from "./MyGuest";
import { EndCard } from "./components/EndCard";
import { proadvancedFirewall } from "./pieces/proadvancedFirewall";
import { proadvancedFirewallRef } from "./pieces/proadvancedFirewallRef";
import { BrandProvider } from "./template/BrandContext";
import { EndCard as PieceEndCard } from "./template/components/EndCard";
import { Piece } from "./template/Piece";
import { resolveStyle } from "./template/style";
import { totalFrames as pieceFrames } from "./template/timing";

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

      {/* Peças montadas com o template de `src/template`.
          Render: npx remotion render ProAdvancedFirewall out/proadvanced.mp4 */}
      <Composition
        id={proadvancedFirewall.id}
        component={Piece}
        defaultProps={{ config: proadvancedFirewall }}
        durationInFrames={pieceFrames(
          proadvancedFirewall.scenes,
          proadvancedFirewall.endCard.seconds,
          VIDEO.fps,
          resolveStyle(proadvancedFirewall.style),
        )}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Mesmo corte, no estilo do vídeo de referência em `public/ref`. */}
      <Composition
        id={proadvancedFirewallRef.id}
        component={Piece}
        defaultProps={{ config: proadvancedFirewallRef }}
        durationInFrames={pieceFrames(
          proadvancedFirewallRef.scenes,
          proadvancedFirewallRef.endCard.seconds,
          VIDEO.fps,
          resolveStyle(proadvancedFirewallRef.style),
        )}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Cartão final isolado, para reaproveitar em outras peças. */}
      <Composition
        id={`${proadvancedFirewall.id}CartaoFinal`}
        component={() => (
          <BrandProvider brand={proadvancedFirewall.brand}>
            <PieceEndCard config={proadvancedFirewall.endCard} />
          </BrandProvider>
        )}
        durationInFrames={Math.round(
          VIDEO.fps * proadvancedFirewall.endCard.seconds,
        )}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
