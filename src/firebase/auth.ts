import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
export const getCurrentUser = () => {
  return getAuth().currentUser;
};

export const logout = async () => {
  await signOut(auth);
};

export const onUserChanged = (callback: (user: any) => void) => {
  onAuthStateChanged(auth, callback);
};
