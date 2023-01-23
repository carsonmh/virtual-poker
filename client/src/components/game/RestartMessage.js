import styled from "styled-components";

import CountdownTimer from "../timers/CountdownTimer";

const RestartMesageWrapper = styled.div`
  position: absolute;
  height: 100px;
  width: 210px;
  top: 80%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: bold;
`;

function RestartMessage({ message, time }) {
  return (
    <>
      {message ? (
        <RestartMesageWrapper>
          <div>{message}</div>
          <div style={{ fontSize: "15px", color: "rgba(225, 225, 225, .7)" }}>
            <CountdownTimer seconds={time} /> seconds until next round
          </div>
        </RestartMesageWrapper>
      ) : null}
    </>
  );
}

export default RestartMessage;
