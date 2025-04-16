// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDHWwbXX_kdhCEVoZjrcmYlCauskzGPnps",
  authDomain: "pirate-alpha.firebaseapp.com",
  databaseURL: "https://pirate-alpha-default-rtdb.firebaseio.com",
  projectId: "pirate-alpha",
  storageBucket: "pirate-alpha.firebasestorage.app",
  messagingSenderId: "791519432071",
  appId: "1:791519432071:web:e5915af896a42c984fd722",
  measurementId: "G-SJQ30E2PVG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);