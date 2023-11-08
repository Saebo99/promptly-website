"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import DataSources from "@/app/components/dashboard/project/data-sources/data-sources";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <DataSources />
    </div>
  );
};

export default Page;
