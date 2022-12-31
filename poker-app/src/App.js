import React, { createContext } from "react";
import "./App.css";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateGame from "./screens/PrivateGame";
import Home from "./screens/Home";

const socket = io.connect("http://localhost:3001");
// const SocketContext = createContext(socket);

function App() {
  return (
    <div style={{ background: "green", height: "100%", minHeight: "100vh" }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path={"/private-game"}
            element={<PrivateGame socket={socket} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
