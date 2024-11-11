// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref,uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW_YI3_TiaLiiWfvsUUXt-Z_EwmK717WM",
  authDomain: "test-ejemplo-c4fa0.firebaseapp.com",
  projectId: "test-ejemplo-c4fa0",
  storageBucket: "test-ejemplo-c4fa0.appspot.com",
  messagingSenderId: "356363113042",
  appId: "1:356363113042:web:f95305121e3b510245458b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage= getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, 'imagenes-bitacora/-' + v4());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}