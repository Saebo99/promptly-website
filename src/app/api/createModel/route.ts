import { db } from "@/app/firebase/firebaseClient"; // Update the path as needed
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  console.log("req.body", req.body);
  const data = await req.json();
  console.log(data);
  const { config } = data;

  const modelsCollectionRef = collection(db, "models");

  // Use config parameter if provided, otherwise use default values
  const newModelData = config || {
    modelType: "gpt-3.5-turbo",
    name: "new model",
    prompt: "New prompt",
    responseLength: 1500,
    temperature: 0.5,
    suggestedMessages: [],
  };

  try {
    const modelRef = await addDoc(modelsCollectionRef, newModelData);
    const modelId = modelRef.id;

    // Assuming you have a way to retrieve the current projectId
    const projectId = "your_project_id"; // Replace with actual logic to get projectId

    // Reference to the project document
    const projectRef = doc(db, "projects", projectId);

    // Get the current data of the project document
    const projectDoc = await getDoc(projectRef);
    const projectData = projectDoc.data();

    if (projectData) {
      const updatedModels = { ...projectData.models };
      for (const [key, value] of Object.entries(updatedModels)) {
        if (value === true) {
          updatedModels[key] = false;
          break;
        }
      }

      updatedModels[modelId] = true;

      await updateDoc(projectRef, { models: updatedModels });
    }

    return new Response(
      JSON.stringify({
        modelId: modelId,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating model:", error.message);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
