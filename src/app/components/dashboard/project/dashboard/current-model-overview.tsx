import React, { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation"; // <-- Adjusted import path

import { useSelector } from "react-redux";
import { selectModelId } from "../../../../../../redux/slices/modelSlice";

import { db } from "@/app/firebase/firebaseClient";
import { getDoc, doc } from "firebase/firestore";

const CurrentModelOverview = () => {
  const pathname = usePathname();
  const router = useRouter();
  const modelId = useSelector(selectModelId);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const fetchModel = async () => {
      if (!modelId) return;

      try {
        const docRef = doc(db, "models", modelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setModel(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchModel();
  }, [modelId]);

  return (
    <div className="border border-[#393E46] rounded-lg shadow-lg bg-[#222831] p-4 text-white h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Current Chatbot Configuration</h2>
      {model ? (
        <div>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold">Model Type:</span>
              <span className="text-gray-200 text-sm">
                The AI model that will be used to generate responses
              </span>
            </div>
            <div
              onClick={() => router.push(`${pathname}/workshop`)}
              className="cursor-pointer hover:bg-[#4B5C78] rounded px-2 py-1"
            >
              {model.modelType}
            </div>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold">Name:</span>
              <span className="text-gray-200 text-sm">
                The name of your chatbot
              </span>
            </div>
            <div
              onClick={() => router.push(`${pathname}/workshop`)}
              className="cursor-pointer hover:bg-[#4B5C78] rounded px-2 py-1"
            >
              {model.name}
            </div>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold">Response length:</span>
              <span className="text-gray-200 text-sm">
                The maximum number of characters in a response
              </span>
            </div>
            <div
              onClick={() => router.push(`${pathname}/workshop`)}
              className="cursor-pointer hover:bg-[#4B5C78] rounded px-2 py-1"
            >
              {model.responseLength}
            </div>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold">Temperature:</span>
              <span className="text-gray-200 text-sm">
                The higher the temperature, the more random the response
              </span>
            </div>
            <div
              onClick={() => router.push(`${pathname}/workshop`)}
              className="cursor-pointer hover:bg-[#4B5C78] rounded px-2 py-1"
            >
              {model.temperature}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CurrentModelOverview;
