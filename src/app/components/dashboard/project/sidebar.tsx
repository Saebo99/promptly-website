import React from "react";
import { usePathname, useRouter } from "next/navigation"; // <-- Adjusted import path

import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import {
  selectProjectIdentifier,
  setProjectIdentifier,
  setProjectId,
  selectCurrentProject,
} from "../../../../../redux/slices/projectSlice";
import { setModelId } from "../../../../../redux/slices/modelSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTachometerAlt,
  faCog,
  faKey,
  faRobot,
  faGlobe,
  faFile,
  faVideo,
  faQuestionCircle,
  faHeadset,
  faChartLine,
  faLifeRing,
  faMessages,
  faCheckToSlot,
} from "@fortawesome/pro-regular-svg-icons";

const menuSections = {
  Overview: [
    { name: "Dashboard", icon: faTachometerAlt, route: "" },
    { name: "Settings", icon: faCog, route: `/project-settings` },
    { name: "Keys", icon: faKey, route: "/api-keys" },
  ],
  Workshop: [{ name: "Chatbot", icon: faHeadset, route: "/workshop" }],
  Data: [
    { name: "Websites", icon: faGlobe, route: "/data-sources" },
    { name: "Files", icon: faFile, route: "/files" },
    { name: "Videos", icon: faVideo, route: "/videos" },
    { name: "FAQs", icon: faQuestionCircle, route: "/faqs" },
    {
      name: "Improved Answers",
      icon: faCheckToSlot,
      route: "/improved-answers",
    },
  ],
  Insight: [
    { name: "Conversations", icon: faMessages, route: "/insight" },
    { name: "Analytics", icon: faChartLine, route: "/analytics" },
  ],
  Support: [{ name: "Support", icon: faLifeRing, route: "/support" }],
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const projectIdentifier = useSelector(selectProjectIdentifier);
  const currentProject = useSelector(selectCurrentProject);

  const hoverAnimation = {
    hover: { backgroundColor: "#4B5C78" },
  };

  return (
    <div className="flex flex-col h-screen bg-[#222831] border-r border-[#393E46] text-white p-4 w-64">
      <div className="flex items-center mb-4">
        <span className="flex-grow font-semibold">{currentProject.name}</span>
      </div>
      {Object.entries(menuSections).map(([sectionTitle, items]) => (
        <div key={sectionTitle}>
          <h2 className="text-gray-500 text-xs uppercase font-semibold">
            {sectionTitle}
          </h2>
          {items.map((item) => (
            <motion.div
              key={item.name}
              whileHover="hover"
              variants={hoverAnimation}
              transition={{ duration: 0.1 }}
              className={`cursor-pointer flex items-center my-1 px-2 py-2 rounded text-sm text-gray-400 ${
                pathname.endsWith(`/app/${projectIdentifier}${item.route}`)
                  ? "bg-[#4B5C78] text-white"
                  : ""
              }`}
              onClick={() =>
                router.push(`/app/${projectIdentifier}${item.route}`)
              }
            >
              <FontAwesomeIcon
                icon={item.icon}
                size="lg"
                className="mr-3 w-10"
              />
              <span>{item.name}</span>
            </motion.div>
          ))}
        </div>
      ))}
      <div className="mt-auto">
        <button
          className="w-full py-2 bg-[#222831] hover:bg-[#4B5C78] duration-100 text-white rounded"
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
