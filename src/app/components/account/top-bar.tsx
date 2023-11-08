import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/slices/userSlice";

const TopBar: React.FC = () => {
  const user = useSelector(selectUser);

  // State for the current date
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // State for the current time
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Effect for updating the time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 60000); // Update every minute

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="flex justify-between items-center w-full bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-3xl font-bold">Account Overview</h1>
      </div>
      <div className="">
        <span className="text-[#00ADB5] text-xl">User: </span>
        <span className="text-[#757B81] text-sm">
          {user && user.displayName}
        </span>
      </div>
      <div className="flex items-center">
        {/* Display the current date */}
        <span className="ml-4 p-2 bg-[#00adb5] rounded text-sm">
          {currentDate}
        </span>
        {/* Display the current time without seconds */}
        <span className="ml-2 p-2 bg-[#00adb5] rounded text-sm">
          {currentTime}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
