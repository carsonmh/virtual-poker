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
    };
    io.to(socket.data.roomCode).emit("room_joined", {
      user: socket.data,
      allUsers: await getUsersInRoom(io, socket.data.roomCode),
    });
    if (!data.createRoom) {
      const room = getSocketGameRoom(socket);
      socket.to(room).emit("game_starting");
    }
  }
}

module.exports = {
  changeGameState,
  joinRoom,
};
