// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyAAjDM52pKftwpRjAuWmyybk0fJDYblWYk",
    authDomain: "sttrika-official.firebaseapp.com",
    projectId: "sttrika-official",
    storageBucket: "sttrika-official.appspot.com",
    messagingSenderId: "276195318783",
    appId: "1:276195318783:web:3dd5735fd9145b752fa5ca"
  
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
