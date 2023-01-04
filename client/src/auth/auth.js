import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase-config";
import axios from "axios";
import { signOut } from "firebase/auth";

function handleGoogleSignIn(setUser) {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      axios
        .get("http://localhost:3001/api/get-users")
        .then((result) => {
          const resData = result.data[user.uid];
          setUser((user) => ({ ...user, loggedIn: true }));
          if (resData) {
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return user.displayName;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      return null;
    });
}

function handleGoogleLogout(e) {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      localStorage.clear();
      console.log("signed out");
      return false;
    })
    .catch((error) => {
      console.log(error);
    });
}

function logUserIn(setUser) {
  auth.onAuthStateChanged((userCred) => {
    if (userCred) {
      const uid = userCred.uid;
      userCred
        .getIdToken()
        .then((token) => {
          localStorage.setItem("user-token", "Bearer " + token);
          setUser((user) => ({ ...user, loggedIn: true }));
        })
        .catch((error) => console.log(error));
      axios
        .get("http://localhost:3001/api/get-users")
        .then((result) => {
          const resData = result.data[uid];
          setUser((user) => ({ ...user, ...resData }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

function checkUserToken() {
  const userToken = localStorage.getItem("user-token");
  if (!userToken || userToken === "undefined") {
    return false;
  }
  axios
    .get("http://localhost:3001/api/check-auth", {
      headers: { authorization: userToken },
    })
    .then((result) => {
      if (!result || result.data.message !== "success") {
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return true;
}

export { handleGoogleSignIn, logUserIn, checkUserToken, handleGoogleLogout };
