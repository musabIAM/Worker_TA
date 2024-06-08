const { initializeApp } = require("firebase/app");
const firebase = require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyDXethO8WOUoYQInjfg4cZIb3YEns59Wtw",
    authDomain: "tasoil-6bdb7.firebaseapp.com",
    databaseURL: "https://tasoil-6bdb7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tasoil-6bdb7",
    storageBucket: "tasoil-6bdb7.appspot.com",
    messagingSenderId: "419619576671",
    appId: "1:419619576671:web:6b2a408b4e51e4ef94b4ea",
    measurementId: "G-RXVB3XYF1V"
}
const con = initializeApp(firebaseConfig);

module.exports = {
    db: con,
    fb: firebase
};