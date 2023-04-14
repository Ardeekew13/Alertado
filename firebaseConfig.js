import { initializeApp } from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {getFirestore} from "firebase/firestore";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcjK8FZTRFF2iEUuAYUyWf7_UFiUXItig",
  authDomain: "fir-auth-d2bb0.firebaseapp.com",
  projectId: "fir-auth-d2bb0",
  storageBucket: "fir-auth-d2bb0.appspot.com",
  messagingSenderId: "98075379892",
  appId: "1:98075379892:web:90a4eb4aea27d2e1342fe1"
};

const app = initializeApp(firebaseConfig);
export const authentication=getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const db = getFirestore(app);