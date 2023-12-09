"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import VideoPage from "@/app/components/dashboard/project/data/videos/index";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <VideoPage />
    </div>
  );
};

export default Page;
