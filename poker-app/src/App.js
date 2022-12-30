import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./game/Game";
import Start from "./screens/Start";

function generateRoomCode() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const socket = io.connect("http://192.168.0.10:3001");

function App() {
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
    <div style={{ background: "green", height: "100%", minHeight: "100vh" }}>
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
    </div>
  );
  // return (
  //   <Router>
  //     <Routes>
  //       {/* <Route path="/" element={<Navigate replace to="/home" />} /> */}
  //       <Route exact path={"/private-game"} element={<Game />} />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
