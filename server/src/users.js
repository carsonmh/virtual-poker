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

function signupUser(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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

// async function getUserById(req, res) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   try {
//     const { userId } = req.body;
//     const userRef = db.collection("users").doc(userId);
//     const doc = await userRef.get();
//     if (!doc.exists) {
//       console.log("user not found");
//       res.send({
//         success: false,
//         message: "user not found",
//         error: error.message,
//       });
//     } else {
//       console.log(doc.data());
//       res.send(doc.data());
//     }
//   } catch (error) {
//     console.error(error);
//     res.send({
//       success: false,
//       message: "failed to get user",
//       error: error.message,
//     });
//   }
// }

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
  try {
    const decodeValue = admin.auth().verifyIdToken(token);
    if (decodeValue) {
      res.send({
        message: "success",
      });
    } else {
      res.send({
        message: "unauthorized",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "failed to decode token",
      error: error.message,
    });
  }
}

module.exports = { signupUser, getUsers, checkUserAuth };
