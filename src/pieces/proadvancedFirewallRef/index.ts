import { PROADVANCED } from "../../brands/proadvanced";
import { LEGENDA_GRANDE } from "../../template/style";
import type { Overlay, PieceConfig } from "../../template/types";
import { SCENES } from "../proadvancedFirewall/scenes";

/**
 * Um gráfico só na peça inteira, e no único lugar em que ele **explica** em
 * vez de enfeitar: o bloco em que o roteiro enumera o que envelhece. Nas
 * outras treze cenas a legenda dá conta sozinha.
 *
 * Os tempos são os da cena como ela está no `scenes.ts`; o template leva para
 * a linha do tempo final, já descontado o silêncio aparado e a aceleração.
 */
const OVERLAYS: Record<string, Overlay> = {
  "8421": { items: [{ text: "Porta aberta", at: 1.5 }] },
  "8424": {
    items: [
      { text: "Porta aberta" },
      { text: "Acesso antigo", at: 0.72 },
      { text: "Configuração desatualizada", at: 1.54 },
    ],
  },
  "8426": {
    items: [
      { text: "Porta aberta" },
      { text: "Acesso antigo" },
      { text: "Configuração desatualizada" },
    ],
  },
};

/**
 * Mesmo roteiro e mesmos cortes da peça original, no estilo medido do vídeo de
 * referência em `public/ref`: legenda grande no topo, caixa baixa, corte seco e
 * quase nada de cromo em volta.
 */
export const proadvancedFirewallRef: PieceConfig = {
  id: "ProAdvancedFirewallRef",
  brand: PROADVANCED,
  clipsDir: "proadv/clips",
  scenes: SCENES,
  overlays: OVERLAYS,
  // Os quatro pontos em que o roteiro vira: da abertura para a explicação, da
  // explicação para o problema, do problema para a ProAdvanced, e daí para o
  // fecho. Nos outros onze cortes, corte seco e nada mais.
  flashBefore: ["8415", "8420", "8427", "8435"],
  endCard: {
    tagline: ["Firewall gerenciado,", "proteção atualizada todo dia."],
    callToAction: "proadvanced.com.br",
    seconds: 4,
  },
  music: { src: "proadv/audio/trilha.mp3" },
  style: {
    ...LEGENDA_GRANDE,
    // Entra durante "Fale com a Pro Advanced", que é onde o roteiro chama.
    cta: { text: "Fale com a gente", at: 52.5 },
  },
};
