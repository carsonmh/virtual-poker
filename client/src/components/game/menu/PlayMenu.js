import { useEffect, useState } from "react";
import styled from "styled-components";

import CallButton from "./CallButton";
import MenuButton from "./MenuButton";
import RaiseSlider from "./RaiseSlider";

const RaiseContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  marginleft: 100px;
  width: 100%;
  align-items: center;
`;

const PlayMenuWrapper = styled.div`
  width: 100%;
  background: rgb(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0%;
  padding: 15px;
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
  gameOver,
}) {
  const [allIn, setAllIn] = useState(false);
  const [raiseButtonVisible, setRaiseButtonVisible] = useState(true);
  const [raising, setRaising] = useState(false);

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
        (playerNumber === 0 && currentTurn === "p1") ||
        (playerNumber === 1 && currentTurn === "p2")
      ) {
        setFunctional(true);
      } else {
        setFunctional(false);
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

    if (p1Chips - increment === 0 || p2Chips - increment === 0) {
      setFunctional(false);
      setAllIn(true);
      socket.emit("game_state_change", { currentTurn: "none" });
    }
    setRaising(false);
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
    setRaising(false);
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
        <MenuButton
          style={{
            background: "rgb(156, 60, 53)",
            opacity: functional ? "100%" : "75%",
          }}
          onClick={() => foldHandler()}
        >
          Fold
        </MenuButton>
        <CallButton
          functional={functional}
          p1Bet={p1Bet}
          p2Bet={p2Bet}
          callHandler={callHandler}
        />
      </div>
      <RaiseContentWrapper>
        {raising ? (
          <>
            <RaiseSlider
              p1Bet={p1Bet}
              p2Bet={p2Bet}
              p1Chips={p1Chips}
              p2Chips={p2Chips}
              raiseAmount={raiseAmount}
              setRaiseAmount={setRaiseAmount}
              SB={SB}
            />
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
        <MenuButton
          style={{
            width: raising ? "125px" : "115px",
            visibility: raiseButtonVisible ? "visible" : "hidden",
            opacity: functional ? "100%" : "75%",
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
        </MenuButton>
      </RaiseContentWrapper>
    </PlayMenuWrapper>
  );
}

export default PlayMenu;
