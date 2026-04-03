import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCCkS6TOE1Ttx27QIP1nKDEo51IqZtuZRQ",
  authDomain: "esp32-83d79.firebaseapp.com",
  projectId: "esp32-83d79",
  storageBucket: "esp32-83d79.firebasestorage.app",
  messagingSenderId: "455843291637",
  appId: "1:455843291637:web:245bceab2401e19b8740bc",
  measurementId: "G-QNJ8MELJ0V",
  databaseURL: "https://esp32-83d79-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);