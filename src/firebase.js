import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaK0_txVHs6zlK7SxPdV1tIRc3MD9T3WI",
  authDomain: "allgreen-a61ae.firebaseapp.com",
  projectId: "allgreen-a61ae",
  storageBucket: "allgreen-a61ae.firebasestorage.app",
  messagingSenderId: "547807072961",
  appId: "1:547807072961:web:a8f89c5f495976ee12ba40"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);