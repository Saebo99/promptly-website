import React, { useState, useEffect } from "react";
import { PromptlyAdapt } from "chat-promptly";
import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../redux/slices/projectSlice";
import { getAPIKeys } from "@/app/utils/getAPIKeys";

const HeroPage = () => {
  const projectId = useSelector(selectProjectId);
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const fetchAPIKeys = async () => {
      const keys = await getAPIKeys(projectId);
      setApiKey(keys[0].decryptedKey);
    };

    if (projectId) {
      fetchAPIKeys();
    }
  }, [projectId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center space-x-10 pb-52 px-8"
      style={{ background: "linear-gradient(to bottom, #4B5C78, #222831)" }}
    >
      <div className="max-w-xl space-y-4">
        <h1 className="text-white text-6xl font-bold">Intelligent Chatbots</h1>
        <p className="text-lg text-gray-400">
          Seamlessly integrate AI-powered chatbots to engage with your audience
          and improve customer service.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button className="bg-white font-bold py-2 px-4 rounded">
            Try now for free
          </button>
          <button className="bg-transparent text-white font-semibold py-2 px-4 border border-[#757575] hover:border-white duration-200 rounded">
            View documentation
          </button>
        </div>
      </div>
      <PromptlyAdapt
        apiKey={apiKey}
        welcomeMessage="Hei, hvordan kan jeg være til hjelp?"
        chatStyle={{
          backgroundColor: "#222831",
          color: "white",
        }}
        inputFieldStyle={{
          backgroundColor: "#222831",
          color: "white",
        }}
        chatButtonStyle={{
          backgroundColor: "#222831",
          color: "white",
        }}
        askButtonStyle={{
          backgroundColor: "#222831",
          color: "white",
        }}
        separatorStyle={{
          borderColor: "#222831",
        }}
      />
    </div>
  );
};

export default HeroPage;
