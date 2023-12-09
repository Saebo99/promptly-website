import { db } from "@/app/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export const getWhitelist = async (projectId: string) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      console.error(`No project found with ID: ${projectId}`);
      return null;
    }

    const projectData = projectDoc.data();

    // Assuming the whitelist is stored in a field called 'whitelist'
    return projectData.whitelist || [];
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return null;
  }
};
