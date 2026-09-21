import { PROADVANCED } from "../../brands/proadvanced";
import { LEGENDA_GRANDE } from "../../template/style";
import type { Overlay, PieceConfig } from "../../template/types";
import { SCENES } from "./scenes";

/**
 * Dois gráficos na peça inteira, e os dois estão onde **completam** o que a
 * locução deixou pela metade — não onde enfeitam.
 *
 * A etiqueta da abertura: o roteiro escrito abre com "Sua empresa pode estar
 * protegida. Mas basta uma empresa com acesso aos seus sistemas ser invadida
 * para o risco chegar até você." Nada disso foi gravado — o que existe em
 * áudio é a pergunta "A sua empresa utiliza sistemas de terceiros?". Sem a
 * frase do risco, o "Foi o que um caso recente no Brasil mostrou" da cena
 * seguinte fica sem antecedente: o "o que" não aponta para nada. A etiqueta
 * carrega a frase que falta, com as palavras do próprio roteiro, e o caso
 * volta a ter do que ser exemplo.
 *
 * A lista das empresas de fora: a voz diz "Contabilidade, suporte de software,
 * fornecedor de TI, quem administra os seus servidores" e para aí. O roteiro
 * escrito termina em "quem administra o servidor **ou a nuvem**", e a nuvem é
 * justamente o acesso que mais escapa de inventário. A ficha diz a íntegra
 * enquanto a voz diz a versão curta.
 *
 * Os tempos são os da cena como ela está no `scenes.ts`, tirados do começo
 * real da palavra que nomeia cada ficha — o `timing.ts` leva para a linha do
 * tempo final, já descontado o silêncio aparado e a aceleração.
 *
 * Ficha sem `at` já está em cena desde o primeiro quadro: é a que veio do take
 * anterior. Assim a lista atravessa o corte sem reanimar, e os dois takes do
 * bloco passam a ler como um só.
 *
 * Nas duas cenas da lista a legenda sai (`hideCaptions`): a bolinha diz a
 * mesma coisa que a voz está dizendo, e dois textos com o mesmo conteúdo na
 * mesma tela fazem quem assiste não ler nenhum dos dois.
 */
const OVERLAYS: Record<string, Overlay> = {
  "01-terceiros": { label: "Basta uma delas ser invadida" },
  "07-contabilidade": {
    hideCaptions: true,
    items: [
      { text: "Contabilidade", at: 0.2 },
      { text: "Suporte do software", at: 1.0 },
    ],
  },
  "08-fornecedor": {
    hideCaptions: true,
    items: [
      { text: "Contabilidade" },
      { text: "Suporte do software" },
      { text: "Fornecedor de TI", at: 0.2 },
      { text: "Servidor ou nuvem", at: 1.3 },
    ],
  },
};

/**
 * Vídeo da ProAdvanced sobre ataque que chega pela empresa de fora — o
 * fornecedor, o contador, quem administra o servidor.
 *
 * Dezoito takes, um pedaço de frase por take, no estilo de legenda grande e
 * corte seco. O material é o que está em `public/terceiros/clips` — veja o
 * README de lá para o mapa take por take e para o que foi descartado de cada
 * um.
 *
 * **O caso citado não é nomeado, e é de propósito.** A locução diz "uma
 * empresa de tecnologia teve os seus dados expostos, e mais de 150 órgãos
 * públicos utilizavam o sistema dela". Nomear a empresa invadida põe marca de
 * terceiro em peça da Wispot e transforma o exemplo em acusação; o número, que
 * é o que dá tamanho ao risco, fica.
 */
export const proadvancedTerceiros: PieceConfig = {
  id: "ProAdvancedTerceiros",
  brand: PROADVANCED,
  clipsDir: "terceiros/clips",
  scenes: SCENES,
  overlays: OVERLAYS,
  // Os pontos em que o argumento vira: da pergunta para o caso, do caso para a
  // explicação, da lista para a consequência, do problema para a solução, e da
  // solução para a pergunta do fecho. Nos outros cortes, corte seco e nada
  // mais — clarão em todos vira papel de parede, e o olho para de registrar o
  // que se repete a cada três segundos.
  flashBefore: ["02-caso", "05-acontece", "09-invadida", "13-proteger", "16-sabe"],
  endCard: {
    tagline: ["Controle quem acessa", "a sua operação."],
    callToAction: "proadvanced.com.br",
    seconds: 4,
  },
  music: { src: "terceiros/audio/trilha.mp3", under: 0.13, over: 0.5 },
  style: {
    ...LEGENDA_GRANDE,
    lead: { head: 0.03, tail: 0.05 },
    overlayStyle: "bubbles",
    // 1,08 em vez dos 1,12 do corte de cartórios. A fala aqui já é mais
    // corrida que a de lá, e a legenda com ela: em 12% a linha trocava antes
    // de ser lida. 8% é o que o estilo documenta como o que dá para tirar sem
    // a fala soar apressada.
    speed: 1.08,
  },
};

/**
 * A mesma peça, sem legenda e sem ficha, para tirar quadro de capa:
 *
 *     npx remotion still ProAdvancedTerceirosCapa out/capa.png --frame=...
 *
 * No vídeo não existe quadro limpo — nos vãos entre um trecho e outro, a
 * legenda que sai e a que entra se cruzam em transparência.
 */
export const proadvancedTerceirosCapa: PieceConfig = {
  ...proadvancedTerceiros,
  id: "ProAdvancedTerceirosCapa",
  overlays: {},
  style: {
    ...proadvancedTerceiros.style,
    captions: {
      ...(proadvancedTerceiros.style?.captions ?? LEGENDA_GRANDE.captions),
      hidden: true,
    },
    flash: undefined,
    progressBar: false,
    cta: undefined,
  },
};
