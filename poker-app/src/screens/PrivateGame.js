import { useState } from "react";
import io from "socket.io-client";
import Game from "./Game";
import { generateRoomCode } from "../utils/Utils";

function PrivateGame({ socket }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomExists, setRoomExists] = useState(false);
  const [username, setUsername] = useState("DEFAULT");
  const [users, setUsers] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  socket.on("room_joined", (data) => {
    setRoomExists(true);
    const allUsers = data.allUsers;
    setUsers(() => allUsers);
    const currUser = data.user;
    setCurrUser(() => currUser);
  });

  socket.on("room_join_error", (err) => {
    console.log(err.message);
  });

  function handleRoomNameChange(e) {
    const value = e.target.value;
    setRoomCode(value);
  }

  function handleCreateRoom(e) {
    e.preventDefault();
    const code = generateRoomCode();
    setRoomCode(code);
    console.log(username);
    socket.emit("create_room", { code: code, username: username });
  }

  function handleUsernameChange(e) {
    e.preventDefault();
    const value = e.target.value;
    console.log(value);
    setUsername(value);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    console.log(roomCode);
    socket.emit("join_room", { code: roomCode, username: username });
  }
  return (
    <>
      {roomExists ? (
        <Game
          roomCode={roomCode}
          socket={socket}
          users={users}
          currUser={currUser}
        />
      ) : (
        <>
          <h1>Game code test screen(2sec)...</h1>
          <p>Username:</p>
          <input onChange={handleUsernameChange}></input>
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
