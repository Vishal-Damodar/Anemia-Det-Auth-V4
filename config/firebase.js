import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLof3-DvJvEc3QZuL7_I2W7iz5pWibOjo",
  authDomain: "anemia-detection-6c1e5.firebaseapp.com",
  projectId: "anemia-detection-6c1e5",
  storageBucket: "anemia-detection-6c1e5.appspot.com",
  messagingSenderId: "875136285263",
  appId: "1:875136285263:web:3c51581b400f05da60483a",
  measurementId: "G-18VTVB19KW",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
