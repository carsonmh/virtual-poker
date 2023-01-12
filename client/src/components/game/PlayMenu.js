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
  background: rgba(85, 160, 110, 0.6);
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
  background: rgba(85, 160, 110, 0.4);
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
  SB,
  functional,
  setFunctional,
}) {
  const [allIn, setAllIn] = useState(false);
  const [raiseButtonVisible, setRaiseButtonVisible] = useState(true);
  const [raising, setRaising] = useState(false);
  let playerChips = [p1Chips, p2Chips];

  useEffect(() => {
    const maxBet = 10 + Math.max(p1Bet, p2Bet);
    console.log(maxBet);
    setRaiseAmount(maxBet);
  }, [currentTurn, turnCount, p1Bet, p2Bet]);

  function canRaise() {
    if (
      raiseAmount % SB !== 0 ||
      raiseAmount > Math.min(p1Chips + p1Bet, p2Chips + p2Bet)
    ) {
      return false;
    } else {
      return true;
    }
  }

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
      if (!canRaise()) {
        setRaiseButtonVisible(false);
      } else {
        setRaiseButtonVisible(true);
      }
    },
    [raiseAmount, increment],
    []
  );

  useEffect(
    () => {
      if (allIn === true && turnCount < 7) {
        socket.emit("game_state_change", {
          showCards: true,
        });
        setTimeout(
          () =>
            socket.emit("game_state_change", {
              turnCount: turnCount + 2,
            }),
          1000
        );
      }
      if (turnCount === 8) {
        setAllIn(false);
      }
    },
    [allIn, turnCount],
    []
  );

  function callHandler() {
    if (!functional) {
      return;
    }
    const increment = Math.abs(p1Bet - p2Bet);
    const gameState = {
      turnCount: turnCount + 1,
      currentTurn: currentTurn === "p1" ? "p2" : "p1",
      p1Chips: currentTurn === "p1" ? p1Chips - increment : p1Chips,
      p2Chips: currentTurn === "p2" ? p2Chips - increment : p2Chips,
      pot: turnCount % 2 === 0 ? pot + 0 : p1Bet + p2Bet + pot + increment,
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

    const p1ChipsTemp = p1Chips;
    const p2ChipsTemp = p2Chips;

    if (p1ChipsTemp === 0 || p2ChipsTemp === 0) {
      setFunctional(false);
      setAllIn(true);
      socket.emit("game_state_change", { currentTurn: "none" });
    }
  }

  function raiseHandler(e) {
    e.preventDefault();
    if (!functional || !canRaise()) {
      return;
    }
    if (!raising) {
      setRaising(true);
      return;
    }
    let turnIncrement = turnCount % 2 === 0 ? 1 : 0;
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        pot: pot,
        currentTurn: "p2",
        p1Chips: p1Chips - (raiseAmount - p1Bet),
        turnCount: turnCount + turnIncrement,
        p1Bet: raiseAmount,
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        increment: raiseAmount,
        pot: pot,
        currentTurn: "p1",
        p2Chips: p2Chips - (raiseAmount - p2Bet),
        turnCount: turnCount + turnIncrement,
        p2Bet: raiseAmount,
      });
    }
    setRaiseAmount(10 + Math.max(p1Bet, p2Bet));
    setRaising(false);
  }

  function foldHandler() {
    if (!functional) {
      return;
    }
    const newGameState = {
      winner: currentTurn === "p1" ? "p2" : "p1",
      restart: true,
      turnCount: -1, //reset turn count
    };
    socket.emit("game_state_change", newGameState);
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
        <StyledButton
          style={{ background: "rgb(156, 60, 53)" }}
          onClick={() => foldHandler()}
        >
          Fold
        </StyledButton>
        <StyledButton
          style={{ background: "rgb(69, 91, 173)" }}
          onClick={() => callHandler()}
        >
          Call
          <span
            style={{ color: "yellow", marginLeft: functional ? "7px" : "0" }}
          >
            {functional ? Math.abs(p1Bet - p2Bet) : ""}
          </span>
        </StyledButton>
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
        {raising ? (
          <>
            <SliderWrapper>
              <Slider
                onChange={(v) => {
                  setRaiseAmount(v);
                }}
                // defaultValue={10 + Math.max(p1Bet, p2Bet)}
                min={10 + Math.max(p1Bet, p2Bet)}
                max={Math.min(p1Chips + p1Bet, p2Chips + p2Bet)}
                step={SB}
                value={raiseAmount}
              >
                <SliderTrack bg="red.100">
                  <Box position="relative" right={10} />
                  <SliderFilledTrack bg="#85BF99" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </SliderWrapper>
            <RaiseInput
              value={raiseAmount}
              onChange={(v) => {
                if (v.target.value && !isNaN(v.target.value)) {
                  setRaiseAmount(parseInt(v.target.value));
                }
              }}
            />{" "}
          </>
        ) : null}
        <StyledButton
          style={{
            width: "125px",
            visibility: raiseButtonVisible ? "visible" : "hidden",
          }}
          onClick={(e) => raiseHandler(e)}
        >
          Raise{" "}
          {raising ? (
            <>
              <span style={{ marginLeft: "5px" }}>
                {functional ? "to" : ""}
              </span>
              <span style={{ color: "yellow", marginLeft: "7px" }}>
                {functional ? raiseAmount : ""}
              </span>
            </>
          ) : null}
        </StyledButton>
      </div>
    </PlayMenuWrapper>
  );
}

export default PlayMenu;
