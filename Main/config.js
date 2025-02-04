// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2XpB6Ct70XWkGx68cbaFjRHB2f-IKix0",
  authDomain: "auth-app-a9cf0.firebaseapp.com",
  projectId: "auth-app-a9cf0",
  storageBucket: "auth-app-a9cf0.firebasestorage.app",
  messagingSenderId: "1090966263769",
  appId: "1:1090966263769:web:929cec3ff7f62372686bc8",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
