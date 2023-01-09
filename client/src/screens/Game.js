import Board from "../components/game/Board";
import PlayMenu from "../components/game/PlayMenu";
import { makeDeck } from "../components/game/Deck";
import { determineWinner } from "../utils/GameFunctions";

import React, { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import userContext from "../contexts/user/userContext";

const GameWrapper = styled.div`
  display: grid;
  text-align: center;
  align-items: space-between;
`;

function Game({ roomCode, socket, users }) {
  const initialState = {
    playerNumber: 0,
    p1Chips: 0,
    p2Chips: 0,
    gameStarted: false,
    currentTurn: "p1",
    turnCount: -1,
    winner: "",
    BB: 20,
    SB: 10,
    pot: 0,
    increment: 0,
    p1Cards: [],
    p2Cards: [],
    mainDeck: [],
    restart: false,
    p1Bet: 0,
    p2Bet: 0,
    gameOver: false,
    startingPlayer: "",
    testWord: "",
  };
  const [gameState, setGameState] = useState(initialState);
  const {
    playerNumber,
    p1Chips,
    p2Chips,
    gameStarted,
    currentTurn,
    turnCount,
    winner,
    BB,
    SB,
    pot,
    increment,
    p1Cards,
    p2Cards,
    mainDeck,
    restart,
    p1Bet,
    p2Bet,
    gameOver,
    startingPlayer,
    testWord,
  } = gameState;

  const [raiseAmount, setRaiseAmount] = useState(0);
  const [isCurrentTurn, setIsCurrentTurn] = useState("");

  const { user, setUser } = useContext(userContext);

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
    setGameState((gameState) => ({
      ...gameState,
      playerNumber: user.playerNumber,
    }));

    if (users.length > 1) {
      setGameState((gameState) => ({
        ...gameState,
        playerNumber: user.playerNumber,
      }));
      if (!gameStarted) {
        startGame();
      }
    }
  }, []);

  function startGame() {
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

  socket.on("game_starting", () => {
    if (gameStarted === false) {
      startGame();
    }
  });

  socket.on("game_state_change", (state) => {
    setGameState((gameState) => ({ ...gameState, ...state }));
  });

  useEffect(() => {
    setRaiseAmount(BB);
    switch (turnCount) {
      case 0:
        if (p1Chips === 0 || p2Chips === 0) {
          socket.emit("game_state_change", { gameOver: true });
        }
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
        break;
      // case 2:
      //   setTestWord("flipping the flop");
      //   break;
      // case 4:
      //   setTestWord("flipping the turn");
      //   break;
      // case 6:
      //   setTestWord("flipping the river");
      //   break;
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
    setGameState((gameState) => ({ ...gameState, restart: false }));
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
      <div style={{ height: "75px" }}>
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
        gameState={gameState}
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
        SB={SB}
      />
    </GameWrapper>
  );
}

export default Game;
