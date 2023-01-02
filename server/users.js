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

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

function signupUser(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const { email, username, userId } = req.body;
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
                  points: 0,
                  gamesPlayed: 0,
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

module.exports = { signupUser };
