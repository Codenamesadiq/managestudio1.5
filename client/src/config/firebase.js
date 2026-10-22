import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-master-production",
  appId: "1:536358048257:web:4a39e974660c6c1720a600",
  storageBucket: "studio-master-production.firebasestorage.app",
  apiKey: "AIzaSyB_vjq-m_QYOwBJ0zx5kdggcpjvgPhai4I",
  authDomain: "studio-master-production.firebaseapp.com",
  messagingSenderId: "536358048257"
};

// Initialize or reuse Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-studiomanager-b326f769-70e0-4eb7-88b9-feba4d05358d");

export {
  app,
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
};
