import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAe_9Cl3iNEJTQoGWxR20m2wpBAfZUiakU",
  authDomain: "coaching---divine.firebaseapp.com",
  projectId: "coaching---divine",
  storageBucket: "coaching---divine.firebasestorage.app",
  messagingSenderId: "347524508600",
  appId: "1:347524508600:web:3476a79f13de03944dfd4d",
  measurementId: "G-SC6YPJHEX4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
