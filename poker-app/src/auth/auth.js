import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlfuR3KyyuZy53yNTkBq6sNHG3I_-xVnM",
  authDomain: "heads-up-poker-575fb.firebaseapp.com",
  projectId: "heads-up-poker-575fb",
  storageBucket: "heads-up-poker-575fb.appspot.com",
  messagingSenderId: "600286567005",
  appId: "1:600286567005:web:e7287528299aa1ff2ecbb4",
  measurementId: "G-TJEP7PZVC4",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth, app };
