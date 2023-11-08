import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { getAPIKeys } from "@/app/utils/getAPIKeys";

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
          />
          <div className="flex flex-grow space-x-4 mb-4 mx-4">
            <KeyTable
              keys={apiKeys}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;
