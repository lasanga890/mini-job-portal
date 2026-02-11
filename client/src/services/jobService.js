
import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

const JOBS_COLLECTION = "jobs";

/**
 * Post a new job
 */
export const createJob = async (employerId, jobData) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...jobData,
      employerId,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

/**
 * Get all jobs posted by a specific employer
 */
export const getEmployerJobs = async (employerId) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION), 
      where("employerId", "==", employerId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    throw error;
  }
};

/**
 * Get a single job by ID
 */
export const getJobById = async (jobId) => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId, jobData) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, {
      ...jobData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await deleteDoc(jobRef);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
