"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import Insight from "@/app/components/dashboard/project/insight/insight";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <Insight />
    </div>
  );
};

export default Page;
