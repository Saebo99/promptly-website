import React from "react";

const palettes = [
  {
    name: "Classic",
    colors: {
      background: "#F0F0F0",
      text: "#333333",
      buttonBackground: "#4B5C78",
      buttonText: "#FFFFFF",
      inputBackground: "#FFFFFF",
      inputText: "#333333",
      aiIcon: "#FFFFFF",
      userIcon: "#FFFFFF",
    },
  },
  {
    name: "Dark Mode",
    colors: {
      background: "#333333",
      text: "#FFFFFF",
      buttonBackground: "#4B5C78",
      buttonText: "#FFFFFF",
      inputBackground: "#4A4A4A",
      inputText: "#FFFFFF",
      aiIcon: "#FFFFFF",
      userIcon: "#FFFFFF",
    },
  },
  {
    name: "High Contrast",
    colors: {
      background: "#000000",
      text: "#FFFFFF",
      buttonBackground: "#FFFF00",
      buttonText: "#000000",
      inputBackground: "#FFFFFF",
      inputText: "#000000",
      aiIcon: "#FFFF00",
      userIcon: "#FFFF00",
    },
  },
  {
    name: "Midnight Blue",
    colors: {
      background: "#1B262C",
      text: "#BBE1FA",
      buttonBackground: "#0F4C75",
      buttonText: "#BBE1FA",
      inputBackground: "#3282B8",
      inputText: "#BBE1FA",
      aiIcon: "#0F4C75",
      userIcon: "#3282B8",
    },
  },
  // ... more palettes
];

const colorLabels: { [key: string]: string } = {
  background: "Background",
  text: "Text",
  buttonBackground: "Button",
  buttonText: "Button Text",
  inputBackground: "Input",
  inputText: "Input Text",
  aiIcon: "AI Icon",
  userIcon: "User Icon",
};

interface PaletteTabProps {
  setSelectedColors: React.Dispatch<React.SetStateAction<any>>;
}

const PaletteTab: React.FC<PaletteTabProps> = ({ setSelectedColors }) => {
  const applyPalette = (palette: any) => {
    setSelectedColors(palette.colors);
  };

  return (
    <div className="flex flex-col space-y-4">
      {palettes.map((palette) => (
        <div
          key={palette.name}
          className="cursor-pointer p-3 rounded"
          onClick={() => applyPalette(palette)}
        >
          <h3 className="text-gray-400 mb-2">{palette.name}</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(palette.colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="w-full h-20 rounded-sm mb-1"
                  style={{ backgroundColor: value }}
                ></div>
                <span className="text-xs text-white">{colorLabels[key]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaletteTab;
