import styled from "styled-components";

import CountdownTimer from "../timers/CountdownTimer";

const RestartMesageWrapper = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  background: yellow;
  top: 80%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function RestartMessage({ message, time }) {
  return (
    <>
      <RestartMesageWrapper>
        <div>{message}</div>
        <div>
          <CountdownTimer seconds={time} /> until next round...
        </div>
      </RestartMesageWrapper>
    </>
  );
}

export default RestartMessage;
