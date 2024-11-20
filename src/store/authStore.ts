import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,
    signUp: async (email, password) => {
      try {
        set({ error: null, loading: true });
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        const errorMessage = (error as Error).message;
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
    signIn: async (email, password) => {
      try {
        set({ error: null, loading: true });
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        const errorMessage = (error as Error).message;
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
    signInWithGoogle: async () => {
      try {
        set({ error: null, loading: true });
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        const errorMessage = (error as Error).message;
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
    signOut: async () => {
      try {
        set({ loading: true });
        await firebaseSignOut(auth);
      } catch (error) {
        const errorMessage = (error as Error).message;
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
    setError: (error) => set({ error }),
  };
});