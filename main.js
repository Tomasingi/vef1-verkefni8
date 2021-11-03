import { createButtons } from './lib/ui.js';
import { show } from './lib/ui.js';
import { updateResultScreen } from './lib/ui.js';
import { updateStatusScreen } from './lib/ui.js';
import { checkGame } from './lib/rock-paper-scissors.js';
import { computerPlay } from './lib/rock-paper-scissors.js';

/** Hámarks fjöldi best-of leikja, ætti að vera jákvæð heiltala stærri en 0 */
const MAX_BEST_OF = 10;

/** Fjöldi leikja sem á að spila í núverandi umferð */
let totalRounds;

/** Númer umferðar í núverandi umferð */
let currentRound;

/** Sigrar spilara í núverandi umferð */
let playerWins = 0;

/** Töp spilara í núverandi umferð */
let computerWins = 0;

/**
 * Fjöldi sigra spilara í öllum leikjum. Gætum reiknað útfrá `games` en til
 * einföldunar höldum við utan um sérstaklega.
 */
let totalWins = 0;

/**
 * Utanumhald um alla spilaða leiki, hver leikur er geymdur á forminu:
 *
 * ```
 * {
 *   player: 2,
 *   computer: 1,
 *   win: true,
 * }
 * ```
 */
const games = [];

/**
 * Uppfærir stöðu eftir að spilari hefur spilað.
 * Athugar hvort leik sé lokið, uppfærir stöðu skjá með `updateResultScreen`.
 * Birtir annað hvort `Næsti leikur` takka ef leik er lokið eða `Næsta umferð`
 * ef spila þarf fleiri leiki.
 *
 * @param {number} player Það sem spilari spilaði
 */
function playRound(player) {
  // Komumst að því hvað tölva spilaði og athugum stöðu leiks
  let computer = computerPlay();
  const roundResult = checkGame(player, computer);
  if (roundResult === 1) {
    playerWins++;
  } else if (roundResult === -1) {
    computerWins++;
  }

  // Uppfærum result glugga áður en við sýnum, hér þarf að importa falli
  updateResultScreen({
    player: player.toString(),
    computer: computer.toString(),
    result: roundResult,
    currentRound: currentRound,
    totalRounds: totalRounds,
    playerWins: playerWins,
    computerWins: computerWins,
  });

  // Uppfærum teljara ef ekki jafntefli, verðum að gera eftir að við setjum titil
  if (roundResult !== 0) {
    currentRound++;
  }

  // Ákveðum hvaða takka skuli sýna
  const finishGame = document.querySelector('.button.finishGame');
  const nextRound = document.querySelector('.button.nextRound');

  finishGame.classList.add('hidden');
  nextRound.classList.add('hidden');

  const threshold = totalRounds / 2;
  if (playerWins > threshold || computerWins > threshold) {
    finishGame.classList.remove('hidden');
  } else {
    nextRound.classList.remove('hidden');
  }

  // Sýnum niðurstöðuskjá
  show('result');
}

/**
 * Fall sem bregst við því þegar smellt er á takka fyrir fjölda umferða
 * @param {Event} e Upplýsingar um atburð
 */
function round(e) {
  totalRounds = e;
  currentRound = 1;
  show('play');
}

// Takki sem byrjar leik
document
  .querySelector('.start button')
  .addEventListener('click', () => show('rounds'));

// Búum til takka
createButtons(MAX_BEST_OF, round);

// Event listeners fyrir skæri, blað, steinn takka
document
  .querySelector('button.scissor')
  .addEventListener('click', () => playRound(1));
document
  .querySelector('button.paper')
  .addEventListener('click', () => playRound(2));
document
  .querySelector('button.rock')
  .addEventListener('click', () => playRound(3));

/**
 * Uppfærir stöðu yfir alla spilaða leiki þegar leik lýkur.
 * Gerir tilbúið þannig að hægt sé að spila annan leik í framhaldinu.
 */
function finishGame() {
  // Bætum við nýjasta leik
  const game = {
    player: playerWins,
    computer: computerWins,
    win: (playerWins > computerWins),
  }

  // Uppfærum stöðu
  if (game.win) {
    totalWins++;
  }

  // Bætum leik við lista af spiluðum leikjum
  games.push(game);

  // Uppfærum skjá
  updateStatusScreen({
    game: game,
    totalWins: totalWins,
    numGames: games.length,
  })

  // Núllstillum breytur
  playerWins = 0;
  computerWins = 0;

  // Byrjum nýjan leik!
  show('rounds');
}

// Næsta umferð og ljúka leik takkar
document.querySelector('button.finishGame').addEventListener('click', finishGame);
// Takki sem fer með í næstu umferð
document.querySelector('button.nextRound').addEventListener('click', () => show('play'));

show('start');
