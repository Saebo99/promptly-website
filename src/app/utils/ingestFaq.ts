import { getAPIKeys } from "./getAPIKeys";

export const ingestFaq = async (
  projectId: string,
  faqGroupName: string,
  question: string,
  answer: string,
  faqId?: string // Optional parameter
) => {
  try {
    const apiKeys = await getAPIKeys(projectId);
    const apiKey = apiKeys[0].decryptedKey;

    // Use provided faqId or generate a new one
    const faqIdToUse = faqId || `faq_${Date.now()}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v0/ingestFaq`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          faqGroupName,
          faqId: faqIdToUse,
          question,
          answer,
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

    return faqIdToUse;
  } catch (error) {
    console.error("Error getting ID token", error);
    return;
  }
};
