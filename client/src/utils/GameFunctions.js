import { makeDeck } from "../components/game/Deck";
import {
  determineWinner,
  getUserFromPlayerString,
  computeEloChange,
} from "../utils/Utils";

function startGame(socket) {
  const deck = makeDeck();
  const tp1Cards = deck.splice(0, 2);
  const tp2Cards = deck.splice(0, 2);
  const tmainDeck = deck.splice(0, 5);

  socket.emit("game_state_change", {
    p1Chips: 500,
    p2Chips: 500,
    gameStarted: true,
    turnCount: 0,
    pot: 0,
    p1Cards: [...tp1Cards],
    p2Cards: [...tp2Cards],
    mainDeck: [...tmainDeck],
    currentTurn: "p1",
  });
}

function gameTurnOne(
  socket,
  currentTurn,
  p1Chips,
  p2Chips,
  SB,
  BB,
  playerNumber
) {
  const newGameState = {
    p1Chips: currentTurn === "p1" ? p1Chips - SB : p1Chips - BB,
    p2Chips: currentTurn === "p1" ? p2Chips - BB : p2Chips - SB,
    pot: 0,
    increment: SB,
    p1Bet: currentTurn === "p1" ? SB : BB,
    p2Bet: currentTurn === "p1" ? BB : SB,
    startingPlayer: currentTurn,
  };
  if (currentTurn === "p1" && playerNumber === 0) {
    socket.emit("game_state_change", newGameState);
  } else if (currentTurn === "p2" && playerNumber === 1) {
    socket.emit("game_state_change", newGameState);
  }
}

function resetGameState(
  socket,
  p1Chips,
  p2Chips,
  pot,
  currentTurn,
  p1Cards,
  p2Cards,
  mainDeck
) {
  socket.emit("game_state_change", {
    p1Chips: p1Chips,
    p2Chips: p2Chips,
    pot: 0,
    currentTurn: currentTurn,
    p1Cards: [...p1Cards],
    p2Cards: [...p2Cards],
    mainDeck: [...mainDeck],
    turnCount: 0,
    restart: false,
    winner: "none",
    p1Bet: 0,
    p2Bet: 0,
  });
}

function endGame(
  playerNumber,
  opponentDisconnected,
  p1Cards,
  p2Cards,
  mainDeck,
  users,
  user
) {
  let winnerP;
  let isWinner;

  if (opponentDisconnected) {
    winnerP = playerNumber === 0 ? "p1" : "p2";
  } else {
    winnerP = determineWinner(p1Cards, p2Cards, mainDeck);
  }

  if (winnerP === "tie") {
    return null;
  }

  if (
    (winnerP === "p1" && playerNumber === 0) ||
    (winnerP === "p2" && playerNumber === 1)
  ) {
    isWinner = true;
  } else {
    isWinner = false;
  }

  const opponentUser = users.filter(
    (user) => user.playerNumber !== playerNumber
  )[0];

  const eloChange = computeEloChange(
    user.points,
    opponentUser.points,
    isWinner
  );
  return isWinner;
}

export { startGame, gameTurnOne, resetGameState, endGame };
