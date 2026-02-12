
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Fetch employer profile from Firestore
 */
export const getEmployerProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting employer profile:", error);
    throw error;
  }
};

/**
 * Create or update employer profile
 */
export const updateEmployerProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    }, { merge: true });
    return data;
  } catch (error) {
    console.error("Error updating employer profile:", error);
    throw error;
  }
};
