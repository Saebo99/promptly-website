"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import { signInWithGoogle } from "../firebase/auth/googleAuth";
import { saveUserData } from "../utils/saveUserData";

import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";

import { db } from "../firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

import GoogleSignInButton from "../components/sign-in-buttons/google-sign-in-button";

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        projects: [],
      };

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // User doesn’t exist, show an error or redirect them to a registration page
        setIsLoading(false); // Ensure loading state is turned off
        alert("No account found, please register first.");
        router.push("/register"); // Redirect to register page
        return; // Exit function early to prevent following logic from executing
      }
      await saveUserData(userData);
      // Save user in local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      dispatch(setUser(userData));
      if (isNotDesktop()) {
        console.log("Mobile");
      } else {
        console.log("desktop");
        // Push to dashboard
        router.push("/app");
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col text-white"
      style={{ background: "linear-gradient(to bottom, #4B5C78, #222831)" }}
    >
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center bg-gray-800 max-w-md px-8 py-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">Sign in</h2>
          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </div>
      </div>
    </div>
  );
};

export default Page;
