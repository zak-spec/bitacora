import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebase);
const storage = getStorage(app);

export async function uploadFile(file: File): Promise<string> {
  const storageRef = ref(storage, `imagenes-bitacora/${uuidv4()}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
    return false;
  }
}
