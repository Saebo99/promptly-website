import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faCircleCheck,
  faCircleXmark,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons";
import { deleteData } from "@/app/utils/deleteData";

type Source = {
  id: string;
  source: string; // Assume this is the YouTube video URL
  title: string;
  author: string;
  type: string;
  insertedAt: string;
  isActive: boolean;
};

interface VideoSourcesProps {
  sources: Source[];
}

const VideoSources: React.FC<VideoSourcesProps> = ({ sources }) => {
  const projectId = useSelector(selectProjectId);
  const [videoSources, setVideoSources] = useState<any[]>([]);

  useEffect(() => {
    const filteredSources = sources
      .filter((source) => source.type === "video")
      .map((source) => ({
        ...source,
        videoId: extractVideoId(source.source), // Function to extract video ID from the URL
      }));

    setVideoSources(filteredSources);
  }, [sources]);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return null;
    }
  };

  const handleDeleteClick = (id: string) => {
    setVideoSources((currentSources) =>
      currentSources.map((source) =>
        source.id === id
          ? { ...source, isDeleting: !source.isDeleting }
          : source
      )
    );
  };

  const confirmDelete = async (source: string, id: string) => {
    await deleteData({ projectId, source });
    setVideoSources((currentSources) =>
      currentSources.filter((source) => source.id !== id)
    );
  };

  return (
    <div className="mt-10 bg-[#222831] flex flex-col w-full max-h-[70vh] rounded text-white">
      {videoSources.length > 0 ? (
        <div
          className="flex-auto overflow-y-scroll p-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "10px",
          }}
        >
          {videoSources.map((source) => (
            <div
              key={source.id}
              className="rounded shadow w-80 h-fit border border-[#4B5C78]"
            >
              {source.source && (
                <div className="w-full flex justify-center items-center">
                  <iframe
                    width="100%"
                    height="100%"
                    className="rounded-t"
                    src={`https://www.youtube.com/embed/${source.source}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={source.title}
                  ></iframe>
                </div>
              )}
              <div className="p-2">
                <div className="text-sm truncate">{source.title}</div>
                <div className="text-xs text-gray-400 truncate">{`https://www.youtube.com/watch?v=${source.source}`}</div>
                <div className="text-xs text-gray-500">{source.insertedAt}</div>
              </div>
              <div className="flex justify-end items-between m-2">
                {source.isActive ? (
                  <div className="cursor-pointer text-xs flex justify-center items-center mr-2 rounded bg-green-500 hover:bg-green-600 duration-300 px-1">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="mr-1"
                      size="xs"
                    />{" "}
                    Is active
                  </div>
                ) : (
                  <div className="cursor-pointer text-xs flex justify-center items-center mr-2 rounded bg-red-500 hover:bg-red-600 duration-300 px-1">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="mr-1"
                      size="xs"
                    />{" "}
                    Not active
                  </div>
                )}
                <div
                  onClick={() => {
                    if (!source.isDeleting) {
                      handleDeleteClick(source.id);
                    }
                  }}
                  className={`text-gray-400 hover:text-red-500 cursor-pointer w-fit h-6 rounded flex justify-center items-center ${
                    !source.isDeleting &&
                    "border border-[#637695] hover:border-red-500 px-2"
                  }`}
                >
                  {!source.isDeleting ? (
                    <FontAwesomeIcon icon={faTrash} className="" size="xs" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <div
                        onClick={() => confirmDelete(source.source, source.id)}
                        className="flex justify-center items-center bg-red-500 text-white cursor-pointer mr-2 w-7 h-7 border border-red-500 rounded hover:bg-red-600 hover:border-red-600 duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="cursor-pointer"
                        />
                      </div>
                      <div
                        onClick={() => handleDeleteClick(source.id)}
                        className="text-gray-400 flex justify-center items-center bg-[#393E46] cursor-pointer w-7 h-7 border border-[#393E46] rounded hover:bg-[#30353D] hover:border-[#30353D] duration-300"
                      >
                        <FontAwesomeIcon icon={faTimes} className="" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="cursor-pointer flex justify-center items-center rounded shadow w-80 h-[260px] text-gray-400 hover:text-white border border-[#4B5C78] hover:bg-[#4B5C78] duration-100">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new video
          </div>
        </div>
      ) : (
        <div className="flex-auto flex justify-center items-center text-gray-400">
          <div className="cursor-pointer flex justify-center items-center rounded shadow w-80 h-[260px] text-gray-400 hover:text-white border border-[#4B5C78] hover:bg-[#4B5C78] duration-100">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new video
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSources;
