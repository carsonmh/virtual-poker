import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Bars } from "react-loader-spinner";

import StyledButton from "../../buttons/StyledButton";

function GameQueue({ socket, message, showButton }) {
  function handleLeaveMatchmaking() {
    socket.emit("leave_matchmaking");
  }
  return (
    <>
      <div style={{ height: "75px" }}>
        {showButton ? (
          <Link to={"/dashboard"}>
            <StyledButton
              style={{
                position: "absolute",
                left: "2%",
                top: "2%",
              }}
              onClick={handleLeaveMatchmaking}
            >
              Leave Matchmaking
            </StyledButton>
          </Link>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80%",
        }}
      >
        <div
          style={{ color: "#85BF99", fontSize: "20px", marginBottom: "10px" }}
        >
          {message}
        </div>
        <Bars
          height="120"
          width="120"
          color="#4fa94d"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </>
  );
}

export default GameQueue;
