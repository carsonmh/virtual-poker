import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import userContext from "../../contexts/user/userContext";
import StyledButton from "../StyledButton";
import { computeEloChange, getOpponent } from "../../utils/Utils";

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
      <p>
        {opponentDisconnected
          ? "Opponent Disconnected"
          : "You Beat The Other Player"}
      </p>
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
        <StyledButton
          style={{
            background: "#ad1822",
            fontSize: "18px",
            position: "relative",
            top: "90px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Back to Menu
        </StyledButton>
      </Link>
    </GameOverPopupWrapper>
  );
}

export default GameOverPopup;
