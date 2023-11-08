import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/slices/userSlice";

import { db } from "@/app/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

// Import Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/pro-regular-svg-icons";

const PendingRequests = () => {
  const user = useSelector(selectUser);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const fetchPendingRequests = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setPendingRequests(userDocSnap.data().pendingRequests || []);
          } else {
            setError("No such user!");
          }
        } catch (err) {
          setError("Failed to fetch pending requests");
          console.error(err);
        }
      };

      fetchPendingRequests();
    }
  }, [user]);

  // Add the necessary handlers for accepting and rejecting requests here
  const handleAccept = (request: string) => {
    // Handle the accept action
  };

  const handleReject = (request: string) => {
    // Handle the reject action
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pending Requests</h1>
      <div className="border border-[#393E46] hover:border-[#00ADB5] bg-[#222831] rounded shadow-lg h-[250px] w-[350px] overflow-y-auto duration-300">
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {pendingRequests.map((request, index) => (
            <li
              key={index}
              className="flex justify-between items-center border border-[#393E46] hover:border-[#00ADB5] duration-300 p-4"
            >
              <span className="w-3/5">{request}</span>
              <div>
                <FontAwesomeIcon
                  size="xl"
                  icon={faCheckCircle}
                  className="text-[#393E46] hover:text-green-500 mx-2 cursor-pointer duration-300"
                  onClick={() => handleAccept(request)}
                />
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="xl"
                  className="text-[#393E46] hover:text-red-500 mx-2 cursor-pointer duration-300"
                  onClick={() => handleReject(request)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PendingRequests;
