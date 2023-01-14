const {
  initializeApp,
  applicationDefault,
  cert,
  refreshToken,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  QuerySnapshot,
} = require("firebase-admin/firestore");
const admin = require("./config/firebase-config");

const db = getFirestore();

function updateUserElo(req, res) {
  try {
    const { userId, newElo } = req.body;
    if (!userId) {
      res.send({
        success: false,
        message: "userId not given",
      });
    }
    if (!newElo) {
      res.send({
        success: false,
        message: "elo not given",
      });
    }
    const userRef = db.doc(`users/${userId}`);
    userRef.update({ points: newElo });
    res.send({
      success: true,
      message: "updated Elo",
    });
  } catch (e) {
    console.error(e);
    res.send({
      success: false,
      message: "failed to change user's elo",
      error: e.message,
    });
  }
}

function signupUser(req, res) {
  try {
    const { email, username, userId } = req.body;
    if (!userId) {
      return;
    }
    db.doc(`users/${userId}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log("user already exists");
          res.send({
            success: false,
            message: "user already exists",
          });
        } else {
          db.collection("users")
            .where("username", "==", username)
            .get()
            .then((snapshot) => {
              if (!snapshot.empty) {
                console.log("username taken");
                res.send({
                  success: false,
                  message: "username taken",
                });
              } else {
                console.log("creating new user in db");
                db.doc(`users/${userId}`).set({
                  email: email,
                  username: username,
                  points: 700,
                  gamesPlayed: 0,
                });
                res.send({
                  success: true,
                  message: "created user in db",
                });
              }
            });
        }
      });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: "failed to sign up",
      error: error.message,
    });
  }
}

async function getUsers(req, res) {
  try {
    const collection = {};
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    snapshot.forEach((doc) => {
      collection[doc.id] = doc.data();
    });
    res.send(collection);
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: "failed to get user",
      error: error.message,
    });
  }
}

function checkUserAuth(req, res) {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!authHeader) {
    res.send({
      message: "unauthorized",
    });
  }
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if (decodedToken) {
        return res.status(200).send({
          message: "Success",
        });
      } else {
        return res.status(401).send({
          message: "Unauthorized: Invalid token",
        });
      }
    })
    .catch((error) => {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Failed to decode token",
        error: error.message,
      });
    });
}

module.exports = { signupUser, getUsers, checkUserAuth, updateUserElo };
