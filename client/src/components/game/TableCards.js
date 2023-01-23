import React from "react";
import styled from "styled-components";

import FlipCard from "./FlipCard";

const TableCardsWrapper = styled.div`
  width: 275px;
  height: 100px;
  display: flex;
  align-items: center;
`;

const CardWrapper = styled.div`
  margin: 0 5px 0 5px;
`;

function TableCards({ mainDeck, cardLimit }) {
  return (
    <TableCardsWrapper>
      {mainDeck.map((value, index) => {
        if (index >= cardLimit) {
          return;
        }
        return (
          <CardWrapper>
            <FlipCard value={value} />
          </CardWrapper>
        );
      })}
    </TableCardsWrapper>
  );
}

export default TableCards;
