import React, { useState } from "react";

import { motion } from "framer-motion";

interface CreateFaqModalProps {
  closeModal: () => void;
  handleCreateFaq: (question: string, answer: string) => void;
}

const CreateFaqModal: React.FC<CreateFaqModalProps> = ({
  closeModal,
  handleCreateFaq,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

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
        <h1 className="text-2xl font-bold mb-4">Create FAQ</h1>
        <div className="text-start w-2/3">
          <span className="mb-1">Question</span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4 p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#4B5C78] focus:outline-none"
            placeholder="Enter question..."
          />
        </div>
        <div className="text-start w-2/3">
          <span className="mb-1">Answer</span>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mb-4 p-2 h-32 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#4B5C78] focus:outline-none resize-none"
            placeholder="Enter answer..."
          />
        </div>
        <button
          onClick={() => handleCreateFaq(question, answer)}
          disabled={!question.trim() || !answer.trim()}
          className={`${
            question.trim() && answer.trim()
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

export default CreateFaqModal;
