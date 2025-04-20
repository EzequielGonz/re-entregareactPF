import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsfZUYJo1AEPHBGv3BTw33mC-X2rXnyZM",
  authDomain: "ecommercecoderhouse-ccbd0.firebaseapp.com",
  projectId: "ecommercecoderhouse-ccbd0",
  storageBucket: "ecommercecoderhouse-ccbd0.firebasestorage.app",
  messagingSenderId: "769264164951",
  appId: "1:769264164951:web:304dabcd648223175e0312",
  measurementId: "G-C3Z3BHV40Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
