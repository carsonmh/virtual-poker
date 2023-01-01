import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth, app } from "../auth/auth";

function Home() {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      setUser(userCred);
    });
  }, []);

  function loginWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  return (
    <>
      <button onClick={loginWithGoogle}>login with google</button>
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
