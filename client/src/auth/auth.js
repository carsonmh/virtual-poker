import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase-config";
import axios from "axios";
import { signOut } from "firebase/auth";

function handleGoogleSignIn(setUser, setLoggedInWithGoogle) {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      axios
        .get("http://localhost:3001/api/get-users")
        .then((result) => {
          setLoggedInWithGoogle(true);
          const resData = result.data[user.uid];
          if (!resData || !resData.username) {
            return false;
          }
          setUser((user) => ({ ...user, loggedIn: true }));
          return true;
        })
        .catch((error) => {
          console.log(error);
        });
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

function handleGoogleLogout(setUser) {
  localStorage.clear();
  signOut(auth)
    .then(() => {
      console.log("signed out");
      setUser((user) => ({ ...user, loggedIn: false }));
      localStorage.clear();
      return false;
    })
    .catch((error) => {
      console.log(error);
    });
}

function logUserIn(setUser) {
  auth.onAuthStateChanged((userCred) => {
    if (userCred) {
      console.log("user cred found");
      const uid = userCred.uid;
      userCred
        .getIdToken()
        .then((token) => {
          localStorage.setItem("user-token", "Bearer " + token);
        })
        .catch((error) => console.log(error));
      axios
        .get("http://localhost:3001/api/get-users")
        .then((result) => {
          const resData = result.data[uid];
          if (!resData) {
            return false;
          }
          setUser((user) => ({ ...user, ...resData, loggedIn: true }));
          return true;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      handleGoogleLogout(setUser);
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
