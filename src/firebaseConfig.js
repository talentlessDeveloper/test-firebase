// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACgFK7oY5LMRR8nEnSDfS6SBrUl_zLCGk",
  authDomain: "kaffy-firebase.firebaseapp.com",
  projectId: "kaffy-firebase",
  storageBucket: "kaffy-firebase.appspot.com",
  messagingSenderId: "655778093839",
  appId: "1:655778093839:web:a53a14e3e675b4f2877c7a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
