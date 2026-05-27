import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdYqgJwvowz2GmA2v2Wc2dya4YYy_nzMM",
  authDomain: "ai-crop-advisory-7d378.firebaseapp.com",
  projectId: "ai-crop-advisory-7d378",
  storageBucket: "ai-crop-advisory-7d378.firebasestorage.app",
  messagingSenderId: "531878644364",
  appId: "1:531878644364:web:fb5122b9934b2189a5c9a9",
  measurementId: "G-89HXTQ31BM",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
