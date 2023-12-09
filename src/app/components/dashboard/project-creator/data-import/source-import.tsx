import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons";

import { ingestData } from "@/app/utils/ingestData";

import { ingestVideo } from "@/app/utils/ingestVideo";

import { getAPIKeys } from "@/app/utils/getAPIKeys";

import { ingestFile } from "@/app/utils/ingestFile";

import URLImport from "./source-input-fields/url-import";
import FileImport from "./source-input-fields/file-import";
import VideoImport from "./source-input-fields/video-import";
import LoadingAnimation from "../../loading-animation/loading-animation";

interface SourceImportProps {
  source: string;
  setSource: (source: string) => void;
}

const SourceImport: React.FC<SourceImportProps> = ({ source, setSource }) => {
  const projectId = useSelector(selectProjectId);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const fetchAPIKeys = async () => {
      const keys = await getAPIKeys(projectId);
      setApiKey(keys[0].decryptedKey);
    };

    if (projectId) {
      fetchAPIKeys();
    }
  }, [projectId]);

  const handleURLImport = async (data: any) => {
    setLoading(true);
    console.log(data); // For now, just log the data. You can implement your logic here.
    await ingestData(
      data.urls.split(",").map((url: string) => url.trim()),
      data.crawlType,
      apiKey
    );
    setLoading(false);
  };

  const handleVideoImport = async (url: string) => {
    setLoading(true);
    await ingestVideo(url, apiKey);
    setLoading(false);
  };

  const handleFileImport = async (files: File[]) => {
    setLoading(true);

    for (const file of files) {
      try {
        const result = await ingestFile(file, apiKey);
        console.log(`File ${file.name} uploaded successfully:`, result);
      } catch (err) {
        console.error(`Error uploading file ${file.name}:`, err);
        throw err; // If you want the loop to stop processing further files when an error is encountered
      }
    }
    setLoading(false);
  };

  return (
    <div className={`flex justify-center items-start w-full h-full`}>
      {loading ? (
        <div className="relative h-1/2">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="rounded-lg shadow-lg p-2 bg-[#222831] border border-[#393E46] w-1/3 flex flex-col items-center">
          <div className="w-full">
            <div
              onClick={() => setSource("")}
              className="w-fit cursor-pointer text-sm rounded px-3 py-1 mb-6 bg-[#222831] border border-[#393E46] hover:border-[#00ADB5] text-white"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back</span>
            </div>
          </div>
          {source === "URL" ? (
            <URLImport onImport={handleURLImport} />
          ) : source === "File" ? (
            <FileImport onImport={handleFileImport} />
          ) : (
            <VideoImport onImport={handleVideoImport} />
          )}
        </div>
      )}
    </div>
  );
};

export default SourceImport;
