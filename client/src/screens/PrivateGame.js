import { useState, useContext, useEffect } from "react";
import axios from "axios";

import Game from "./Game";
import { generateRoomCode } from "../utils/Utils";
import { auth } from "../config/firebase-config";
import UserContext from "../contexts/user/userContext";

function PrivateGame({ socket }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomExists, setRoomExists] = useState(false);
  const [users, setUsers] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const uid = userCred.uid;
        userCred
          .getIdToken()
          .then((token) => {
            localStorage.setItem("user-token", "Bearer " + token);
          })
          .catch((error) => console.log(error));
        axios
          .get("http://localhost:3001/api/get-users")
          .then((result) => {
            const resData = result.data[uid];
            setUser((user) => ({ ...user, ...resData }));
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        localStorage.clear();
      }
    });
  }, []);

  socket.on("room_joined", (data) => {
    setRoomExists(true);
    const allUsers = data.allUsers;
    setUsers(() => allUsers);
    const currUser = data.user;
    currUser.username = user.username;
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
    setUser((user) => ({ ...user, code: code }));
    console.log(user);
    socket.emit("create_room", { ...user, code: code });
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    console.log(roomCode);
    socket.emit("join_room", { ...user, code: roomCode });
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
