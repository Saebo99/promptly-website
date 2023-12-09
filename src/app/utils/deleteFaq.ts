import { db } from "@/app/firebase/firebaseClient";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export const deleteFaq = async (
  projectId: string,
  faqGroupId: string,
  faqId: string
) => {
  console.log("projectId: ", projectId);
  console.log("faqGroupId: ", faqGroupId);
  console.log("faqId: ", faqId);

  try {
    // Reference to the specific FAQ group document
    const faqGroupDocRef = doc(
      db,
      "projects",
      projectId,
      "dataSources",
      faqGroupId
    );

    // FAQ object to be removed
    const faqObjectToRemove = {
      id: faqId,
      // Include other necessary fields that identify the FAQ to be removed
      // question, answer, insertedAt, etc. (if these fields are used in arrayRemove)
    };

    // Update the FAQ group document to remove the FAQ object
    await updateDoc(faqGroupDocRef, {
      faqs: arrayRemove(faqObjectToRemove),
    });

    console.log("FAQ deleted with ID:", faqId);
    return faqId; // Return the deleted FAQ's ID
  } catch (e) {
    console.error("Error deleting FAQ:", e);
    return null;
  }
};
