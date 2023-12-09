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
  //
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v0/ingestData`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls,
        crawlType,
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
