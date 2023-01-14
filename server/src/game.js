function getSocketGameRoom(socket) {
  const socketRooms = Array.from(socket.rooms.values()).filter(
    (r) => r !== socket.id
  );
  const gameRoom = socketRooms && socketRooms[0];

  return gameRoom;
}

async function getUsersInRoom(io, roomCode) {
  const allConnectedUsers = await io.fetchSockets();
  const usersInRoom = allConnectedUsers
    .filter((user) => user.data.roomCode === roomCode)
    .map((user) => user.data);
  return usersInRoom;
}

function generateRoomId() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function changeGameState(socket, io, state) {
  const room = getSocketGameRoom(socket);
  console.log(state);
  io.to(room).emit("game_state_change", state);
}

async function joinRoom(socket, io, data) {
  const connectedSockets = io.sockets.adapter.rooms.get(data.code);
  if (!data.createRoom && connectedSockets === undefined) {
    socket.emit("room_join_error", { message: "room is not found" });
  } else if (connectedSockets && connectedSockets.size === 2) {
    socket.emit("room_join_error", { message: "room is full" });
  } else {
    await socket.join(data.code);
    socket.data = {
      playerNumber: data.createRoom ? 0 : 1,
      roomCode: data.code,
      username: data.username,
      uid: data.uid,
      points: data.points,
    };
    socket.emit("room_joined", {
      user: socket.data,
      allUsers: await getUsersInRoom(io, socket.data.roomCode),
    });
    io.to(socket.data.roomCode).emit("user_data", {
      allUsers: await getUsersInRoom(io, socket.data.roomCode),
    });
  }
}

async function joinMatchmaking(socket, io, data, q) {
  socket.data = {
    username: data.username,
    points: data.points,
    uid: data.uid,
  };
  q.push(socket);
  console.log("q length: " + q.length);
  if (q.length >= 2) {
    const [player1, player2] = q.splice(0, 2);
    room = generateRoomId();
    player1.join(room);
    player2.join(room);
    player1.data.roomCode = room;
    player2.data.roomCode = room;
    player1.data.playerNumber = 0;
    player2.data.playerNumber = 1;
    player1.emit("match_found", {
      user: player1.data,
      allUsers: await getUsersInRoom(io, room),
    });
    player2.emit("match_found", {
      user: player2.data,
      allUsers: await getUsersInRoom(io, room),
    });
  }
}

module.exports = {
  changeGameState,
  joinRoom,
  joinMatchmaking,
};
