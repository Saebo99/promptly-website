import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { saveUserData } from "../utils/saveUserData";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAixhijM4g3JEtunXp6J6HMobSnuXZ2cu0",
  authDomain: "promptly-c3fc2.firebaseapp.com",
  projectId: "promptly-c3fc2",
  storageBucket: "promptly-c3fc2.appspot.com",
  messagingSenderId: "984171417610",
  appId: "1:984171417610:web:d500eb7613d9565ec38ff3",
  measurementId: "G-S1JT9R6T42",
};

const app = initializeApp(firebaseConfig);

// Only initialize analytics on the client side
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);

auth
  .setPersistence(browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error setting persistence: ", errorCode, errorMessage);
  });

const provider = new GoogleAuthProvider();

export { app, auth, provider, db };
