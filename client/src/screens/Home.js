import React, { useEffect, useState, useContext } from "react";

import { Link } from "react-router-dom";
import { auth } from "../config/firebase-config";
import axios from "axios";

import userContext from "../contexts/userContext";
import {
  checkUserToken,
  handleGoogleSignIn,
  logUserIn,
  handleGoogleLogout,
} from "../auth/auth";

function Home() {
  const [username, setUsername] = useState("");

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

  return (
    <>
      {user.loggedIn ? (
        <div>logged in</div>
      ) : (
        <>
          <h1>Sign up</h1>
          <form onSubmit={handleSignUp}>
            <button
              onClick={() => {
                const username = handleGoogleSignIn(setUser);
                username !== " " && setUsername(username);
              }}
            >
              login with google
            </button>
            <input value={username} onChange={handleUsernameChange}></input>
            <button type="submit">submit</button>
          </form>

          <h1>Sign in</h1>
          <button onClick={() => handleGoogleSignIn(setUser)}>Button</button>
        </>
      )}
      <button
        onClick={(e) =>
          !handleGoogleLogout(e) &&
          setUser((user) => ({ ...user, loggedIn: false }))
        }
      >
        logout
      </button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={"/private-game"}>
          <button>Private Game</button>
        </Link>
        <Link>
          <button>Online Multiplayer</button>
        </Link>
      </div>
    </>
  );
}

export default Home;
