import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1uesIR6LCiOvCk-C1mCwNYw7H-pBdwGk",
  authDomain: "retriv-acb19.firebaseapp.com",
  projectId: "retriv-acb19",
  storageBucket: "retriv-acb19.firebasestorage.app",
  messagingSenderId: "646376900234",
  appId: "1:646376900234:web:5defcf869f141df6844f73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };