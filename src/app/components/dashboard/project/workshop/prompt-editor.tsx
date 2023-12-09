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
    <div className="w-full max-w-[1000px] h-full my-8 flex flex-col p-4 bg-[#222831] text-white">
      <div className="border-b border-[#4B5C78] flex flex-col space-y-1 py-2">
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
        className="flex-1 outline-none rounded bg-[#222831] pr-4 mt-4"
      ></textarea>
      <div className="mt-8">
        <button
          onClick={() => dispatch(setUsingPromptEngineer(true))}
          className="px-4 py-2 w-fit rounded bg-[#4B5C78] hover:bg-[#394861] transition duration-100"
        >
          Use prompt engineer
        </button>
      </div>
    </div>
  );
};

export default PromptEditor;
