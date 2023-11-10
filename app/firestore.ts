
import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyBzlmNl1rlVWeV51sUZKqThSD93FO55Hbk",
  authDomain: "raffle-app2.firebaseapp.com",
  projectId: "raffle-app2",
  storageBucket: "raffle-app2.appspot.com",
  messagingSenderId: "660655652385",
  appId: "1:660655652385:web:701957628117f847f46d60"
};


const app = initializeApp(firebaseConfig);

export default app