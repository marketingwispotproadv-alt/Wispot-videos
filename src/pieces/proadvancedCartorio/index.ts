import { PROADVANCED } from "../../brands/proadvanced";
import { LEGENDA_GRANDE } from "../../template/style";
import type { Overlay, PieceConfig } from "../../template/types";
import { SCENES } from "./scenes";

/**
 * Dois gráficos na peça inteira, e os dois estão onde **completam** o que a
 * locução deixou pela metade — não onde enfeitam.
 *
 * A etiqueta dos provimentos: ele diz "no provimento 213 e no provimento 243",
 * sem o ano e sem o CNJ, que o roteiro escrito traz. Quem carrega o dado exato
 * passa a ser a etiqueta, e ninguém precisa regravar a locução por causa disso.
 *
 * A lista da conformidade: o roteiro pede "backups protegidos e testados" e o
 * que foi gravado é só "backup". A ficha diz a íntegra enquanto a voz diz a
 * abreviação, e o item que fecha a lista deixa de ser o mais fraco dela.
 *
 * Os tempos são os da cena como ela está no `scenes.ts`, tirados do começo real
 * da palavra que nomeia cada ficha — o `timing.ts` leva para a linha do tempo
 * final, já descontado o silêncio aparado e a aceleração.
 *
 * Ficha sem `at` já está em cena desde o primeiro quadro: é a que veio do take
 * anterior. Assim a lista atravessa o corte sem reanimar, e os três takes do
 * bloco passam a ler como um só.
 */
const OVERLAYS: Record<string, Overlay> = {
  "07-provimentos": { label: "Provimentos 213/2026 e 243/2026 — CNJ" },
  "10-politicas": {
    items: [{ text: "Políticas de segurança", at: 2.34 }],
  },
  "11-controle-acesso": {
    items: [
      { text: "Políticas de segurança" },
      { text: "Controle de acesso", at: 0.76 },
      { text: "Inventário de ativos", at: 1.98 },
    ],
  },
  "12-negocio-backup": {
    items: [
      { text: "Políticas de segurança" },
      { text: "Controle de acesso" },
      { text: "Inventário de ativos" },
      { text: "Continuidade do negócio", at: 0.7 },
      { text: "Backups protegidos e testados", at: 2.46 },
    ],
  },
};

/**
 * Vídeo da ProAdvanced sobre segurança da informação em cartórios.
 *
 * 21 takes, um pedaço de frase por take, no estilo de legenda grande e corte
 * seco. O material é o que está em `public/cartorio/clips` — veja o README de
 * lá para o mapa take por take e para o que foi descartado de cada um.
 *
 * **A abertura do roteiro não foi gravada.** Não existe áudio para "Quando o
 * sistema de um cartório para..." nem para o "Fale com a Pro Advanced" falado.
 * Por decisão de quem pediu o corte, a peça começa no "Todos os dias..." e o
 * fecho fica na pílula de chamada e no cartão final. Se a locução da abertura
 * aparecer, ela entra como duas cenas novas no topo do `scenes.ts` e nada mais
 * aqui precisa mudar.
 */
export const proadvancedCartorio: PieceConfig = {
  id: "ProAdvancedCartorio",
  brand: PROADVANCED,
  clipsDir: "cartorio/clips",
  scenes: SCENES,
  overlays: OVERLAYS,
  // Os seis pontos em que o argumento vira: do que circula para o risco, do
  // risco para a norma, da norma para a prática, da prática para a solução, da
  // solução para a ProAdvanced, e daí para a pergunta do fecho. Nos outros
  // quatorze cortes, corte seco e nada mais — clarão em todos vira papel de
  // parede, e o olho para de registrar o que se repete a cada três segundos.
  flashBefore: [
    "04-comprometidas",
    "07-provimentos",
    "10-politicas",
    "13-antivirus",
    "17-proadvanced",
    "19-preparado",
  ],
  endCard: {
    tagline: ["Proteção para o seu cartório,", "da prevenção à continuidade."],
    callToAction: "proadvanced.com.br",
    seconds: 4,
  },
  // A trilha é a mesma faixa licenciada para a ProAdvanced, remontada para a
  // duração desta peça — a do vídeo do firewall foi cortada para 52,93 s e
  // aqui a peça tem 70,30 s. Ver `public/cartorio/audio/README.md`.
  music: { src: "cartorio/audio/trilha.mp3" },
  style: {
    ...LEGENDA_GRANDE,
    // O roteiro não tem o "Fale com a Pro Advanced" gravado, então quem faz a
    // chamada é a pílula. Ela entra junto com a pergunta do fecho, em 58,83 s,
    // e fica até o cartão final, em 66,30 s.
    cta: { text: "Fale com a Pro Advanced", at: 59 },
  },
};

/**
 * A mesma peça, sem legenda e sem ficha, para tirar quadro de capa:
 *
 *     npx remotion still ProAdvancedCartorioCapa out/capa.png --frame=1500
 *
 * No vídeo não existe quadro limpo — nos vãos entre um trecho e outro, a
 * legenda que sai e a que entra se cruzam em transparência.
 */
export const proadvancedCartorioCapa: PieceConfig = {
  ...proadvancedCartorio,
  id: "ProAdvancedCartorioCapa",
  overlays: {},
  style: {
    ...proadvancedCartorio.style,
    captions: {
      ...(proadvancedCartorio.style?.captions ?? LEGENDA_GRANDE.captions),
      hidden: true,
    },
    flash: undefined,
    progressBar: false,
    cta: undefined,
  },
};
