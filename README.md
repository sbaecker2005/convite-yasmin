# Convite para a Yasmin

Um convite em forma de carta antiga: o envelope abre, a carta é escrita à máquina
na tela e, no fim, ela responde quando, onde e o que quer beber.

**Site:** https://sbaecker2005.github.io/convite-yasmin/

Feito só com HTML, CSS e JavaScript — sem framework, sem build, sem dependência.

## Como funciona

1. **Entrada** — tela com o nome dela e o botão que libera a música
   (o navegador só deixa tocar som depois de um clique).
2. **Envelope** — lacrado com um selo de cera vermelho. Clicou, o selo estala,
   a aba abre em 3D e a carta sai de dentro.
3. **A carta** — a mensagem do convite aparece sendo escrita, letra por letra.
   Tocar na carta pula a digitação.
4. **O formulário** — só aparece depois que ela toca em "Quero responder":
   data, horário, data reserva, onde, tipo de comida, bebida, dress code,
   plano B se chover, restrição alimentar, recado e um slider de ansiedade.
5. **A resposta** — confete, contagem regressiva ao vivo até o encontro e um
   botão que abre o WhatsApp dela com o resumo todo já digitado.

Detalhes: o campo de comida só aparece se ela escolher restaurante ou
"eu cozinho pra você", e os números das seções se reorganizam sozinhos
(contador do CSS). O botão "Não" foge do mouse.

## Música

O site procura um arquivo de áudio na pasta (`musica.mp3`). Se não achar,
toca o clipe oficial no YouTube através do player embutido.

Por isso o `.gitignore` ignora arquivos de áudio: a versão publicada usa o
embed oficial, e não uma cópia da gravação.

Para trocar a faixa, mexa em `CONFIG` no topo do `script.js`:

```js
const CONFIG = {
  telefone:  '5511948909000',   // quem recebe a resposta no WhatsApp
  youtubeId: 'dl0Dp_FRMo4',     // clipe usado quando não há arquivo local
  convite:   '...'              // o texto da carta
};
```

## Rodando

Abra o `index.html` no navegador. Só isso.

Para ouvir o arquivo local em vez do YouTube, coloque o mp3 na pasta
com o nome `musica.mp3`.

## Arquivos

| Arquivo      | O que faz                                             |
|--------------|-------------------------------------------------------|
| `index.html` | estrutura e os 28 ícones em SVG                       |
| `style.css`  | papel envelhecido, selo de cera e todas as animações  |
| `script.js`  | abertura do envelope, formulário, confete e contagem  |
