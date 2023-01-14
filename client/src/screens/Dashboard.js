import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { Tooltip } from "@chakra-ui/react";

import Loading from "../components/Loading";
import userContext from "../contexts/user/userContext";
import { handleGoogleLogout, logUserIn } from "../auth/auth";
import { generateRoomCode } from "../utils/Utils";
import LeaderboardIcon from "../assets/icons8-podium-64.png";
import StyledButton from "../components/StyledButton";

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

function Dashboard({ socket }) {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

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
            <NavItem style={{ marginRight: "auto" }}>
              <button onClick={() => !handleGoogleLogout(setUser)}>
                Logout
              </button>
            </NavItem>
            <NavItem>
              <Link to="/leaderboard">
                <img width="30" src={LeaderboardIcon} />
              </Link>
            </NavItem>
            <NavItem>
              <Tooltip
                hasArrow
                label="Poker Rating"
                bg="gray.300"
                color="black"
              >
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
              <h1>Hello, {user.username}</h1>
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
                fontSize: "35px",
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
                <GameModeHeader>Lorem, ipsum.</GameModeHeader>
                <p style={{ color: "#85BF99" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquam ea molestiae, eveniet, est fuga dolore ducimus aliquid
                  totam, blanditiis quos doloremque delectus mollitia
                  aspernatur? Earum voluptatem quod accusamus! Deserunt
                  architecto libero magni. Ratione dolor laborum consequatur ex
                  distinctio illum omnis aliquid error officia rerum quibusdam
                  impedit vel porro, obcaecati hic nam consectetur animi illo
                  fugit temporibus molestiae! Doloremque itaque eum illo,
                  mollitia asperiores molestiae voluptas odit voluptates tempore
                  soluta consequuntur, repudiandae non necessitatibus, beatae
                  quas! Unde quod id labore quidem impedit dolores autem maxime
                  odit amet quaerat accusamus fugiat ducimus natus, ex ipsam
                  praesentium sit laboriosam officiis, soluta saepe itaque?
                  Atque saepe ullam id voluptatem delectus quam fugit vel natus
                  distinctio ad culpa quo omnis qui, dolore quod nam. Doloremque
                  maiores excepturi quae vel quo qui sed. Placeat, fugiat eos!
                  Laborum harum voluptatibus veniam nemo! Laborum esse non
                  dolorem nam facere incidunt doloremque corrupti autem quos.
                  Repellendus laboriosam perferendis dolorem.
                </p>
              </ScrollableMenuPanel>
            </div>
          </GameMenuWrapper>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
