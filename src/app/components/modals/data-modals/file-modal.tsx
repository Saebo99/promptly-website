import React, { useState, useEffect, useRef } from "react";

type FileModalProps = {
  closeModal: () => void;
  onImport: (file: any[]) => void;
};

const FileModal: React.FC<FileModalProps> = ({ closeModal, onImport }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("mozdirectory", "");
    }
  }, []);

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    // Convert FileList to an array of files
    const filesArray = Array.from(event.target.files);
    console.log("Files selected:", filesArray);
    setSelectedFiles(filesArray);
    // Add your logic here to process the files if needed
  };

  const handleFolderInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    // Convert FileList to an array of files from the folder
    const filesArray = Array.from(event.target.files);
    console.log("Files from folder selected:", filesArray);
    setSelectedFiles(filesArray);
    // Add your logic here to process the files from the folder if needed
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100 }}
    >
      <div
        onClick={closeModal}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ width: "50%" }}
      >
        <div className="mb-4 space-x-2 w-full flex justify-center items-center">
          {/* For Files */}
          <label
            htmlFor="fileInput"
            className="w-[150px] flex justify-center items-center cursor-pointer bg-[#222831] text-white px-4 py-2 rounded hover:bg-[#4B5C78] duration-100"
          >
            Import Files
          </label>
          <input
            type="file"
            id="fileInput"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* For Folders */}
          <label
            htmlFor="folderInput"
            className="w-[150px] flex justify-center items-center cursor-pointer bg-[#222831] text-white px-4 py-2 rounded hover:bg-[#4B5C78] duration-100"
          >
            Import Folder
          </label>
          <input
            type="file"
            id="folderInput"
            className="hidden"
            ref={folderInputRef}
            onChange={handleFolderInputChange}
          />
        </div>

        <div className="rounded-lg mb-4 text-center">
          <p className="text-gray-300 text-xs">
            Combined Size:{" "}
            {(
              selectedFiles.reduce((total, file) => total + file.size, 0) /
              1000000
            ).toFixed(2)}{" "}
            MB / 50 MB
          </p>
          <p className="text-gray-300 text-xs">
            Total Files: {selectedFiles.length}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={clearSelectedFiles}
            className="text-xs text-gray-200 hover:text-gray-400 focus:outline-none"
          >
            Clear selected files
          </button>
          <button
            onClick={() => onImport(selectedFiles)}
            className="cursor-pointer bg-[#222831] text-white px-4 py-2 rounded hover:bg-[#4B5C78] duration-100"
          >
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
