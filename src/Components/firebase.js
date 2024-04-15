import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6TWx_lqBjxHcej_5u4PzDxtt4MuTqXgk",
  authDomain: "chat-80715.firebaseapp.com",
  projectId: "chat-80715",
  storageBucket: "chat-80715.appspot.com",
  messagingSenderId: "572565341346",
  appId: "1:572565341346:web:617c54ed6096d44a94c3fb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()