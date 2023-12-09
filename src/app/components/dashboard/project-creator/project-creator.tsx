import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/app/firebase/firebaseClient";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../../../redux/slices/userSlice";
import {
  setProjectId,
  setProjectIdentifier,
} from "../../../../../redux/slices/projectSlice";
import { setModelId } from "../../../../../redux/slices/modelSlice";

import { createClientAPIKey } from "@/app/utils/createClientAPIKey";

import LoadingAnimation from "../loading-animation/loading-animation";
import DashboardNavbar from "@/app/components/dashboard/project/dashboard-navbar";
import MultiStepProgressBar from "./progress-bar/multi-step-progress-bar";
import ProjectConfig from "./project-config";
import DataImport from "./data-import/data-import";
import Workshop from "./workshop/workshop";

const ProjectCreator = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<string>("pageone");
  const [tempProjectName, setTempProjectName] = useState<string>("");
  const [tempProjectId, setTempProjectId] = useState<string>("");
  const [isProjectNameValid, setIsProjectNameValid] = useState(false);
  const [isProjectIdValid, setIsProjectIdValid] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState({
    value: "gpt-3.5-turbo",
    label: "gpt-3.5-turbo",
  });
  const [temperature, setTemperature] = useState<any>(0.5);
  const [responseLength, setResponseLength] = useState<any>(1500);

  const modelOptions = [
    { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
    { value: "gpt-4", label: "gpt-4" },
  ];

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]);

  const nextPageNumber = (pageNumber: string) => {
    setLoading(true);
    switch (pageNumber) {
      case "1":
        setPage("pageone");
        break;
      case "2":
        setPage("pagetwo");
        break;
      case "3":
        setPage("pagethree");
        break;
      case "4":
        alert("Ooops! Seems like you did not fill the form.");
        break;
      default:
        setPage("1");
    }
  };

  const getNextPage = (currentPage: string) => {
    switch (currentPage) {
      case "pageone":
        return "pagetwo";
      case "pagetwo":
        return "pagethree";
      case "pagethree":
        return null; // No more pages after this.
      default:
        return "pageone";
    }
  };

  const handleNextButtonClick = async () => {
    setLoading(true);
    const nextPage = getNextPage(page);

    if (page === "pagethree") {
      try {
        // Storing projectId in the user's document
        const userDocRef = doc(db, "users", user.uid); // Assuming user.id is the document ID
        await setDoc(
          userDocRef,
          {
            projects: arrayUnion(tempProjectId),
          },
          { merge: true }
        );

        // Step 1: Create a new document in the models collection
        const modelDocRef = await addDoc(collection(db, "models"), {
          name: modelName || "new model", // Default to "new model" if modelName is not set
          modelType: modelType.value, // Assuming you want to store just the value
          temperature: temperature,
          responseLength: responseLength,
        });

        // Step 2: Get the ID of the newly created document
        const modelId = modelDocRef.id;

        // Create an object with modelId as the key and true as the value
        const modelsObject = { [modelId]: true };

        // Step 3: Create a new document in the projects collection
        const docRef = await addDoc(collection(db, "projects"), {
          name: tempProjectName,
          projectIdentifier: tempProjectId,
          models: modelsObject,
          team: [],
        });

        // Update the redux store
        dispatch(setProjectId(docRef.id));
        dispatch(setProjectIdentifier(tempProjectId));
        dispatch(setModelId(modelDocRef.id));

        // Step 4: Create a client api key for the project
        await createClientAPIKey(docRef.id);

        // Redirecting to the project page
        router.push(`/app/${tempProjectId}`);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }

    if (nextPage) {
      setPage(nextPage);
    } else {
      console.log("done");
    }
  };

  const renderNextButtonText = () => {
    switch (page) {
      case "pageone":
        return "Let's Dive into Data Import!";
      case "pagetwo":
        return "Skip to data integration!";
      case "pagethree":
        return "Handle sources later?";
      default:
        return "Next";
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#222831]">
      <DashboardNavbar />

      <MultiStepProgressBar
        page={page}
        onPageNumberClick={nextPageNumber}
        isProjectNameValid={isProjectNameValid}
        isProjectIdValid={isProjectIdValid}
      />
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          <div className="mt-20 flex-1 overflow-y-auto">
            {
              {
                pageone: (
                  <ProjectConfig
                    projectName={tempProjectName}
                    setProjectName={setTempProjectName}
                    projectId={tempProjectId}
                    setProjectId={setTempProjectId}
                    setIsProjectNameValid={setIsProjectNameValid}
                    setIsProjectIdValid={setIsProjectIdValid}
                  />
                ),
                pagetwo: (
                  <Workshop
                    modelName={modelName}
                    setModelName={setModelName}
                    modelType={modelType}
                    setModelType={setModelType}
                    temperature={temperature}
                    setTemperature={setTemperature}
                    responseLength={responseLength}
                    setResponseLength={setResponseLength}
                    modelOptions={modelOptions}
                  />
                ),
                pagethree: <DataImport />,
              }[page]
            }
          </div>
          <div className="mt-20 w-screen flex flex-col justify-center items-center pb-4">
            {["pagetwo", "pagethree"].includes(page) && (
              <span className="text-gray-500 text-xs mb-1">
                {page === "pagethree"
                  ? "You can configure sources anytime later from the dashboard."
                  : "You can configure the model anytime later from the dashboard."}
              </span>
            )}
            <button
              className="py-2 px-4 text-white rounded hover:bg-[#4B5C78] duration-100"
              onClick={handleNextButtonClick}
              disabled={
                page === "pageone" && (!isProjectNameValid || !isProjectIdValid)
              }
            >
              {renderNextButtonText()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCreator;
