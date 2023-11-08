"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import { signInWithGoogle } from "../firebase/auth/googleAuth";
import { saveUserData } from "../utils/saveUserData";

import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";

import { db, app } from "../firebase/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import GoogleSignInButton from "../components/sign-in-buttons/google-sign-in-button";

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreeToTerms, setIsAgreeToTerms] = useState(false);

  function isNotDesktop() {
    if (typeof window === "undefined") return false; // Default to desktop when SSR
    const userAgent = window.navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const user = await signInWithGoogle();
    if (user) {
      // Save user data to Firestore
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        // Additional user data
        termsOfServiceAgreement: {
          hasAgreed: isAgreeToTerms,
          version: "1.0", // Update as needed
        },
        projects: [],
      };

      await saveUserData(userData);
      // Save user in local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      dispatch(setUser(userData));
      if (isNotDesktop()) {
        console.log("Mobile");
      } else {
        console.log("Desktop");
        router.push("/app");
      }
    }
    setIsLoading(false);
  };

  const handleAgreeToTermsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAgreeToTerms(event.target.checked);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-700">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center bg-gray-800 max-w-md px-8 py-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">
            Register
          </h2>

          {/* Checkbox for agreement to terms */}
          <label className="inline-flex items-center mt-3 text-sm">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600"
              checked={isAgreeToTerms}
              onChange={handleAgreeToTermsChange}
            />
            <span className="ml-2 text-white">
              I agree to the{" "}
              <a
                href="https://app.termly.io/document/terms-of-service/eae93a6e-1c15-4813-830e-348d6f2ead90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://app.termly.io/document/privacy-policy/edcbea52-c27d-4783-a8b8-299e5e014556"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Google Sign-In Button, which is disabled if the user does not agree to terms */}
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            disabled={!isAgreeToTerms}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
