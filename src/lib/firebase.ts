import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCkxPYfXyXMLpMJl-7DmuJ0k6eLTVoXQZg",
  authDomain: "yectospro.firebaseapp.com",
  projectId: "yectospro",
  storageBucket: "yectospro.firebasestorage.app",
  messagingSenderId: "67673665043",
  appId: "1:67673665043:web:9eb85cbe59f42153f899e6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export default app
