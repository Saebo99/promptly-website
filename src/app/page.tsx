"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./hooks/useAuth";
import { useRequireAuth } from "./hooks/useRequireAuth";

import Navbar from "./components/navbar";
import LandingPage from "@/app/components/landing-page/landing-page";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add a loading state

  useAuth();
  useRequireAuth();

  function isNotDesktop() {
    if (typeof window === "undefined") return false; // Default to desktop when SSR
    const userAgent = window.navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <LandingPage />
    </div>
  );
};

export default Home;
