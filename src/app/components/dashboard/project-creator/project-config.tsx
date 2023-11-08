import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";

interface ProjectConfigProps {
  projectName: string;
  setProjectName: (projectName: string) => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
  setIsProjectNameValid: (isValid: boolean) => void;
  setIsProjectIdValid: (isValid: boolean) => void;
}

const ProjectConfig: React.FC<ProjectConfigProps> = ({
  projectName,
  setProjectName,
  projectId,
  setProjectId,
  setIsProjectNameValid,
  setIsProjectIdValid,
}) => {
  const [showIdEditor, setShowIdEditor] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);
  const [nameInputTouched, setNameInputTouched] = useState(false); // <-- Add this state
  // New state variable to keep track of a temporary ID in the editor
  const [tempProjectId, setTempProjectId] = useState(projectId);
  const idEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (idEditorRef.current && !idEditorRef.current.contains(e.target)) {
        if (isValidId(tempProjectId)) {
          setProjectId(tempProjectId);
        }
        setShowIdEditor(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tempProjectId]);

  useEffect(() => {
    setTempProjectId(projectId);
  }, [projectId]);

  useEffect(() => {
    setIsProjectIdValid(isValidId(tempProjectId));
  }, [tempProjectId]);

  const isValid = (input: string) => {
    const regex = /^[a-zA-Z0-9! -]*$/; // Moved the '-' to the end
    return regex.test(input) && input.length >= 6;
  };

  const isValidId = (input: string) => {
    const regex = /^[a-zA-Z0-9!-]*$/; // Notice we removed space character from allowed characters
    return regex.test(input) && input.length >= 6;
  };

  const randomId = (name: string) => {
    const formattedName = name.trim().replace(/\s+/g, "-"); // Replacing space with '-'
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${formattedName}-${randomNum}`;
  };

  const handleProjectNameChange = (e: any) => {
    const name = e.target.value;
    setProjectName(name);
    setIsProjectNameValid(isValid(name));
    if (!manualEdit && isValid(name)) {
      setProjectId(randomId(name));
    }
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center space-y-6 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Write the name of your project
      </h1>
      <div>
        <input
          type="text"
          placeholder="Project Name"
          className={`bg-transparent border-b ${
            isValid(projectName) && !nameInputTouched
              ? "border-black"
              : "border-[#00ADB5]"
          } focus:outline-none focus:border-[#00ADB5] w-96 text-2xl font-semibold`}
          value={projectName}
          onChange={handleProjectNameChange}
          onBlur={() => setNameInputTouched(true)} // <-- Add this event handler
        />
        {!isValid(projectName) &&
          nameInputTouched && ( // <-- Modify this condition
            <div className="text-red-500 text-xs w-72">
              Name must be at least 6 characters and can only contain letters,
              numbers, ! and -
            </div>
          )}

        <div className="relative w-96 flex">
          {showIdEditor && (
            <div
              ref={idEditorRef}
              className="absolute top-0 left-0 p-4 rounded shadow-md border border-[#393E46] z-10 space-y-4 bg-[#222831]"
            >
              <h2 className="font-semibold">Project ID</h2>
              <p className="text-xs mb-2">
                The ID is used to identify the project in the database and
                cannot be edited later.
              </p>
              <input
                type="text"
                value={tempProjectId}
                className={`border border-[#393E46] focus:border-[#00ADB5] outline-none rounded p-2 w-full bg-[#222831] ${
                  isValidId(tempProjectId) ? "" : "border-red-500"
                }`}
                onChange={(e) => {
                  setTempProjectId(e.target.value);
                }}
              />
              {!isValidId(tempProjectId) && (
                <div className="text-red-500 text-sm">
                  ID must be at least 6 characters and can only contain letters,
                  numbers, ! and -
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  className="text-gray-500"
                  onClick={() => {
                    setTempProjectId(projectId);
                    setShowIdEditor(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!isValidId(tempProjectId)}
                  className={`border bg-[#222831] ${
                    isValidId(tempProjectId)
                      ? "border-[#00ADB5] text-white hover:bg-[#00ADB5]"
                      : "border-[#393E46] text-gray-400"
                  } rounded px-4 py-1 duration-300`}
                  onClick={() => {
                    setProjectId(tempProjectId);
                    setIsProjectIdValid(isValidId(tempProjectId));
                    setShowIdEditor(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div
            className="flex items-center text-xs text-gray-200 space-x-2 p-2 mt-4 rounded border border-[#393E46] cursor-pointer"
            onClick={() => {
              if (isValid(projectName)) {
                setShowIdEditor(!showIdEditor);
              }
            }}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
            <span>{isValid(projectName) ? projectId : "project-id"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectConfig;
