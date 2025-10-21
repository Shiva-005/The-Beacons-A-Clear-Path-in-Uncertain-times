// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBWwfO03TibkIHWFKeRP3iMQYAhgw013yw",
  authDomain: "the-beacon-58243.firebaseapp.com",
  projectId: "the-beacon-58243",
  storageBucket: "the-beacon-58243.firebasestorage.app",
  messagingSenderId: "515350358021",
  appId: "1:515350358021:web:7eca88269eff076bb7946c",
  measurementId: "G-1PEPVVJB3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);