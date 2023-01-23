import styled from "styled-components";

const GameLogWrapper = styled.div`
  width: 300px;
  height: 150px;
  background: rgba(255, 255, 255);
  border-radius: 5px 5px 0px 0px;
  border: 2px solid black;
  border-bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 20px;
  bottom: 0%;
  position: absolute;
  z-index: 999;
`;

function GameLog() {
  return (
    <GameLogWrapper>
      <h1>Game Log</h1>
    </GameLogWrapper>
  );
}

export default GameLog;
