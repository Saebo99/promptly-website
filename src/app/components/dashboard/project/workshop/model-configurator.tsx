import React from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ModelConfiguratorProps {
  modelName: string;
  setModelName: (value: string) => void;
  modelType: { value: string; label: string };
  setModelType: (value: { value: string; label: string }) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  responseLength: number;
  setResponseLength: (value: number) => void;
  suggestedMessages: string;
  setSuggestedMessages: (value: string) => void;
  modelOptions: { value: string; label: string }[];
  initialMessage: string;
  setInitialMessage: (value: string) => void;
  updateChatBot: () => void;
}

const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({
  modelName,
  setModelName,
  modelType,
  setModelType,
  temperature,
  setTemperature,
  responseLength,
  setResponseLength,
  suggestedMessages,
  setSuggestedMessages,
  modelOptions,
  initialMessage,
  setInitialMessage,
  updateChatBot,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#222831",
      color: "white",
      borderColor: "#00ADB5", // border
      boxShadow: "none", // Remove box shadow on focus
      "&:hover": {
        borderColor: "#00ADB5", // border on hover
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
      color: "#00ADB5", // chevron
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "#00ADB5", // separator line, if visible
    }),
  };

  const handleModelTypeChange = (selectedOption: any) => {
    if (selectedOption) {
      setModelType(selectedOption);
    }
  };

  return (
    <div className="w-full h-full shadow-lg p-4 border border-[#393E46] rounded-lg bg-[#222831] text-white flex flex-col">
      {/* Model Name */}
      <div className="text-sm">
        <label className="block mb-1">Model Name:</label>
        <input
          type="text"
          placeholder="Model Name"
          className="w-full bg-transparent border-b border-[#393E46] focus:outline-none focus:border-[#00ADB5] font-semibold"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>

      {/* Model Type */}
      <div className="w-full mt-6 text-sm">
        <label className="block mb-1">Select Model Type:</label>
        <Select
          options={modelOptions}
          styles={customStyles}
          value={modelType}
          onChange={handleModelTypeChange}
          className="text-black"
        />
      </div>

      {/* Temperature */}
      <div className="w-full mt-6 text-sm">
        <div className="flex justify-between items-center mb-1">
          <label className="block">Temperature</label>
          <div className="">{temperature}</div>
        </div>

        <Slider
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(value) => setTemperature(value as number)}
          trackStyle={{ backgroundColor: "#00ADB5" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#00ADB5" }}
        />
      </div>

      {/* Response Length */}
      <div className="w-full mt-6 text-sm">
        <div className="flex justify-between items-center mb-1">
          <label className="block">Maximum length</label>
          <div className="">{responseLength}</div>
        </div>

        <Slider
          min={100}
          max={4000}
          step={100}
          value={responseLength}
          onChange={(value) => setResponseLength(value as number)}
          trackStyle={{ backgroundColor: "#00ADB5" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#00ADB5" }}
        />
      </div>

      {/* Suggested Messages */}
      <div className="w-full mt-6 text-sm">
        <label className="block mb-1">Suggested Messages:</label>
        <textarea
          rows={3}
          placeholder="e.g., Hi, How can I help?, Is there something you need?"
          className="w-full p-2 border border-[#393E46] rounded bg-[#393E46] placeholder-gray-300"
          value={suggestedMessages}
          onChange={(e) => setSuggestedMessages(e.target.value)}
        />
      </div>
      <div className="w-full mt-6 text-sm">
        <label className="block mb-1">Initial message:</label>
        <input
          type="text"
          placeholder="Initial message"
          className="w-full pt-2 bg-transparent border-b border-[#393E46] focus:outline-none focus:border-[#00ADB5] font-semibold"
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
