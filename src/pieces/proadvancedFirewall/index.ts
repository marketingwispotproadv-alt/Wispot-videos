import { PROADVANCED } from "../../brands/proadvanced";
import type { Overlay, PieceConfig } from "../../template/types";
import { SCENES } from "./scenes";

/**
 * Gráficos por clipe. Os tempos são segundos contados do início da cena já
 * cortada, tirados dos word timestamps — cada ficha entra na palavra que a
 * nomeia.
 *
 * Ficha sem `at` já está em cena desde o primeiro quadro: é a que veio do take
 * anterior. Assim a lista atravessa o corte sem reanimar, e três takes
 * seguidos passam a ler como um bloco só em vez de três saltos.
 */
const OVERLAYS: Record<string, Overlay> = {
  "8413": {
    label: "Segurança de rede",
    items: [
      { text: "Firewall instalado", tone: "ok", at: 0.4 },
      { text: "Empresa protegida", tone: "question", at: 1.75 },
    ],
  },
  "8414": {
    items: [
      { text: "Como está configurado", at: 0.75 },
      { text: "Como é gerenciado", at: 2.5 },
    ],
  },
  "8415": { label: "O que ele faz" },
  "8417": {
    items: [
      { text: "Controla o tráfego", at: 0.8 },
      { text: "Define acessos", at: 2.4 },
    ],
  },
  "8419": {
    items: [
      { text: "Controla o tráfego" },
      { text: "Define acessos" },
      { text: "Bloqueia ameaças", at: 0.7 },
    ],
  },
  "8420": { label: "As regras envelhecem" },
  "8421": { items: [{ text: "Porta aberta", tone: "risk", at: 0.5 }] },
  "8424": {
    items: [
      { text: "Porta aberta", tone: "risk" },
      { text: "Acesso antigo", tone: "risk", at: 0.3 },
      { text: "Configuração desatualizada", tone: "risk", at: 1.3 },
    ],
  },
  "8426": {
    items: [
      { text: "Porta aberta", tone: "risk" },
      { text: "Acesso antigo", tone: "risk" },
      { text: "Configuração desatualizada", tone: "risk" },
    ],
  },
  "8427": { label: "Gestão contínua" },
  "8429": {
    items: [
      { text: "Revisamos regras", at: 0.3 },
      { text: "Acompanhamos o ambiente", at: 1.2 },
    ],
  },
  "8430": {
    items: [
      { text: "Revisamos regras" },
      { text: "Acompanhamos o ambiente" },
      { text: "Ajustamos as configurações", at: 0.4 },
    ],
  },
  "8434": {
    items: [
      { text: "Revisamos regras" },
      { text: "Acompanhamos o ambiente" },
      { text: "Ajustamos as configurações" },
    ],
  },
};

export const proadvancedFirewall: PieceConfig = {
  id: "ProAdvancedFirewall",
  brand: PROADVANCED,
  clipsDir: "proadv/clips",
  scenes: SCENES,
  overlays: OVERLAYS,
  endCard: {
    tagline: ["Firewall gerenciado,", "proteção atualizada todo dia."],
    callToAction: "proadvanced.com.br",
    seconds: 4,
  },
  // Sem trilha: o music.mp3 do projeto é da Wispot e não cabe em peça de outra
  // marca. Chegando uma trilha da ProAdvanced, basta
  //   music: { src: "proadv/audio/trilha.mp3" }
};
