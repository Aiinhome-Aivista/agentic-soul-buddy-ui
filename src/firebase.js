// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOgqsFMZVtQPTOXLVqW0OIKYSk6BLX-iU",
  authDomain: "soul-buddy-c1174.firebaseapp.com",
  projectId: "soul-buddy-c1174",
  storageBucket: "soul-buddy-c1174.firebasestorage.app",
  messagingSenderId: "720128674704",
  appId: "1:720128674704:web:f97e6da256d1db7ace0115",
  measurementId: "G-G099ZFCNYC"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
