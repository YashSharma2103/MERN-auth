// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-auth-45aee.firebaseapp.com",
  projectId: "mern-auth-45aee",
  storageBucket: "mern-auth-45aee.appspot.com",
  messagingSenderId: "912572969095",
  appId: "1:912572969095:web:ecf38b8816e3f263ed4822"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);   