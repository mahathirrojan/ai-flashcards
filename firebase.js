// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo5wGrSBlY_nwctRvUJR44QZ2qUnEmP_A",
  authDomain: "flashcards-2fa4d.firebaseapp.com",
  projectId: "flashcards-2fa4d",
  storageBucket: "flashcards-2fa4d.appspot.com",
  messagingSenderId: "52866458717",
  appId: "1:52866458717:web:d21d8f3c8cd0b4a61dd9b4",
  measurementId: "G-1GWYYHLPMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;