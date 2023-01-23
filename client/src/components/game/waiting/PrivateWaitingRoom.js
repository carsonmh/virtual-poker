import styled from "styled-components";
import { Link } from "react-router-dom";

import StyledButton from "../../buttons/StyledButton";

function PrivateRoomWaiting({ socket, roomCode }) {
  return (
    <>
      <Link to={"/dashboard"}>
        <StyledButton
          style={{
            position: "relative",
            left: "2%",
            top: "2%",
          }}
        >
          Leave Waiting Room
        </StyledButton>
      </Link>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "85%",
        }}
      >
        <div
          style={{ color: "#85BF99", fontSize: "40px", marginBottom: "10px" }}
        >
          Game Code: <span style={{ fontWeight: "bold" }}>{roomCode}</span>
        </div>
        <div
          style={{ color: "#85BF99", fontSize: "30px", marginBottom: "10px" }}
        >
          Waiting for opponent to join
        </div>
      </div>
    </>
  );
}

export default PrivateRoomWaiting;
