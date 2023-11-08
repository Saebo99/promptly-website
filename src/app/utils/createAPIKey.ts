import { getAuth, getIdToken } from "firebase/auth";

export const createAPIKey = async (projectId: string, keyName = "New key") => {
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

  // Send request to your server route
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/createAPIKey`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({
        projectId: projectId,
        keyName: keyName,
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
};
