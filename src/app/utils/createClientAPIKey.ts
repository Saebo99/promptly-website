import { db } from "@/app/firebase/firebaseClient";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import crypto from "crypto";

const SECRET_CRYPTO_KEY =
  "623c04d4bba66a6379db4df14c3cbca794153390ddcd204186066daf894c3e52";
export const createClientAPIKey = async (projectId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    return;
  }
  console.log("beginning creation");

  try {
    const apiKeyPrefix = "flx-";
    const randomBytesLength = 11; // 11 bytes will make 22 hexadecimal characters
    const apiKey =
      apiKeyPrefix + crypto.randomBytes(randomBytesLength).toString("hex");
    const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    const iv = crypto.randomBytes(16);
    const keyBuffer = Buffer.from(SECRET_CRYPTO_KEY || "", "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
    const encryptedApiKey = Buffer.concat([
      cipher.update(apiKey, "utf8"),
      cipher.final(),
    ]).toString("hex");

    const clientKeysCollection = collection(db, "clientKeys");
    await addDoc(clientKeysCollection, {
      projectId: projectId,
      apiKeyHashed: apiKeyHash,
      apiKeyEncrypted: encryptedApiKey,
      iv: iv.toString("hex"),
      createdAt: Timestamp.now(),
    });

    console.log("Client API Key created:", apiKey);
    return apiKey; // Return the API key or relevant data as needed
  } catch (e) {
    console.error("Error creating client API key:", e);
    return null;
  }
};
