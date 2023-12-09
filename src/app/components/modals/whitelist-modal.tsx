import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProjectId,
  setWhitelistModalOpen,
} from "../../../../redux/slices/projectSlice";
import { saveWhitelist } from "@/app/utils/saveWhitelist";

type WhitelistEntry = {
  url: string;
  includes: string;
  excludes: string;
};

const WhitelistModal = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectProjectId);
  const [url, setUrl] = useState("");
  const [includes, setIncludes] = useState("");
  const [excludes, setExcludes] = useState("");

  const handleSaveWhitelist = async () => {
    const whitelistEntry: WhitelistEntry = {
      url,
      includes,
      excludes,
    };

    try {
      await saveWhitelist({
        projectId,
        whitelistEntry,
        onCloseModal: () => dispatch(setWhitelistModalOpen(false)),
      });
    } catch (error) {
      console.error("Error saving whitelist:", error);
      // Optionally handle error state here, e.g., display a message to the user
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 100 }}
    >
      <div
        onClick={() => dispatch(setWhitelistModalOpen(false))}
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      ></div>
      <div
        className="bg-[#222831] text-gray-200 p-8 shadow-xl rounded-lg z-50 flex flex-col justify-between items-center text-center"
        style={{ width: "50%" }}
      >
        <h1 className="text-2xl font-bold mb-4">Whitelist URL</h1>

        <div className="w-3/4 mb-4 text-start">
          <label className="block text-lg font-semibold">Enter URL</label>
          <p className="text-sm text-gray-400 mb-2">
            Specify the main URL to whitelist.
          </p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
            placeholder="https://flexibel.ai/"
          />
        </div>

        <div className="w-3/4 mb-4 text-start">
          <label className="block text-lg font-semibold">Include Paths</label>
          <p className="text-sm text-gray-400 mb-2">
            Define paths to include from the main URL.
          </p>
          <input
            type="text"
            value={includes}
            onChange={(e) => setIncludes(e.target.value)}
            className="p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
            placeholder="https://flexibel.ai/blog/*, https://flexibel.ai/products/*"
          />
        </div>

        <div className="w-3/4 mb-4 text-start">
          <label className="block text-lg font-semibold">Exclude Paths</label>
          <p className="text-sm text-gray-400 mb-2">
            Enter paths to exclude within the main URL.
          </p>
          <input
            type="text"
            value={excludes}
            onChange={(e) => setExcludes(e.target.value)}
            className="p-2 w-full bg-[#222831] rounded border border-[#393E46] focus:border-[#00ADB5] focus:outline-none"
            placeholder="https://flexibel.ai/blog/specific-article"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-4 w-full">
          <button
            onClick={handleSaveWhitelist}
            className="bg-[#222831] border border-[#00ADB5] text-white py-2 px-4 rounded hover:bg-[#00ADB5] duration-300"
          >
            Submit
          </button>
          <button
            onClick={() => dispatch(setWhitelistModalOpen(false))}
            className="text-gray-400 py-2 px-4 rounded hover:text-white duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhitelistModal;
