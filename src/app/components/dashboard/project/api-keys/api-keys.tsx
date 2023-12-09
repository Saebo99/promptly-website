import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/pro-regular-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { getAPIKeys } from "@/app/utils/getAPIKeys";
import { createAPIKey } from "@/app/utils/createAPIKey";

import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import TopBar from "./top-bar";
import KeyTable from "./key-table";
import LoadingAnimation from "../../loading-animation/loading-animation";

type Key = {
  id: string;
  name: string;
  decryptedKey: string;
  createdAt: string;
  lastUsedAt: string;
};

const ApiKeys = () => {
  const projectId = useSelector(selectProjectId);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // State to keep track of selected keys
  const [apiKeys, setApiKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingApiKey, setCreatingApiKey] = useState(false);

  // useEffect hook to simulate loading animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("selectedKeys: ", selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    const fetchAPIKeys = async () => {
      const keys = await getAPIKeys(projectId);
      setApiKeys(keys);
    };

    if (projectId) {
      fetchAPIKeys();
    }
  }, [projectId]);

  const handleDeleteKeys = () => {
    const filteredKeys = apiKeys.filter(
      (key) => !selectedKeys.includes(key.decryptedKey)
    );
    if (filteredKeys.length > 0) {
      setApiKeys(filteredKeys); // Update keys after deletion
      setSelectedKeys([]); // Clear selection after deletion
    }
    // Here you would also handle the deletion in the backend
  };

  return (
    <div className="w-screen h-screen bg-[#222831] flex text-white">
      <Sidebar />
      {loading ? (
        <div className="relative w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <DashboardNavbar />
          <TopBar
            handleDeleteKeys={handleDeleteKeys}
            selectedKeys={selectedKeys}
            apiKeys={apiKeys}
            setCreatingApiKey={setCreatingApiKey}
          />
          <div className="w-full flex justify-center mt-8">
            <KeyTable keys={apiKeys} />
          </div>
        </div>
      )}
      {creatingApiKey && (
        <CreateApiKey onClose={() => setCreatingApiKey(false)} />
      )}
    </div>
  );
};

// Modal component for editing project name
const CreateApiKey = ({ onClose }: any) => {
  const projectId = useSelector(selectProjectId);
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleCreateKey = async () => {
    const newKey = await createAPIKey(
      projectId,
      inputText.trim() ? inputText : "New Key"
    );
    setApiKey(newKey as string);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    // Optionally, you can display a notification to the user that the key has been copied
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100 }}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ width: "50%" }}
      >
        {!apiKey ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Create new key</h1>
            <span className="w-3/4 text-start">Enter Key name (optional)</span>
            <input
              type="text"
              value={inputText}
              placeholder="New key"
              onChange={(e) => setInputText(e.target.value)}
              className="mb-4 p-2 w-3/4 bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
            />
            <div className="space-x-4">
              <button
                onClick={handleCreateKey}
                className="text-white mt-4 py-2 px-4 rounded border border-[#00ADB5] hover:bg-[#00ADB5] duration-300"
              >
                Create Key
              </button>
              <button
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-white duration-300"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">API Key Created</h1>
            <p className="mb-4">
              Keep your newly created API key secret, keep it safe. This is the
              only time you will be able to see the key for security reasons. If
              you lose it, you will have to create a new one.
            </p>
            <div
              className={`mb-4 p-2 w-3/4 bg-[#222831] rounded border ${
                isFocused ? "border-[#00ADB5]" : "border-[#393E46]"
              } flex justify-between items-center`}
              onClick={() => setIsFocused(true)}
              tabIndex={0} // Make it focusable
            >
              <span>{apiKey}</span>
              <FontAwesomeIcon
                icon={copied ? faCheck : faCopy}
                onClick={handleCopyToClipboard}
                className="cursor-pointer"
              />
            </div>
            <button
              onClick={onClose}
              className="text-white mt-4 py-2 px-4 rounded border border-[#00ADB5] hover:bg-[#00ADB5] duration-300"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;
