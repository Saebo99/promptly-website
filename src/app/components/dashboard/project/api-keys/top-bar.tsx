import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-regular-svg-icons";

interface TopBarProps {
  handleDeleteKeys: () => void;
  selectedKeys: string[];
  apiKeys: any[];
  setCreatingApiKey: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<TopBarProps> = ({
  handleDeleteKeys,
  selectedKeys,
  apiKeys,
  setCreatingApiKey,
}) => {
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (selectedKeys.length > 0 && selectedKeys.length < apiKeys.length) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  }, [selectedKeys, apiKeys]);

  useEffect(() => {
    console.log("canDelete: ", canDelete);
  }, [canDelete]);

  return (
    <div className="flex justify-between items-center w-full bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-xl font-bold">API Keys</h1>
        <p>API Keys are used to authenticate requests to the API.</p>
      </div>
      <div className="flex space-x-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCreatingApiKey(true)}
            className="px-4 py-2 rounded border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] transition duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            <span>Create new key</span>
          </button>
        </div>
        {canDelete && (
          <button
            onClick={handleDeleteKeys}
            className="px-4 py-2 rounded border border-red-500 bg-[#222831] hover:bg-red-500 transition duration-300"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            <span>Delete selected keys</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
