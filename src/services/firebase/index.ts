import auth, {
  updateEmail,
  updatePassword,
  updateProfile,
} from '@react-native-firebase/auth';

const createAccount = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

const signInWithEmail = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

const updateUserProfile = (displayName: string) => {
  return updateProfile(auth().currentUser!, {displayName});
};

const updateUserEmail = (email: string) => {
  return updateEmail(auth().currentUser!, email);
};

const updateUserPassword = (password: string) => {
  return updatePassword(auth().currentUser!, password);
};

const logOutUser = () => {
  return auth().signOut();
};

export {
  createAccount,
  signInWithEmail,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
  logOutUser,
};
