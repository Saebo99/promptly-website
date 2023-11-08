import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const getModels = async (ids: string[]) => {
  try {
    const db = getFirestore();
    const modelsCollectionRef = collection(db, "models");

    // Split ids into chunks of 10 or fewer for Firestore query
    const chunks = [];
    for (let i = 0; i < ids.length; i += 10) {
      chunks.push(ids.slice(i, i + 10));
    }

    const modelsDocs = [];
    for (const chunk of chunks) {
      const modelsQuery = query(
        modelsCollectionRef,
        where("__name__", "in", chunk)
      );
      const modelsQuerySnapshot = await getDocs(modelsQuery);
      modelsDocs.push(
        ...modelsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }

    return modelsDocs; // This will return an array of model documents data
  } catch (error) {
    console.error("Error fetching models:", error);
    return null;
  }
};
