import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faTrash,
} from "@fortawesome/pro-regular-svg-icons";

interface TopBarProps {
  addingSource: boolean;
  setAddingSource: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSources: string[];
  handleDeleteSources: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  addingSource,
  setAddingSource,
  selectedSources,
  handleDeleteSources,
}) => {
  return (
    <div className="flex justify-between items-center bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-xl font-bold">Sources</h1>
        <p>The information your chatbot has access to.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setAddingSource(!addingSource)}
          className="px-4 py-2 rounded border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] transition duration-300"
        >
          {addingSource ? (
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          ) : (
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
          )}
          <span>{addingSource ? "View Sources" : "Add new source"}</span>
        </button>
        <button
          onClick={handleDeleteSources}
          className="px-4 py-2 rounded border border-red-500 bg-[#222831] hover:bg-red-500 transition duration-300"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          <span>
            {selectedSources && selectedSources.length > 0
              ? "Delete selected sources"
              : "Delete all sources"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
