import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import {
  selectProjectId,
  selectSources,
} from "../../../../../../../redux/slices/projectSlice";

import { useDataSourceListener } from "../../../../../hooks/useDataSourceListener";
import { ingestVideo } from "@/app/utils/ingestVideo";

import Sidebar from "../../sidebar";
import DashboardNavbar from "../../dashboard-navbar";
import VideoSources from "./video-sources";
import TopBar from "./top-bar";
import DataImport from "../../../project-creator/data-import/data-import";
import LoadingAnimation from "../../../loading-animation/loading-animation";
import VideoModal from "@/app/components/modals/data-modals/video-modal";

const VideoPage = () => {
  const projectId = useSelector(selectProjectId);
  const sources = useSelector(selectSources);
  const [videoSources, setVideoSources] = useState<any>([]);
  const [addingSource, setAddingSource] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useDataSourceListener();

  // useEffect hook to simulate loading animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("sources: ", sources);
    if (sources) {
      setVideoSources(sources.filter((source: any) => source.type === "video"));
    }
  }, [sources]);

  const handleImport = async (url: string) => {
    await ingestVideo(url, projectId);
    setModalOpen(false);
  };

  return (
    <div className="w-screen h-screen bg-[#222831] flex">
      <Sidebar />

      {loading ? (
        <div className="relative w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <DashboardNavbar />
          <TopBar
            addingSource={addingSource}
            setAddingSource={setAddingSource}
          />
          <div className="flex flex-grow space-x-4 mb-4 mx-4">
            {addingSource ? (
              <div className="w-full h-full pt-40">
                <DataImport />
              </div>
            ) : (
              <VideoSources
                sources={videoSources}
                openModal={() => setModalOpen(true)}
              />
            )}
          </div>
        </div>
      )}
      {modalOpen && (
        <VideoModal
          closeModal={() => setModalOpen(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default VideoPage;
