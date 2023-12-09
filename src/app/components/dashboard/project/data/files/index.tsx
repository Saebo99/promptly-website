import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import {
  selectProjectId,
  selectSources,
} from "../../../../../../../redux/slices/projectSlice";

import { useDataSourceListener } from "../../../../../hooks/useDataSourceListener";
import { ingestFile } from "@/app/utils/ingestFile";

import Sidebar from "../../sidebar";
import DashboardNavbar from "../../dashboard-navbar";
import FileSources from "./file-sources";
import TopBar from "./top-bar";
import DataImport from "../../../project-creator/data-import/data-import";
import LoadingAnimation from "../../../loading-animation/loading-animation";
import FileModal from "@/app/components/modals/data-modals/file-modal";

const FilePage = () => {
  const projectId = useSelector(selectProjectId);
  const sources = useSelector(selectSources);
  const [fileSources, setFileSources] = useState<any>([]);
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
      setFileSources(
        sources.filter((source: any) => source.type === "website")
      );
    }
  }, [sources]);

  const handleImport = async (files: File[]) => {
    for (const file of files) {
      try {
        const result = await ingestFile(file, projectId);
        console.log(`File ${file.name} uploaded successfully:`, result);
      } catch (err) {
        console.error(`Error uploading file ${file.name}:`, err);
        throw err; // If you want the loop to stop processing further files when an error is encountered
      }
    }
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
              <FileSources
                sources={fileSources}
                openModal={() => setModalOpen(true)}
              />
            )}
          </div>
        </div>
      )}
      {modalOpen && (
        <FileModal
          closeModal={() => setModalOpen(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default FilePage;
