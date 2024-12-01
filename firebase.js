// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAoxo-obu2mG6Gxp8saculnwvZAOjM94UA',
  authDomain: 'todoapp-5a9a1.firebaseapp.com',
  projectId: 'todoapp-5a9a1',
  storageBucket: 'todoapp-5a9a1.appspot.com',
  messagingSenderId: '652417591940',
  appId: '1:652417591940:android:61dfff9b37f84dfcc4b0d1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, firestore };
