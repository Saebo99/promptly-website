import React from "react";

import DashboardNavbar from "../dashboard/project/dashboard-navbar";
import TopBar from "./top-bar";
import PendingRequests from "./pending-requests";
import ProjectsOverview from "./projects-overview";

const Account = () => {
  return (
    <div className="h-screen w-screen bg-[#222831] text-white">
      <DashboardNavbar />
      <TopBar />
      <div className="p-8 space-x-10 flex">
        <PendingRequests />
        <ProjectsOverview />
      </div>
    </div>
  );
};

export default Account;
