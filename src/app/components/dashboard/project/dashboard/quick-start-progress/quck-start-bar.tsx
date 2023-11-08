import React from "react";
import "./quick-start-progress.css";
import { ProgressBar, Step } from "react-step-progress-bar";

interface QuickStartBarProps {
  page: string;
  onPageNumberClick: (pageNumber: string) => void;
}

const QuickStartBar: React.FC<QuickStartBarProps> = ({
  page,
  onPageNumberClick,
}) => {
  var stepPercentage = 0;
  if (page === "pageone") {
    stepPercentage = 24;
  } else if (page === "pagetwo") {
    stepPercentage = 49;
  } else if (page === "pagethree") {
    stepPercentage = 74;
  } else if (page === "pagefour") {
    stepPercentage = 99;
  } else if (page === "pagefive") {
    stepPercentage = 100;
  } else {
    stepPercentage = 0;
  }

  return (
    <ProgressBar percent={stepPercentage}>
      <Step>
        {({ accomplished, index }: any) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => {
              onPageNumberClick("1");
            }}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }: any) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => {
              onPageNumberClick("2");
            }}
          >
            {index + 1}
          </div>
        )}
      </Step>

      <Step>
        {({ accomplished, index }: any) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => {
              onPageNumberClick("3");
            }}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }: any) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("4")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }: any) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("5")}
          >
            {index + 1}
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default QuickStartBar;
