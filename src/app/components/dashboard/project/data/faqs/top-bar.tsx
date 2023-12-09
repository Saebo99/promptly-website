import React from "react";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faTrash,
  faGlobe,
} from "@fortawesome/pro-regular-svg-icons";

import { deleteData } from "@/app/utils/deleteData";

interface TopBarProps {
  addingSource: boolean;
  setAddingSource: React.Dispatch<React.SetStateAction<boolean>>;
  activeFaqGroup: any;
  setActiveFaqGroup: React.Dispatch<React.SetStateAction<any>>;
}

const TopBar: React.FC<TopBarProps> = ({
  addingSource,
  setAddingSource,
  activeFaqGroup,
  setActiveFaqGroup,
}) => {
  const projectId = useSelector(selectProjectId);

  return (
    <div className="flex justify-between items-center bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-xl font-bold">
          {activeFaqGroup ? (
            <div className="flex">
              <div
                onClick={() => setActiveFaqGroup(null)}
                className="cursor-pointer w-fit flex justify-center items-center px-2 mr-2 rounded text-gray-400 hover:text-white hover:bg-[#4B5C78]"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="" />
              </div>
              <span>{activeFaqGroup.name}</span>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
              <span>FAQ Sources</span>
            </div>
          )}
        </h1>
        <p>
          The information from frequently asked questions your chatbot has
          access to.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setAddingSource(!addingSource)}
          className="px-4 py-2 rounded bg-[#4B5C78] hover:bg-[#394861] transition duration-300"
        >
          {addingSource ? (
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          ) : (
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
          )}
          <span>{addingSource ? "View Sources" : "Add new source"}</span>
        </button>
        <button
          onClick={() => deleteData({ projectId, deleteAllSources: true })}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition duration-300"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          <span>Delete all sources</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
