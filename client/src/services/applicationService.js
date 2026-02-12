
import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  getDocs, 
  query, 
  where 
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
