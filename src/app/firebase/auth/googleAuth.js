import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebaseClient";

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return null;
  }
};

const signInWithDifferentGoogleAccount = async () => {
  try {
    // Set the 'prompt' option to 'select_account' to force the account chooser to display
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Remove the current user from local storage
    localStorage.removeItem("user");

    // Set the new user to local storage
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Error signing in with different Google account:", error);
    return null;
  }
};

export { signInWithGoogle, signInWithDifferentGoogleAccount };
