import "./index.css";
import { Composition } from "remotion";
import { VIDEO } from "./brand";
import { Capa } from "./Capa";
import { MyGuest, totalFrames } from "./MyGuest";
import { EndCard } from "./components/EndCard";
import { DemoConfig, DemoVideo, demoFrames } from "./demos/DemoVideo";
import { horaPremiadaConfig } from "./demos/HoraPremiada";
import { myGuestConfig } from "./demos/MyGuestDemo";
import { sendingConfig } from "./demos/Sending";
import { wimapConfig } from "./demos/Wimap";
import { wiquestConfig } from "./demos/Wiquest";

/** Demos animadas de cada ferramenta, na ordem do menu do site. */
const DEMOS = [
  { id: "DemoHoraPremiada", config: horaPremiadaConfig },
  { id: "DemoMyGuest", config: myGuestConfig },
  { id: "DemoSending", config: sendingConfig },
  { id: "DemoWimap", config: wimapConfig },
  { id: "DemoWiquest", config: wiquestConfig },
  // a config leva os componentes das cenas, que não passam por props
  // serializáveis — por isso cada demo vira um componente próprio
].map((d: { id: string; config: DemoConfig }) => ({ ...d, component: () => <DemoVideo config={d.config} /> }));

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

      {/* Demos animadas das ferramentas — vertical 9:16, sem locução.
          Render: npx remotion render DemoHoraPremiada out/demos/hora-premiada.mp4 */}
      {DEMOS.map((d) => (
        <Composition
          key={d.id}
          id={d.id}
          component={d.component}
          durationInFrames={demoFrames(d.config, VIDEO.fps)}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}
    </>
  );
};
