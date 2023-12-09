import { db } from "@/app/firebase/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import crypto from "crypto";

const SECRET_CRYPTO_KEY =
  "623c04d4bba66a6379db4df14c3cbca794153390ddcd204186066daf894c3e52"; // Ensure this is securely managed

export const getClientKey = async (projectId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  try {
    const clientKeysCollection = collection(db, "clientKeys");
    const q = query(clientKeysCollection, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No client keys found for project ${projectId}`);
      return null;
    }

    const clientKeyData = querySnapshot.docs[0].data();
    const { apiKeyEncrypted, iv } = clientKeyData;

    console.log("apiKeyEncrypted:", apiKeyEncrypted); // Check if this is undefined
    console.log("iv:", iv); // Check if this is undefined

    try {
      const keyBuffer = Buffer.from(SECRET_CRYPTO_KEY, "hex");
      const ivBuffer = Buffer.from(iv, "hex");
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        keyBuffer,
        ivBuffer
      );
      const decryptedKey = Buffer.concat([
        decipher.update(Buffer.from(apiKeyEncrypted, "hex")),
        decipher.final(),
      ]).toString("utf8");

      console.log("Client API Key retrieved:", decryptedKey);
      return decryptedKey;
    } catch (cryptoError) {
      console.error("Error in decryption:", cryptoError);
    }
  } catch (error) {
    console.error(`Error fetching client key for project ${projectId}:`, error);
    return null;
  }
};
