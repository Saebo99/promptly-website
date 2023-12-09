import { getAPIKeys } from "./getAPIKeys";

export const ingestVideo = async (url: string, projectId: string) => {
  try {
    const apiKeys = await getAPIKeys(projectId);
    const apiKey = apiKeys[0].decryptedKey;

    // http://51.20.75.92:3000
    // Send request to your server route
    //${process.env.NEXT_PUBLIC_API_URL}
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v0/ingestVideo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
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
  } catch (error) {
    console.error("Error getting ID token", error);
    return;
  }
};
