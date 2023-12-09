import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectModelId } from "../../../../../../redux/slices/modelSlice";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseClient";

import DesignTabSelection from "./design-tab-selection";
import PaletteTab from "./design/palette-tab";
import ColorTab from "./design/color-tab";

interface DesignProps {
  selectedColors: {
    background: string;
    buttonBackground: string;
    text: string;
    buttonText: string;
    inputBackground: string;
    inputText: string;
  };
  setSelectedColors: React.Dispatch<React.SetStateAction<any>>;
}

const Design: React.FC<DesignProps> = ({
  selectedColors,
  setSelectedColors,
}) => {
  const modelId = useSelector(selectModelId);
  const tabs = ["Palettes", "Colors", "Icons"];
  const [selectedTab, setSelectedTab] = useState<string>("Palettes");

  useEffect(() => {
    const updateModelColors = async () => {
      if (modelId && selectedColors) {
        try {
          const docRef = doc(db, "models", modelId);
          await updateDoc(docRef, {
            colorSettings: selectedColors, // Storing the entire object
          });
        } catch (error) {
          console.error("Error updating model colors:", error);
        }
      }
    };

    updateModelColors();
  }, [selectedColors, modelId]);

  return (
    <div className="w-full max-w-[1000px] my-8 space-y-8 flex flex-col items-center">
      <DesignTabSelection
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        numOfTabs={tabs.length}
      />
      <div className="w-full h-[60vh] flex flex-col p-4 bg-[#222831] text-white overflow-scroll">
        {selectedTab === "Palettes" ? (
          <PaletteTab setSelectedColors={setSelectedColors} />
        ) : selectedTab === "Colors" ? (
          <ColorTab
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
          />
        ) : (
          <div>Icons</div>
        )}
      </div>
    </div>
  );
};

export default Design;
