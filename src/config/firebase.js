// Centralized Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAjDM52pKftwpRjAuWmyybk0fJDYblWYk",
  authDomain: "sttrika-official.firebaseapp.com",
  projectId: "sttrika-official",
  storageBucket: "sttrika-official.appspot.com",
  messagingSenderId: "276195318783",
  appId: "1:276195318783:web:3dd5735fd9145b752fa5ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance if needed
export default app;

// Optional: Export commonly used Firebase functions for convenience
export {
  // Auth functions
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

export {
  // Firestore functions
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

export {
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";