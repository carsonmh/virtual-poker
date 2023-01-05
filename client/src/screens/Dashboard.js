import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import userContext from "../contexts/user/userContext";
import { handleGoogleLogout } from "../auth/auth";
import { useNavigate } from "react-router";
import styled from "styled-components";

const StyledButton = styled.button`
  background: white;
  border-radius: 30px;
  padding: 10px;
`;

function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.loggedIn) {
      return navigate("/");
    }
  }, [user.loggedIn]);
  return (
    <>
      <button onClick={(e) => !handleGoogleLogout(e, setUser)}>logout</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1>Elo: {user.points}</h1>
        <div
          style={{
            alignItems: "center",
            background: "blue",
            display: "flex",
            flexDirection: "column",
            height: "100px",
            justifyContent: "space-between",
          }}
        >
          <Link to={"/private-game"}>
            <StyledButton>Private Game</StyledButton>
          </Link>
          <Link>
            <StyledButton>Online Multiplayer</StyledButton>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
