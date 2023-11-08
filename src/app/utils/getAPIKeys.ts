import { getAuth, getIdToken } from "firebase/auth";

export const getAPIKeys = async (projectId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  let idToken;
  try {
    idToken = await getIdToken(user);
  } catch (error) {
    console.error("Error getting ID token", error);
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getAPIKeys?projectId=${projectId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to get API keys:", await response.text());
    return;
  }

  const data = await response.json();
  return data.apiKeys;
};
