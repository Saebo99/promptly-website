import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faFile,
  faCircleCheck,
  faCircleXmark,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";
import { deleteData } from "@/app/utils/deleteData";

interface FileSourcesProps {
  sources: any[];
  openModal: () => void;
}

const FileSources: React.FC<FileSourcesProps> = ({ sources, openModal }) => {
  const projectId = useSelector(selectProjectId);
  const [fileSources, setFileSources] = useState<any[]>([]);

  useEffect(() => {
    const filteredSources = sources
      .filter((source) => source.type === "file")
      .map((source) => ({
        ...source,
        isDeleting: false,
      }));

    setFileSources(filteredSources);
  }, [sources]);

  const handleDeleteClick = (id: string) => {
    setFileSources((currentSources) =>
      currentSources.map((source) =>
        source.id === id
          ? { ...source, isDeleting: !source.isDeleting }
          : source
      )
    );
  };

  const confirmDelete = async (source: string, id: string) => {
    await deleteData({ projectId, source });
    setFileSources((currentSources) =>
      currentSources.filter((source) => source.id !== id)
    );
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-fit h-fit max-h-[70vh] rounded">
      {fileSources.length > 0 ? (
        <div className="flex-auto overflow-y-scroll">
          {fileSources.map((source) => (
            <div
              key={source.id}
              className="grid grid-cols-4 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100"
              style={{ gridTemplateColumns: "700px 90px 90px 40px" }}
            >
              <div>
                <FontAwesomeIcon icon={faFile} className="mr-2" size="sm" />
                <span className="truncate" style={{ width: "700px" }}>
                  {source.source}
                </span>
              </div>
              <div className="text-sm flex justify-center items-center">
                {source.insertedAt}
              </div>
              {source.isActive ? (
                <div className="cursor-pointer text-xs flex items-center justify-center mr-2 rounded bg-green-500 hover:bg-green-600 duration-300 px-1">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="mr-1"
                    size="xs"
                  />{" "}
                  Is active
                </div>
              ) : (
                <div className="cursor-pointer text-xs flex items-center justify-center mr-2 rounded bg-red-500 hover:bg-red-600 duration-300 px-1">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="mr-1"
                    size="xs"
                  />{" "}
                  Not active
                </div>
              )}
              <div
                onClick={() => handleDeleteClick(source.id)}
                className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                  !source.isDeleting &&
                  "border border-[#637695] hover:border-red-500 px-2"
                }`}
              >
                {!source.isDeleting ? (
                  <FontAwesomeIcon icon={faTrash} className="" size="sm" />
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="cursor-pointer"
                        onClick={() => confirmDelete(source.source, source.id)}
                      />
                    </div>
                    <div className="flex justify-center items-center bg-[#393E46] text-white cursor-pointer mr-2 w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300">
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-gray-400 cursor-pointer"
                        onClick={() => handleDeleteClick(source.id)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={openModal}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new file
          </button>
        </div>
      ) : (
        <div className="flex-auto flex justify-center items-center text-gray-400">
          <button
            onClick={openModal}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new file
          </button>
        </div>
      )}
    </div>
  );
};

export default FileSources;
