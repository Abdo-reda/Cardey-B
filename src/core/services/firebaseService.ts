import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'cardy-b.firebaseapp.com',
	projectId: 'cardy-b',
	storageBucket: 'cardy-b.appspot.com',
	messagingSenderId: '581085078554',
	appId: import.meta.env.VITE_FIREBASE_API_ID,
};

const app = initializeApp(firebaseConfig);

const cardeyBFireStore = getFirestore(app);

export { cardeyBFireStore };
