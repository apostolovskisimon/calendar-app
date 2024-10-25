import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Event} from '@/services/types';

const eventsCollection = firestore().collection('events');

const getUserEvents = () => {
  const userId = auth().currentUser?.uid;
  if (userId) {
    return eventsCollection.where('user', '==', userId).get();
  }
};

const addUserEvent = (event: Event) => {
  const userId = auth().currentUser?.uid;
  if (userId) {
    return eventsCollection.add({...event, user: userId});
  }
};

const editUserEvent = (id: string, event: Event) => {
  const userId = auth().currentUser?.uid;
  if (userId) {
    return eventsCollection.doc(id).update(event);
  }
};

const removeUserEvent = (id: string) => {
  const userId = auth().currentUser?.uid;
  if (userId) {
    return eventsCollection.doc(id).delete();
  }
};
export {getUserEvents, addUserEvent, editUserEvent, removeUserEvent};
