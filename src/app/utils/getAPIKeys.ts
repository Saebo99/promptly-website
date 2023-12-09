import { db } from "@/app/firebase/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import crypto from "crypto";

const SECRET_CRYPTO_KEY =
  "623c04d4bba66a6379db4df14c3cbca794153390ddcd204186066daf894c3e52"; // Ensure this is securely managed

export const getAPIKeys = async (projectId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    return [];
  }

  try {
    const keysCollection = collection(db, "keys");
    const keysQuery = query(
      keysCollection,
      where("projectId", "==", projectId)
    );
    const querySnapshot = await getDocs(keysQuery);

    const apiKeysData: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { apiKeyEncrypted, iv, name, createdAt, lastUsedAt } = data;

      const keyBuffer = Buffer.from(SECRET_CRYPTO_KEY || "", "hex");
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

      apiKeysData.push({
        name,
        decryptedKey,
        createdAt: createdAt.toDate(),
        lastUsedAt: lastUsedAt.toDate(),
      });
    });

    return apiKeysData;
  } catch (error) {
    console.error("Error fetching API keys: ", error);
    return [];
  }
};
