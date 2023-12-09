import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- Adjusted import path

import { useSelector } from "react-redux";
import {
  selectProjectIdentifier,
  selectProjectId,
} from "../../../../../../../redux/slices/projectSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faTrash,
  faArrowRight,
  faSignalBars,
  faTimes,
  faCheck,
} from "@fortawesome/pro-regular-svg-icons";

import { motion, AnimatePresence } from "framer-motion";

import { deleteData } from "@/app/utils/deleteData";

type ImprovedAnswerSource = {
  id: string;
  source: string;
  insertedAt: string;
  updatedAt: string;
  question: string;
  answer: string;
  isActive: boolean;
  type: string;
};

interface ImprovedAnswerSourcesProps {
  sources: ImprovedAnswerSource[];
}

const ImprovedAnswerSources: React.FC<ImprovedAnswerSourcesProps> = ({
  sources,
}) => {
  const router = useRouter();
  const projectId = useSelector(selectProjectId);
  const projectIdentifier = useSelector(selectProjectIdentifier);
  const [improvedAnswerSources, setImprovedAnswerSources] = useState<any[]>(
    sources || []
  );
  const [expandedSources, setExpandedSources] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const filteredSources = sources
      .filter((source) => source.type === "improved answer")
      .map((source) => ({
        ...source,
        isDeleting: false,
      }));
    console.log("filteredSources: ", filteredSources);

    setImprovedAnswerSources(filteredSources);
  }, [sources]);

  const toggleSource = (sourceId: string) => {
    setExpandedSources((prevExpandedSources) => {
      const newExpandedSources = new Set(prevExpandedSources);
      if (newExpandedSources.has(sourceId)) {
        newExpandedSources.delete(sourceId);
      } else {
        newExpandedSources.add(sourceId);
      }
      return newExpandedSources;
    });
  };

  const handleDeleteClick = (id: string) => {
    setImprovedAnswerSources((currentSources) =>
      currentSources.map((source) =>
        source.id === id
          ? { ...source, isDeleting: !source.isDeleting }
          : source
      )
    );
  };

  const confirmDelete = async (source: string, id: string) => {
    await deleteData({ projectId, source });
    setImprovedAnswerSources((currentSources) =>
      currentSources.filter((source) => source.id !== id)
    );
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-fit h-fit max-h-[70vh] rounded">
      {improvedAnswerSources?.map((source) => (
        <div key={source.id}>
          <div
            className="cursor-pointer grid grid-cols-4 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100"
            style={{ gridTemplateColumns: "700px 90px 90px auto" }}
            onClick={() => toggleSource(source.id)}
          >
            <div>
              <FontAwesomeIcon icon={faSignalBars} className="mr-2" size="sm" />
              <span className="truncate" style={{ width: "700px" }}>
                {source.question}
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
                <FontAwesomeIcon icon={faTrash} className="" size="xs" />
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
                    className="text-gray-400 flex justify-center items-center bg-[#393E46] cursor-pointer w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300"
                  >
                    <FontAwesomeIcon icon={faTimes} className="" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {expandedSources.has(source.id) && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-8 py-4 my-2 text-white bg-[#222831] rounded overflow-hidden"
                style={{ boxShadow: "inset 0 0 10px #171717" }}
              >
                <div className="flex flex-col ml-2">
                  <span className="text-gray-400 text-sm">Question</span>
                  <p className="bg-[#222831] py-1 outline-none">
                    {source.question}
                  </p>
                </div>
                <br />
                <div className="flex flex-col ml-2">
                  <span className="text-gray-400 text-sm">Answer</span>
                  <p className="bg-[#222831] py-1 outline-none">
                    {source.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <button
        onClick={() => router.push(`/app/${projectIdentifier}/insight`)}
        className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
      >
        <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
        {`Head to "Conversations" to improve an answer from the AI chatbot`}
      </button>
    </div>
  );
};

export default ImprovedAnswerSources;
