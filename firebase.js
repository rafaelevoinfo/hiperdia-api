// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD9WROHNstYUJGZl1sg1h_rfZeGzYgWxfw",
//   authDomain: "hiperdia-mineiros.firebaseapp.com",
//   projectId: "hiperdia-mineiros",
//   storageBucket: "hiperdia-mineiros.appspot.com",
//   messagingSenderId: "274229462579",
//   appId: "1:274229462579:web:ab677b3bbfda802ff3c546",
//   measurementId: "G-5ZXQPJXFCQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const firebase = require("firebase/app");
const auth = require("firebase/auth");

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
});

module.exports = { firebase, auth };
