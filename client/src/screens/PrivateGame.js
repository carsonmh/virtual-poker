import { useState, useContext, useEffect } from "react";
import axios from "axios";

import Game from "./Game";
import { generateRoomCode } from "../utils/Utils";
import { auth } from "../config/firebase-config";
import UserContext from "../contexts/user/userContext";
import { logUserIn, handleGoogleLogout } from "../auth/auth";

function PrivateGame({ socket }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomExists, setRoomExists] = useState(false);
  const [users, setUsers] = useState([]);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    logUserIn(setUser);
  }, []);

  useEffect(() => {
    socket.on("room_joined", (data) => {
      setRoomExists(true);
      const allUsers = data.allUsers;
      setUsers(() => allUsers);
      const userData = data.user;
      userData.username = user.username;
      setUser((user) => ({ ...user, ...userData }));
    });

    socket.on("room_join_error", (err) => {
      console.log(err.message);
    });
  }, []);

  function handleRoomNameChange(e) {
    const value = e.target.value;
    setRoomCode(value);
  }

  function handleCreateRoom(e) {
    e.preventDefault();
    const code = generateRoomCode();
    setRoomCode(code);
    setUser((user) => ({ ...user, code: code }));
    console.log(user);
    socket.emit("join_room", { ...user, code: code, createRoom: true });
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    setUser((user) => ({ ...user, code: roomCode }));
    socket.emit("join_room", { ...user, code: roomCode, createRoom: false });
  }
  return (
    <>
      {roomExists ? (
        <Game roomCode={roomCode} socket={socket} users={users} />
      ) : (
        <>
          <h1>Game code test screen(2sec)...</h1>
          <form onSubmit={handleCreateRoom} action="#">
            <button>Create Game</button>
          </form>
          <form onSubmit={handleJoinRoom} action="#">
            <input onChange={handleRoomNameChange} id="code"></input>
            <button>join game</button>
          </form>
        </>
      )}
    </>
  );
}

export default PrivateGame;
