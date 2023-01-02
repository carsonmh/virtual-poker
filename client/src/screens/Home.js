import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth, app } from "../auth/auth";

function Home() {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      console.log(userCred);
    });
  });

  function handleGoogleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUsername(user.displayName);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  function handleUsernameChange(e) {
    e.preventDefault();
    setUsername(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.log("no user");
      return;
    }
    fetch("http://localhost:3001/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        email: user.email,
        userId: user.uid,
      }),
    }).then((result) => console.log(result));
  }

  return (
    <>
      {loggedIn ? (
        <div>logged in</div>
      ) : (
        <>
          <h1>Sign up</h1>
          <form onSubmit={handleSubmit}>
            <button onClick={handleGoogleSignIn}>login with google</button>
            <input value={username} onChange={handleUsernameChange}></input>
            <button type="submit">submit</button>
          </form>

          <h1>Sign in</h1>
          <button>Button</button>
        </>
      )}
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
