import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import CurrentModelOverview from "./current-model-overview";
import ClientKey from "./client-key";
import QuickStartProgress from "./quick-start-progress/quick-start-progress";
import TeamOverview from "./team-overview";
import TopBar from "./top-bar";
import UsageOverview from "./usage-overview/usage-overview";
import LoadingAnimation from "../../loading-animation/loading-animation";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // useEffect hook to simulate loading animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#222831] flex">
      <Sidebar />
      {loading ? (
        <div className="relative w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <DashboardNavbar />
          <TopBar />
          <div className="h-full w-full flex flex-col items-center overflow-y-scroll">
            <div className="flex flex-grow w-full h-full">
              <div className="w-1/2 p-2 ml-2" style={{ height: "500px" }}>
                <TeamOverview />
              </div>
              <div
                className="w-1/2 p-2 mr-2 flex flex-col space-y-4"
                style={{ height: "500px" }}
              >
                <div className="h-2/5">
                  <ClientKey />
                </div>
                <div className="h-3/5">
                  <CurrentModelOverview />
                </div>
              </div>
            </div>
            <div className="flex flex-grow w-full h-full">
              <div className="w-full p-2 mb-2 mx-2">
                <UsageOverview />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
