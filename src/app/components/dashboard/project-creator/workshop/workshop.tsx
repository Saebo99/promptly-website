import React, { useState } from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface WorkshopProps {
  modelName: string;
  setModelName: (value: string) => void;
  modelType: { value: string; label: string };
  setModelType: (value: { value: string; label: string }) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  responseLength: number;
  setResponseLength: (value: number) => void;
  modelOptions: { value: string; label: string }[];
}

const Workshop: React.FC<WorkshopProps> = ({
  modelName,
  setModelName,
  modelType,
  setModelType,
  temperature,
  setTemperature,
  responseLength,
  setResponseLength,
  modelOptions,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minWidth: 200,
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
      backgroundColor: "#2c2c2c",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4B5C78" : "#222831",
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

  const handleModelTypeChange = (selectedOption: any) => {
    if (selectedOption) {
      setModelType(selectedOption);
    }
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center space-y-6 text-white">
      <h1 className="text-4xl font-bold mb-6">{`Let's Craft Your Chatbot!`}</h1>

      {/* Model Name */}
      <div>
        <label className="block font-semibold">Model Name (optional):</label>
        <p className="text-sm mb-2 text-gray-300">
          Give your model an identifier or keep it mysterious!
        </p>
        <input
          type="text"
          placeholder="Model Name"
          className="bg-transparent border-b border-[#393E46] focus:outline-none focus:border-[#4B5C78] w-96 text-2xl font-semibold"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>

      {/* Model Type */}
      <div className="w-96 mt-6">
        <label className="block font-semibold">Select Model Type:</label>
        <p className="text-sm mb-2 text-gray-300">
          Choose the brainpower behind your chatbot.
        </p>
        <Select
          options={modelOptions}
          styles={customStyles}
          value={modelType}
          onChange={handleModelTypeChange}
          className="text-black"
        />
      </div>

      {/* Temperature */}
      <div className="w-96 mt-6">
        <label className="block font-semibold">
          Set Temperature (Creativity):
        </label>
        <p className="text-sm mb-2 text-gray-300">{`How wild do you want your chatbot's imagination to be?`}</p>

        <Slider
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(value) => setTemperature(value as number)}
          trackStyle={{ backgroundColor: "#4B5C78" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#4B5C78" }}
        />

        <div className="text-center">{temperature}</div>
      </div>

      {/* Response Length */}
      <div className="w-96 mt-6">
        <label className="block font-semibold">Set Max Response Length:</label>
        <p className="text-sm mb-2 text-gray-300">{`Choose the verbosity of your chatbot's replies.`}</p>

        <Slider
          min={200}
          max={4000}
          step={200}
          value={responseLength}
          onChange={(value) => setResponseLength(value as number)}
          trackStyle={{ backgroundColor: "#4B5C78" }}
          handleStyle={{ backgroundColor: "#000000", borderColor: "#4B5C78" }}
        />

        <div className="text-center">{responseLength} characters</div>
      </div>
    </div>
  );
};

export default Workshop;
