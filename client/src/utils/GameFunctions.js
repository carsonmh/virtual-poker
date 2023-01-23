import { makeDeck } from "../components/game/Deck";
import axios from "axios";

import {
  determineWinner,
  getUserFromPlayerString,
  computeEloChange,
  getOpponent,
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
    startingPlayer: "p1",
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
  if (playerNumber === 1) {
    socket.emit("game_state_change", newGameState);
  }
}

function endGame(
  playerNumber,
  opponentDisconnected,
  p1Cards,
  p2Cards,
  mainDeck,
  users,
  user,
  winner,
  socket
) {
  let winnerP;
  let isWinner;

  switch (winner) {
    case "p1":
      socket.emit("game_state_change", {
        p1Chips: 1000,
        pot: 0,
        p2Chips: 0,
      });
    case "p2":
      socket.emit("game_state_change", {
        p2Chips: 1000,
        p1Chips: 0,
        pot: 0,
      });
  }

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

  axios.post("http://10.0.0.145:3001/api/update-elo", {
    userId: user.uid,
    newElo: computeEloChange(
      user.points,
      getOpponent(users, user).points,
      isWinner
    ),
  });
  return isWinner;
}

async function restartGame(
  socket,
  p1Chips,
  p2Chips,
  pot,
  currentTurn,
  winner,
  p1Bet,
  p2Bet,
  playerNumber
) {
  if (
    (playerNumber === 0 && winner === "p2") ||
    (playerNumber === 1 && winner === "p1") ||
    (winner === "tie" && playerNumber === 1)
  ) {
    return;
  }
  const deck = makeDeck();
  const tp1Cards = deck.splice(0, 2);
  const tp2Cards = deck.splice(0, 2);
  const tmainDeck = deck.splice(0, 5);
  switch (winner) {
    case "p1":
      resetGameState(
        socket,
        p1Chips + pot + p2Bet + p1Bet,
        p2Chips,
        pot,
        "p1",
        tp1Cards,
        tp2Cards,
        tmainDeck
      );
      break;
    case "p2":
      resetGameState(
        socket,
        p1Chips,
        p2Chips + pot + p2Bet + p1Bet,
        pot,
        "p2",
        tp1Cards,
        tp2Cards,
        tmainDeck
      );
      break;
    case "tie":
      resetGameState(
        socket,
        p1Chips + pot / 2,
        p2Chips + pot / 2,
        pot,
        "p1",
        tp1Cards,
        tp2Cards,
        tmainDeck
      );
      break;
  }
}

function setUserChips(socket, p1Chips, p2Chips) {
  socket.emit("game_state_change", {
    p1Chips: p1Chips,
    p2Chips: p2Chips,
    pot: 0,
    p1Bet: 0,
    p2Bet: 0,
  });
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
  setUserChips(socket, p1Chips, p2Chips);
  socket.emit("game_state_change", {
    currentTurn: currentTurn,
    p1Cards: [...p1Cards],
    p2Cards: [...p2Cards],
    mainDeck: [...mainDeck],
    turnCount: 0,
    restart: false,
    winner: "none",
    startingPlayer: currentTurn,
    showCards: false,
  });
}

export { startGame, gameTurnOne, resetGameState, endGame, restartGame };
