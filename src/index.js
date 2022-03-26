import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu3jiBIj8klVwykvre9Gz3zuqvrkzWl5M",
  authDomain: "e-lish-89afd.firebaseapp.com",
  projectId: "e-lish-89afd",
  storageBucket: "e-lish-89afd.appspot.com",
  messagingSenderId: "234975663077",
  appId: "1:234975663077:web:0548972da78eecb0b7d50c",
  measurementId: "G-1V3EM1J3Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App fireBaseApp={app} />
  </React.StrictMode>,
  document.getElementById('root')
);
