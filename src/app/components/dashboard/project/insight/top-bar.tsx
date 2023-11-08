import React from "react";

const TopBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full bg-[#222831] p-4 text-white">
      <div className="">
        <h1 className="text-xl font-bold">Insight</h1>
        <p>Gain insight into the questions your users are asking.</p>
      </div>
    </div>
  );
};

export default TopBar;
