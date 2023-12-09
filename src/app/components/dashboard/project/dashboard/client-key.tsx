import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-solid-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { getClientKey } from "@/app/utils/getClientKey";

const ClientKey = () => {
  const projectId = useSelector(selectProjectId);
  const [clientKey, setClientKey] = useState("");

  useEffect(() => {
    const fetchClientKey = async () => {
      try {
        const decryptedKey = await getClientKey(projectId);
        setClientKey(decryptedKey || ""); // Adjust according to your data structure
      } catch (error) {
        console.error("Error fetching client key:", error);
      }
    };

    if (projectId) {
      fetchClientKey();
    }
  }, [projectId]);

  return (
    <div className="h-full shadow-lg border border-[#393E46] rounded-lg bg-[#222831] p-4 text-white">
      <h2 className="text-2xl font-bold">Client Key</h2>
      <p className="text-sm text-gray-200 font-semibold mb-4">
        {`Your client key is used in Flexibel components and
        is distinct from server API keys used for API calls. It's
        safe to expose this key as long as the domains
        using these components are whitelisted.`}
      </p>
      <div className="cursor-pointer flex items-center justify-between gap-4 p-2 border border-[#4B5C78] bg-[#222831] hover:bg-[#4B5C78] duration-300 rounded">
        <p className="text-sm font-semibold">{clientKey}</p>
        <FontAwesomeIcon icon={faCopy} className="text-white" />
      </div>
    </div>
  );
};

export default ClientKey;
