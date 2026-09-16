/**
 * O estilo desta peça — plano do apresentador cortado em muitos takes, legenda
 * palavra a palavra e fichas que se acumulam — virou modelo. Estes são os tipos
 * que uma peça nova precisa preencher; o resto (`src/template`) não muda.
 */

export type Brand = {
  name: string;
  colors: {
    /** cor que carrega a marca: pílula da palavra ativa, fichas, etiqueta */
    primary: string;
    /** variação clara: topo do degradê e termo-chave ainda não dito */
    primaryLight: string;
    /** cinza institucional */
    neutral: string;
    white: string;
    /** fundo escuro, para a ficha de risco */
    ink: string;
  };
  gradient: string;
  fontFamily: string;
  logo: {
    /** lockup completo em branco, para fundo de marca ou imagem escura */
    lockupWhite: string;
    /** lockup completo colorido, para fundo branco */
    lockupColor: string;
    iconWhite: string;
    iconColor: string;
  };
};

export type CaptionWord = {
  text: string;
  start: number;
  end: number;
  /** termo que carrega o sentido da frase: ganha a cor da marca */
  hl?: boolean;
};

export type CaptionChunk = { words: CaptionWord[] };

export type SceneDef = {
  /** nome do arquivo em `clipsDir`, sem extensão */
  clip: string;
  /** corte no material original, em segundos */
  trimStart: number;
  trimEnd: number;
  /**
   * Legenda em trechos curtos, com tempo em segundos contados do início da
   * cena já cortada.
   */
  chunks: CaptionChunk[];
  /**
   * Silêncio de verdade nas pontas da cena cortada, em segundos, medido do
   * áudio.
   *
   * Não dá para deduzir isto dos tempos da legenda: o Whisper marca a primeira
   * palavra cerca de 0,2 s antes de o som sair, e estica a última até o fim do
   * segmento. Nos dezesseis takes da ProAdvanced a cabeça media 0,40 s onde a
   * transcrição dizia 0,20, e três caudas que a transcrição dava como 0,30
   * eram 0,00 — o borrão caía em cima da fala.
   */
  silence?: { head: number; tail: number };
};

/**
 * `ok` = o que está sob controle.
 * `question` = a dúvida que o roteiro levanta.
 * `risk` = o que saiu do padrão.
 */
export type Tone = "ok" | "question" | "risk";

export type RuleItem = {
  text: string;
  tone?: Tone;
  /**
   * Segundo em que a ficha entra, contado do início da cena. Sem isto, a ficha
   * já está em cena desde o primeiro quadro — é a que veio do take anterior, e
   * é isso que faz takes seguidos lerem como um bloco só.
   */
  at?: number;
};

export type Overlay = {
  /** etiqueta do bloco do roteiro, abaixo da assinatura */
  label?: string;
  items?: RuleItem[];
};

export type EndCardConfig = {
  /** duas linhas curtas; a quebra é sua */
  tagline: string[];
  /** o que vai na pílula branca, normalmente o site */
  callToAction: string;
  seconds: number;
};

export type MusicConfig = {
  /** caminho em `public/`, já normalizado a −20 LUFS */
  src: string;
  /** volume sob a locução e no cartão final */
  under?: number;
  over?: number;
};

/**
 * Os poucos parâmetros em que dois estilos de peça divergem. O padrão reproduz
 * o corte original da ProAdvanced; medidas diferentes montam o estilo de
 * legenda grande no topo, sem cromo nenhum em volta.
 */
export type Style = {
  captions: {
    /** de onde a legenda é ancorada */
    anchor: "top" | "bottom";
    /** distância da borda ancorada, em px de um quadro de 1920 */
    offset: number;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    /** caixa baixa em tudo, como manda o estilo de legenda grande */
    lowercase: boolean;
    /**
     * `pill` acende a palavra ativa numa pílula da cor da marca;
     * `none` deixa tudo branco e o ritmo fica só na entrada das palavras.
     */
    highlight: "pill" | "none";
    /**
     * `preview` mostra o trecho inteiro e escurece o que ainda não foi dito;
     * `reveal` faz cada palavra aparecer na hora em que é falada.
     */
    reveal: "preview" | "reveal";
  };
  /** `blur` emenda com o borrão; `cut` corta seco em tudo */
  transitions: "blur" | "cut";
  /** assinatura da marca no canto */
  watermark: boolean;
  /**
   * Silêncio que fica em cada ponta da cena, em segundos. O que passar disso é
   * aparado, e a legenda anda junto. Nunca acrescenta silêncio que não exista.
   */
  lead: { head: number; tail: number };
  /**
   * Salto de enquadramento a cada corte: as cenas alternam entre o quadro
   * cheio e um recorte `punch` vezes mais fechado. É o que a referência faz —
   * lá o salto é de ~35% — e é o que dá a sensação de transição sem haver
   * transição nenhuma.
   */
  punch?: number;
  /** quanto a cena fecha ao longo do take (0.045 = 4,5%) */
  push: number;
  /**
   * Alternar o sentido do empurrão a cada take evita que dois planos seguidos
   * andem para o mesmo lado. O estilo de legenda grande não alterna: lá a
   * câmera só fecha, nunca abre.
   */
  pushAlternates: boolean;
  /** tempero quente por cima da imagem, de 0 a 1 */
  warmth?: number;
  /**
   * Clarão nos cortes, desenhado por cima da peça. Não é emenda: o corte
   * continua seco no vídeo e no áudio.
   *
   * Não vem da referência — lá o brilho não oscila em nenhum dos seis cortes.
   * É escolha de montagem.
   */
  flash?: { intensity: number; rise: number; fall: number; color?: string };
  /** efeito curto em cada corte, alinhado pelo pico com o clarão */
  flashSfx?: {
    src: string;
    volume?: number;
    peakAt?: number;
    length?: number;
  };
  /** fio de progresso no topo */
  progressBar?: boolean;
  /** pílula de chamada, como a dos anúncios; entra no segundo indicado */
  cta?: { text: string; at: number };
};

export type PieceConfig = {
  /** id da composição no Remotion Studio */
  id: string;
  brand: Brand;
  /** pasta em `public/` com os clipes já convertidos */
  clipsDir: string;
  scenes: SceneDef[];
  /** gráficos por clipe, na chave do `clip` da cena */
  overlays?: Record<string, Overlay>;
  /**
   * Cenas em que o corte ganha clarão e efeito, pelo `clip`.
   *
   * Clarão em todo corte vira papel de parede: a peça tem quinze deles, e o
   * olho para de registrar o que se repete a cada três segundos. Marcando só
   * onde o argumento vira — a abertura para a explicação, a explicação para o
   * problema, o problema para a solução, a solução para o fecho — o clarão
   * volta a significar alguma coisa.
   *
   * Sem isto, o clarão entra em todos os cortes.
   */
  flashBefore?: string[];
  endCard: EndCardConfig;
  music?: MusicConfig;
  /** sem isto, vale o padrão de `src/template/style.ts` */
  style?: Partial<Style>;
};
