 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
 from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

 import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

 import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";


 const firebaseConfig = {
   apiKey: "AIzaSyAXlCpAdvmmdKgooHnvycKisZwm9wSr0bI",
   authDomain: "mini-hackathon-191c6.firebaseapp.com",
   projectId: "mini-hackathon-191c6",
   storageBucket: "mini-hackathon-191c6.appspot.com",
   messagingSenderId: "75674333079",
   appId: "1:75674333079:web:302bd3b4dbe35ce9935ed2",
   measurementId: "G-EELQLKBCVZ"
 };


 const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);

 const storage = getStorage(app);

 const db = getFirestore(app);



 export{auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, 
    db, collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc, storage, ref, uploadBytes,
    uploadBytesResumable, getDownloadURL
 };