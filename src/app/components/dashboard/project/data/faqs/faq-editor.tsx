import React from "react";
import { Editor } from "novel";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseClient";

interface FaqEditorProps {
  faq: any;
  faqGroup: any;
}

const FaqEditor: React.FC<FaqEditorProps> = ({ faq, faqGroup }) => {
  const projectId = useSelector(selectProjectId);

  const updateFaqAnswer = async (newAnswer: string) => {
    console.log("faq: ", faq);
    try {
      // Reference to the specific FAQ group document
      const faqGroupDocRef = doc(
        db,
        "projects",
        projectId,
        "dataSources",
        faqGroup.id
      );

      // Get the current state of the FAQs
      const faqGroupDoc = await getDoc(faqGroupDocRef);
      if (!faqGroupDoc.exists()) {
        throw new Error("FAQ group document does not exist");
      }
      const faqGroupData = faqGroupDoc.data();

      // Update the answer of the specific FAQ
      const updatedFaqs = faqGroupData.faqs.map((currentFaq: any) =>
        currentFaq.id === faq.id
          ? { ...currentFaq, answer: newAnswer }
          : currentFaq
      );

      // Write the updated FAQs back to Firestore
      await updateDoc(faqGroupDocRef, {
        faqs: updatedFaqs,
      });

      console.log("FAQ updated with new answer");
    } catch (e) {
      console.error("Error updating FAQ:", e);
    }
  };

  const handleEditorUpdate = (editor: any) => {
    console.log("editor: ", editor);
    const newAnswer = editor.getHTML(); // Get the updated content from the editor
    console.log("newAnswer: ", newAnswer);
    updateFaqAnswer(newAnswer);
  };

  return (
    <div className="mx-4">
      <Editor
        className="bg-[#222831] text-white"
        defaultValue={faq.answer}
        disableLocalStorage={true}
        onDebouncedUpdate={handleEditorUpdate}
        debounceDuration={750} // Adjust debounce duration as needed
      />
    </div>
  );
};

export default FaqEditor;
