import React, { useEffect, useState } from "react";

import { db } from "../../../../../firebase/firebaseClient";
import { collection, getDocs, doc } from "firebase/firestore";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";

import Sidebar from "../../sidebar";
import DashboardNavbar from "../../dashboard-navbar";
import FileSources from "./file-sources";
import TopBar from "./top-bar";
import DataImport from "../../../project-creator/data-import/data-import";
import LoadingAnimation from "../../../loading-animation/loading-animation";

type Source = {
  id: string;
  source: string;
  type: string;
  insertedAt: string;
  charCount: number;
  isActive: boolean;
};

const FilePage = () => {
  const projectId = useSelector(selectProjectId);
  const [sources, setSources] = useState<Source[]>([]);
  const [addingSource, setAddingSource] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // useEffect hook to simulate loading animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      const projectRef = doc(db, "projects", projectId);
      const dataSourcesRef = collection(projectRef, "dataSources");
      const dataSourcesSnapshot = await getDocs(dataSourcesRef);

      const sourcesData = dataSourcesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          source: data.source,
          type: data.type,
          insertedAt: data.insertedAt.toDate().toLocaleDateString(), // Convert to Date object, then to string
          charCount: data.charCount,
          isActive: data.isActive.toString(),
        };
      });
      console.log("sourcesData: ", sourcesData);
      setSources(sourcesData as Source[]);
    };

    fetchData();
  }, [projectId]);

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
              <FileSources sources={sources} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePage;
