import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faFolder,
  faPlus,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/pro-regular-svg-icons";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";
import { deleteData } from "@/app/utils/deleteData";

import { createFaqGroup } from "@/app/utils/createFaqGroup";

import FaqGroupModal from "./faq-group-modal";

type Faq = {
  id: string;
  question: string;
  answer: string;
  insertedAt: string;
  isDeleting: boolean;
};

type Source = {
  id: string;
  name: string;
  description: string;
  type: string;
  insertedAt: string;
  isActive: boolean;
  faqs: Faq[];
};

interface FaqGroupsProps {
  sources: Source[];
  setActiveFaqGroup: React.Dispatch<React.SetStateAction<Source | null>>;
}

const FaqGroups: React.FC<FaqGroupsProps> = ({
  sources,
  setActiveFaqGroup,
}) => {
  const projectId = useSelector(selectProjectId);
  const [faqGroups, setFaqGroups] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const filteredSources = sources
      .filter((source) => source.type === "faq")
      .map((source) => ({
        ...source,
        isDeleting: false,
      }));

    setFaqGroups(filteredSources);
  }, [sources]);

  const handleCreateGroup = async (
    groupName: string,
    groupDescription: string
  ) => {
    const newGroupId = await createFaqGroup(
      projectId,
      groupName,
      groupDescription
    );
    setFaqGroups((currentGroups) => [
      ...currentGroups,
      {
        id: newGroupId,
        type: "faq",
        name: groupName,
        description: groupDescription,
        insertedAt: new Date().toLocaleDateString(),
        isActive: true,
        faqs: [],
      },
    ]);
    setShowModal(false);
  };

  const handleDeleteClick = (id: string) => {
    setFaqGroups((currentSources) =>
      currentSources.map((source) =>
        source.id === id
          ? { ...source, isDeleting: !source.isDeleting }
          : source
      )
    );
  };

  const confirmDelete = async (source: string, id: string) => {
    await deleteData({ projectId, source });
    setFaqGroups((currentSources) =>
      currentSources.filter((source) => source.id !== id)
    );
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-fit h-fit max-h-[70vh] rounded text-white">
      {faqGroups.length > 0 ? (
        <div className="flex-auto overflow-y-scroll">
          {faqGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setActiveFaqGroup(group)}
              className="cursor-pointer grid grid-cols-3 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100"
              style={{ gridTemplateColumns: "700px 90px 90px auto" }}
            >
              <div>
                <FontAwesomeIcon icon={faFolder} className="mr-2" size="sm" />
                <span className="truncate" style={{ width: "700px" }}>
                  {group.name}
                </span>
              </div>
              <div className="text-sm flex justify-center items-center">
                {group.insertedAt}
              </div>
              {group.isActive ? (
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
                  if (!group.isDeleting) {
                    handleDeleteClick(group.id);
                  }
                }}
                className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                  !group.isDeleting &&
                  "border border-[#637695] hover:border-red-500 px-2"
                }`}
              >
                {!group.isDeleting ? (
                  <FontAwesomeIcon icon={faTrash} className="" size="sm" />
                ) : (
                  <div className="flex items-center justify-center">
                    <div
                      onClick={() => confirmDelete(group.source, group.id)}
                      className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="cursor-pointer"
                      />
                    </div>
                    <div
                      onClick={() => handleDeleteClick(group.id)}
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
          <button
            onClick={() => setShowModal(true)}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create new FAQ group
          </button>
        </div>
      ) : (
        <div className="flex-auto flex justify-center items-center text-gray-400">
          <button
            onClick={() => setShowModal(true)}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create new FAQ group
          </button>
        </div>
      )}
      {showModal && (
        <FaqGroupModal
          closeModal={() => setShowModal(false)}
          handleCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default FaqGroups;
