import { db } from "@/app/firebase/firebaseClient";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export const createFaqGroup = async (
  projectId: string,
  groupName: string,
  groupDescription: string
) => {
  console.log("projectId: ", projectId);
  console.log("groupName: ", groupName);
  console.log("groupDescription: ", groupDescription);

  try {
    // Reference to the specific project document
    const projectDocRef = doc(db, "projects", projectId);
    // Reference to the 'dataSources' sub-collection
    const dataSourcesCollection = collection(projectDocRef, "dataSources");

    // Create the FAQ group document
    const faqGroupDoc = {
      name: groupName,
      description: groupDescription || "",
      insertedAt: Timestamp.now(),
      isActive: true,
      type: "faq",
      faqs: [],
    };

    // Add the FAQ group document to the 'dataSources' collection
    const docRef = await addDoc(dataSourcesCollection, faqGroupDoc);

    console.log("FAQ group created with ID:", docRef.id);
    return docRef.id; // Return the new document's ID or relevant data as needed
  } catch (e) {
    console.error("Error creating FAQ group:", e);
    return null;
  }
};
