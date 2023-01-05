import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import { Link, Navigate } from "react-router-dom";
import { auth } from "../config/firebase-config";
import axios from "axios";

import userContext from "../contexts/user/userContext";
import {
  checkUserToken,
  handleGoogleSignIn,
  logUserIn,
  handleGoogleLogout,
} from "../auth/auth";
import LogInWithGoogleButton from "../components/home/LogInWithGoogleButton";
import InputField from "../components/home/InputField";
import { useNavigate } from "react-router";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 220px;
  background: white;
  border-radius: 5px;
  justify-content: space-between;
  padding: 15px;
`;

const SubmitButton = styled.button`
  width: 250px;
  background: #bf4239;
  padding: 12px;
  border-radius: 30px;
  font-size: 20px;
  height: 50px;
`;

function Home() {
  const [username, setUsername] = useState("");
  const [loggedInWithGoogle, setLoggedInWithGoogle] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    // log user in and create auth token
    logUserIn(setUser);

    // verify auth token
    const authorized = checkUserToken();
    if (!authorized) {
      localStorage.clear();
      setUser((user) => ({ ...user, loggedIn: false }));
    }
  }, []);

  function handleUsernameChange(e) {
    e.preventDefault();
    setUsername(e.target.value);
  }

  function handleSignUp(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.log("no user");
      return;
    }
    setUser((user) => ({ ...user, loggedIn: true }));
    axios
      .post("http://localhost:3001/api/signup", {
        username: username,
        email: user.email,
        userId: user.uid,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  useEffect(() => {
    setLoggedInWithGoogle(false);
    if (user.loggedIn) {
      return navigate("/Dashboard");
    }
  }, [user.loggedIn]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <>
        <StyledForm onSubmit={handleSignUp}>
          <div>
            <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>Hey there!</h1>
            <p style={{ fontSize: "14px" }}>
              Please sign in with google and we'll help you get you signed up if
              needed
            </p>
          </div>
          {!loggedInWithGoogle ? (
            <>
              <LogInWithGoogleButton
                type="button"
                setLoggedInWithGoogle={setLoggedInWithGoogle}
              ></LogInWithGoogleButton>
            </>
          ) : (
            <></>
          )}
          {loggedInWithGoogle ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InputField onChange={handleUsernameChange}></InputField>
              <SubmitButton type="submit">submit</SubmitButton>
            </div>
          ) : (
            <></>
          )}
        </StyledForm>
      </>
    </div>
  );
}

export default Home;
