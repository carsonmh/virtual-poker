import React from "react";
import "./App.css";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateGame from "./screens/PrivateGame";
import Home from "./screens/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import UserProvider from "./contexts/user/UserProvider";
import Dashboard from "./screens/Dashboard";

const socket = io.connect("http://localhost:3001");

function App() {
  return (
    <UserProvider>
      <div
        style={{ background: "#2F814B", height: "100%", minHeight: "100vh" }}
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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
