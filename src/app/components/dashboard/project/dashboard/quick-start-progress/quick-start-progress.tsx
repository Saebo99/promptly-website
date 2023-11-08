import React, { useState } from "react";

import QuickStartBar from "./quck-start-bar";

const QuickStartProgress = () => {
  const [page, setPage] = useState("pageone");

  const nextPageNumber = (pageNumber: string) => {
    switch (pageNumber) {
      case "1":
        setPage("pageone");
        break;
      case "2":
        setPage("pagetwo");
        break;
      case "3":
        setPage("pagethree");
        break;
      case "4":
        setPage("pagefour");
        break;
      case "5":
        setPage("pagefive");
        break;
      default:
        setPage("1");
    }
  };

  return (
    <div
      className="w-full border border-gray-800 rounded-lg bg-gray-700 mb-4 p-4"
      style={{ maxWidth: "calc(100% - 2rem)" }}
    >
      <QuickStartBar page={page} onPageNumberClick={nextPageNumber} />
    </div>
  );
};

export default QuickStartProgress;
