// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDs4A_QVVlCykHkGVUi9dO6AlRy1I-yrq8",

    authDomain: "sttrikaofficial.firebaseapp.com",
  
    projectId: "sttrikaofficial",
  
    storageBucket: "sttrikaofficial.appspot.com",
  
    messagingSenderId: "879169838900",
  
    appId: "1:879169838900:web:ff004b0c6e7092cc8a8f61"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
