# Áudio — ProAdvanced, vídeo de acesso de terceiros

| Arquivo | O que é |
| --- | --- |
| `trilha.mp3` | *Funky Corporate Explainer*, de Alex Morgan — a mesma faixa licenciada para a ProAdvanced no vídeo do firewall, remontada para a duração desta peça |

O efeito de corte vem de `public/proadv/audio/whoosh.wav`, sintetizado em
`tools/make_whoosh.py`, sem licença de terceiro no meio.

## Como a trilha foi remontada

Esta peça tem 57,47 s, contra 52,93 s do firewall e 66,17 s do vídeo de
cartórios, então a faixa precisou de outra montagem —
`tools/fit_music.py` corta na grade musical em vez de no talho:

```bash
python3 tools/fit_music.py public/proadv/audio/trilha.mp3 \
    public/terceiros/audio/trilha.mp3 57.47
```

- batida medida por autocorrelação do envelope de ataque: **110,3 BPM**,
  compasso de 2,1756 s;
- miolo de 13,27→41,55 s repetido por 2 compassos;
- resultado de **57,01 s**, normalizado a −20 dBFS de RMS.

Sobram 0,46 s de silêncio no fim, porque a emenda cai em compasso inteiro e não
no quadro exato. É debaixo do cartão final, depois de a faixa ter resolvido —
inaudível na prática, e melhor do que cortar a música no meio de uma frase.

**A mesma ressalva do corte de cartórios:** a origem aqui é a `trilha.mp3` do
firewall, que já é uma montagem, e remontar uma montagem recorta emendas que já
existiam. Se o arquivo original de 38,52 s aparecer, vale refazer a partir dele.

**Atenção**: o número no fim do comando é a duração do vídeo **final**. O estilo
desta peça acelera a imagem em 12% (`speed: 1.12`), e mexer nisso muda a duração
— a trilha precisa ser remontada, senão a cauda fica de fora.

O volume na peça é montado por `template/components/MusicBed.tsx`: baixo sob a
locução, subindo no cartão final. Como no corte de cartórios, os volumes são
menores que o padrão do template — `under: 0.13` e `over: 0.5`.
