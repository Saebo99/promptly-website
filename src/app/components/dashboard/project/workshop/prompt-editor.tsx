import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  setUsingPromptEngineer,
  selectGeneratedPrompt,
  setGeneratedPrompt,
} from "../../../../../../redux/slices/modelSlice";

import { db } from "@/app/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

interface PromptEditorProps {
  modelId: string;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  modelId,
  prompt,
  setPrompt,
}) => {
  const dispatch = useDispatch();
  const generatedPrompt = useSelector(selectGeneratedPrompt);

  useEffect(() => {
    const fetchModel = async () => {
      if (!modelId) return;

      console.log("modelId: ", modelId);
      const modelRef = doc(db, "models", modelId);
      const modelDoc = await getDoc(modelRef);
      if (modelDoc.exists()) {
        setPrompt(modelDoc.data().prompt);
      }
    };

    fetchModel();
  }, [modelId]);

  useEffect(() => {
    if (generatedPrompt) {
      setPrompt(generatedPrompt);
      dispatch(setGeneratedPrompt(""));
    }
  }, [generatedPrompt]);

  return (
    <div className="w-full h-full flex flex-col shadow-lg p-4 border border-[#393E46] rounded-lg bg-[#222831] text-white">
      <div className="border-b border-white flex flex-col space-y-1 py-2">
        <h2 className="text-xl font-bold">Prompt</h2>
        <span className="text-xs text-gray-300">
          The prompt must contain these items for the model to work properly:
        </span>
        <span className="text-xs text-gray-300">
          [chat_history]: The chat history of the conversation.
        </span>
        <span className="text-xs text-gray-300">
          [context]: The context from your data sources.
        </span>
        <span className="text-xs text-gray-300">
          [question]: The question from the user.
        </span>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt for your chatbot"
        className="flex-1 outline-none rounded bg-[#222831] mt-4"
      ></textarea>
      <button
        onClick={() => dispatch(setUsingPromptEngineer(true))}
        className="px-4 py-2 rounded border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] transition duration-300"
      >
        Use prompt engineer
      </button>
    </div>
  );
};

export default PromptEditor;
