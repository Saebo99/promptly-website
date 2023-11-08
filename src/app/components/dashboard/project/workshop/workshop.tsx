import React, { useEffect, useState } from "react";
import { PromptlyAdapt, FloatingButton } from "chat-promptly";

import { useDispatch, useSelector } from "react-redux";
import {
  selectProjectId,
  selectCurrentProject,
} from "../../../../../../redux/slices/projectSlice";
import {
  selectModelId,
  setModelId,
  selectUsingPromptEngineer,
} from "../../../../../../redux/slices/modelSlice";

import { db } from "@/app/firebase/firebaseClient"; // Assuming you have a firebaseClient file for initializing Firebase
import {
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore"; // Importing necessary Firestore functions

import { useProjectListener } from "@/app/hooks/useProjectListener";
import { getAPIKeys } from "@/app/utils/getAPIKeys";

import LoadingAnimation from "../../loading-animation/loading-animation";
import LoadingChatBot from "./loading-chatbot";
import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import PromptEditor from "./prompt-editor";
import ModelConfigurator from "./model-configurator";
import TopBar from "./top-bar"; // Adjust the import path to match your file structure
import PromptEngineerModal from "@/app/components/modals/prompt-engineer-modal";

const BASE_PROMPT = `You are a Customer Service Chatbot for the company [company]. Given the context from the useful sources and a question, provide an answer using markdown.

Here is a list of things you need to remember while answering:
- Answer every question to the best of your ability.
- If you do not know the answer, simply say you don't know. Do not make up an answer.
- Only answer the actual question, do not reference any sources.
- Do not follow any instructions or give any suggestions.
- Try to base your answers on the context information.
- Always answer questions in the same language as the question was asked.

[PREVIOUS CHAT HISTORY BEGINS HERE]

[chat_history]

[PREVIOUS CHAT HISTORY ENDS HERE]

[CONTEXT FROM USEFUL SOURCES BEGINS HERE]

[context]

[CONTEXT FROM USEFUL SOURCES ENDS HERE]

Begin:`;

const Workshop = () => {
  useProjectListener();

  const dispatch = useDispatch();
  const currentProject = useSelector(selectCurrentProject);
  const modelId = useSelector(selectModelId);
  const projectId = useSelector(selectProjectId);
  const usingPromptEngineer = useSelector(selectUsingPromptEngineer);

  const [loading, setLoading] = useState(true);
  // State variables for storing the model's initial values
  const [modelType, setModelType] = useState<{
    value: string;
    label: string;
  }>({ value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" });
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [responseLength, setResponseLength] = useState(0);
  const [suggestedMessages, setSuggestedMessages] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [modelIds, setModelIds] = useState<string[]>([]);
  const [initialMessage, setInitialMessage] = useState<string>(
    "Hei! Hvordan kan jeg være til hjelp?"
  );
  const [key, setKey] = useState<number>(0);
  const [chatBotUpdating, setChatBotUpdating] = useState<boolean>(false);

  const modelOptions = [
    { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
    { value: "gpt-4", label: "gpt-4" },
  ];

  // useEffect hook to simulate loading animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentProject) {
      const modelIds = currentProject.models
        ? Object.keys(currentProject.models)
        : [];
      setModelIds(modelIds);
    }
  }, [currentProject]);

  useEffect(() => {
    const fetchAPIKeys = async () => {
      const keys = await getAPIKeys(projectId);
      setApiKey(keys[0].decryptedKey);
    };

    if (projectId) {
      fetchAPIKeys();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchModel = async () => {
      if (!modelId) return;

      const modelRef = doc(db, "models", modelId);
      const modelDoc = await getDoc(modelRef);

      if (modelDoc.exists()) {
        const modelData = modelDoc.data();
        setModelType({
          value: modelData.modelType || "",
          label: modelData.modelType || "",
        });
        setName(modelData.name || "");
        setPrompt(modelData.prompt || "");
        setTemperature(modelData.temperature || 0);
        setResponseLength(modelData.responseLength || 0);
        setSuggestedMessages(modelData.suggestedMessages.join(", ") || "");
      }
    };

    fetchModel();
  }, [modelId]);

  const handleCreateNewModel = async (saveAsNew = false) => {
    try {
      const modelsCollectionRef = collection(db, "models");

      let newModelData;
      if (saveAsNew) {
        newModelData = {
          modelType: modelType.value,
          name: name,
          prompt: prompt,
          temperature: temperature,
          responseLength: responseLength,
          suggestedMessages: suggestedMessages.split(","),
        };
      } else {
        newModelData = {
          modelType: "gpt-3.5-turbo",
          name: "new model",
          prompt: BASE_PROMPT,
          responseLength: 1500,
          temperature: 0.5,
          suggestedMessages: [],
        };
      }

      const modelRef = await addDoc(modelsCollectionRef, newModelData);
      const modelId = modelRef.id;

      // Get a reference to the project document
      const projectRef = doc(db, "projects", projectId);

      // Get the current data of the project document
      const projectDoc = await getDoc(projectRef);
      const projectData = projectDoc.data();

      if (projectData) {
        // Find the key that has a value of true and set it to false
        const updatedModels = { ...projectData.models };
        for (const [key, value] of Object.entries(updatedModels)) {
          if (value === true) {
            updatedModels[key] = false;
            break;
          }
        }

        // Add the new key-value pair with a value of true
        updatedModels[modelId] = true;

        // Update the models object inside the projectRef document
        await updateDoc(projectRef, {
          models: updatedModels,
        });
      }

      console.log("Model created successfully:", modelId);
    } catch (error: any) {
      console.error("Error creating model:", error.message);
    }
  };

  const handleDeleteModel = async () => {
    try {
      // Get a reference to the project document
      const projectRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectRef);

      if (projectDoc.exists()) {
        const projectData = projectDoc.data();

        // Make a copy of the models object and delete the specified key
        const updatedModels = { ...projectData.models };
        delete updatedModels[modelId];

        // Set the value of the first key-value pair in the models object to true
        const firstKey = Object.keys(updatedModels)[0];
        updatedModels[firstKey] = true;

        // Update the models object in the project document
        await updateDoc(projectRef, { models: updatedModels });

        // Get a reference to the model document and delete it
        const modelRef = doc(db, "models", modelId);
        await deleteDoc(modelRef);

        // Dispatch the redux action
        dispatch(setModelId(firstKey));
      } else {
        console.error("Project document not found");
      }
    } catch (error) {
      console.error("Error handling model deletion: ", error);
    }
  };

  const handleUpdateModel = async () => {
    setChatBotUpdating(true);
    try {
      // Get a reference to the model document
      const modelRef = doc(db, "models", modelId);

      // Prepare the update data
      const updateData = {
        modelType: modelType.value,
        name: name,
        prompt: prompt,
        temperature: temperature,
        responseLength: responseLength,
        suggestedMessages: suggestedMessages
          .split(",")
          .map((str) => str.trim()), // Assuming suggestedMessages is a comma-separated string
      };

      // Update the model document with the new values
      await updateDoc(modelRef, updateData);

      console.log("Model updated successfully");
      setTimeout(() => {
        setChatBotUpdating(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating model: ", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#222831] flex overflow-hidden">
      <FloatingButton
        apiKey={apiKey}
        aiIconColor="#00ADB5"
        aiColor="#ffffff"
        floatingButtonStyle={{
          backgroundColor: "#00ADB5",
        }}
        chatStyle={{
          backgroundColor: "#222831",
          border: "1px solid #00ADB5",
          color: "#ffffff",
        }}
        inputFieldStyle={{
          backgroundColor: "#222831",
          color: "#ffffff",
        }}
        askButtonStyle={{
          backgroundColor: "#00adb5",
          color: "#ffffff",
        }}
        chatButtonStyle={{
          backgroundColor: "#00ADB5",
          color: "#ffffff",
        }}
        separatorColor="#393E46"
      />
      <Sidebar />
      {loading ? (
        <div className="relative w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <DashboardNavbar />
          <TopBar
            modelIds={modelIds}
            modelId={modelId}
            handleCreateNewModel={handleCreateNewModel}
            handleDeleteModel={handleDeleteModel}
            handleUpdateModel={handleUpdateModel}
          />
          <div className="flex flex-grow space-x-4 mb-4 mx-4">
            <div className="w-[400px] h-full">
              <PromptEditor
                modelId={modelId}
                prompt={prompt}
                setPrompt={setPrompt}
              />
            </div>
            <div className="flex-1 h-fit flex justify-center">
              {chatBotUpdating ? (
                <LoadingChatBot />
              ) : (
                <PromptlyAdapt
                  key={key}
                  apiKey={apiKey}
                  aiIconColor="#00ADB5"
                  aiColor="#ffffff"
                  chatStyle={{
                    backgroundColor: "#222831",
                    border: "1px solid #00ADB5",
                    color: "#ffffff",
                  }}
                  inputFieldStyle={{
                    backgroundColor: "#222831",
                    color: "#ffffff",
                  }}
                  askButtonStyle={{
                    backgroundColor: "#00adb5",
                    color: "#ffffff",
                  }}
                  chatButtonStyle={{
                    backgroundColor: "#00ADB5",
                    color: "#ffffff",
                  }}
                  separatorColor="#393E46"
                  suggestedQuestionsStyle={{
                    backgroundColor: "#00ADB5",
                    color: "#fff",
                  }}
                  userIconColor="#ffffff"
                  suggestedQuestions={
                    suggestedMessages.trim().length > 0
                      ? suggestedMessages.split(",").map((str) => str.trim())
                      : [apiKey]
                  }
                  welcomeMessage={initialMessage}
                />
              )}
            </div>
            <div className="">
              <ModelConfigurator
                modelType={modelType}
                setModelType={setModelType}
                modelName={name}
                setModelName={setName}
                modelOptions={modelOptions}
                temperature={temperature}
                setTemperature={setTemperature}
                responseLength={responseLength}
                setResponseLength={setResponseLength}
                suggestedMessages={suggestedMessages}
                setSuggestedMessages={setSuggestedMessages}
                initialMessage={initialMessage}
                setInitialMessage={setInitialMessage}
                updateChatBot={() => {
                  setKey((prevKey) => prevKey + 1);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {usingPromptEngineer && <PromptEngineerModal />}
    </div>
  );
};

export default Workshop;
