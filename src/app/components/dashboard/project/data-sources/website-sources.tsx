import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faChevronRight,
  faListTree,
  faCircleCheck,
  faCircleXmark,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { deleteData } from "@/app/utils/deleteData";

interface WebsiteSourcesProps {
  sources: any[];
  openModal: () => void;
}

const WebsiteSources: React.FC<WebsiteSourcesProps> = ({
  sources,
  openModal,
}) => {
  const projectId = useSelector(selectProjectId);
  const [websiteSources, setWebsiteSources] = useState<any[]>([]);

  useEffect(() => {
    const filteredSources = sources
      .filter((source) => source.type === "website")
      .map((source) => ({
        ...source,
        isDeleting: false,
        children: [],
        isOpen: false,
      }));

    // Building a tree structure
    const sourceMap = new Map();
    filteredSources.forEach((source) => {
      sourceMap.set(source.source, source);
    });

    filteredSources.forEach((source) => {
      const baseUrl = source.source.split("/").slice(0, 3).join("/");
      if (source.source !== baseUrl && sourceMap.has(baseUrl)) {
        sourceMap.get(baseUrl).children.push(source);
      }
    });

    setWebsiteSources(
      filteredSources.filter(
        (source) =>
          source.source.split("/").slice(0, 3).join("/") === source.source
      )
    );
  }, [sources]);

  const toggleChildren = (sourceId: string) => {
    setWebsiteSources((currentSources) =>
      currentSources.map((source) =>
        source.id === sourceId ? { ...source, isOpen: !source.isOpen } : source
      )
    );
  };

  const handleDeleteClick = (id: string, parentId?: string) => {
    console.log("delete", id);
    console.log("current website sources: ", websiteSources);

    if (parentId) {
      // Handle deletion for child item
      setWebsiteSources((currentSources) =>
        currentSources.map((source) => {
          if (source.id === parentId) {
            // Found the parent, now update the child
            const updatedChildren = source.children.map((child: any) => {
              if (child.id === id) {
                return { ...child, isDeleting: !child.isDeleting };
              }
              return child;
            });

            return { ...source, children: updatedChildren };
          }
          return source;
        })
      );
    } else {
      // Handle deletion for top-level item
      setWebsiteSources((currentSources) =>
        currentSources.map((source) =>
          source.id === id
            ? { ...source, isDeleting: !source.isDeleting }
            : source
        )
      );
    }
  };

  const confirmDelete = async (
    source: string,
    id: string,
    parentId?: string
  ) => {
    await deleteData({ projectId, source });

    setWebsiteSources((currentSources) => {
      if (parentId) {
        // Delete a child item
        return currentSources.map((sourceItem) => {
          if (sourceItem.id === parentId) {
            // Filter out the child item with the specified id
            const updatedChildren = sourceItem.children.filter(
              (child: any) => child.id !== id
            );
            return { ...sourceItem, children: updatedChildren };
          }
          return sourceItem;
        });
      } else {
        // Delete a top-level item
        return currentSources.filter((sourceItem) => sourceItem.id !== id);
      }
    });
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-fit h-fit max-h-[70vh] rounded">
      {websiteSources.length > 0 ? (
        <div className="flex-auto overflow-y-scroll">
          {websiteSources.map((source, index) => (
            <>
              <div
                key={source.id}
                className={`cursor-pointer grid grid-cols-4 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100`}
                style={{ gridTemplateColumns: "700px 90px 90px auto" }}
                onClick={() => toggleChildren(source.id)}
              >
                <div className="w-4/5 truncate">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`mr-2 text-gray-400 duration-300 ${
                      source.isOpen ? "rotate-90" : ""
                    }`}
                    size="sm"
                  />
                  <a
                    href={source.source}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer border-b border-transparent hover:border-b-white"
                  >
                    {source.source}
                  </a>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!source.isDeleting) {
                      handleDeleteClick(source.id);
                    }
                  }}
                  className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                    !source.isDeleting &&
                    "border border-[#637695] hover:border-red-500 px-2"
                  }`}
                >
                  {!source.isDeleting ? (
                    <FontAwesomeIcon icon={faTrash} className="" size="sm" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <div
                        onClick={() => confirmDelete(source.source, source.id)}
                        className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="cursor-pointer"
                        />
                      </div>
                      <div
                        onClick={() => handleDeleteClick(source.id)}
                        className="flex justify-center items-center bg-[#393E46] text-white cursor-pointer w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="text-gray-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {source.isOpen &&
                source.children.map((child: any) => (
                  <div
                    key={child.id}
                    className="pl-8 grid grid-cols-4 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100"
                    style={{ gridTemplateColumns: "672px 90px 90px auto" }}
                  >
                    <div className="w-4/5 truncate">
                      <FontAwesomeIcon
                        icon={faListTree}
                        className="mr-2 text-gray-400"
                        size="sm"
                      />
                      <a
                        href={child.source}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer border-b border-transparent hover:border-b-white"
                      >
                        {child.source}
                      </a>
                    </div>
                    <div className="text-sm flex justify-center items-center">
                      {child.insertedAt}
                    </div>
                    {child.isActive ? (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!child.isDeleting) {
                          handleDeleteClick(child.id, source.id);
                        }
                      }}
                      className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                        !child.isDeleting &&
                        "border border-[#637695] hover:border-red-500 px-2"
                      }`}
                    >
                      {!child.isDeleting ? (
                        <FontAwesomeIcon
                          icon={faTrash}
                          className=""
                          size="sm"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          <div
                            onClick={() =>
                              confirmDelete(child.source, child.id)
                            }
                            className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="cursor-pointer"
                            />
                          </div>
                          <div
                            onClick={() =>
                              handleDeleteClick(child.id, source.id)
                            }
                            className="flex justify-center items-center bg-[#393E46] text-white cursor-pointer w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-gray-400 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </>
          ))}
          <button
            onClick={openModal}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new website
          </button>
        </div>
      ) : (
        <div className="flex-auto flex justify-center items-center text-gray-400">
          <button
            onClick={openModal}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new website
          </button>
        </div>
      )}
    </div>
  );
};

export default WebsiteSources;
