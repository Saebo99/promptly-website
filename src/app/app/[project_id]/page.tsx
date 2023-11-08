"use client";

import React from "react";

import { useAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";

import Dashboard from "@/app/components/dashboard/project/dashboard/dashboard";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
