import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faTimes } from "@fortawesome/pro-regular-svg-icons";

import { deleteAPIKey } from "@/app/utils/deleteAPIKey";

type Key = {
  id: string;
  name: string;
  decryptedKey: string;
  createdAt: string;
};

interface KeyTableProps {
  keys: Key[];
}

type KeyWithDeletionState = Key & { isDeleting: boolean };

const KeyTable: React.FC<KeyTableProps> = ({ keys }) => {
  const projectId = useSelector(selectProjectId);
  const [keysWithDeletionState, setKeysWithDeletionState] = useState<
    KeyWithDeletionState[]
  >(keys.map((key) => ({ ...key, isDeleting: false })));

  const handleDeleteClick = (id: string) => {
    setKeysWithDeletionState((currentKeys) =>
      currentKeys.map((key) =>
        key.decryptedKey === id ? { ...key, isDeleting: !key.isDeleting } : key
      )
    );
  };

  const confirmDelete = async (id: string) => {
    await deleteAPIKey(projectId, id);
    setKeysWithDeletionState((currentKeys) =>
      currentKeys.filter((key) => key.decryptedKey !== id)
    );
  };
  // Utility function to format the date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Utility function to format the decryptedKey
  const formatDecryptedKey = (decryptedKey: string) => {
    if (decryptedKey.length > 10) {
      const firstFour = decryptedKey.substring(0, 4);
      const lastThree = decryptedKey.substring(decryptedKey.length - 3);
      return `${firstFour}***${lastThree}`;
    }
    return decryptedKey;
  };

  return (
    <div className="bg-[#222831] w-fit h-fit border border-[#393E46] rounded">
      <div
        className="grid grid-cols-4 text-white font-semibold p-4"
        style={{ gridTemplateColumns: "200px 200px 200px 50px" }}
      >
        <div>Name</div>
        <div>Key</div>
        <div>Created At</div>
        <div>Action</div>
      </div>
      {keysWithDeletionState.map((key, index) => (
        <div
          key={key.decryptedKey}
          className={`grid grid-cols-4 p-4 ${
            index !== 0 ? "border-t border-[#393E46]" : ""
          }`}
          style={{ gridTemplateColumns: "200px 200px 200px 50px" }}
        >
          <div>{key.name}</div>
          <div className="text-gray-400">
            {formatDecryptedKey(key.decryptedKey)}
          </div>
          <div className="text-gray-400">{formatDate(key.createdAt)}</div>
          <div className="w-full flex justify-center">
            {!key.isDeleting ? (
              <FontAwesomeIcon
                icon={faTrash}
                className="text-gray-400 hover:text-red-500 duration-300 cursor-pointer"
                onClick={() => handleDeleteClick(key.decryptedKey)}
              />
            ) : (
              <div className="flex items-center">
                <div className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300">
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="sm"
                    onClick={() => confirmDelete(key.decryptedKey)}
                  />
                </div>
                <div className="flex justify-center items-center bg-[#393E46] text-white cursor-pointer mr-2 w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300">
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="sm"
                    onClick={() => handleDeleteClick(key.decryptedKey)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyTable;
