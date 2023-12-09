import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectSources } from "../../../../../../../redux/slices/projectSlice";

import { useDataSourceListener } from "../../../../../hooks/useDataSourceListener";

import Sidebar from "../../sidebar";
import DashboardNavbar from "../../dashboard-navbar";
import TopBar from "./top-bar";
import ImprovedAnswerSources from "./improved-answer-sources";
import DataImport from "../../../project-creator/data-import/data-import";
import LoadingAnimation from "../../../loading-animation/loading-animation";

const ImprovedAnswersPage = () => {
  const sources = useSelector(selectSources);
  const [improvedAnswerSources, setImprovedAnswerSources] = useState<any>([]);
  const [addingSource, setAddingSource] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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
      setImprovedAnswerSources(
        sources.filter((source: any) => source.type === "improved answer")
      );
    }
  }, [sources]);

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
              <ImprovedAnswerSources sources={improvedAnswerSources} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedAnswersPage;
