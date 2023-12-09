import React, { useState, useEffect, useRef } from "react";

interface VideoImportProps {
  onImport: (url: string) => void;
}

const VideoImport: React.FC<VideoImportProps> = ({ onImport }) => {
  const [url, setUrl] = useState<string>("");
  const [hasBlurred, setHasBlurred] = useState(false);

  const urlPattern =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+(&[\w-]+)*$/;

  const isValidUrl = (url: string) => urlPattern.test(url.trim());

  const handleImport = () => {
    if (isValidUrl(url)) {
      onImport(url);
    } else {
      console.log("Invalid YouTube URL");
    }
  };

  useEffect(() => {
    console.log("hasBlurred: ", hasBlurred);
  }, [hasBlurred]);

  return (
    <>
      <div className="w-2/3 h-full flex flex-col">
        <span className="text-white text-sm font-semibold mb-1">
          Enter YouTube URL
        </span>
        <input
          type="text"
          placeholder="youtube.com/watch?v=..."
          className="w-full p-2 rounded border bg-[#222831] border-[#393E46] focus:border-[#00ADB5] outline-none text-white mb-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setHasBlurred(true)}
        />
      </div>

      {!isValidUrl(url) && hasBlurred && (
        <span className="text-red-500 text-xs mt-10">
          The URL syntax is incorrect. Please provide a valid URL.
        </span>
      )}

      <button
        onClick={handleImport}
        disabled={!isValidUrl(url)}
        className={`cursor-pointer py-2 px-4 bg-[#222831] text-white rounded border border-[#393E46] hover:border-[#00ADB5]`}
      >
        Import Data
      </button>
    </>
  );
};

export default VideoImport;
