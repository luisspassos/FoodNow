import * as firebase from "firebase";
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDJ-OHkzB2RwbUlPiBAsroGtqDuebSBrBs",
    authDomain: "foodnow-ed748.firebaseapp.com",
    projectId: "foodnow-ed748",
    storageBucket: "foodnow-ed748.appspot.com",
    messagingSenderId: "581763773095",
    appId: "1:581763773095:web:a2921855fecfd78deb2182"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
firebase.firestore().settings({ experimentalForceLongPolling: true }); 
const db = firebase.firestore()
const storage = firebase.storage();

export default auth;
export { db, storage }