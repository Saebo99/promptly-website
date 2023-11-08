export const ingestData = async (
  urls: string[],
  crawlType: string,
  apiKey: string
) => {
  try {
  } catch (error) {
    console.error("Error getting ID token", error);
    return;
  }

  // Send request to your server route
  //${process.env.NEXT_PUBLIC_API_URL}
  const response = await fetch(`http://localhost:3000/api/ingestData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      urls,
      crawlType,
    }),
  });

  // Handle the response
  if (!response.ok) {
    console.error("Failed to create API key:", await response.text());
    return;
  }

  const data = await response.json();
  console.log(data);
};
