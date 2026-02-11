
import { db, storage } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Fetch candidate profile from Firestore
 */
export const getCandidateProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

/**
 * Create or update candidate profile
 */
export const updateCandidateProfile = async (uid, data) => {
  try {
    // We use "users" collection to stay consistent with AuthContext
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Upload CV to Firebase Storage and return download URL
 * - Only PDF
 * - Max 2MB
 * - One CV per user
 */
export const uploadCV = async (uid, file) => {
  if (!file) {
    throw new Error("No file selected");
  }

  // File validation
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("CV must be less than 2MB (Your file: " + (file.size / (1024 * 1024)).toFixed(2) + "MB)");
  }

  try {
    // Fixed storage path: cvs/{uid}/resume.pdf
    const storageRef = ref(storage, `cvs/${uid}/resume.pdf`);
    
    // Perform upload
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    // Also update the user document with the new CV URL automatically
    await updateCandidateProfile(uid, { cvUrl: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage Error:", error);
    if (error.code === 'storage/unauthorized') {
      throw new Error("Storage access denied. Please check your Firebase Storage Security Rules.");
    }
    throw error;
  }
};
