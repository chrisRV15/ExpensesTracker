import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyADpKILRtkEsk0DCaCppqSK_BzTALupV6Q",
    authDomain: "expensetracker-4255c.firebaseapp.com",
    projectId: "expensetracker-4255c",
    storageBucket: "expensetracker-4255c.appspot.com",
    messagingSenderId: "914204917667",
    appId: "1:914204917667:web:c0fe422982c483d4aea416",
    measurementId: "G-7YYRFLKE3S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);