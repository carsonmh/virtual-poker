import Board from "./components/Board";
import PlayMenu from "./components/PlayMenu";
import Deck, { makeDeck } from "./components/Deck";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Hand } from "pokersolver";

import styled from "styled-components";

import {
  Slider,
  SliderTrack,
  Box,
  SliderFilledTrack,
  SliderThumb,
  Button,
} from "@chakra-ui/react";

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
    }
  );

  useEffect(() => {
    setRaiseAmount(BB);
    switch (turnCount) {
      case 0:
        setTestWord("beginning");
        if (currentTurn === "p1" && playerNumber === 0) {
          socket.emit("game_state_change", {
            p1Chips: p1Chips - SB,
            p2Chips: p2Chips - BB,
            pot: pot + BB + SB,
            increment: SB,
          });
        } else if (currentTurn === "p2" && playerNumber === 1) {
          socket.emit("game_state_change", {
            p2Chips: p2Chips - SB,
            p1Chips: p1Chips - BB,
            pot: pot + BB + SB,
            increment: SB,
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
        if (playerNumber === 0) {
          socket.emit("game_state_change", {
            restart: true,
            winner: determineWinner(p1Cards, p2Cards, mainDeck),
          });
        }
        break;
    }
  }, [turnCount]);

  function determineWinner(p1Cards, p2Cards, mainDeck) {
    const p1Hand = Hand.solve([...p1Cards, ...mainDeck]);
    const p2Hand = Hand.solve([...p2Cards, ...mainDeck]);
    const winner = Hand.winners([p1Hand, p2Hand]);
    if (winner.length === 2) {
      return "tie";
    }
    if (winner[0] === p1Hand) {
      return "p1";
    }
    if (winner[0] === p2Hand) {
      return "p2";
    }
  }

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
            p1Chips + pot,
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
            p2Chips + pot,
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
  }, [restart]);

  return (
    <GameWrapper>
      <div>
        <div>View from player {playerNumber + 1}</div>
        <div>Room code: {roomCode}</div>
      </div>
      <Board
        playerNumber={playerNumber}
        pot={pot}
        users={users}
        turnCount={turnCount}
        mainDeck={mainDeck}
        p1Chips={p1Chips}
        p2Chips={p2Chips}
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
      />
    </GameWrapper>
  );
}

export default Game;
