import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDIbnZcZ2-YSE2z0mp6M8H9Swj4fgqWEjI",
  authDomain: "myprivatechatapp2.firebaseapp.com",
  projectId: "myprivatechatapp2",
  storageBucket: "myprivatechatapp2.appspot.com",
  messagingSenderId: "418731671639",
  appId: "1:418731671639:web:d437aa268a9a90b064e312",
  measurementId: "G-BF76399Y7D"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(),
   auth = firebase.auth(),
   storage = firebase.storage(),
   provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage,provider };