import { playAsText } from "./rock-paper-scissors.js";

/**
 * Býr til takka fyrir umferðir, festir `onClick` við og bætir
 * við `.rounds__buttons`.
 *
 * @param {number} max Hámark umferða
 * @param {function} onClick Fall sem keyra skal þegar ýtt er á takka
 */
export function createButtons(max, onClick) {
  const buttons = document.querySelector('.rounds__buttons');
  for (let i = 1; i <= max; i += 2) {
    const button = document.createElement('BUTTON');
    button.classList.add('button');
    button.textContent = i.toString();
    button.addEventListener('click', () => onClick(i.toString()))

    buttons.appendChild(button);
  }
}

export function show(part) {
  // Element fyrir „parta“ leiks sem við viljum fela og sýna
  const start = document.querySelector('.start');
  const rounds = document.querySelector('.rounds');
  const play = document.querySelector('.play');
  const result = document.querySelector('.result');

  // Felum allt
  start.classList.add('hidden');
  rounds.classList.add('hidden');
  play.classList.add('hidden');
  result.classList.add('hidden');

  // og sýnum það sem beðið er um
  switch (part) {
    case 'start':
      start.classList.remove('hidden');
      break;
    case 'rounds':
      rounds.classList.remove('hidden');
      break;
    case 'play':
      play.classList.remove('hidden');
      break;
    case 'result':
      result.classList.remove('hidden');
      break;
    default:
      console.warn(`${part} óþekkt`);
  }

}

/**
 * @typedef {Object} Results
 * @property {string} player Það sem spilari spilaði
 * @property {string} computer Það sem tölva spilaði
 * @property {number} result Útkoma úr leik, `-1`, `0`, eða `1`
 * @property {number} currentRound Núverandi umferð
 * @property {number} totalRounds Heildarfjöldi umferð
 * @property {number} playerWins Sigrar spilara í umferð
 * @property {number} computerWins Sigrar tölvu í umferð
 */

/**
 * Uppfærir öll gildi stöðu skjás innan `.result` áður en sýndur.
 * @param {Results} r Gildi fyrir skjá
 */
export function updateResultScreen({ player, computer, result, currentRound, totalRounds, playerWins, computerWins }) {
  const resultPlayer = document.querySelector('.result__player');
  resultPlayer.textContent = playAsText(player);

  const resultComputer = document.querySelector('.result__computer');
  resultComputer.textContent = playAsText(computer);

  const resultResult = document.querySelector('.result__result');
  let resultString;
  if (result === 1) {
    resultString = 'Þú sigrar.';
  } else if (result === -1) {
    resultString = 'Tölva sigrar.';
  } else {
    resultString = 'Jafntefli.';
  }
  resultResult.textContent = resultString;

  const resultCurrentRound = document.querySelector('.result__currentRound');
  resultCurrentRound.textContent = currentRound.toString();

  const resultTotalRounds = document.querySelector('.result__totalRounds');
  resultTotalRounds.textContent = totalRounds.toString();

  const resultStatus = document.querySelector('.result__status');
  resultStatus.textContent = `Staðan er ${playerWins}-${computerWins}.`;
}

/**
 * @typedef {Object} StatusUpdate
 * @property {Game} game Síðasti spilaði leikur
 * @property {number} totalWins Heildarfjöldi vinninga leikmanns
 */

/**
 * Uppfærir allar upplýsingar á skjá um spilaða leiki
 * @param {StatusUpdate} s Gildi fyrir uppfærslu
 */
export function updateStatusScreen({ game, totalWins, numGames }) {
  const gamesPlayed = document.querySelector('.games__played');
  gamesPlayed.textContent = numGames;

  const gamesWins = document.querySelector('.games__wins');
  gamesWins.textContent = totalWins;

  const GamesWinratio = document.querySelector('.games__winratio');
  GamesWinratio.textContent = (100 * totalWins / numGames).toFixed(2);

  const totalLosses = numGames - totalWins;
  const gamesLosses = document.querySelector('.games__losses');
  gamesLosses.textContent = totalLosses;

  const GamesLossratio = document.querySelector('.games__lossratio');
  GamesLossratio.textContent = (100 * totalLosses / numGames).toFixed(2);

  const gamesList = document.querySelector('.games__list');

  const newGame = document.createElement('LI');
  if (game.win) {
    newGame.textContent = `Þú vannst ${game.player}-${game.computer}`;
  } else {
    newGame.textContent = `Tölva vann ${game.player}-${game.computer}`;
  }

  gamesList.appendChild(newGame);
}
