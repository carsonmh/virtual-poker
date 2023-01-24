import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import io from "socket.io-client";

import PrivateGame from "./screens/PrivateGame";
import Home from "./screens/Home";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import UserProvider from "./contexts/user/UserProvider";
import Dashboard from "./screens/Dashboard";
import OnlineGame from "./screens/OnlineGame";
import Leaderboard from "./screens/Leaderboard";

const socket = io.connect("http://10.0.0.145:3001");

function App() {
  return (
    <UserProvider>
      <div
        className="App"
        style={{
          background: "#2F814B",
          height: "100%",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path={"/private-game"}
              element={
                <ProtectedRoute>
                  <PrivateGame socket={socket} />
                </ProtectedRoute>
              }
            />
            <Route
              path={"/dashboard"}
              element={
                <ProtectedRoute>
                  <Dashboard socket={socket} />
                </ProtectedRoute>
              }
            />
            <Route
              path={"/online-match"}
              element={
                <ProtectedRoute>
                  <OnlineGame socket={socket} />
                </ProtectedRoute>
              }
            />
            <Route path={"/leaderboard"} element={<Leaderboard />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
