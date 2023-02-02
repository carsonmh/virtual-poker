import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import userContext from "../../../contexts/user/userContext";
import StyledButton from "../../buttons/StyledButton";
import { computeEloChange, getOpponent } from "../../../utils/Utils";
import { flexbox } from "@chakra-ui/react";

const LeaveGameButton = styled.StyledButton`
  background: #ad1822;
  fontsize: 18px;
  position: relative;
  top: 90px;
  color: white;
  fontweight: bold;
  marginright: auto;
  marginleft: auto;
`;

const GameOverPopupWrapper = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  width: 375px;
  height: 275px;
  background: white;
  color: black;
  box-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

function GameOverPopup({
  users,
  isWinner,
  showPopup,
  setShowPopUp,
  opponentDisconnected,
  socket,
}) {
  const { user, setUser } = useContext(userContext);
  return (
    <GameOverPopupWrapper>
      <div
        style={{
          textAlign: "right",
          marginRight: "10px",
          fontWeight: "bold",
          fontSize: "17px",
          cursor: "pointer",
        }}
        onClick={() => {
          setShowPopUp(false);
        }}
      >
        x
      </div>
      {isWinner ? (
        <h1 style={{ fontWeight: "bold", fontSize: "30px", color: "green" }}>
          You Win
        </h1>
      ) : (
        <h1 style={{ fontWeight: "bold", fontSize: "30px", color: "red" }}>
          You Lose
        </h1>
      )}
      <p>{opponentDisconnected ? "Opponent Disconnected" : "Game Ended"}</p>
      <p>
        Poker Rank:{" "}
        {Math.round(
          computeEloChange(
            user.points,
            getOpponent(users, user).points,
            isWinner
          )
        )}{" "}
        {user.points <
        computeEloChange(
          user.points,
          getOpponent(users, user).points,
          isWinner
        ) ? (
          <span style={{ color: "green" }}>
            (+
            {Math.abs(
              Math.round(
                user.points -
                  computeEloChange(
                    user.points,
                    getOpponent(users, user).points,
                    isWinner
                  )
              )
            )}
            )
          </span>
        ) : (
          <span style={{ color: "red" }}>
            (-
            {Math.abs(
              user.points -
                computeEloChange(
                  user.points,
                  getOpponent(users, user).points,
                  isWinner
                )
            )}
            )
          </span>
        )}
      </p>
      <Link to={"/dashboard"}>
        <LeaveGameButton
          onClick={() => {
            socket.emit("leave_game");
          }}
        >
          Back to Menu
        </LeaveGameButton>
      </Link>
    </GameOverPopupWrapper>
  );
}

export default GameOverPopup;
