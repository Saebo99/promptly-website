import { db } from "@/app/firebase/firebaseClient"; // Update the import path as needed
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { getAPIKeys } from "./getAPIKeys";

type DeleteDataParams = {
  projectId: string;
  source?: string;
  deleteAllSources?: boolean;
};

export const deleteData = async ({
  projectId,
  source,
  deleteAllSources = false,
}: DeleteDataParams) => {
  try {
    const apiKeys = await getAPIKeys(projectId);
    const apiKey = apiKeys[0].decryptedKey;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v0/deleteData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          source,
          deleteAllSources,
        }),
      }
    );

    // Handle the response
    if (!response.ok) {
      console.error("Failed to create API key:", await response.text());
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error in deleting data source:", error);
    throw error; // Rethrow the error for the calling function to handle
  }
};
