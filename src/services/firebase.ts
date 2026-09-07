import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Subject, StudyTask, StudentProfile } from "../types";

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const envConfig: FirebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isConfigured = false;

export function initializeFirebase(customConfig?: FirebaseConfig) {
  const config = customConfig || envConfig;
  if (config && config.apiKey && config.projectId) {
    try {
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
      db = getFirestore(app);
      isConfigured = true;
      console.log("Firebase initialized successfully.");
      return true;
    } catch (err) {
      console.warn("Firebase initialization note:", err);
      isConfigured = false;
      return false;
    }
  }
  isConfigured = false;
  return false;
}

initializeFirebase();

// Firestore persistence helpers
export async function syncUserDataToFirestore(userId: string, data: { profile?: StudentProfile; subjects?: Subject[]; tasks?: StudyTask[] }) {
  if (!db || !isConfigured) return;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.warn("Firestore sync error:", e);
  }
}

export async function fetchUserDataFromFirestore(userId: string) {
  if (!db || !isConfigured) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (e) {
    console.warn("Firestore fetch error:", e);
    return null;
  }
}

export {
  auth,
  db,
  isConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  fbUpdateProfile,
  onAuthStateChanged,
};
export type { User };
