# Áudio — ProAdvanced, vídeo de cartórios

| Arquivo | O que é |
| --- | --- |
| `trilha.mp3` | *Funky Corporate Explainer*, de Alex Morgan — a mesma faixa licenciada para a ProAdvanced no vídeo do firewall, remontada para a duração desta peça |

O efeito de corte vem de `public/proadv/audio/whoosh.wav`, sintetizado em
`tools/make_whoosh.py`, sem licença de terceiro no meio.

## Como a trilha foi remontada

A peça do firewall tem 52,93 s e esta tem 68,53 s, então a faixa precisou de
outra montagem — `tools/fit_music.py` corta na grade musical em vez de no
talho:

```bash
python3 tools/fit_music.py public/proadv/audio/trilha.mp3 \
    public/cartorio/audio/trilha.mp3 68.53
```

- batida medida por autocorrelação do envelope de ataque: **110,3 BPM**,
  compasso de 2,1756 s;
- miolo de 13,27→41,55 s repetido por 7 compassos;
- resultado de **67,88 s**, normalizado a −20 dBFS de RMS.

Sobram 0,65 s de silêncio no fim, porque a emenda cai em compasso inteiro e não
no quadro exato. É debaixo do cartão final, depois de a faixa ter resolvido —
inaudível na prática, e melhor do que cortar a música no meio de uma frase.

**Uma ressalva honesta:** a origem aqui é a `trilha.mp3` do firewall, que já é
uma montagem. Remontar uma montagem recorta emendas que já existiam. Medi o
resultado e não há queda de nível nas novas emendas, mas se o arquivo original
de 38,52 s aparecer, vale refazer a partir dele:

```bash
python3 tools/fit_music.py original.mp3 public/cartorio/audio/trilha.mp3 68.53
```

**Atenção**: o número no fim do comando é a duração do vídeo **final**. O estilo
desta peça acelera a imagem em 8% (`speed: 1.08`), e mexer nisso muda a duração
— a trilha precisa ser remontada, senão a cauda fica de fora.

O volume na peça é montado por `template/components/MusicBed.tsx`: baixo sob a
locução, subindo no cartão final. Esta peça pede volumes menores que o padrão
do template — `under: 0.13` no lugar de 0,22 e `over: 0.5` no lugar de 0,62,
ou seja −4,6 dB sob a fala e −1,9 dB no cartão. O cartão baixa menos de
propósito: ali não há locução, e é a trilha que resolve o fim da peça.
