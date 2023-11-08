import React from "react";
import { usePathname, useRouter } from "next/navigation"; // <-- Adjusted import path

import { useSelector, useDispatch } from "react-redux";
import {
  selectProjectIdentifier,
  setProjectIdentifier,
  setProjectId,
} from "../../../../../redux/slices/projectSlice";
import { setModelId } from "../../../../../redux/slices/modelSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTools,
  faFlask,
  faDatabase,
  faKey,
  faCog,
} from "@fortawesome/pro-regular-svg-icons";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const projectIdentifier = useSelector(selectProjectIdentifier);

  const menuItems = [
    { name: "Dashboard", icon: faTachometerAlt, route: "" },
    { name: "Workshop", icon: faTools, route: "/workshop" },
    { name: "Insight", icon: faFlask, route: "/insight" },
    { name: "Data Sources", icon: faDatabase, route: "/data-sources" },
    { name: "API Keys", icon: faKey, route: "/api-keys" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#222831] border-r border-[#393E46] text-white p-4 w-64">
      <div className="flex items-center mb-8">
        <span className="flex-grow text-xs font-semibold">
          {projectIdentifier}
        </span>
        <FontAwesomeIcon
          icon={faCog}
          className="cursor-pointer"
          onClick={() =>
            router.push(`/app/${projectIdentifier}/project-settings`)
          }
        />
      </div>
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center my-1 px-2 py-2 rounded ${
            pathname.endsWith(`/app/${projectIdentifier}${item.route}`) // <-- Check the current route
              ? "bg-[#00ADB5]" // <-- Apply background if route matches
              : ""
          } border border-[#222831] hover:border-[#009CA2] cursor-pointer`}
          onClick={() => {
            router.push(`/app/${projectIdentifier}/${item.route}`);
          }}
        >
          <FontAwesomeIcon icon={item.icon} size="lg" className="mr-3 w-10" />
          <span>{item.name}</span>
        </div>
      ))}
      <div className="mt-auto">
        <button
          className="w-full py-2 bg-[#222831] hover:bg-[#00ADB5] duration-300 border border-[#00ADB5] text-white rounded"
          onClick={() => {
            dispatch(setProjectId(""));
            dispatch(setProjectIdentifier(""));
            dispatch(setModelId(""));
            router.push("/app/");
          }}
        >
          View all projects
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
