const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const users = require("./users");
const game = require("./game");

app.use(cors({ origin: "*" }));
app.options("*", cors());
app.use(express.json());

const server = http.createServer(app);

app.post("/api/signup", users.signupUser);
app.get("/api/get-users", users.getUsers);
app.get("/api/check-auth", users.checkUserAuth);
app.get("/", (req, res) => {
  return res.send("success");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log(`player ${socket} disconnected`);
  });

  socket.on("game_state_change", (state) => {
    game.changeGameState(socket, io, state);
  });

  socket.on("create_room", async (data) => {
    game.createRoom(socket, io, data);
  });

  socket.on("join_room", async (data) => {
    game.joinRoom(socket, io, data);
  });
});

server.listen(3001, () => {
  console.log("server runing on port 3001");
});
