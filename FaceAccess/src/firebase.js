import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-DRBo9r3sWEI2bnmU2tTVX8oOUWj0xy4",
  authDomain: "faceaccess-57261.firebaseapp.com",
  projectId: "faceaccess-57261",
  storageBucket: "faceaccess-57261.appspot.com",
  messagingSenderId: "800587963423",
  appId: "1:800587963423:web:7301367306a408c66cc92a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);