import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCF8Dp3d8fQJ5xjy5lrI-2oNBUWo5HoUMw",
  authDomain: "fir-grocery-f7ec0.firebaseapp.com",
  projectId: "fir-grocery-f7ec0",
  storageBucket: "fir-grocery-f7ec0.firebasestorage.app",
  messagingSenderId: "467130491154",
  appId: "1:467130491154:web:74bb4f2fe704d3272613cb",
  measurementId: "G-SXJSTH8ST2",
  databaseURL: "https://fir-grocery-f7ec0-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize only if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const authentication = getAuth(app);
const database = getFirestore(app);
export const db = getDatabase(app);

export { authentication, database };