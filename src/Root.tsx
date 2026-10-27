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
import { ExplainerConfig, ExplainerVideo, explainerFrames } from "./explainers/ExplainerVideo";
import { horaPremiadaExplainer } from "./explainers/ExHoraPremiada";
import { myGuestExplainer } from "./explainers/ExMyGuest";
import { sendingExplainer } from "./explainers/ExSending";
import { wimapExplainer } from "./explainers/ExWimap";
import { wiquestExplainer } from "./explainers/ExWiquest";
import { beatFrames, NarratedVideo, StoryConfig, StoryVideo, storyFrames } from "./stories/story-kit";
import { PAINEL_BEATS } from "./painel/PainelWispot";
import { horaPremiadaStory } from "./stories/StoryHoraPremiada";
import { myGuestStory } from "./stories/StoryMyGuest";
import { sendingStory } from "./stories/StorySending";
import { wimapStory } from "./stories/StoryWimap";
import { wiquestStory } from "./stories/StoryWiquest";

/** Histórias 16:9: uma narrativa por ferramenta, mais rápidas, com 3D. */
const STORIES = [
  { id: "HistoriaHoraPremiada", config: horaPremiadaStory },
  { id: "HistoriaMyGuest", config: myGuestStory },
  { id: "HistoriaSending", config: sendingStory },
  { id: "HistoriaWimap", config: wimapStory },
  { id: "HistoriaWiquest", config: wiquestStory },
].map((d: { id: string; config: StoryConfig }) => ({
  ...d,
  component: () => <StoryVideo config={d.config} />,
}));

const PainelWispot = () => <NarratedVideo narration="painel" beats={PAINEL_BEATS} />;

/** Explainers 16:9 no estilo do institucional antigo da Wispot. */
const EXPLAINERS = [
  { id: "ExplainerHoraPremiada", config: horaPremiadaExplainer },
  { id: "ExplainerMyGuest", config: myGuestExplainer },
  { id: "ExplainerSending", config: sendingExplainer },
  { id: "ExplainerWimap", config: wimapExplainer },
  { id: "ExplainerWiquest", config: wiquestExplainer },
].map((d: { id: string; config: ExplainerConfig }) => ({
  ...d,
  component: () => <ExplainerVideo config={d.config} />,
}));

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
      {/* Explainers 16:9. Render: npx remotion render ExplainerWimap out/explainers/wimap.mp4 */}
      {EXPLAINERS.map((d) => (
        <Composition
          key={d.id}
          id={d.id}
          component={d.component}
          durationInFrames={explainerFrames(VIDEO.fps)}
          fps={VIDEO.fps}
          width={1920}
          height={1080}
        />
      ))}
      {/* Histórias. Render: npx remotion render HistoriaWimap out/historias/wimap.mp4 */}
      {STORIES.map((d) => (
        <Composition
          key={d.id}
          id={d.id}
          component={d.component}
          durationInFrames={storyFrames(d.config, VIDEO.fps)}
          fps={VIDEO.fps}
          width={1920}
          height={1080}
        />
      ))}
      {/* "Por dentro do painel Wispot": o vídeo do post de blog sobre gestão de conectividade */}
      <Composition
        id="PainelWispot"
        component={PainelWispot}
        durationInFrames={beatFrames(PAINEL_BEATS, VIDEO.fps)}
        fps={VIDEO.fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
