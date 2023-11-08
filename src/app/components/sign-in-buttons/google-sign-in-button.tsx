import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

interface GoogleSignInButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 mt-4 text-white border border-gray-900 bg-gray-800 hover:bg-gray-900 rounded-md shadow-md focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
