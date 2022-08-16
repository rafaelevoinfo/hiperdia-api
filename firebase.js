const firebase_admin = require("firebase-admin");
// const firebase = require("firebase/app");
// const auth = require("firebase/auth");
// const firestore = require("firebase/firestore");

// const firebaseApp = firebase.initializeApp(
//   {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID
//   }
// );


if (process.env.DESENVOLVIMENTO) {
  var serviceAccount = require("./hiperdia-mineiros-firebase-adminsdk.json");
  firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount)
  });
} else {
  firebase_admin.initializeApp({
    credential: firebase_admin.credential.applicationDefault()
  });
}

// firebase_admin.firestore().collection("agentes")

module.exports = { firebase_admin };
