import React, { useEffect, useState } from "react";
import styled from "styled-components";

import PlayerSlot from "./PlayerSlot";
import BetAmount from "./BetAmount";
import RestartMessage from "../message/RestartMessage";
import TableCards from "./TableCards";
import Pot from "./Pot";

const BoardDiv = styled.div`
  width: 500px;
  height: 250px;
  background: rgb(255, 255, 255, 0.2);
  border: 5px solid rgb(120, 120, 120, 0.8);
  border-radius: 300px;
  // box-shadow: 0px 3px 5px 7px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoardWrapper = styled.div`
  position: relative;
  top: 13%;
  display: flex;
  width: 600px;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 10px 0;
`;

function Board({
  playerNumber,
  pot,
  users,
  turnCount,
  mainDeck,
  p1Chips,
  p2Chips,
  p1Cards,
  p2Cards,
  p1Bet,
  p2Bet,
  currentTurn,
  gameState,
  showCards,
  restartMessage,
}) {
  function getOtherPlayer(playerNumber) {
    if (playerNumber === 0) {
      return 1;
    } else {
      return 0;
    }
  }
  let cardLimit = 0;
  switch (turnCount) {
    case 2:
    case 3:
      cardLimit = 3;
      break;
    case 4:
    case 5:
      cardLimit = 4;
      break;
    case 6:
    case 7:
    case 8:
      cardLimit = 5;
      break;
  }
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <BoardWrapper>
        <PlayerSlot
          user={users
            .filter(
              (user) => user.playerNumber === getOtherPlayer(playerNumber)
            )
            .map((user) => user.username)}
          chips={playerNumber === 0 ? p2Chips : p1Chips}
          cards={playerNumber === 0 ? p2Cards : p1Cards}
          currentTurn={currentTurn}
          playerNumber={getOtherPlayer(playerNumber)}
          isCurrentUser={false}
          showCards={showCards}
        />
        <BoardDiv>
          <BetAmount
            betAmount={playerNumber === 0 ? p2Bet : p1Bet}
            top={"-25px"}
          />
          <Pot pot={pot} />
          <TableCards mainDeck={mainDeck} cardLimit={cardLimit} />
          <BetAmount
            betAmount={playerNumber === 0 ? p1Bet : p2Bet}
            top={"25px"}
          />
        </BoardDiv>
        <PlayerSlot
          user={users
            .filter((user) => user.playerNumber === playerNumber)
            .map((user) => user.username)}
          chips={playerNumber === 0 ? p1Chips : p2Chips}
          cards={playerNumber === 0 ? p1Cards : p2Cards}
          currentTurn={currentTurn}
          playerNumber={playerNumber}
          isCurrentUser={true}
          showCards={showCards}
        />
        <RestartMessage message={restartMessage} time={3} />
      </BoardWrapper>
    </div>
  );
}

export default Board;
