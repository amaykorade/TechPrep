import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDw3YOZ8Kn3zwkJwTTfotpFLKWePZiggaU",
  authDomain: "interviewplatform-ef8e8.firebaseapp.com",
  projectId: "interviewplatform-ef8e8",
  storageBucket: "interviewplatform-ef8e8.firebasestorage.app",
  messagingSenderId: "343452611240",
  appId: "1:343452611240:web:6a1a79a6bad2cc5352889d"
};

// Initialize Firebase only if no apps exist
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});