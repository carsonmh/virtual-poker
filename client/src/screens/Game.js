import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Board from "../components/game/Board";
import PlayMenu from "../components/game/PlayMenu";
import { makeDeck } from "../components/game/Deck";
import {
  determineWinner,
  getUserFromPlayerString,
  computeEloChange,
} from "../utils/Utils";
import userContext from "../contexts/user/userContext";
import {
  startGame,
  gameTurnOne,
  resetGameState,
  endGame,
} from "../utils/GameFunctions";

const GameWrapper = styled.div`
  display: grid;
  text-align: center;
  align-items: space-between;
`;

const GameOverPopup = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  width: 375px;
  height: 275px;
  background: white;
  color: black;
  box-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.2);
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
    showCards: false,
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
    showCards,
  } = gameState;

  const [raiseAmount, setRaiseAmount] = useState(0);
  const [isCurrentTurn, setIsCurrentTurn] = useState("");
  const [functional, setFunctional] = useState(true);
  const [showPopUp, setShowPopUp] = useState(true);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

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
        startGame(socket);
      }
    }
  }, []);

  socket.on("game_starting", () => {
    if (gameStarted === false) {
      startGame(socket);
    }
  });

  socket.on("game_state_change", (state) => {
    setGameState((gameState) => ({ ...gameState, ...state }));
  });

  socket.on("opponent_disconnected", () => {
    setGameState((gameState) => ({
      ...gameState,
      gameOver: true,
    }));
    setOpponentDisconnected(true);
  });

  useEffect(() => {
    switch (turnCount) {
      case 0:
        // if (p1Chips === 0 || p2Chips === 0) {
        //   socket.emit("game_state_change", { gameOver: true });
        // }
        if (gameOver) break;
        gameTurnOne(
          socket,
          currentTurn,
          p1Chips,
          p2Chips,
          SB,
          BB,
          playerNumber
        );
        break;
      case 8:
        setGameState((gameState) => ({ ...gameState, showCards: true }));
        setFunctional(false);
        setTimeout(() => {
          if (
            p1Chips === 0 ||
            (p2Chips === 0 &&
              determineWinner(p1Cards, p2Cards, mainDeck) !== "tie")
          ) {
            socket.emit("game_state_change", { gameOver: true });
          } else {
            setGameState((gameState) => ({ ...gameState, showCards: false }));
          }
          if (playerNumber === 0) {
            socket.emit("game_state_change", {
              restart: true,
              winner: determineWinner(p1Cards, p2Cards, mainDeck),
            });
          }
        }, 3000);
        break;
    }
  }, [turnCount]);

  useEffect(() => {
    const deck = makeDeck();
    const tp1Cards = deck.splice(0, 2);
    const tp2Cards = deck.splice(0, 2);
    const tmainDeck = deck.splice(0, 5);
    if (gameOver) {
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
    }
    if (
      restart &&
      !gameOver &&
      (winner === "p1" || winner === "p2" || winner === "tie")
    )
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
    setGameState((gameState) => ({ ...gameState, restart: false }));
  }, [restart]);

  if (gameOver === true) {
    let isWinner = endGame(
      playerNumber,
      opponentDisconnected,
      p1Cards,
      p2Cards,
      mainDeck,
      users,
      user
    );
    if (isWinner === null) {
      return <div>There was an error</div>;
    }
    console.log(isWinner);
    //   axios.post("http://localhost:3001/api/update-elo", {
    //     userId: user.uid,
    //     elo: eloChange
    //   })
    // return <div>game over. Winner: bruh</div>;
  }

  if (gameStarted === false) {
    return <div>waiting room, code: {user.code}</div>;
  }

  return (
    <GameWrapper>
      {!gameOver ? (
        <div style={{ height: "75px" }}>
          <div>View from player {playerNumber + 1}</div>
          <div>Room code: {user.code}</div>
          <div>
            {currentTurn}
            's turn
          </div>
        </div>
      ) : (
        <div style={{ height: "75px" }}>
          <div>Game Over</div>
          <div>
            Winner:{" "}
            {
              getUserFromPlayerString(
                determineWinner(p1Cards, p2Cards, mainDeck),
                users
              ).username
            }
          </div>
          <div>
            <Link to={"/dashboard"}>Leave</Link>
          </div>
        </div>
      )}
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
        showCards={showCards}
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
        functional={functional}
        setFunctional={setFunctional}
      />
      {gameOver && showPopUp ? (
        <GameOverPopup>
          <div
            style={{
              textAlign: "right",
            }}
            onClick={() => {
              setShowPopUp(false);
            }}
          >
            X
          </div>
          Game Over
        </GameOverPopup>
      ) : null}
    </GameWrapper>
  );
}

export default Game;
