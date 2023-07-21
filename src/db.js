import * as firebase from "firebase/firebase"
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AI",
    authDomain: "thin.firebaseapp.com",
    databaseURL: "https://thin.firebaseio.com",
    projectId: "thi",
    storageBucket: "thinkin.appspot.com",
    messagingSenderId: "925",
    appId: "1:925433993503",
    measurementId: "G-"
  };

// Get a Firestore instance
export const db = firebase
  .initializeApp(firebaseConfig)
  .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })
