import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { MutatingDots, Bars } from "react-loader-spinner";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../config/firebase-config";
import axios from "axios";

import userContext from "../contexts/user/userContext";
import { checkUserToken, handleGoogleLogout, logUserIn } from "../auth/auth";
import LogInWithGoogleButton from "../components/buttons/LogInWithGoogleButton";
import InputField from "../components/forms/InputField";
import { useNavigate } from "react-router";
import PokerBackground from "../assets/9e071a09af668c11512375ab1b8bdb3b.jpeg";
import Loading from "../components/loading/Loading";
import BlackDesign from "../assets/black-design.jpeg";

import { generateRoomCode } from "../utils/Utils";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 275px;
  height: 350px;
  background: white;
  border-radius: 5px;
  justify-content: space-between;
  padding: 15px;
  box-shadow: 0px 0px 5px 0.5px rgba(0, 0, 0, 0.15);
`;

const SubmitButton = styled.button`
  width: 250px;
  background: #bf4239;
  padding: 12px;
  border-radius: 30px;
  font-size: 20px;
  height: 50px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
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
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInWithGoogle, setLoggedInWithGoogle] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    setIsLoading(false);
    if (localStorage.getItem("user-token")) {
      return navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setLoggedInWithGoogle(false);
    console.log("useeffect");
    if (user.loggedIn) {
      return navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    // log user in and create auth token
    logUserIn(setUser);
  }, []);

  function handleUsernameChange(e) {
    e.preventDefault();
    setUsername(e.target.value);
  }

  function handleSignUp(e) {
    console.log("signing up");
    e.preventDefault();
    const authUser = auth.currentUser;
    if (!authUser) {
      console.log("no user");
      return;
    }
    axios
      .post("http://10.0.0.145:3001/api/signup", {
        username: username
          ? username
          : authUser.displayName + generateRoomCode(),
        email: authUser.email,
        userId: authUser.uid,
      })
      .then((result) => {
        console.log("hello world");
        setUser((user) => ({ ...user, loggedIn: true }));
        authUser.getIdToken().then((token) => {
          localStorage.setItem("user-token", "Bearer " + token);
        });
      })
      .catch((error) => {
        console.log("error");
        console.log(error.response.data);
      });
  }

  if (isLoading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom right, black, rgb(200, 200, 200))",
      }}
    >
      <>
        <FormWrapper>
          <div
            style={{
              width: "100%",
              height: "100%",
              // background: "red",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: `url(${BlackDesign})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div style={{ width: "90%", padding: "15px" }}>
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "23px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Welcome to Heads-up Poker!
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Please take a moment to login or signup so we can get you
                started playing the game!
              </p>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
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
                    <SubmitButton type="submit">Submit</SubmitButton>
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
