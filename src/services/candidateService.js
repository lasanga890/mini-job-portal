
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
 * Upload CV to Firebase Storage (Profile CV)
 * Path: cvs/{uid}/resume.pdf
 * - Only PDF
 * - Max 2MB
 * - One CV per user (overwrites previous)
 */
export const uploadCV = async (uid, file) => {
  if (!file) {
    throw new Error("No file selected");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("CV must be less than 2MB (Your file: " + (file.size / (1024 * 1024)).toFixed(2) + "MB)");
  }

  try {
    const storageRef = ref(storage, `cvs/${uid}/resume.pdf`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile with CV metadata
    await updateCandidateProfile(uid, { 
      cvUrl: downloadURL,
      cvName: file.name,
      cvUpdatedAt: new Date().toISOString()
    });
    
    return { url: downloadURL, name: file.name };
  } catch (error) {
    console.error("Firebase Storage Error:", error);
    if (error.code === 'storage/unauthorized') {
      throw new Error("Storage access denied. Please check your Firebase Storage Security Rules.");
    }
    throw error;
  }
};

/**
 * Upload CV to Firebase Storage (Application CV)
 * Path: applications/{applicationId}/resume.pdf
 * Creates a snapshot copy for the specific application
 */
export const uploadApplicationCV = async (applicationId, uid, file) => {
  if (!file) {
    throw new Error("No file selected");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("CV must be less than 2MB (Your file: " + (file.size / (1024 * 1024)).toFixed(2) + "MB)");
  }

  try {
    // Store application CV in separate path: applications/{applicationId}/resume.pdf
    const storageRef = ref(storage, `applications/${applicationId}/resume.pdf`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return { url: downloadURL, name: file.name, path: storageRef.fullPath };
  } catch (error) {
    console.error("Firebase Storage Error:", error);
    if (error.code === 'storage/unauthorized') {
      throw new Error("Storage access denied. Please check your Firebase Storage Security Rules.");
    }
    throw error;
  }
};

/**
 * Get fresh download URL for profile CV
 */
export const getProfileCvUrl = async (uid) => {
  try {
    if (!uid) throw new Error('Missing user id');
    const storageRef = ref(storage, `cvs/${uid}/resume.pdf`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error fetching profile CV URL:', error);
    throw error;
  }
};
