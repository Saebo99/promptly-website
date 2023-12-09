import React, { useState } from "react";
import { motion } from "framer-motion";

interface TabSelectionProps {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const TabSelection: React.FC<TabSelectionProps> = ({
  tabs,
  selectedTab,
  setSelectedTab,
}) => {
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const findTabIndex = () => {
    return tabs.indexOf(selectedTab);
  };

  return (
    <div>
      <div className="flex flex-row items-center relative">
        <motion.div
          className="absolute bottom-0 h-full bg-[#4B5C78] rounded w-1/4"
          initial={false}
          animate={{ x: `${findTabIndex() * 100}%` }}
          transition={{ type: "tween", duration: 0.3 }}
          style={{
            width: "calc(100% / 4)", // Adjust width based on number of tabs
            zIndex: 0, // Ensure it's behind the text
          }}
        />
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer px-4 py-2 w-32 flex justify-center hover:text-white duration-100 ${
              tab === selectedTab ? "text-white z-10" : "text-gray-400"
            }`}
            onClick={() => handleTabClick(tab)}
            style={{ zIndex: 1 }} // Ensure text is above the box
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSelection;
