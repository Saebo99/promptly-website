import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-solid-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { getAPIKeys } from "@/app/utils/getAPIKeys";

const APIKeyOverview = () => {
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
    <div className="h-full shadow-lg border border-[#393E46] rounded-lg bg-[#222831] p-4 text-white">
      <h2 className="text-2xl font-bold">API Key</h2>
      <p className="text-sm text-gray-200 font-semibold mb-4">
        Your API key is used to authenticate requests to the API. Keep it
        secret, keep it safe.
      </p>
      <div className="cursor-pointer flex items-center justify-between gap-4 p-2 border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] duration-300 rounded">
        <p className="text-sm font-semibold">{apiKey}</p>
        <FontAwesomeIcon icon={faCopy} className="text-white" />
      </div>
    </div>
  );
};

export default APIKeyOverview;
