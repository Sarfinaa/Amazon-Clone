import firebase from 'firebase';
import dotenv from 'dotenv';
dotenv.config();
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_KEY,//firebase api key
    authDomain: "clone-522be.firebaseapp.com",
    projectId: "clone-522be",
    storageBucket: "clone-522be.appspot.com",
    messagingSenderId: "640019458384",
    appId: "1:640019458384:web:808fce64c7ba0cfb2a2455",
    measurementId: "G-R2MFF8MV95"
  };
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  //realtime database in firebase
  const db=firebaseApp.firestore();
  //variable for sign in 
  const auth=firebase.auth();
  export {db,auth};