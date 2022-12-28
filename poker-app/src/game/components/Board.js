import PlayerSlot from "./PlayerSlot";
import styled from "styled-components";

const BoardDiv = styled.div`
  width: 500px;
  height: 250px;
  background: rgb(255, 255, 255, 0.2);
  border: 5px solid rgb(120, 120, 120, 0.8);
  border-radius: 300px;
  box-shadow: 0px 3px 5px 7px rgba(0, 0, 0, 0.2);
`;

const BoardWrapper = styled.div`
  display: flex;
  width: 100%;
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
}) {
  console.log(users);
  return (
    <>
      <BoardWrapper>
        {playerNumber === 0 ? (
          <>
            <PlayerSlot
              user={users.length > 1 ? "Player 2" : "Empty"}
              chips={p2Chips}
            />
            <BoardDiv>
              <p style={{ color: "white" }}>pot: {pot}</p>
            </BoardDiv>
            <PlayerSlot user={"Player 1"} chips={p1Chips} />
          </>
        ) : (
          <>
            <PlayerSlot user={"Player 2"} chips={p2Chips} />
            <BoardDiv>
              <p style={{ color: "white" }}>pot: {pot}</p>
            </BoardDiv>
            <PlayerSlot user={"Player 1"} chips={p1Chips} />
          </>
        )}
      </BoardWrapper>
    </>
  );
}

export default Board;
