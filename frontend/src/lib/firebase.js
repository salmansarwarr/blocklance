// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDp17pKdSHs7uKhnR7Z2QDH5I7zmqCv_vo",
    authDomain: "blocklance-abe90.firebaseapp.com",
    databaseURL:
        "https://blocklance-abe90-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "blocklance-abe90",
    storageBucket: "blocklance-abe90.appspot.com",
    messagingSenderId: "339237135835",
    appId: "1:339237135835:web:e51ad82ece6aadc03a73fe",
    measurementId: "G-1NFLEDJQ44",
};



const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
