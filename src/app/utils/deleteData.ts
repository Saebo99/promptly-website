export const deleteData = async (apiKey: string, sources: string[]) => {
  // Send request to your server route
  //${process.env.NEXT_PUBLIC_API_URL}
  const response = await fetch(`http://localhost:3000/api/deleteData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      sources,
    }),
  });

  // Handle the response
  if (!response.ok) {
    console.error("Failed delete data:", await response.text());
    return;
  }

  const data = await response.json();
  console.log(data);
};
