import { useState, useContext, useEffect } from "react";

import Game from "./Game";
import UserContext from "../contexts/user/userContext";
import { logUserIn } from "../auth/auth";

function PrivateGame({ socket }) {
  const [users, setUsers] = useState([]);
  const [gameExists, setGameExists] = useState(false);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    logUserIn(setUser);
  }, []);

  useEffect(() => {
    socket.on("room_joined", (data) => {
      setGameExists(true);
      const userData = data.user;
      userData.username = user.username;
      setUser((user) => ({ ...user, ...userData }));
    });

    socket.on("user_data", (data) => {
      const allUsers = data.allUsers;
      setUsers(() => allUsers);
    });

    socket.on("room_join_error", (err) => {
      console.log(err.message);
    });
  }, []);
  return (
    <>
      {gameExists ? (
        <Game roomCode={user.code} socket={socket} users={users} />
      ) : null}
    </>
  );
}

export default PrivateGame;
