import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCKpLrl6x3L7ZO1drMEnbc2GeJfh-t6_aY",
  authDomain: "heads-up-poker-48666.firebaseapp.com",
  projectId: "heads-up-poker-48666",
  storageBucket: "heads-up-poker-48666.appspot.com",
  messagingSenderId: "690954813756",
  appId: "1:690954813756:web:879abd18eae171cf64de39",
  measurementId: "G-N9KB5YC5YF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth, app };
