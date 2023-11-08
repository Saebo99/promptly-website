import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faLink } from "@fortawesome/pro-solid-svg-icons";

interface SourceSelectionProps {
  handleSourceClick: (source: string) => void;
}

const SourceSelection: React.FC<SourceSelectionProps> = ({
  handleSourceClick,
}) => {
  const sources = [
    { name: "URL", icon: faLink },
    { name: "File/Folder", icon: faFile },
  ];

  return (
    <div className="flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg shadow-lg p-6 bg-[#222831] border border-[#393E46] w-1/3"
      >
        <div className="grid grid-cols-2 gap-4">
          {sources.map((source) => (
            <div
              key={source.name}
              onClick={() => handleSourceClick(source.name)}
              className="flex items-center justify-center p-3 rounded-lg shadow-md cursor-pointer border bg-[#222831] border-[#393E46] hover:border-[#00ADB5] text-white"
            >
              <FontAwesomeIcon icon={source.icon} className="mr-3" />
              <span>{source.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SourceSelection;
