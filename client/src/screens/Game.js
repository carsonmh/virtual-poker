import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

import Board from "../components/game/Board";
import PlayMenu from "../components/game/PlayMenu";
import { makeDeck } from "../components/game/Deck";
import {
  computeEloChange,
  determineWinner,
  getUserFromPlayerString,
  getOpponent,
} from "../utils/Utils";
import userContext from "../contexts/user/userContext";
import {
  startGame,
  gameTurnOne,
  resetGameState,
  endGame,
} from "../utils/GameFunctions";
import GameOverPopup from "../components/game/GameOverPopup";
import { auth } from "../config/firebase-config";

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
  const [functional, setFunctional] = useState(true);
  const [showPopUp, setShowPopUp] = useState(true);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [isWinner, setIsWinner] = useState(null);

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    if (opponentDisconnected) {
      setIsWinner(true);
    } else {
      if (
        (winner === "p1" && playerNumber === 0) ||
        (winner === "p2" && playerNumber === 1)
      ) {
        setIsWinner(true);
      } else {
        setIsWinner(false);
      }
    }
  }, [opponentDisconnected, winner]);

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

  socket.on("game_state_change", (state) => {
    setGameState((gameState) => ({ ...gameState, ...state }));
  });

  socket.on("opponent_disconnected", (userData) => {
    setGameState((gameState) => ({
      ...gameState,
      gameOver: true,
      currentTurn: "none",
    }));
    setFunctional(false);
    setOpponentDisconnected(true);
    axios.post("http://10.0.0.145:3001/api/update-elo", {
      userId: userData.uid,
      newElo: computeEloChange(
        getOpponent(users, user).points,
        userData.points,
        false
      ),
    });
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
            (p1Chips === 0 || p2Chips === 0) &&
            determineWinner(p1Cards, p2Cards, mainDeck) !== "tie"
          ) {
            socket.emit("game_state_change", { gameOver: true });
          } else {
            setFunctional(true);
            setGameState((gameState) => ({ ...gameState, showCards: false }));
          }
          if (playerNumber === 0) {
            socket.emit("game_state_change", {
              restart: true,
              winner: determineWinner(p1Cards, p2Cards, mainDeck),
            });
          }
        }, 2000);
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
    } else if (
      restart &&
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

  useEffect(() => {
    if (gameOver === true) {
      setFunctional(false);
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
        console.log("false");
      }
      axios.post("http://10.0.0.145:3001/api/update-elo", {
        userId: user.uid,
        newElo: computeEloChange(
          user.points,
          getOpponent(users, user).points,
          isWinner
        ),
      });
    }
  }, [gameOver]);

  // useEffect(() => {
  //   if (!gameStarted) {
  //   }
  // }, [gameStarted]);
  if (!gameStarted) {
    return <div>waiting room</div>;
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
        gameOver={gameOver}
      />
      {gameOver && showPopUp ? (
        <GameOverPopup
          isWinner={isWinner}
          showPopup={showPopUp}
          setShowPopUp={setShowPopUp}
          users={users}
          opponentDisconnected={opponentDisconnected}
        />
      ) : null}
    </GameWrapper>
  );
}

export default Game;
