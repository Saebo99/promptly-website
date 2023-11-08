import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";
import { db } from "@/app/firebase/firebaseClient";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/pro-solid-svg-icons";
import {
  getDoc,
  doc,
  collection,
  where,
  getDocs,
  query,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const TeamOverview = () => {
  const projectId = useSelector(selectProjectId);
  const [project, setProject] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [buttonStatus, setButtonStatus] = useState("default"); // 'default', 'success', 'error'

  // Variants for the animation
  const buttonVariants = {
    default: { scale: 1 },
    success: { scale: [1, 1.25, 1], transition: { duration: 0.2 } },
    error: { scale: [1, 1.25, 1], transition: { duration: 0.2 } },
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      default:
        return "bg-[#222831]";
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      console.log("projectId: ", projectId);
      if (!projectId) return;

      const projectRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        console.log("projectDoc: ", projectDoc.data);
        setProject(projectDoc.data());
      }
    };

    fetchProject();
  }, [projectId]);

  // Function to validate email address format
  const validateEmail = (email: string) => {
    console.log("email: ", email);
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle updating the Firestore document
  const sendInvite = async () => {
    console.log("inside sendInvite");
    if (!projectId || !validateEmail(email)) return;

    console.log("projectId: ", projectId);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          pendingRequests: arrayUnion(projectId),
        })
          .then(() => {
            setButtonStatus("success");
            setTimeout(() => setButtonStatus("default"), 3000); // Reset the button after 3 seconds
          })
          .catch((error: any) => {
            setButtonStatus("error");
            setTimeout(() => setButtonStatus("default"), 3000); // Reset the button after 3 seconds
          });
      });
    } else {
      setButtonStatus("error");
      setTimeout(() => setButtonStatus("default"), 3000); // Reset the button after 3 seconds
    }
  };

  return (
    <div className="h-full shadow-lg border border-[#393E46] rounded-lg bg-[#222831] p-4 text-white">
      <div>
        <h2 className="text-2xl font-bold">Team</h2>
        <p className="mb-8">
          Collaborate on testing and building your AI applications
        </p>
        <div
          className="mb-4 space-y-4"
          style={{ maxHeight: "240px", overflowY: "auto" }}
        >
          {project &&
            project.team.map((member: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 border border-[#393E46] rounded p-2"
              >
                <div className="flex flex-col">
                  <span>{member.name}</span>
                  <span className="text-gray-200 text-sm">{member.email}</span>
                </div>
                <span
                  className={`${getRoleColor(
                    member.role
                  )} border border-[#393E46] text-white rounded px-2 py-1 mr-1 text-sm w-20 flex justify-center items-center`}
                >
                  {member.role}
                </span>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-between items-center border border-[#393E46] rounded p-2">
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded p-2 mr-2 bg-[#222831] outline-none"
        />
        <motion.button
          onClick={sendInvite}
          className="border border-[#00ADB5] hover:bg-[#00ADB5] duration-300 text-white rounded p-2 flex items-center justify-center"
          variants={buttonVariants}
          animate={buttonStatus}
        >
          {buttonStatus === "default" && "Send invite"}
          {buttonStatus === "success" && (
            <>
              <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
              Sent successfully
            </>
          )}
          {buttonStatus === "error" && (
            <>
              <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />
              User not found
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default TeamOverview;
