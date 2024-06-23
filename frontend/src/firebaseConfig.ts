import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD17yAF902MbeBLxvnAySRb13LimMbrgjU',
  authDomain: 'uni-project-typescript.firebaseapp.com',
  projectId: 'uni-project-typescript',
  storageBucket: 'uni-project-typescript.appspot.com',
  messagingSenderId: '302438758927',
  appId: '1:302438758927:web:47b3829869a4be3bc8417a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
