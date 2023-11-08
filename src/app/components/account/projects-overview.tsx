import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/slices/userSlice";
import { db } from "@/app/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

const ProjectsOverview = () => {
  const user = useSelector(selectUser);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setProjects(userDocSnap.data().projects || []);
          } else {
            setError("No such user!");
          }
        } catch (err) {
          setError("Failed to fetch projects");
          console.error(err);
        }
      };

      fetchProjects();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Project Overview</h1>
      <div className="border border-[#393E46] hover:border-[#00ADB5] bg-[#222831] rounded shadow-lg h-[250px] w-[350px] overflow-y-auto duration-300">
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {projects.map((project, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b border-[#393E46] hover:border-[#00ADB5] duration-300 p-4"
            >
              <span className="w-full">{project}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectsOverview;
