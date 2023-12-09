import React, { useEffect, useState } from "react";

import { db } from "@/app/firebase/firebaseClient";
import { collection, getDocs, doc } from "firebase/firestore";

import { useSelector } from "react-redux";
import {
  selectProjectId,
  selectSources,
} from "../../../../../../redux/slices/projectSlice";

import { useDataSourceListener } from "../../../../hooks/useDataSourceListener";
import { ingestData } from "@/app/utils/ingestData";

import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import WebsiteSources from "./website-sources";
import TopBar from "./top-bar";
import DataImport from "../../project-creator/data-import/data-import";
import LoadingAnimation from "../../loading-animation/loading-animation";
import WebsiteModal from "@/app/components/modals/data-modals/website-modal";

const DataSources = () => {
  const projectId = useSelector(selectProjectId);
  const sources = useSelector(selectSources);
  const [websiteSources, setWebsiteSources] = useState<any>([]);
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
      setWebsiteSources(
        sources.filter((source: any) => source.type === "website")
      );
    }
  }, [sources]);

  const handleImport = async (data: any) => {
    console.log(data); // For now, just log the data. You can implement your logic here.
    await ingestData(
      data.urls.split(",").map((url: string) => url.trim()),
      data.crawlType,
      projectId
    );
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
              <WebsiteSources
                sources={websiteSources}
                openModal={() => {
                  console.log("hello");
                  setModalOpen(true);
                }}
              />
            )}
          </div>
        </div>
      )}
      {modalOpen && (
        <WebsiteModal
          closeModal={() => setModalOpen(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default DataSources;
