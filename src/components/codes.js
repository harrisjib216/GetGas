import * as firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyAzcvjWqYN5tA-LdW3gaTmlMr_KbzAc4PA",
    authDomain: "uberclone-b1900.firebaseapp.com",
    databaseURL: "https://uberclone-b1900.firebaseio.com",
    projectId: "uberclone-b1900",
    storageBucket: "uberclone-b1900.appspot.com",
    messagingSenderId: "315339965967"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);