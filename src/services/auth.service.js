import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut
  // onAuthStateChanged is now only used in main.js
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthService = {
  async register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  
  async loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },
  
  async logout() {
    await signOut(auth);
    return true;
  },
  
  getCurrentUser() {
    return auth.currentUser;
  },
  
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
};

export default AuthService;