"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import ImprovedAnswersPage from "@/app/components/dashboard/project/data/improved-answers/index";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <ImprovedAnswersPage />
    </div>
  );
};

export default Page;
