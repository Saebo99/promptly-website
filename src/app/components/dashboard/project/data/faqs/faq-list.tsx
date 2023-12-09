import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faPlus,
  faChevronRight,
} from "@fortawesome/pro-regular-svg-icons";

import { ingestFaq } from "@/app/utils/ingestFaq";
import { deleteFaq } from "@/app/utils/deleteFaq";

import CreateFaqModal from "./create-faq-modal";

type Faq = {
  id: string;
  question: string;
  answer: string;
  insertedAt: any;
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

interface FaqListProps {
  activeFaqGroup: Source | null;
}

const FaqList: React.FC<FaqListProps> = ({ activeFaqGroup }) => {
  const projectId = useSelector(selectProjectId);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
  const [editableFaqs, setEditableFaqs] = useState<{
    [id: string]: { question: string; answer: string };
  }>({});

  useEffect(() => {
    if (activeFaqGroup) {
      // Map the FAQs to the editable state
      const newEditableFaqs = activeFaqGroup.faqs.reduce((acc: any, faq) => {
        acc[faq.id] = { question: faq.question, answer: faq.answer };
        return acc;
      }, {});
      setEditableFaqs(newEditableFaqs);
      setFaqs(
        activeFaqGroup.faqs.map((faq) => ({ ...faq, isDeleting: false }))
      );
    }
  }, [activeFaqGroup]);

  useEffect(() => {
    // Adjust the height of all textareas when the component mounts
    expandedFaqs.forEach((faqId) => {
      const textarea = document.getElementById(`textarea-${faqId}`);
      adjustTextareaHeight(textarea);
    });
  }, [expandedFaqs]);

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs((prevExpandedFaqs) => {
      const newExpandedFaqs = new Set(prevExpandedFaqs);
      if (newExpandedFaqs.has(faqId)) {
        newExpandedFaqs.delete(faqId);
      } else {
        newExpandedFaqs.add(faqId);
      }
      return newExpandedFaqs;
    });
  };

  const handleCreateFaq = async (question: string, answer: string) => {
    const newFaqId = await ingestFaq(
      projectId,
      activeFaqGroup?.name || "",
      question,
      answer
    );
    console.log("newFaqId: ", newFaqId);
    setFaqs([
      ...faqs,
      {
        id: newFaqId || "",
        question,
        answer,
        insertedAt: new Date().toISOString(),
        isDeleting: false,
      },
    ]);
    setShowModal(false);
  };

  const handleDeleteClick = (id: string) => {
    setFaqs((currentFaqs) =>
      currentFaqs.map((faq) =>
        faq.id === id ? { ...faq, isDeleting: !faq.isDeleting } : faq
      )
    );
  };

  const confirmDelete = async (id: string) => {
    await deleteFaq(projectId, activeFaqGroup?.id || "", id);
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const updateEditableFaq = (
    faqId: string,
    field: "question" | "answer",
    value: string
  ) => {
    setEditableFaqs((prev) => ({
      ...prev,
      [faqId]: { ...prev[faqId], [field]: value },
    }));
  };

  const updateFaq = async (faqId: string) => {
    const editableFaq = editableFaqs[faqId];
    if (!editableFaq) {
      console.error("FAQ data not found for editing:", faqId);
      return;
    }

    const { question, answer } = editableFaq;
    try {
      ingestFaq(projectId, activeFaqGroup?.name || "", question, answer, faqId);

      // Update the faqs state as well
      setFaqs((prev) =>
        prev.map((prevFaq) =>
          prevFaq.id === faqId ? { ...prevFaq, question, answer } : prevFaq
        )
      );
      console.log("FAQ updated");
    } catch (e) {
      console.error("Error updating FAQ:", e);
    }
  };

  const adjustTextareaHeight = (textarea: any) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-fit h-fit max-h-[70vh] rounded text-white">
      {faqs.length > 0 ? (
        <div className="flex-auto overflow-y-scroll">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <div
                onClick={() => toggleFaq(faq.id)}
                className={`cursor-pointer grid grid-cols-3 p-1 my-2 text-white rounded border border-transparent hover:bg-[#4B5C78] duration-100`}
                style={{ gridTemplateColumns: "700px 90px auto" }}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`mr-2 transition-transform duration-100 ${
                      expandedFaqs.has(faq.id) ? "rotate-90" : ""
                    }`}
                    size="sm"
                  />
                  <span className="truncate" style={{ width: "700px" }}>
                    {faq.question}
                  </span>
                </div>
                <div className="text-sm flex justify-center items-center">
                  {faq.insertedAt
                    ? typeof faq.insertedAt === "string"
                      ? new Date(faq.insertedAt).toLocaleDateString()
                      : faq.insertedAt?.toDate().toLocaleDateString()
                    : ""}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!faq.isDeleting) {
                      handleDeleteClick(faq.id);
                    }
                  }}
                  className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                    !faq.isDeleting &&
                    "border border-[#637695] hover:border-red-500 px-2"
                  }`}
                >
                  {!faq.isDeleting ? (
                    <FontAwesomeIcon icon={faTrash} className="" size="sm" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <div
                        onClick={() => confirmDelete(faq.id)}
                        className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="cursor-pointer"
                        />
                      </div>
                      <div
                        onClick={() => handleDeleteClick(faq.id)}
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

              <AnimatePresence>
                {expandedFaqs.has(faq.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }} // Dynamic height based on content
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 py-4 my-2 text-white bg-[#222831] rounded overflow-hidden"
                    style={{ boxShadow: "inset 0 0 10px #171717" }}
                  >
                    <div className="flex flex-col ml-2">
                      <span className="text-gray-400 text-sm">Question</span>
                      <input
                        value={editableFaqs[faq.id]?.question || ""}
                        onChange={(e) =>
                          updateEditableFaq(faq.id, "question", e.target.value)
                        }
                        className="bg-[#222831] py-1 outline-none"
                      />
                    </div>
                    <br />
                    <div className="flex flex-col ml-2">
                      <span className="text-gray-400 text-sm">Answer</span>
                      <textarea
                        id={`textarea-${faq.id}`} // Unique ID for each textarea
                        ref={(el) => adjustTextareaHeight(el)} // Ref callback to adjust height
                        value={editableFaqs[faq.id]?.answer || ""}
                        onChange={(e) => {
                          updateEditableFaq(faq.id, "answer", e.target.value);
                          adjustTextareaHeight(e.target);
                        }}
                        className="bg-[#222831] py-1 outline-none w-full resize-none"
                        rows={3}
                        style={{ overflowY: "hidden" }}
                      />
                    </div>
                    <button
                      onClick={() => updateFaq(faq.id)}
                      disabled={
                        editableFaqs[faq.id]?.question === faq.question &&
                        editableFaqs[faq.id]?.answer === faq.answer
                      }
                      className={`mt-4 rounded px-2 py-1 ${
                        editableFaqs[faq.id]?.question === faq.question &&
                        editableFaqs[faq.id]?.answer === faq.answer
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100 hover:bg-[#4B5C78]"
                      }`}
                    >
                      Update FAQ
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create new FAQ
          </button>
        </div>
      ) : (
        <div className="flex-auto flex justify-center items-center text-gray-400">
          <button
            onClick={() => setShowModal(true)}
            className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create new FAQ
          </button>
        </div>
      )}
      {showModal && (
        <CreateFaqModal
          closeModal={() => setShowModal(false)}
          handleCreateFaq={handleCreateFaq}
        />
      )}
    </div>
  );
};

export default FaqList;
