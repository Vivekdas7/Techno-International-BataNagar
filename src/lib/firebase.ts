import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTpMgMSSTzVyUy1kkkOTJgI6q5zhfcOv0",
  authDomain: "college-exam-be740.firebaseapp.com",
  projectId: "college-exam-be740",
  storageBucket: "college-exam-be740.firebasestorage.app",
  messagingSenderId: "598378496414",
  appId: "1:598378496414:web:bc8f6702629a9535f1568f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
