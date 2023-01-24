import React, { useContext, useEffect, useState } from "react";

import { logUserIn } from "../auth/auth";
import userContext from "../contexts/user/userContext";
import Game from "./Game";
import GameQueue from "../components/game/waiting/GameQueue";

function OnlineGame({ socket }) {
  const [matchFound, setMatchFound] = useState(false);
  const [users, setUsers] = useState([]);
  const [roomCode, setRoomCode] = useState(null);
  const [userJoined, setUserJoined] = useState(false);

  const { user, setUser } = useContext(userContext);
  useEffect(() => {
    logUserIn(setUser);

    socket.on("match_found", (data) => {
      setRoomCode(data.user.roomCode);
      setUsers(() => data.allUsers);
      setUser((user) => ({ ...user, playerNumber: data.user.playerNumber }));
      setMatchFound(true);
    });
  }, []);

  useEffect(() => {
    if (user.username && !userJoined) {
      setUserJoined(true);
      socket.emit("join_matchmaking", { ...user });
    }
  }, [user]);
  return (
    <>
      {!matchFound ? (
        <GameQueue
          socket={socket}
          message={"Looking for a game..."}
          showButton={true}
        />
      ) : (
        <Game roomCode={roomCode} socket={socket} users={users} />
      )}
    </>
  );
}

export default OnlineGame;
