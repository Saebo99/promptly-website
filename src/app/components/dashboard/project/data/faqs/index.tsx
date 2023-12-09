import React, { useEffect, useState } from "react";

import { db } from "../../../../../firebase/firebaseClient";
import { collection, getDocs, doc } from "firebase/firestore";

import { useSelector } from "react-redux";
import {
  selectProjectId,
  selectSources,
} from "../../../../../../../redux/slices/projectSlice";

import { useDataSourceListener } from "../../../../../hooks/useDataSourceListener";

import Sidebar from "../../sidebar";
import DashboardNavbar from "../../dashboard-navbar";
import FaqGroups from "./faq-groups";
import FaqList from "./faq-list";
import TopBar from "./top-bar";
import DataImport from "../../../project-creator/data-import/data-import";
import LoadingAnimation from "../../../loading-animation/loading-animation";

const FaqPage = () => {
  const sources = useSelector(selectSources);
  const [faqSources, setFaqSources] = useState<any[]>([]);
  const [addingSource, setAddingSource] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [activeFaqGroup, setActiveFaqGroup] = useState<any | null>(null);

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
      setFaqSources(sources.filter((source: any) => source.type === "faq"));
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
            activeFaqGroup={activeFaqGroup}
            setActiveFaqGroup={setActiveFaqGroup}
          />
          <div className="flex flex-grow space-x-4 mb-4 mx-4">
            {addingSource ? (
              <div className="w-full h-full pt-40">
                <DataImport />
              </div>
            ) : activeFaqGroup ? (
              <FaqList activeFaqGroup={activeFaqGroup} />
            ) : (
              <FaqGroups
                sources={faqSources}
                setActiveFaqGroup={setActiveFaqGroup}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqPage;
