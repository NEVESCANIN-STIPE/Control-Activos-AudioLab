// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAusTV1SjkfiPEcleFqxfIY54WmeD9l0SE",
  authDomain: "control-activos-fc37e.firebaseapp.com",
  projectId: "control-activos-fc37e",
  storageBucket: "control-activos-fc37e.firebasestorage.app",
  messagingSenderId: "977564975938",
  appId: "1:977564975938:web:3ece9fcf03b86098e2fedb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);