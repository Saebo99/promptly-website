"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import FilePage from "@/app/components/dashboard/project/data/files/index";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <FilePage />
    </div>
  );
};

export default Page;
