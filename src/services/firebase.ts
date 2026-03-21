import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-NJMDkSSaZ2f3BYlJI5FnA0Kv2nxj104",
  authDomain: "theprogrammersacademy-users.firebaseapp.com",
  projectId: "theprogrammersacademy-users",
  storageBucket: "theprogrammersacademy-users.firebasestorage.app",
  messagingSenderId: "465960453468",
  appId: "1:465960453468:web:718200a78aaa79d6f1ad99",
  measurementId: "G-MTV9DY1JK0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);