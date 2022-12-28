const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function getSocketGameRoom(socket) {
  const socketRooms = Array.from(socket.rooms.values()).filter(
    (r) => r !== socket.id
  );
  const gameRoom = socketRooms && socketRooms[0];

  return gameRoom;
}

async function getUsersInRoom(roomCode) {
  const allConnectedUsers = await io.fetchSockets();
  const usersInRoom = allConnectedUsers
    .filter((user) => user.data.roomCode === roomCode)
    .map((user) => user.data);
  return usersInRoom;
}

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log(`player ${socket} disconnected`);
  });

  socket.on("game_state_change", (state) => {
    const room = getSocketGameRoom(socket);
    console.log(state);
    io.to(room).emit("game_state_change", state);
  });

  socket.on("create_room", async (data) => {
    const connectedSockets = io.sockets.adapter.rooms.get(data.code);
    if (connectedSockets && connectedSockets.size === 2) {
      socket.emit("room_join_error", { error: "room is full" });
    } else {
      socket.data = {
        playerNumber: 0,
        roomCode: data.code,
        username: data.username,
      };
      await socket.join(data.code);
      io.to(socket.data.roomCode).emit("room_joined", {
        user: socket.data,
        allUsers: await getUsersInRoom(socket.data.roomCode),
      });
    }
  });

  socket.on("join_room", async (data) => {
    const connectedSockets = io.sockets.adapter.rooms.get(data.code);
    if (connectedSockets === undefined) {
      socket.emit("room_join_error", { message: "room is not found" });
    } else if (connectedSockets.size === 2) {
      socket.emit("room_join_error", { message: "room is full" });
    } else {
      await socket.join(data.code);
      socket.data = {
        playerNumber: 1,
        roomCode: data.code,
        username: data.username,
      };
      io.to(socket.data.roomCode).emit("room_joined", {
        user: socket.data,
        allUsers: await getUsersInRoom(socket.data.roomCode),
      });
      const room = getSocketGameRoom(socket);
      socket.to(room).emit("game_starting");
    }
  });
});

server.listen(3001, () => {
  console.log("server runing on port 3001");
});
