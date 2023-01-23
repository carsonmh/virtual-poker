import styled from "styled-components";
import Card from "../cards/Card";
import BlankCard from "../cards/BlankCard";

import { useEffect, useState } from "react";

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

const InnerText = styled.div`
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
      <div
        style={{
          position: "absolute",
          width: "115px",
          height: "115px",
          background: "rgba(255, 255, 255, .1)",
          borderRadius: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "0",
          visibility: thisTurn ? "visible" : "hidden",
          transform: "translateY(-7px)",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, .2)",
            borderRadius: "1000px",
          }}
        ></div>
      </div>
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
        <div
          style={{
            textOverflow: "ellipsis",
            maxWidth: "100px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {user}
        </div>
        &nbsp;
        {isCurrentUser ? <span>(you)&nbsp;</span> : <span></span>} / {chips}
      </PlayerSlotDiv>
    </PlayerSlotWrapper>
  );
}

export default PlayerSlot;
