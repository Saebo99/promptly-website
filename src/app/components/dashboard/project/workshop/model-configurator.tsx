import React from "react";

import { motion } from "framer-motion";

import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ModelConfiguratorProps {
  modelName: string;
  setModelName: (value: string) => void;
  models: string[];
  currentModel: string;
  setCurrentModel: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  responseLength: number;
  setResponseLength: (value: number) => void;
  suggestedMessages: string;
  setSuggestedMessages: (value: string) => void;
  initialMessage: string;
  setInitialMessage: (value: string) => void;
  updateChatBot: () => void;
}

const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({
  modelName,
  setModelName,
  models,
  currentModel,
  setCurrentModel,
  temperature,
  setTemperature,
  responseLength,
  setResponseLength,
  suggestedMessages,
  setSuggestedMessages,
  initialMessage,
  setInitialMessage,
  updateChatBot,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#222831",
      color: "white",
      borderColor: "#4B5C78", // border
      boxShadow: "none", // Remove box shadow on focus
      "&:hover": {
        borderColor: "#4B5C78", // border on hover
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#222831",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#222831" : "#222831",
      color: "white",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#4B5C78", // chevron
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "#4B5C78", // separator line, if visible
    }),
  };

  const findModelIndex = () => {
    return models.indexOf(currentModel);
  };

  return (
    <div className="w-full max-w-[1000px] h-[60vh] mt-8 px-4 bg-[#222831] text-white flex flex-col overflow-scroll">
      {/* Model Name */}
      <div className="space-y-2">
        <label className="text-gray-400">Model Name</label>
        <input
          type="text"
          placeholder="Model Name"
          className="w-full bg-transparent border-b border-[#393E46] focus:outline-none focus:border-[#4B5C78] font-semibold"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>

      {/* Model Type */}
      <div className="w-full mt-6 space-y-2">
        <label className="text-gray-400">Select Model Type</label>
        <div className="flex flex-row items-center relative">
          <motion.div
            className="absolute bottom-0 h-full bg-[#4B5C78] rounded w-1/2"
            initial={false}
            animate={{ x: `${findModelIndex() * 100}%` }}
            transition={{ type: "tween", duration: 0.3 }}
            style={{
              width: "calc(100% / 2)", // Adjust width based on number of tabs
              zIndex: 0, // Ensure it's behind the text
            }}
          />
          {models.map((model, index) => (
            <div
              key={index}
              className={`cursor-pointer px-4 py-2 w-full flex justify-center hover:text-white duration-100 ${
                model === currentModel ? "text-white z-10" : "text-gray-400"
              }`}
              onClick={() => setCurrentModel(model)}
              style={{ zIndex: 1 }} // Ensure text is above the box
            >
              {model}
            </div>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div className="w-full mt-8 space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-gray-400">Temperature</label>
          <div className="">{temperature}</div>
        </div>

        <Slider
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(value) => setTemperature(value as number)}
          trackStyle={{ backgroundColor: "#4B5C78" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#4B5C78" }}
        />
      </div>

      {/* Response Length */}
      <div className="w-full mt-8 space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-gray-400">Maximum length</label>
          <div className="">{responseLength}</div>
        </div>

        <Slider
          min={100}
          max={4000}
          step={100}
          value={responseLength}
          onChange={(value) => setResponseLength(value as number)}
          trackStyle={{ backgroundColor: "#4B5C78" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#4B5C78" }}
        />
      </div>

      {/* Suggested Messages */}
      <div className="w-full mt-8 space-y-2">
        <label className="text-gray-400">Suggested Messages</label>
        <textarea
          rows={3}
          placeholder="e.g., Hi, How can I help?, Is there something you need?"
          className="outline-none w-full p-2 rounded bg-[#222831] placeholder-gray-300"
          value={suggestedMessages}
          onChange={(e) => setSuggestedMessages(e.target.value)}
        />
      </div>
      <div className="w-full mt-8 space-y-2">
        <label className="text-gray-400">Initial message</label>
        <input
          type="text"
          placeholder="Initial message"
          className="w-full pt-2 bg-transparent border-b border-[#393E46] focus:outline-none focus:border-[#4B5C78] font-semibold"
          value={initialMessage}
          onChange={(e) => {
            setInitialMessage(e.target.value);
            updateChatBot();
          }}
        />
      </div>
    </div>
  );
};

export default ModelConfigurator;
