import { useEffect, useState } from "react";
import styled from "styled-components";

import {
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";

const PlayMenuWrapper = styled.div`
  width: 100%;
  background: rgb(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0%;
  padding: 15px;
`;

const StyledButton = styled.button`
  background: rgba(0, 255, 0, 0.2);
  padding: 2px;
  color: white;
  width: 100px;
  height: 25px;
  margin: 10px;
  border-radius: 100px;
  font-weight: 550;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.1);
  }
  &:active {
    box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.2);
  }
`;

const SliderWrapper = styled.div`
  width: 100px;
  margin: 0 20px 0 20px;
  display: flex;
  align-items: center;
`;

const RaiseInput = styled.input`
  width: 100px;
  height: 25px;
  border-radius: 7px;
  padding-right: 5px;
  text-align: right;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: green;
  color: white;
`;

function PlayMenu({
  currentTurn,
  playerNumber,
  p1Chips,
  p2Chips,
  BB,
  raiseAmount,
  increment,
  socket,
  turnCount,
  pot,
  setRaiseAmount,
  p1Bet,
  p2Bet,
  gameStarted,
  p1Cards,
  p2Cards,
  mainDeck,
  startingPlayer,
}) {
  const [functional, setFunctional] = useState(true);
  const [allIn, setAllIn] = useState(false);

  useEffect(
    () => {
      if (
        (playerNumber === 0 && currentTurn === "p2") ||
        (playerNumber === 1 && currentTurn === "p1")
      ) {
        setFunctional(false);
      } else {
        setFunctional(true);
      }
    },
    [currentTurn],
    []
  );

  useEffect(
    () => {
      if (allIn === true && turnCount < 7) {
        setTimeout(
          () => socket.emit("game_state_change", { turnCount: turnCount + 2 }),
          1000
        );
      }
    },
    [allIn, turnCount],
    []
  );

  function callHandler() {
    if (!functional) {
      return;
    }
    const gameState = {
      turnCount: turnCount + 1,
      currentTurn: currentTurn === "p1" ? "p2" : "p1",
      p1Chips: currentTurn === "p1" ? p1Chips - increment : p1Chips,
      p2Chips: currentTurn === "p2" ? p2Chips - increment : p2Chips,
      pot: turnCount % 2 === 0 ? pot + 0 : p1Bet + p2Bet + pot + increment,
      increment: 0,
      p1Bet:
        turnCount % 2 === 0
          ? p1Bet + (currentTurn === "p1" ? increment : 0)
          : 0,
      p2Bet:
        turnCount % 2 === 0
          ? p2Bet + (currentTurn === "p2" ? increment : 0)
          : 0,
    };

    if (turnCount % 2 !== 0) {
      gameState.currentTurn = startingPlayer === "p1" ? "p2" : "p1";
    }

    socket.emit("game_state_change", gameState);

    if (p1Chips === 0 || p2Chips === 0) {
      setFunctional(false);
      setAllIn(true);
    }
  }

  function raiseHandler(e) {
    e.preventDefault();
    if (
      !functional ||
      raiseAmount % BB !== 0 ||
      raiseAmount > Math.min(p1Chips, p2Chips)
    ) {
      return;
    }
    let turnIncrement = turnCount % 2 === 0 ? 1 : 0;
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        increment: raiseAmount,
        pot: pot,
        currentTurn: "p2",
        p1Chips: p1Chips - increment - raiseAmount,
        turnCount: turnCount + turnIncrement,
        p1Bet: p1Bet + raiseAmount + increment,
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        increment: raiseAmount,
        pot: pot,
        currentTurn: "p1",
        p2Chips: p2Chips - increment - raiseAmount,
        turnCount: turnCount + turnIncrement,
        p2Bet: p2Bet + raiseAmount + increment,
      });
    }
    setRaiseAmount(BB);
  }

  function foldHandler() {
    if (!functional) {
      return;
    }
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        winner: "p2",
        restart: true,
        turnCount: -1, //reset turn count
        p1Bet: 0,
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        winner: "p1",
        restart: true,
        turnCount: -1, //reset turn count
        p1Bet: 0,
      });
    }
    if (p1Chips === 0 || p2Chips === 0) {
      socket.emit("game_state_change", { gameOver: true });
    }
  }
  return (
    <PlayMenuWrapper>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          marginLeft: "50px",
        }}
      >
        <StyledButton onClick={() => foldHandler()}>Fold</StyledButton>
        <StyledButton onClick={() => callHandler()}>Call</StyledButton>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "100px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <SliderWrapper>
          <Slider
            onChange={(v) => {
              setRaiseAmount(v);
            }}
            defaultValue={60}
            min={20}
            max={Math.min(p1Chips, p2Chips)}
            step={BB}
          >
            <SliderTrack bg="red.100">
              <Box position="relative" right={10} />
              <SliderFilledTrack bg="green" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </SliderWrapper>
        <RaiseInput
          value={raiseAmount}
          onChange={(v) => {
            setRaiseAmount(parseInt(v.target.value));
          }}
        />
        <StyledButton onClick={(e) => raiseHandler(e)}>Raise</StyledButton>
      </div>
    </PlayMenuWrapper>
  );
}

export default PlayMenu;
