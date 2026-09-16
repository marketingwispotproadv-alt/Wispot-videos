import { PROADVANCED } from "../../brands/proadvanced";
import { LEGENDA_GRANDE } from "../../template/style";
import type { PieceConfig } from "../../template/types";
import { SCENES } from "../proadvancedFirewall/scenes";

/**
 * Mesmo roteiro e mesmos cortes da peça original, no estilo medido do vídeo de
 * referência em `public/ref`: legenda grande no topo, caixa baixa, corte seco e
 * nada de cromo em volta.
 *
 * Sem `overlays` de propósito. A referência não tem ficha, etiqueta nem logo em
 * cena — o único gráfico do vídeo inteiro é a legenda, e a pílula de chamada no
 * fim. Ligar as fichas aqui seria misturar os dois estilos.
 */
export const proadvancedFirewallRef: PieceConfig = {
  id: "ProAdvancedFirewallRef",
  brand: PROADVANCED,
  clipsDir: "proadv/clips",
  scenes: SCENES,
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
