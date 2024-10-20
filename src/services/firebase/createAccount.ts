import auth from '@react-native-firebase/auth';

const createAccount = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export default createAccount;
