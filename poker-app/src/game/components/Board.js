import PlayerSlot from "./PlayerSlot";
import styled from "styled-components";
import Card from "./Card";

import BetAmount from "../components/BetAmount";

const BoardDiv = styled.div`
  width: 500px;
  height: 250px;
  background: rgb(255, 255, 255, 0.2);
  border: 5px solid rgb(120, 120, 120, 0.8);
  border-radius: 300px;
  box-shadow: 0px 3px 5px 7px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoardWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 10px 0;
`;

const TableCardsWrapper = styled.div`
  width: 275px;
  height: 100px;
  display: flex;
  align-items: center;
`;

const CardWrapper = styled.div`
  margin: 0 5px 0 5px;
`;

const PotDiv = styled.div`
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  border-radius: 100px;
  padding: 10px;
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
}) {
  let cardLimit = 0;
  switch (turnCount) {
    case 2:
      cardLimit = 3;
      break;
    case 3:
      cardLimit = 3;
      break;
    case 4:
      cardLimit = 4;
      break;
    case 5:
      cardLimit = 4;
      break;
    case 6:
      cardLimit = 5;
      break;
    case 7:
      cardLimit = 5;
      break;
    case 8:
      cardLimit = 5;
      break;
  }
  return (
    <BoardWrapper>
      {playerNumber === 0 ? (
        <PlayerSlot
          user={users
            .filter((user) => user.playerNumber === 1)
            .map((user) => user.username)}
          chips={p2Chips}
          cards={p2Cards}
          currentTurn={currentTurn}
          playerNumber={1}
        />
      ) : (
        <PlayerSlot
          user={users
            .filter((user) => user.playerNumber === 0)
            .map((user) => user.username)}
          chips={p1Chips}
          cards={p1Cards}
          currentTurn={currentTurn}
          playerNumber={0}
        />
      )}
      <BoardDiv>
        {playerNumber === 0 ? (
          <BetAmount betAmount={p2Bet} top={"-25px"} />
        ) : (
          <BetAmount betAmount={p1Bet} top={"-25px"} />
        )}
        <PotDiv>
          <div>
            Total Pot: <strong>{pot}</strong>
          </div>
        </PotDiv>
        <TableCardsWrapper>
          {mainDeck.map((value, index) => {
            if (index >= cardLimit) {
              return;
            }
            return (
              <CardWrapper>
                <Card card={value} />
              </CardWrapper>
            );
          })}
        </TableCardsWrapper>
        {playerNumber === 0 ? (
          <BetAmount betAmount={p1Bet} top={"25px"} />
        ) : (
          <BetAmount betAmount={p2Bet} top={"25px"} />
        )}
      </BoardDiv>
      {playerNumber === 0 ? (
        <PlayerSlot
          user={users
            .filter((user) => user.playerNumber === 0)
            .map((user) => user.username)}
          chips={p1Chips}
          cards={p1Cards}
          currentTurn={currentTurn}
          playerNumber={0}
        />
      ) : (
        <PlayerSlot
          user={users
            .filter((user) => user.playerNumber === 1)
            .map((user) => user.username)}
          chips={p2Chips}
          cards={p2Cards}
          currentTurn={currentTurn}
          playerNumber={1}
        />
      )}
    </BoardWrapper>
  );
}

export default Board;
