// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6wLEp-xWRy3HYFPVEKGJQLF8ZPmE6Jfc",
  authDomain: "mini-job-portal-73d31.firebaseapp.com",
  projectId: "mini-job-portal-73d31",
  storageBucket: "mini-job-portal-73d31.firebasestorage.app",
  messagingSenderId: "100347441378",
  appId: "1:100347441378:web:49314e935bb962d82eaebb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);