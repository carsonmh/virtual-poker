import {
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";

import styled from "styled-components";

const PlayMenuWrapper = styled.div``;

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
}) {
  function callHandler() {
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        turnCount: turnCount + 1,
        currentTurn: "p2",
        p1Chips: p1Chips - increment,
        p2Chips: p2Chips,
        pot: pot + increment,
        increment: 0,
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        turnCount: turnCount + 1,
        currentTurn: "p1",
        p2Chips: p2Chips - increment,
        p1Chips: p1Chips,
        pot: pot + increment,
        increment: 0,
      });
    }
  }

  function raiseHandler(e) {
    e.preventDefault();
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        increment: raiseAmount,
        pot: pot + raiseAmount + increment,
        currentTurn: "p2",
        p1Chips: p1Chips - increment - raiseAmount,
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        increment: raiseAmount,
        pot: pot + raiseAmount + increment,
        currentTurn: "p1",
        p2Chips: p2Chips - increment - raiseAmount,
      });
    }
  }

  function foldHandler() {
    if (currentTurn === "p1") {
      socket.emit("game_state_change", {
        winner: "p2",
        restart: true,
        turnCount: -1, //reset turn count
      });
    } else if (currentTurn === "p2") {
      socket.emit("game_state_change", {
        winner: "p1",
        restart: true,
        turnCount: -1, //reset turn count
      });
    }
  }

  return (
    <PlayMenuWrapper>
      {(currentTurn === "p1" && playerNumber === 0) ||
      (currentTurn === "p2" && playerNumber === 1) ? (
        <div>
          <Button onClick={() => foldHandler()}>Fold</Button>
          <Button onClick={() => callHandler()}>Call</Button>
          <div style={{ display: "flex" }}>
            {Math.min(p1Chips, p2Chips) > 0 ? (
              <>
                <div style={{ width: "50%" }}>
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
                      <SliderFilledTrack bg="blue" />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                </div>
                <Button onClick={(e) => raiseHandler(e)}>Raise</Button>
                <div>{raiseAmount}</div>
              </>
            ) : (
              <div></div>
            )}
          </div>
          <div>increment: {increment}</div>
        </div>
      ) : (
        <div></div>
      )}
    </PlayMenuWrapper>
  );
}

export default PlayMenu;
