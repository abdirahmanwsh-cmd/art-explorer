import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsrfWXF1oE0Bupbu_X1ccnBAY-SpyiFdI",
  authDomain: "art-explorer-6707a.firebaseapp.com",
  projectId: "art-explorer-6707a",
  storageBucket: "art-explorer-6707a.firebasestorage.app",
  messagingSenderId: "590759525533",
  appId: "1:590759525533:web:9059bcc79166c7e22a6874"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

 
export { auth, provider, db };