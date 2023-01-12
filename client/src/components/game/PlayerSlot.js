import styled from "styled-components";
import Card from "./Card";

import { useEffect, useState } from "react";

const BlankCard = styled.div`
  width: 45px;
  height: 70px;
  justify-content: space-around;
  border: solid 1.5px white;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  color: red;
  font-weight: bold;
`;

const PlayerSlotDiv = styled.div`
  border-radius: 1000px;
  padding: 15px;
  height: 30px;
  background: white;
  color: black;
  text-align: center;
  margin: 0px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.6);
  z-index: 5;
`;

const CardWrapper = styled.div`
  height: 70px;
  width: 100px;
  display: flex;
  justify-content: space-around;
  padding: 0;
  z-index: 0;
  position: relative;
  top: 6px;
`;

const InnerText = styled.p`
  font-size: 14px;
`;

const PlayerSlotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function PlayerSlot({
  user,
  chips,
  cards,
  currentTurn,
  playerNumber,
  isCurrentUser,
  showCards,
}) {
  const [thisTurn, setThisTurn] = useState(false);
  useEffect(
    () => {
      if (
        (playerNumber === 0 && currentTurn === "p1") ||
        (playerNumber === 1 && currentTurn === "p2" && showCards === false)
      ) {
        setThisTurn(true);
      } else {
        setThisTurn(false);
      }
    },
    [currentTurn],
    []
  );

  return (
    <PlayerSlotWrapper style={{ opacity: thisTurn ? "100%" : "50%" }}>
      <CardWrapper>
        {showCards || isCurrentUser ? (
          <>
            <Card card={cards[0]} />
            <Card card={cards[1]} />
          </>
        ) : (
          <>
            <BlankCard>HU</BlankCard>
            <BlankCard>HU</BlankCard>
          </>
        )}
      </CardWrapper>
      <PlayerSlotDiv>
        <InnerText>
          {user} {isCurrentUser ? <span>(you)</span> : <span></span>} / {chips}
        </InnerText>
      </PlayerSlotDiv>
    </PlayerSlotWrapper>
  );
}

export default PlayerSlot;
