import React, { useState } from "react";

import { motion } from "framer-motion";

interface FaqGroupModalProps {
  closeModal: () => void;
  handleCreateGroup: (name: string, description: string) => void;
}

const FaqGroupModal: React.FC<FaqGroupModalProps> = ({
  closeModal,
  handleCreateGroup,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100000000 }}
    >
      <div
        onClick={closeModal}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <motion.div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ height: "40%", width: "50%", minHeight: "400px" }}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-bold mb-4">Create FAQ Group</h1>
        <div className="text-start w-2/3">
          <span className="mb-1">Name of the group</span>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-4 p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#4B5C78] focus:outline-none"
            placeholder="Enter group name..."
          />
        </div>
        <div className="text-start w-2/3">
          <span className="mb-1">Description of the group</span>
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="mb-4 p-2 h-32 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#4B5C78] focus:outline-none resize-none"
            placeholder="Enter group description..."
          />
        </div>
        <button
          onClick={() => handleCreateGroup(groupName, groupDescription)}
          disabled={!groupName.trim()}
          className={`${
            groupName.trim()
              ? "bg-[#222831] hover:bg-[#4B5C78] duration-100"
              : "bg-[#222831] cursor-not-allowed"
          } text-gray-400 hover:text-white py-2 px-4 rounded`}
        >
          Create Group
        </button>
      </motion.div>
    </div>
  );
};

export default FaqGroupModal;
