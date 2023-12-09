export const ingestFile = async (file: any, apiKey: string) => {
  // Create a new FormData object
  const formData = new FormData();

  // Append the file to the FormData object
  formData.append("file", file);

  try {
    // Send the file to the server using fetch
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v0/ingestFile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    // Get the JSON response from the server
    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
