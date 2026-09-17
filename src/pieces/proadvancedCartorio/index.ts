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
 *
 * Nas três cenas da lista a legenda sai (`hideCaptions`): a bolinha diz a mesma
 * coisa que a voz está dizendo, e dois textos com o mesmo conteúdo na mesma
 * tela fazem quem assiste não ler nenhum dos dois.
 */
const OVERLAYS: Record<string, Overlay> = {
  "07-provimentos": { label: "Provimentos 213/2026 e 243/2026 — CNJ" },
  "10-politicas": {
    hideCaptions: true,
    items: [{ text: "Políticas de segurança", at: 2.34 }],
  },
  "11-controle-acesso": {
    hideCaptions: true,
    items: [
      { text: "Políticas de segurança" },
      { text: "Controle de acesso", at: 0.76 },
      { text: "Inventário de ativos", at: 1.98 },
    ],
  },
  "12-negocio-backup": {
    hideCaptions: true,
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
 * **A abertura do roteiro ainda não foi gravada por inteiro.** Existe áudio
 * para "Quando o sistema de um cartório para," — está convertido em
 * `public/cartorio/clips/00-quando.mp4`, e o nome começa em `00` para entrar na
 * frente quando for a hora. Falta a segunda metade da frase ("não é só a
 * tecnologia que fica indisponível") e o "Param escrituras, certidões...".
 * Oração subordinada sozinha não emenda no "Todos os dias...", então o clipe
 * fica fora do corte até o resto chegar; aí ele entra como cenas novas no topo
 * do `scenes.ts` e nada mais aqui precisa mudar.
 *
 * O fecho falado, esse já existe: "Fale conosco!", na cena 22.
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
  // aqui a peça tem 66,17 s. Ver `public/cartorio/audio/README.md`.
  //
  // Mais baixa que o padrão do template (0,22 e 0,62), por pedido: −4,6 dB sob
  // a locução e −1,9 dB no cartão final. O cartão baixa menos de propósito,
  // porque ali não há fala e é a trilha que resolve o fim da peça.
  music: { src: "cartorio/audio/trilha.mp3", under: 0.13, over: 0.5 },
  style: {
    ...LEGENDA_GRANDE,
    // Mais apertado que o padrão do estilo (0,08 / 0,12), por pedido de ritmo.
    // Abaixo disto a consoante de ataque começa a entrar decepada: o corte
    // cairia em cima do "p" de "políticas" e do "b" de "backup", que são
    // justamente os que precisam do silêncio de antes para soarem.
    lead: { head: 0.03, tail: 0.05 },
    // As fichas do bloco da conformidade sobem pela borda de baixo, uma por
    // exigência, e empurram para cima as que já estão em cena. É o único bloco
    // da peça com fichas, então o estilo pode ser desta peça inteira.
    overlayStyle: "bubbles",
    // 12% é o teto que o estilo documenta: acima disso a correção de tom começa
    // a deixar a voz com textura de plástico. Estava em 8%.
    speed: 1.12,
    // A pílula entra junto com a pergunta do fecho, em 54,43 s, e fica até o
    // cartão final, em 62,17 s. Ela nasceu para suprir o "Fale com a Pro
    // Advanced" que não tinha sido gravado; agora que o "Fale conosco!" existe
    // em áudio, ela passou a anunciá-lo — a pergunta do fecho já aparece com a
    // chamada na tela, e a voz a confirma no fim. Se soar repetido com o
    // cartão final, é só tirar esta linha.
    cta: { text: "Fale com a Pro Advanced", at: 54.5 },
  },
};

/**
 * A mesma peça, sem legenda e sem ficha, para tirar quadro de capa:
 *
 *     npx remotion still ProAdvancedCartorioCapa out/capa.png --frame=1560
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
