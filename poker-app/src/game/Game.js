import Board from "./components/Board";
import PlayMenu from "./components/PlayMenu";
import { makeDeck } from "./components/Deck";
import { determineWinner } from "../utils/GameFunctions";

import React, { useState, useEffect } from "react";

import styled from "styled-components";

const GameWrapper = styled.div`
  display: grid;
  text-align: center;
  align-items: space-between;
`;

function Game({ roomCode, socket, users, currUser }) {
  // game states
  const [playerNumber, setPlayerNumber] = useState("");
  const [p1Chips, setP1Chips] = useState(0);
  const [p2Chips, setP2Chips] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("p1");
  const [turnCount, setTurnCount] = useState(null);
  const [winner, setWinner] = useState("");
  const [BB, setBB] = useState(20);
  const [SB, setSB] = useState(10);
  const [pot, setPot] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [p1Cards, setP1Cards] = useState([]);
  const [p2Cards, setP2Cards] = useState([]);
  const [mainDeck, setMainDeck] = useState([]);
  const [restart, setRestart] = useState(false);
  const [testWord, setTestWord] = useState("beginning");
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [p1Bet, setP1Bet] = useState(0);
  const [p2Bet, setP2Bet] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState("");
  const [isCurrentTurn, setIsCurrentTurn] = useState("");

  useEffect(
    () => {
      if (
        (currentTurn === "p1" && playerNumber === 0) ||
        (currentTurn === "p2" && playerNumber === 1)
      ) {
        setIsCurrentTurn(true);
      } else {
        setIsCurrentTurn(false);
      }
    },
    [],
    [currentTurn]
  );

  useEffect(() => {
    setPlayerNumber(() => currUser.playerNumber);
  }, []);

  socket.on("game_starting", () => {
    if (gameStarted === false) {
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
  });

  socket.on(
    "game_state_change",
    ({
      p1Chips,
      p2Chips,
      gameStarted,
      turnCount,
      pot,
      currentTurn,
      increment,
      restart,
      p1Cards,
      p2Cards,
      mainDeck,
      winner,
      p1Bet,
      p2Bet,
      gameOver,
      startingPlayer,
    }) => {
      p1Chips !== null && p1Chips !== undefined && setP1Chips(p1Chips);
      p2Chips !== null && p2Chips !== undefined && setP2Chips(p2Chips);
      gameStarted !== null &&
        gameStarted !== undefined &&
        setGameStarted(gameStarted);
      turnCount !== null && turnCount !== undefined && setTurnCount(turnCount);
      pot !== null && pot !== undefined && setPot(pot);
      currentTurn && setCurrentTurn(currentTurn);
      increment !== null && increment !== undefined && setIncrement(increment);
      restart !== null && restart !== undefined && setRestart(restart);
      p1Cards && setP1Cards(p1Cards);
      p2Cards && setP2Cards(p2Cards);
      mainDeck && setMainDeck(mainDeck);
      winner && setWinner(winner);
      p1Bet !== undefined && p1Bet !== null && setP1Bet(p1Bet);
      p2Bet !== undefined && p2Bet !== null && setP2Bet(p2Bet);
      gameOver !== undefined && gameOver !== null && setGameOver(gameOver);
      startingPlayer !== undefined &&
        startingPlayer !== null &&
        setStartingPlayer(startingPlayer);
    }
  );

  useEffect(() => {
    setRaiseAmount(BB);
    switch (turnCount) {
      case 0:
        if (p1Chips === 0 || p2Chips === 0) {
          socket.emit("game_state_change", { gameOver: true });
        }
        setTestWord("beginning");
        if (currentTurn === "p1" && playerNumber === 0) {
          socket.emit("game_state_change", {
            p1Chips: p1Chips - SB,
            p2Chips: p2Chips - BB,
            pot: 0,
            increment: SB,
            p1Bet: SB,
            p2Bet: BB,
            startingPlayer: currentTurn,
          });
        } else if (currentTurn === "p2" && playerNumber === 1) {
          socket.emit("game_state_change", {
            p2Chips: p2Chips - SB,
            p1Chips: p1Chips - BB,
            pot: 0,
            increment: SB,
            p1Bet: BB,
            p2Bet: SB,
            startingPlayer: currentTurn,
          });
        }
        break;
      case 2:
        setTestWord("flipping the flop");
        break;
      case 4:
        setTestWord("flipping the turn");
        break;
      case 6:
        setTestWord("flipping the river");
        break;
      case 8:
        if (p1Chips === 0 || p2Chips === 0) {
          socket.emit("game_state_change", { gameOver: true });
        }
        if (playerNumber === 0) {
          socket.emit("game_state_change", {
            restart: true,
            winner: determineWinner(p1Cards, p2Cards, mainDeck),
          });
        }
        break;
    }
  }, [turnCount]);

  function resetGameState(
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

  useEffect(() => {
    const deck = makeDeck();
    const tp1Cards = deck.splice(0, 2);
    const tp2Cards = deck.splice(0, 2);
    const tmainDeck = deck.splice(0, 5);
    if (
      restart === true &&
      (winner === "p1" || winner === "p2" || winner === "tie")
    )
      switch (winner) {
        case "p1":
          resetGameState(
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
    setRestart(false);
  }, [restart]);

  if (gameOver === true) {
    return (
      <div>
        game over. Winner: {determineWinner(p1Cards, p2Cards, mainDeck)}
      </div>
    );
  }

  if (gameStarted === false) {
    return <div>waiting room, code: {roomCode}</div>;
  }

  return (
    <GameWrapper>
      <div style={{ marginBottom: "30px" }}>
        <div>View from player {playerNumber + 1}</div>
        <div>Room code: {roomCode}</div>
        <div>{currentTurn}'s turn</div>
      </div>
      <Board
        playerNumber={playerNumber}
        pot={pot}
        users={users}
        turnCount={turnCount}
        mainDeck={mainDeck}
        p1Chips={p1Chips}
        p2Chips={p2Chips}
        p1Cards={p1Cards}
        p2Cards={p2Cards}
        p1Bet={p1Bet}
        p2Bet={p2Bet}
        currentTurn={currentTurn}
      />
      <PlayMenu
        currentTurn={currentTurn}
        playerNumber={playerNumber}
        p1Chips={p1Chips}
        p2Chips={p2Chips}
        BB={BB}
        raiseAmount={raiseAmount}
        increment={increment}
        socket={socket}
        turnCount={turnCount}
        pot={pot}
        setRaiseAmount={setRaiseAmount}
        p1Bet={p1Bet}
        p2Bet={p2Bet}
        gameStarted={gameStarted}
        startingPlayer={startingPlayer}
      />
    </GameWrapper>
  );
}

export default Game;
