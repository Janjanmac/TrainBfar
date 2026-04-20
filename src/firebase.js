// firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuFPVQsJ429tgGUViZrlCZy86xEJXO21w",
  authDomain: "dfw-system.firebaseapp.com",
  projectId: "dfw-system",
  storageBucket: "dfw-system.firebasestorage.app",
  messagingSenderId: "43477353012",
  appId: "1:43477353012:web:0b926265e33bf65f38c061",
  measurementId: "G-Y2MYTXXH4V"
};


const app = initializeApp(firebaseConfig)
// Initialize Auth
const auth = getAuth(app);

// EXPORT AUTH
export { auth };

export const db = getFirestore(app)
