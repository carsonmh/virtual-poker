import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import { Link, Navigate } from "react-router-dom";
import { auth } from "../config/firebase-config";
import axios from "axios";

import userContext from "../contexts/user/userContext";
import { checkUserToken, handleGoogleLogout, logUserIn } from "../auth/auth";
import LogInWithGoogleButton from "../components/home/LogInWithGoogleButton";
import InputField from "../components/home/InputField";
import { useNavigate } from "react-router";
import PokerBackground from "../assets/9e071a09af668c11512375ab1b8bdb3b.jpeg";

import { generateRoomCode } from "../utils/Utils";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 275px;
  height: 300px;
  background: white;
  border-radius: 5px;
  justify-content: space-between;
  padding: 15px;
  box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.3);
`;

const SubmitButton = styled.button`
  width: 250px;
  background: #bf4239;
  padding: 12px;
  border-radius: 30px;
  font-size: 20px;
  height: 50px;
`;

const FormWrapper = styled.div`
  width: 700px;
  height: 450px;
  background: white;
  display: flex;
  align-items: center;
`;

function Home() {
  const [username, setUsername] = useState(null);
  const [loggedInWithGoogle, setLoggedInWithGoogle] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      return navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setLoggedInWithGoogle(false);
    if (user.loggedIn) {
      return navigate("/dashboard");
    }
  }, [user.loggedIn]);

  useEffect(() => {
    // log user in and create auth token
    logUserIn(setUser);
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
    axios
      .post("http://10.0.0.145:3001/api/signup", {
        username: username ? username : user.displayName + generateRoomCode(),
        email: user.email,
        userId: user.uid,
      })
      .then((result) => {
        setUser((user) => ({ ...user, loggedIn: true }));
        console.log(result);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${PokerBackground})`,
      }}
    >
      <>
        <FormWrapper>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "red",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "90%", padding: "15px" }}>
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "23px",
                  textAlign: "center",
                }}
              >
                Welcome to Heads-up Poker!
              </h1>
              <p style={{ textAlign: "center", fontSize: "15px" }}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Dolorem, voluptatibus itaque tempora nam hic consequatur id?
                Est, temporibus voluptates omnis nulla earum itaque incidunt
                mollitia.
              </p>
            </div>
          </div>
          <div style={{ padding: "15px" }}>
            <StyledForm onSubmit={handleSignUp}>
              {!loggedInWithGoogle ? (
                <>
                  <div>
                    <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>
                      Hey there!
                    </h1>
                    <p style={{ fontSize: "14px" }}>
                      Please sign in with google and we'll help you create an
                      account if needed
                    </p>
                  </div>
                  <LogInWithGoogleButton
                    type="button"
                    setLoggedInWithGoogle={setLoggedInWithGoogle}
                  ></LogInWithGoogleButton>
                </>
              ) : (
                <>
                  <div>
                    <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>
                      Pick a Username
                    </h1>
                    <p style={{ fontSize: "14px" }}>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Nihil libero omnis nesciunt aut atque fuga!
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <InputField
                      placeholder="Type your username"
                      onChange={handleUsernameChange}
                    ></InputField>
                    <SubmitButton type="submit">submit</SubmitButton>
                  </div>
                </>
              )}
            </StyledForm>
          </div>
        </FormWrapper>
      </>
    </div>
  );
}

export default Home;
