import LayoutSide from "@/components/layout/Layout";
import { useProfile } from "@/lib/useProfile";
import React from "react";

const page = async ({ children }) => {
  const profile = await useProfile();
  return (
    <div>
      <LayoutSide profile={profile}>{children}</LayoutSide>
    </div>
  );
};

export default page;
