import { getAPIKeys } from "./getAPIKeys";

export async function ingestImprovedAnswer(
  projectId: string,
  conversationId: string,
  messageId: string,
  question: string,
  answer: string,
  improvedAnswerId?: string // Optional parameter
) {
  try {
    // Get the API key
    const apiKeys = await getAPIKeys(projectId);
    const apiKey = apiKeys[0].decryptedKey;

    // Send the request to the ingestImprovedAnswer route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v0/ingestImprovedAnswer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          conversationId,
          messageId,
          improvedAnswerId: improvedAnswerId || null,
          question,
          answer,
        }),
      }
    );

    // Handle the response
    if (!response.ok) {
      throw new Error("Failed to ingest improved answer");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error sending improved answer", error);
    throw error;
  }
}
