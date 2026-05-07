import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACVqDohRcepGPAMa0loRbVmVwbtNhbkNQ",
  authDomain: "car-stock-system.firebaseapp.com",
  projectId: "car-stock-system",
  storageBucket: "car-stock-system.appspot.com",
  messagingSenderId: "326293663025",
  appId: "1:326293663025:web:81662b16f10e0229e91410",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

