import React, { useState, useEffect } from "react";

type VideoModalProps = {
  closeModal: () => void;
  onImport: (url: string) => void;
};

const VideoModal: React.FC<VideoModalProps> = ({ closeModal, onImport }) => {
  const [hasBlurred, setHasBlurred] = useState(false);
  const [url, setUrl] = useState<string>("");
  // URL validation regex pattern
  const urlPattern =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+(&[\w-]+)*$/;

  const isValidUrl = urlPattern.test(url.trim());

  const handleImport = () => {
    onImport(url);
  };

  useEffect(() => {
    console.log("hasBlurred: ", hasBlurred);
  }, [hasBlurred]);

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
        <div className="w-full mt-4 flex flex-col items-center justify-between">
          <div className="w-3/4 mt-8 flex flex-col">
            <span className="text-white text-sm font-semibold mb-1">
              Video URL
            </span>
            <span className="text-white text-xs mb-2">
              Free version supports up to 400 pages; paid plan allows 4000.
            </span>
            <input
              type="text"
              placeholder="https://example.com/page"
              className="p-2 rounded border bg-[#222831] border-[#393E46] focus:border-[#4B5C78] outline-none text-white mb-1"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setHasBlurred(true)}
            />
          </div>
          {!isValidUrl && hasBlurred && (
            <span className="text-red-500 text-xs mt-10">
              The URL syntax is incorrect. Please provide a valid URL.
            </span>
          )}
          <button
            onClick={handleImport}
            disabled={!isValidUrl}
            className={`cursor-pointer py-2 px-4 bg-[#222831] text-white rounded hover:bg-[#4B5C78] duration-100 ${
              (isValidUrl || !hasBlurred) && "mt-10"
            }`}
          >
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
