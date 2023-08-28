import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU8gwiwSAtFRke0T760XbB-jUS2Cq6S98",
  authDomain: "expenses-management-b20cd.firebaseapp.com",
  projectId: "expenses-management-b20cd",
  storageBucket: "expenses-management-b20cd.appspot.com",
  messagingSenderId: "271021473888",
  appId: "1:271021473888:web:75274fe1f20f5d2ba08305",
  measurementId: "G-Q4MHMNDKY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)