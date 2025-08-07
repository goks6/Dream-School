import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase configuration here
  // For now using placeholder - will need real config for production
  apiKey: "placeholder-api-key",
  authDomain: "dream-school-placeholder.firebaseapp.com",
  databaseURL: "https://dream-school-placeholder-default-rtdb.firebaseio.com",
  projectId: "dream-school-placeholder",
  storageBucket: "dream-school-placeholder.appspot.com",
  messagingSenderId: "123456789",
  appId: "placeholder-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
export const dbRefs = {
  students: ref(database, 'students'),
  teachers: ref(database, 'teachers'),
  calendar: ref(database, 'calendar'),
  assessments: ref(database, 'assessments'),
  events: ref(database, 'events'),
  holidays: ref(database, 'holidays'),
  birthdays: ref(database, 'birthdays'),
};

// Common Firebase operations
export const firebaseOps = {
  // Add data
  addData: (refPath: string, data: any) => {
    const dataRef = ref(database, refPath);
    return push(dataRef, data);
  },

  // Set data
  setData: (refPath: string, data: any) => {
    const dataRef = ref(database, refPath);
    return set(dataRef, data);
  },

  // Listen to data changes
  listenToData: (refPath: string, callback: (data: any) => void) => {
    const dataRef = ref(database, refPath);
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    return dataRef;
  },

  // Stop listening
  stopListening: (dataRef: any) => {
    off(dataRef);
  },
};

export { database };