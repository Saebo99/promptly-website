import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";
import { setModelId } from "../../../../../../redux/slices/modelSlice";

import Select from "react-select";

import { getModels } from "@/app/utils/getModels";

interface OverviewProps {
  modelIds: string[];
  modelId: string;
  handleCreateNewModel: (saveAsNew?: boolean) => void;
  handleDeleteModel: () => void;
  handleUpdateModel: () => void;
}

type Model = {
  id: string;
  modelType: string;
  name: string;
  prompt: string;
  temperature: number;
  responseLength: number;
  suggestedMessages: string[];
};

const Overview: React.FC<OverviewProps> = ({
  modelIds,
  modelId,
  handleCreateNewModel,
  handleDeleteModel,
  handleUpdateModel,
}) => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectProjectId);
  const [models, setModels] = useState<any>([]);
  const [selectedModel, setSelectedModel] = useState<any | null>(modelId);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minWidth: 200,
      backgroundColor: "#222831",
      color: "white",
      borderColor: "#393E46", // border
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

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || modelIds.length === 0) return;

      const models: Model[] = (await getModels(modelIds)) as Model[];
      console.log(models);
      // set models variable to a list of the names of the models
      setModels(
        models.map((model) => ({ value: model.id, label: model.name }))
      );
    };

    fetchProject();
  }, [projectId, modelIds]);

  useEffect(() => {
    if (!modelId || !models) return;
    // Find the selected model based on modelId prop
    const selected = models.find((model: any) => {
      if (model.value === modelId) {
        return true;
      }
    });
    setSelectedModel(selected); // <-- Set the selected model
  }, [modelId, models]);

  const handleModelChange = (selectedOption: any) => {
    console.log("selectedOption: ", selectedOption);
    if (!selectedOption) return;
    const modelId = selectedOption.value;
    if (!projectId || !modelId) return;
    console.log("dispatching");
    dispatch(setModelId(modelId));
  };

  return (
    <div className="w-full max-w-[1000px] h-full my-8 flex flex-col p-4 bg-[#222831] text-white">
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-gray-400">Selected Model</label>
        </div>
        <Select
          options={models}
          styles={customStyles}
          onChange={handleModelChange} // Pass the handleModelChange function here
          value={selectedModel}
        />
      </div>
      <button
        onClick={() => {
          handleCreateNewModel(true);
        }}
        className="mt-8 px-4 py-2 w-fit rounded bg-[#4B5C78] hover:bg-[#393E46] transition duration-100"
      >
        Save as new model
      </button>
      <button
        onClick={() => {
          handleCreateNewModel();
        }}
        className="mt-8 px-4 py-2 w-fit rounded bg-[#4B5C78] hover:bg-[#393E46] transition duration-100"
      >
        Create model from scratch
      </button>
      <button
        onClick={handleUpdateModel}
        className="mt-8 px-4 py-2 w-fit rounded bg-[#4B5C78] hover:bg-[#393E46] transition duration-100"
      >
        Save and deploy
      </button>
      <button
        onClick={handleDeleteModel}
        className="mt-8 px-4 py-2 w-fit rounded bg-[#4B5C78] hover:bg-[#393E46] transition duration-100"
      >
        Delete
      </button>
    </div>
  );
};

export default Overview;
