"use client";

import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useRequireAuth } from "../../../hooks/useRequireAuth";

import Workshop from "@/app/components/dashboard/project/workshop/workshop";

const Page = () => {
  useAuth();
  useRequireAuth();

  return (
    <div>
      <Workshop />
    </div>
  );
};

export default Page;
