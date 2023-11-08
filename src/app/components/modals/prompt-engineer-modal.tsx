import React, { useState } from "react";

import { useDispatch } from "react-redux";
import {
  setUsingPromptEngineer,
  setGeneratedPrompt,
} from "../../../../redux/slices/modelSlice";

const PromptEngineerModal = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");

  const handleGeneratePrompt = async () => {
    const res = await fetch("/api/promptEngineer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptDescription: inputText }),
    });

    if (!res.ok) throw new Error(res.statusText);
    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let aiPrompt = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      aiPrompt += decoder.decode(value);
    }

    if (aiPrompt) {
      dispatch(setGeneratedPrompt(aiPrompt));
      dispatch(setUsingPromptEngineer(false));
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100000000 }}
    >
      <div
        onClick={() => dispatch(setUsingPromptEngineer(false))}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ height: "40%", width: "50%" }}
      >
        <div>
          <h1 className="text-2xl font-bold mb-4">Prompt Generator</h1>
          <p className="mb-4">
            Creating a prompt is easy! Simply describe your chatbot and what you
            want it to do in the input field below. We will do the rest!
          </p>
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mb-4 p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
          placeholder="Describe your chatbot here..."
        />
        <button
          onClick={handleGeneratePrompt}
          disabled={!inputText.trim()}
          className={`${
            inputText.trim()
              ? "bg-[#222831] border border-[#00ADB5] hover:bg-[#00ADB5] duration-300"
              : "bg-[##222831] border border-[#393E46] cursor-not-allowed"
          } text-white py-2 px-4 rounded`}
        >
          Generate Prompt
        </button>
      </div>
    </div>
  );
};

export default PromptEngineerModal;
