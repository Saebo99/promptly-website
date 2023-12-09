import { db } from "@/app/firebase/firebaseClient";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import crypto from "crypto";

export const createAPIKey = async (projectId: string, keyName = "New key") => {
  const SECRET_CRYPTO_KEY =
    "623c04d4bba66a6379db4df14c3cbca794153390ddcd204186066daf894c3e52";
  console.log("projectId: ", projectId);
  console.log("keyName: ", keyName);
  // Perform API Key creation logic directly here
  try {
    const apiKey = crypto.randomBytes(22).toString("hex");
    const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
    const iv = crypto.randomBytes(16);
    const keyBuffer = Buffer.from(SECRET_CRYPTO_KEY || "", "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
    const encryptedApiKey = Buffer.concat([
      cipher.update(apiKey, "utf8"),
      cipher.final(),
    ]).toString("hex");
    console.log("encryptedApiKey: ", encryptedApiKey);

    const keysCollection = collection(db, "keys");
    await addDoc(keysCollection, {
      projectId: projectId,
      name: keyName,
      apiKeyEncrypted: encryptedApiKey,
      iv: iv.toString("hex"),
      apiKeyHashed: apiKeyHash,
      createdAt: Timestamp.now(),
      lastUsedAt: Timestamp.now(),
    });

    console.log("API Key created:", apiKey);
    return apiKey; // Return the API key or relevant data as needed
  } catch (e) {
    console.error("Error creating API key:", e);
    return null;
  }
};
