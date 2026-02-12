
import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";

const APPLICATIONS_COLLECTION = "applications";

/**
 * Get all applications for a specific employer's jobs
 */
export const getEmployerApplications = async (employerId) => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION), 
      where("employerId", "==", employerId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching employer applications:", error);
    throw error;
  }
};
/**
 * Get all applications for a specific candidate
 */
export const getCandidateApplications = async (candidateId) => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION), 
      where("candidateId", "==", candidateId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    throw error;
  }
};
/**
 * Check if a candidate has already applied for a job
 */
export const hasAppliedToJob = async (candidateId, jobId) => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where("candidateId", "==", candidateId),
      where("jobId", "==", jobId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking application status:", error);
    throw error;
  }
};

/**
 * Submit a new job application
 */
export const applyToJob = async (applicationData) => {
  try {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
      ...applicationData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error applying to job:", error);
    throw error;
  }
};
