import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../../redux/slices/userSlice";
import { setModelId } from "../../../../redux/slices/modelSlice";
import {
  setProjectId,
  setProjectIdentifier,
} from "../../../../redux/slices/projectSlice";

import { db } from "@/app/firebase/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "@/app/hooks/useAuth";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import DashboardNavbar from "../dashboard/project/dashboard-navbar";

const ProjectsOverview = () => {
  useAuth();
  useRequireAuth();

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user && user.uid) {
        // Get user's projects list
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userProjects = userDoc.data()?.projects || [];
        console.log("userProjects: ", userProjects);

        if (userProjects.length > 0) {
          // Query to fetch projects based on user's projects list
          const projectsRef = collection(db, "projects");
          const q = query(
            projectsRef,
            where("projectIdentifier", "in", userProjects)
          );

          const querySnapshot = await getDocs(q);
          const fetchedProjects = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(fetchedProjects);
        }
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="w-screen h-screen bg-[#222831] px-32 text-white">
      <DashboardNavbar />
      <h1 className="text-4xl font-bold mb-6 pt-20">Projects Overview</h1>
      <div className="flex flex-wrap gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              localStorage.setItem("projectId", project.id);
              dispatch(setProjectId(project.id));
              dispatch(setProjectIdentifier(project.projectIdentifier));
              const modelsObject = project.models;
              console.log("modelsObject: ", modelsObject);

              // Find the active modelId
              let activeModelId = null;
              for (const [modelId, isActive] of Object.entries(modelsObject)) {
                if (isActive) {
                  console.log("modelId: ", modelId);
                  activeModelId = modelId;
                  break;
                }
              }

              // If an active modelId is found, dispatch an action to update the Redux store
              if (activeModelId) {
                dispatch(setModelId(activeModelId));
              }

              router.push(`/app/${project.projectIdentifier}`);
            }}
            className="cursor-pointer flex flex-col justify-between h-60 w-80 p-4 shadow-md rounded-lg border border-[#393E46] bg-[#222831] hover:border-[#00ADB5] duration-300"
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-sm">{project.id}</p>
          </div>
        ))}
        <div
          onClick={() => {
            router.push("/app/project-creator/");
          }}
          className="cursor-pointer flex items-center justify-center w-80 h-60 p-4 shadow-md rounded-lg border border-[#393E46] bg-[#222831] hover:border-[#00ADB5] duration-300"
        >
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverview;
