import { db } from "../firebase/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export async function saveUserData(user: Partial<UserData>): Promise<void> {
  try {
    const userDocRef = doc(db, "users", user.uid as string);
    const userDoc = await getDoc(userDocRef);

    // Check if the user document doesn't exist
    if (!userDoc.exists()) {
      const newUser = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        termsOfServiceAgreement: {
          hasAgreed: true,
          version: "1.0", // Update as needed
        },
        projects: [],
      };

      await setDoc(userDocRef, newUser);
    }
  } catch (e) {
    console.error("Error saving user data:", e);
  }
}
