import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsmBaHeNCITHhxsYPapNfws3geMgxHNAs",
  authDomain: "to-list-95bba.firebaseapp.com",
  databaseURL:
    "https://to-list-95bba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "to-list-95bba",
  storageBucket: "to-list-95bba.appspot.com",
  messagingSenderId: "284594904253",
  appId: "1:284594904253:web:7f8bf91c4c7e60149e2bd4",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
