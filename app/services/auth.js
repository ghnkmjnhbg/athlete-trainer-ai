import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const DEFAULT_USER_DATA = {
  profile: {
    age: 0,
    height: 0,
    weight: 0,
    sport: '',
    goal: '',
    experience: '',
  },
  stats: {
    xp: 0,
    discipline: 0,
    streak: 0,
    level: 1,
  },
  ai: {
    avgFormScore: 0,
    weakAreas: [],
  },
};

export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    ...DEFAULT_USER_DATA,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserData(uid) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function updateUserData(uid, data) {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, data, { merge: true });
}
