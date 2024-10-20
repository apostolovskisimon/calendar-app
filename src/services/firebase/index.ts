import auth from '@react-native-firebase/auth';

const createAccount = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

const signInWithEmail = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export {createAccount, signInWithEmail};
