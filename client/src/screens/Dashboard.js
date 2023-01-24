import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { Tooltip } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import GitHubButton from "react-github-btn";

import Loading from "../components/loading/Loading";
import userContext from "../contexts/user/userContext";
import { handleGoogleLogout, logUserIn } from "../auth/auth";
import { generateRoomCode } from "../utils/Utils";
import LeaderboardIcon from "../assets/icons8-podium-64.png";
import StyledButton from "../components/buttons/StyledButton";
import PokerLogo from "../assets/poker-logo.png";

const GameCodeInput = styled.input`
  width: 250px;
  margin: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  padding: 4px;
  background: none;
  width: 200px;
  font-size: 18px;
  color: white;
  margin-top: 0;

  &:focus {
    outline: none;
    color: white;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const GameModeHeader = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 25px;
  text-align: center;
  color: rgba(80, 198, 112, 0.6);
  margin-bottom: 10px;
  font-weight: bold;
`;

const Navbar = styled.div`
  width: 100%;
  height: 50px;
`;

const NavItem = styled.li`
  list-style: none;
  margin: 10px;
  cursor: pointer;
`;

const MenuPanel = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  width: 300px;
`;

const ScrollableMenuPanel = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  width: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const GameMenuWrapper = styled.div`
  height: 450px;
  display: flex;
  align-items: center;
  width: 375px;
  justify-content: center;
  flex-direction: column;
  background: #2f814b;
  border-radius: 20px;
`;

const Dropdown = styled.ul`
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: white;
  list-style: none;
  padding: 5px;
  margin: 5px;
  margin-right: 10px;
  border-radius: 5px;
  right: 0;
  opacity: 0;
  transition: all 100ms linear;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const TextLink = styled.a`
  border-bottom: 2px solid #85bf99;
  font-weight: bold;
  transition: all 150ms ease;

  &:hover {
    background: #85bf99;
    color: black;
  }
`;

const DropdownItem = styled.li``;

function Dashboard({ socket }) {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser((user) => ({ ...user, code: null }));
    logUserIn(setUser);
  }, []);

  useEffect(() => {
    //wait until user data has loaded
    if (user.points !== undefined && user.points !== null) {
      setIsLoading(false);
    }
  }, [user]);

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
    //checking if the user was logged out using logout button
    if (!user.loggedIn && !localStorage.getItem("user-token")) {
      return navigate("/");
    }
  }, [user.loggedIn]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          overflow: "hidden",
        }}
        onClick={() => {
          menuOpen && setMenuOpen(false);
        }}
      >
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
            <NavItem
              style={{
                marginRight: "auto",
                display: "flex",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={() => {
                window.location.reload();
              }}
            >
              POKER
              <img
                style={{ width: "40px", filter: "brightness(0) invert(1)" }}
                src={PokerLogo}
              />
            </NavItem>
            <NavItem>
              <Link to="/leaderboard">
                <img width="30" src={LeaderboardIcon} />
              </Link>
            </NavItem>
            <NavItem>
              <Tooltip hasArrow label="Poker Rating" bg="white" color="black">
                <div
                  style={{
                    background: "white",
                    width: "100%",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "100px",
                  }}
                >
                  <h1>{Math.round(user.points)}</h1>
                </div>
              </Tooltip>
            </NavItem>
            <NavItem>
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                }}
                style={{
                  width: "auto",
                  padding: "5px",
                  background: "white",
                  borderRadius: "5px",
                }}
              >
                Hello, {user.username} <ChevronDownIcon />
              </button>
              {/* {menuOpen ? ( */}
              <Dropdown
                style={{
                  height: menuOpen ? "30px" : "0",
                  visibility: menuOpen ? "visible" : "hidden",
                  opacity: menuOpen ? "1" : "0",
                }}
                onClick={() => handleGoogleLogout(setUser)}
              >
                <DropdownItem>Logout</DropdownItem>
              </Dropdown>
              {/* ) : null} */}
            </NavItem>
          </ul>
        </Navbar>
        <div
          style={{
            height: "85%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GameMenuWrapper>
            <h1
              style={{
                textAlign: "center",
                fontSize: "50px",
                margin: 0,
                paddingBottom: "20px",
                fontWeight: "bold",
              }}
            >
              Heads Up Poker
            </h1>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  alignItems: "center",
                  // background: "blue",
                  display: "flex",
                  height: "350px",
                  width: "325px",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <MenuPanel
                  style={{
                    display: "flex",
                    height: "155px",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <GameModeHeader>Online Match</GameModeHeader>
                    <Link to={"/online-match"}>
                      <StyledButton
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "25px",
                          width: "225px",
                          height: "50px",
                        }}
                      >
                        Play Online
                      </StyledButton>
                    </Link>
                  </div>
                </MenuPanel>
                <MenuPanel
                  style={{
                    display: "flex",
                    height: "180px",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <>
                    <form
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                      onSubmit={handleJoinRoom}
                      action="#"
                    >
                      <GameModeHeader style={{ margin: 0 }}>
                        Private Game
                      </GameModeHeader>
                      <GameCodeInput
                        onChange={handleRoomNameChange}
                        id="code"
                        placeholder="Type a game code"
                      ></GameCodeInput>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <StyledButton
                          style={{ width: "125px", marginRight: "3px" }}
                          type="submit"
                        >
                          Join Game
                        </StyledButton>
                        <StyledButton
                          style={{ width: "125px", marginLeft: "3px" }}
                          onClick={handleCreateRoom}
                        >
                          Create Game
                        </StyledButton>
                      </div>
                    </form>
                  </>
                </MenuPanel>
              </div>
              <ScrollableMenuPanel
                style={{
                  height: "350px",
                  width: "300px",
                  padding: "20px",
                }}
              >
                <GameModeHeader>How to Play</GameModeHeader>
                <p style={{ color: "#85BF99", fontSize: "17px" }}>
                  Try to beat the other player by taking all of their chips.
                  Rules are the same as two player{" "}
                  <TextLink
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Texas_hold_%27em"
                  >
                    No Limit Texas Holdem
                  </TextLink>
                  .
                </p>
                <GameModeHeader style={{ marginTop: "15px" }}>
                  Why is Poker fun?
                </GameModeHeader>
                <p style={{ color: "#85BF99", fontSize: "17px" }}>
                  Poker is a fun and exciting game as it combines chance and
                  strategy. It is unpredictable and requires a lot of skill and
                  strategy to outsmart opponents. Additionally, it tests
                  emotional and psychological stamina and can be played
                  socially. The potential of winning money adds an extra layer
                  of excitement. Overall, poker offers a unique combination of
                  chance, strategy, skill, and social interaction, creating an
                  engaging and exciting experience.
                </p>
              </ScrollableMenuPanel>
            </div>
          </GameMenuWrapper>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ margin: "15px" }}>
            <GitHubButton
              href="https://github.com/carsonmh/one-vs-one-poker"
              data-icon="octicon-star"
              data-size="large"
              aria-label="Star carsonmh/one-vs-one-poker on GitHub"
            >
              Star
            </GitHubButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
