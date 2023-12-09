import React, { useState } from "react";

import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/pro-solid-svg-icons";

interface ColorSelectorProps {
  type: string;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  type,
  selectedColor,
  setSelectedColor,
}) => {
  const colors = [
    "#CC313D",
    "#33FF57",
    "#3357FF",
    "#FF33F6",
    "#33FFF5",
    "#FFFF33",
    "#FF8333",
    "#8E33FF",
    "#FBEAEB",
    "#101820",
  ];

  const [customColor, setCustomColor] = useState<string>("");

  return (
    <div className="p-4 text-white">
      <div className="space-y-2">
        <span className="text-gray-400">{type}</span>
        <div className="flex space-x-2">
          {colors.map((color) => (
            <div key={color} className="text-center">
              <motion.div
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-sm cursor-pointer mb-2 ${
                  selectedColor === color ? "border-4 border-[#4B5C78]" : ""
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              ></motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center w-full">
        <input
          type="text"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="outline-none flex-1 p-1 mr-4 bg-[#222831] text-white placeholder-gray-500 border-b border-[#393E46] focus:border-[#4B5C78]"
          placeholder={selectedColor || "#FFFFFF"}
        />
        <button
          onClick={() => setSelectedColor(customColor)}
          className="w-8 h-8 rounded bg-[#4B5C78] hover:bg-[#5c6c88] transition-colors"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </div>
  );
};

export default ColorSelector;
