import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";

import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import TopBar from "./top-bar";
import LoadingAnimation from "../../loading-animation/loading-animation";

const ProjectSettings = () => {
  const projectId = useSelector(selectProjectId);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectCredentials, setProjectCredentials] = useState({
    name: "",
    projectIdentifier: "",
  });

  useEffect(() => {
    const fetchProjectCredentials = async () => {
      if (projectId) {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProjectCredentials(docSnap.data() as typeof projectCredentials);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchProjectCredentials().then(() => setLoading(false));
  }, [projectId]);

  const handleDelete = async () => {
    if (projectId) {
      await deleteDoc(doc(db, "projects", projectId));
      // Handle the deletion UI feedback here
    }
  };

  // Function to open the edit modal
  const openEditModal = () => {
    setShowEditModal(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Function to handle the project name update
  const handleUpdateProjectName = async (newName: string) => {
    if (projectId) {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, { name: newName });
      setProjectCredentials({ ...projectCredentials, name: newName });
      closeEditModal();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#222831] flex text-white">
      <Sidebar />
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="flex flex-col items-center w-full">
          <DashboardNavbar />
          <TopBar />
          <div className="box-border p-4 border border-[#393E46] rounded-md m-4 w-[60vw] shadow-lg">
            <div className="flex justify-between items-center my-6 ">
              <div>
                <h3 className="text-lg font-semibold">Project Name</h3>
                <p className="text-sm text-gray-400">
                  The name of the project.
                </p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="text-gray-400 hover:text-white duration-300 cursor-pointer"
                  onClick={openEditModal}
                />
                <span className="border border-[#393E46] rounded px-2 py-1 ml-4">
                  {projectCredentials.name}
                </span>
              </div>
            </div>
            <hr className="border-[#393E46]" />
            <div className="flex justify-between items-center my-6">
              <div>
                <h3 className="text-lg font-semibold">Project Identifier</h3>
                <p className="text-sm text-gray-400">
                  Unique identifier for the project chosen at creation.
                </p>
              </div>
              <span className="border border-[#393E46] rounded px-2 py-1">
                {projectCredentials.projectIdentifier}
              </span>
            </div>
            <hr className="border-[#393E46]" />
            <div className="flex justify-between items-center my-6">
              <div>
                <h3 className="text-lg font-semibold">Delete project</h3>
                <p className="text-sm text-gray-400">
                  This action cannot be undone!
                </p>
              </div>
              <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded duration-300"
                onClick={handleDelete}
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <EditProjectNameModal
          onClose={closeEditModal}
          onSubmit={handleUpdateProjectName}
          currentName={projectCredentials.name}
        />
      )}
    </div>
  );
};

// Modal component for editing project name
const EditProjectNameModal = ({ onClose, onSubmit, currentName }: any) => {
  const [inputText, setInputText] = useState(currentName);

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100 }}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ width: "50%" }}
      >
        <h1 className="text-2xl font-bold mb-4">Edit Project Name</h1>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mb-4 p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
        />
        <button
          onClick={() => onSubmit(inputText)}
          disabled={!inputText.trim()}
          className={`text-white py-2 px-4 rounded ${
            inputText.trim()
              ? "bg-[#00ADB5] hover:bg-[#00ADB5] duration-300"
              : "cursor-not-allowed"
          }`}
        >
          Update Name
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
