import React from "react";

import ColorSelector from "../color-selector";

interface ColorTabProps {
  selectedColors: {
    background: string;
    buttonBackground: string;
    text: string;
    buttonText: string;
    inputBackground: string;
    inputText: string;
    aiIcon: string;
    userIcon: string;
  };
  setSelectedColors: React.Dispatch<React.SetStateAction<any>>;
}

const ColorTab: React.FC<ColorTabProps> = ({
  selectedColors,
  setSelectedColors,
}) => {
  return (
    <div>
      <ColorSelector
        type={"Background color"}
        selectedColor={selectedColors.background}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, background: color })
        }
      />
      <ColorSelector
        type={"Button background color"}
        selectedColor={selectedColors.buttonBackground}
        setSelectedColor={(color: string) =>
          setSelectedColors({
            ...selectedColors,
            buttonBackground: color,
          })
        }
      />
      <ColorSelector
        type={"Text color"}
        selectedColor={selectedColors.text}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, text: color })
        }
      />
      <ColorSelector
        type={"Button text color"}
        selectedColor={selectedColors.buttonText}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, buttonText: color })
        }
      />
      <ColorSelector
        type={"Input background color"}
        selectedColor={selectedColors.inputBackground}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, inputBackground: color })
        }
      />
      <ColorSelector
        type={"Input text color"}
        selectedColor={selectedColors.inputText}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, inputText: color })
        }
      />
      <ColorSelector
        type={"AI icon color"}
        selectedColor={selectedColors.aiIcon}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, aiIcon: color })
        }
      />
      <ColorSelector
        type={"User icon color"}
        selectedColor={selectedColors.userIcon}
        setSelectedColor={(color: string) =>
          setSelectedColors({ ...selectedColors, userIcon: color })
        }
      />
    </div>
  );
};

export default ColorTab;
