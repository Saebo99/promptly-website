"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import ApiKeys from "@/app/components/dashboard/project/api-keys/api-keys";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <ApiKeys />
    </div>
  );
};

export default Page;
