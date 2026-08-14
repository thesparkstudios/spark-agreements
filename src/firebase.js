import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, doc, setDoc, getDoc, deleteDoc,
  collection, onSnapshot, serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Same artifacts/{appId}/public/data/{collection} convention as the
// sibling quote app, but its own top-level appId so the two tools never
// collide, even though they share one Firebase project.
const FIRESTORE_APP_ID = process.env.REACT_APP_FIRESTORE_APP_ID || 'the-spark-studios-agreements';

const agreementsCollection = () =>
  collection(db, 'artifacts', FIRESTORE_APP_ID, 'public', 'data', 'agreements');

const agreementDoc = (id) =>
  doc(db, 'artifacts', FIRESTORE_APP_ID, 'public', 'data', 'agreements', id);

export function initAuth(onReady) {
  signInAnonymously(auth).catch(() => {});
  return onAuthStateChanged(auth, (user) => onReady(user));
}

export function subscribeAgreements(onData, onError) {
  return onSnapshot(agreementsCollection(), (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(rows);
  }, onError);
}

export async function loadAgreement(id) {
  const snap = await getDoc(agreementDoc(id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveAgreement(id, data) {
  const targetId = id || `agr_${Date.now()}`;
  await setDoc(agreementDoc(targetId), {
    ...data,
    updatedAt: Date.now(),
    createdAt: data.createdAt || Date.now(),
    savedAt: serverTimestamp(),
  }, { merge: true });
  return targetId;
}

export async function deleteAgreement(id) {
  await deleteDoc(agreementDoc(id));
}
