import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLY6VJnTuK3NVzMx3MYv2kBBaTDtXbF54",
  authDomain: "agilesoftwareachitects-1e894.firebaseapp.com",
  projectId: "agilesoftwareachitects-1e894",
  storageBucket: "agilesoftwareachitects-1e894.firebasestorage.app",
  messagingSenderId: "879900375962",
  appId: "1:879900375962:web:5a34f6461fcd8130e51823"
};

const app = initializeApp(firebaseConfig);