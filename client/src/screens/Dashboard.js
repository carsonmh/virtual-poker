import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import styled from "styled-components";

import userContext from "../contexts/user/userContext";
import { handleGoogleLogout, logUserIn } from "../auth/auth";
import { generateRoomCode } from "../utils/Utils";

const StyledButton = styled.button`
  background: white;
  border-radius: 30px;
  padding: 10px;
`;

const Navbar = styled.div`
  width: 100%;
  height: 50px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.3);
`;

const NavItem = styled.li`
  list-style: none;
  margin: 10px;
`;

function Dashboard({ socket }) {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  function handleRoomNameChange(e) {
    const value = e.target.value;
    setUser((user) => ({ ...user, code: value }));
  }

  function handleCreateRoom(e) {
    e.preventDefault();
    const code = generateRoomCode();
    setUser((user) => ({ ...user, code: code }));
    navigate("/private-game");
    socket.emit("join_room", { ...user, code: code, createRoom: true });
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    navigate("/private-game");
    socket.emit("join_room", { ...user, code: user.code, createRoom: false });
  }

  useEffect(() => {
    logUserIn(setUser);
  }, []);

  useEffect(() => {
    //checking if the user was logged out using logout button
    if (!user.loggedIn && !localStorage.getItem("user-token")) {
      return navigate("/");
    }
  }, [user.loggedIn]);

  return (
    <>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <Navbar>
          <ul
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: 0,
              padding: 0,
              alignItems: "center",
            }}
          >
            <NavItem style={{ marginRight: "auto" }}>
              <button onClick={() => !handleGoogleLogout(setUser)}>
                logout
              </button>
            </NavItem>
            <NavItem>
              <h1>Elo: {user.points}</h1>
            </NavItem>
            <NavItem>
              <h1>Username: {user.username}</h1>
            </NavItem>
          </ul>
        </Navbar>
        <div
          style={{
            height: "95%",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "blue",
              display: "flex",
              height: "100px",
              width: "400px",
              justifyContent: "center",
            }}
          >
            <Link to={"/private-game"}>
              <StyledButton>Private Game</StyledButton>
            </Link>
            <Link to={"/online-match"}>
              <StyledButton>Online Multiplayer</StyledButton>
            </Link>
            <Link>
              <StyledButton onClick={handleCreateRoom}>
                Create Game
              </StyledButton>
            </Link>
            <form onSubmit={handleJoinRoom} action="#">
              <input onChange={handleRoomNameChange} id="code"></input>
              <button>join game</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
