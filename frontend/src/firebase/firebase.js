import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGnyT8mQ3Kch_PWAVid2L_Mb5vqH739lE",
  authDomain: "appgestorturnos.firebaseapp.com",
  projectId: "appgestorturnos",
  storageBucket: "appgestorturnos.firebasestorage.app",
  messagingSenderId: "179820532627",
  appId: "1:179820532627:web:8a1f2593d32644497cce66"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
