// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
var firebaseConfig = {
    apiKey: "AIzaSyAWqxFZ_pT06_hf-NhS0M9JEfBM0RvEXyU",
    authDomain: "fir-web-codelab-c799e.firebaseapp.com",
    databaseURL: "https://fir-web-codelab-c799e.firebaseio.com",
    projectId: "fir-web-codelab-c799e",
    storageBucket: "fir-web-codelab-c799e.appspot.com",
    messagingSenderId: "320069949496",
    appId: "1:320069949496:web:cf34fb003824293a03aecd",
    measurementId: "G-FZVD7PKJ9N"
  };

firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

startRsvpButton.addEventListener("click", () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut()
  } else {
    ui.start("#firebaseui-auth-container", uiConfig)
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    startRsvpButton.textContent = "LOGOUT"
    guestbookContainer.style.display = "block";
    subscribeGusetBook();
  } else {
    startRsvpButton.textContent = "RSVP"
    guestbookContainer.style.display = "none";
    unsubscribeGusetBook();
  }
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  firebase.firestore().collection("guestbook").add({
    text: input.value,
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid
  })

  input.value = "";
  return false;
});

function subscribeGusetBook() {
  guestbookListener = firebase.firestore().collection("guestbook").orderBy("timestamp", "desc").onSnapshot((snaps) => {
  guestbook.innerHTML = "";
  snaps.forEach((doc) => {
    const entry = document.createElement("p");
    entry.textContent = doc.data().name + ":" + doc.data().text;
    guestbook.appendChild(entry);
  });
});
};

function unsubscribeGusetBook() {
  if (guestbookListener != null){
    guestbookListener();
    guestbookListener - null;
  }
}
