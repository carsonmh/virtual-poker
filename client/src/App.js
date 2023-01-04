import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import io from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import PrivateGame from "./screens/PrivateGame";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { logUserIn } from "./auth/auth";
import { auth } from "./config/firebase-config";

import userContext from "./contexts/userContext";
import UserProvider from "./contexts/UserProvider";

const socket = io.connect("http://localhost:3001");

function App() {
  const { user, setUser } = useContext(userContext);
  return (
    <UserProvider>
      <div style={{ background: "green", height: "100%", minHeight: "100vh" }}>
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
            {/* <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
