import React, { useState, useEffect } from "react";

type WebsiteModalProps = {
  closeModal: () => void;
  onImport: (data: {
    urls: string;
    crawlType: string;
    excludes?: string;
    includes?: string;
  }) => void;
};

const WebsiteModal: React.FC<WebsiteModalProps> = ({
  closeModal,
  onImport,
}) => {
  const [importMode, setImportMode] = useState<"single" | "crawl">("single");
  const [hasBlurred, setHasBlurred] = useState(false);
  const [urls, setUrls] = useState<string>("");
  const [excludes, setExcludes] = useState<string>("");
  const [includes, setIncludes] = useState<string>("");
  // URL validation regex pattern
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

  const isValidUrl = urls
    .split(",")
    .every((url) => urlPattern.test(url.trim()));

  const handleImport = () => {
    onImport({ urls, crawlType: importMode, excludes, includes });
  };

  useEffect(() => {
    console.log("hasBlurred: ", hasBlurred);
  }, [hasBlurred]);

  const getDescription = () => {
    if (importMode === "single") {
      return "Enter list of URLs to import (separated by commas)";
    }
    return "This will extract data from all pages starting with this link";
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
        <div className="w-full mt-4 flex flex-col items-center justify-between">
          <div className="flex justify-center items-center w-full">
            <button
              className={`text-sm rounded w-2/5 py-1 mr-2 bg-[#222831] hover:bg-[#4B5C78] text-gray-400 duration-100 ${
                importMode === "single" && "bg-[#4B5C78] text-white"
              }`}
              onClick={() => setImportMode("single")}
            >
              Specific Source URLs
            </button>
            <button
              className={`text-sm rounded w-2/5 py-1 mr-2 bg-[#222831] hover:bg-[#4B5C78] text-gray-400 duration-100 ${
                importMode === "crawl" && "bg-[#4B5C78] text-white"
              }`}
              onClick={() => setImportMode("crawl")}
            >
              Web Crawler
            </button>
          </div>
          <div className="w-3/4 mt-8 flex flex-col">
            <span className="text-white text-sm font-semibold mb-1">
              {getDescription()}
            </span>
            <span className="text-white text-xs mb-2">
              Free version supports up to 400 pages; paid plan allows 4000.
            </span>
            <input
              type="text"
              placeholder="https://example.com/page"
              className="p-2 rounded border bg-[#222831] border-[#393E46] focus:border-[#4B5C78] outline-none text-white mb-1"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              onBlur={() => setHasBlurred(true)}
            />
          </div>
          {importMode === "crawl" && (
            <div className="w-3/4 mt-8 flex flex-col">
              <span className="text-white text-sm font-semibold mb-1">
                Exclude URLs
              </span>
              <span className="text-white text-xs">
                {`Specify URLs that you'd like to exclude from crawling.`}
              </span>
              <input
                type="text"
                placeholder="/exclude1/*, /exclude2/*"
                className="p-2 rounded border bg-[#222831] border-[#393E46] focus:border-[#4B5C78] outline-none text-white mb-1"
                value={excludes}
                onChange={(e) => setExcludes(e.target.value)}
              />

              <span className="text-white text-sm font-semibold mt-8 mb-1">
                Include only URLs
              </span>
              <span className="text-white text-xs">
                {`Specify particular URLs that you'd like to crawl.`}
              </span>
              <input
                type="text"
                placeholder="/include1/*, /include2/*"
                className="p-2 rounded border bg-[#222831] border-[#393E46] focus:border-[#4B5C78] outline-none text-white mb-1"
                value={includes}
                onChange={(e) => setIncludes(e.target.value)}
              />
            </div>
          )}
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

export default WebsiteModal;
