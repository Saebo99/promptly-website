import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";
import { setModelId } from "../../../../../../redux/slices/modelSlice";

import Select from "react-select";

import { getModels } from "@/app/utils/getModels";

interface TopBarProps {
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

const TopBar: React.FC<TopBarProps> = ({
  modelIds,
  modelId,
  handleCreateNewModel,
  handleDeleteModel,
  handleUpdateModel,
}) => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectProjectId);
  const [models, setModels] = useState<any>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(modelId);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minWidth: 200,
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
      backgroundColor: "#2c2c2c",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#444" : "#2c2c2c",
      color: "white",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "skyBlue", // chevron
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "skyBlue", // separator line, if visible
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
    <div className="flex justify-between items-center bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-xl font-bold">Workshop</h1>
        <p>
          {`Finetune your chatbot to match your brand's voice and personality.`}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Select
          options={models}
          styles={customStyles}
          onChange={handleModelChange} // Pass the handleModelChange function here
          value={selectedModel}
        />
        <button
          onClick={() => {
            handleCreateNewModel(true);
          }}
          className="px-4 py-2 rounded border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] transition duration-300"
        >
          Save as new model
        </button>
        <button
          onClick={() => {
            handleCreateNewModel();
          }}
          className="px-4 py-2 rounded border border-[#00ADB5] bg-[#222831] hover:bg-[#00ADB5] transition duration-300"
        >
          Create
        </button>
        <button
          onClick={handleUpdateModel}
          className="px-4 py-2 rounded border border-[#00ADB5] bg-[#00ADB5] transition duration-300"
        >
          Deploy
        </button>
        <button
          onClick={handleDeleteModel}
          className="px-4 py-2 rounded border border-red-500 bg-[#222831] hover:bg-red-500 transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TopBar;
