// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiT3A-oR6W_5cgS23QZL6emMmWkjTFyRo",
  authDomain: "cardy-b.firebaseapp.com",
  projectId: "cardy-b",
  storageBucket: "cardy-b.appspot.com",
  messagingSenderId: "581085078554",
  appId: "1:581085078554:web:0d609783078c3c2d039da3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firestore instance
const db = getFirestore(app);

export {db};