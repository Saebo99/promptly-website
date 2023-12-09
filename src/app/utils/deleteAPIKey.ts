import { db } from "@/app/firebase/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import crypto from "crypto";

const SECRET_CRYPTO_KEY =
  "623c04d4bba66a6379db4df14c3cbca794153390ddcd204186066daf894c3e52"; // Ensure this is securely managed

export const deleteAPIKey = async (projectId: string, decryptedKey: string) => {
  console.log("projectId: ", projectId);
  console.log("decryptedKey: ", decryptedKey);
  try {
    const keysCollection = collection(db, "keys");
    const keysQuery = query(
      keysCollection,
      where("projectId", "==", projectId)
    );
    const querySnapshot = await getDocs(keysQuery);

    let keyDocRef = null;

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const { apiKeyEncrypted, iv } = data;

      const keyBuffer = Buffer.from(SECRET_CRYPTO_KEY, "hex");
      const ivBuffer = Buffer.from(iv, "hex");
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        keyBuffer,
        ivBuffer
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(apiKeyEncrypted, "hex")),
        decipher.final(),
      ]).toString("utf8");
      console.log("decrypted: ", decrypted);

      if (decrypted === decryptedKey) {
        keyDocRef = doc.ref;
        break;
      }
    }

    if (keyDocRef) {
      await deleteDoc(keyDocRef);
      console.log("API key deleted successfully");
    } else {
      console.log("No matching API key found");
    }
  } catch (error) {
    console.error("Error deleting API key:", error);
  }
};
