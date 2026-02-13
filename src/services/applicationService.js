
import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";
const storage = getStorage();

const APPLICATIONS_COLLECTION = "applications";

/**
 * Get all applications for a specific employer's jobs
 */
export const getEmployerApplications = async (employerId) => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION), 
      where("employerId", "==", employerId),
      orderBy("createdAt", "desc")
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
/**
 * Update application status (Pending, Shortlisted, Rejected)
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
export const getFreshCvUrl = async (candidateId) => {
  try {
    // This must match the path in your Storage: cvs/{userId}/resume.pdf
    const cvRef = ref(storage, `cvs/${candidateId}/resume.pdf`);
    const url = await getDownloadURL(cvRef);
    return url;
  } catch (error) {
    console.error("Error generating fresh CV URL:", error);
    throw error;
  }
};