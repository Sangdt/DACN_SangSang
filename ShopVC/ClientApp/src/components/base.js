import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAia3I8r9YT4bCEx95r9dh1ps_cz96JaVY",
    authDomain: "sangsangprojects.firebaseapp.com",
    databaseURL: "https://sangsangprojects.firebaseio.com",
    projectId: "sangsangprojects",
    storageBucket: "sangsangprojects.appspot.com",
    messagingSenderId: "504867768128"
});
const base = Rebase.createClass(firebase.database());
const storage = firebaseApp.storage().ref('images');
export { firebaseApp, storage };
export default base;