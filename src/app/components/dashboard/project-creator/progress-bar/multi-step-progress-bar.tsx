import React from "react";
import "./progress-bar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

interface MultiStepProgressBarProps {
  page: string;
  onPageNumberClick: (pageNumber: string) => void;
  isProjectNameValid: boolean;
  isProjectIdValid: boolean;
}

const MultiStepProgressBar: React.FC<MultiStepProgressBarProps> = ({
  page,
  onPageNumberClick,
  isProjectNameValid,
  isProjectIdValid,
}) => {
  var stepPercentage = 0;
  if (page === "pageone") {
    stepPercentage = 0;
  } else if (page === "pagetwo") {
    stepPercentage = 50;
  } else if (page === "pagethree") {
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
              if (
                index === 0 ||
                (index === 1 && isProjectNameValid && isProjectIdValid)
              ) {
                onPageNumberClick("1");
              }
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
              if (isProjectNameValid && isProjectIdValid) {
                onPageNumberClick("2");
              }
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
              if (isProjectNameValid && isProjectIdValid) {
                onPageNumberClick("3");
              }
            }}
          >
            {index + 1}
          </div>
        )}
      </Step>
      {/*
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
      */}
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
