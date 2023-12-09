import { db } from "@/app/firebase/firebaseClient";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

type WhitelistEntry = {
  url: string;
  includes: string;
  excludes: string;
};

type SaveWhitelistParams = {
  projectId: string;
  whitelistEntry: WhitelistEntry;
  onCloseModal: () => void; // Function to close the modal
};

export const saveWhitelist = async ({
  projectId,
  whitelistEntry,
  onCloseModal,
}: SaveWhitelistParams) => {
  try {
    const projectRef = doc(db, "projects", projectId);

    // Update project document with the new whitelist entry
    // Assuming "whitelist" is an array field in the project document
    await updateDoc(projectRef, {
      whitelist: arrayUnion(whitelistEntry),
    });

    // Close the modal after successful update
    onCloseModal();
  } catch (error) {
    console.error("Error saving whitelist entry:", error);
  }
};
