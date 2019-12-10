import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
// import * as serviceWorker from './serviceWorker';

//import and configure firebase here
import firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWJ2SYaKux-xioI1dQ2XcQN4as11gNVRU",
    authDomain: "project-giada1198.firebaseapp.com",
    databaseURL: "https://project-giada1198.firebaseio.com",
    projectId: "project-giada1198",
    storageBucket: "project-giada1198.appspot.com",
    messagingSenderId: "56711413010",
    appId: "1:56711413010:web:79f0e9300dae78fed047cb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();