"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import FaqPage from "@/app/components/dashboard/project/data/faqs/index";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <FaqPage />
    </div>
  );
};

export default Page;
