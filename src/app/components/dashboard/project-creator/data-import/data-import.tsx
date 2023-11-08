import React, { useState } from "react";

import SourceSelection from "./source-selection";
import SourceImport from "./source-import";

const DataImport = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");

  return (
    <div className="w-full h-full">
      {selectedSource === "" ? (
        <SourceSelection
          handleSourceClick={(source: string) => {
            setSelectedSource(source);
          }}
        />
      ) : (
        <SourceImport source={selectedSource} setSource={setSelectedSource} />
      )}
    </div>
  );
};

export default DataImport;
