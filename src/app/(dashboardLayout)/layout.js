import LayoutSide from "@/components/layout/Layout";
import { useProfile } from "@/lib/useProfile";

const page = async ({ children }) => {
  const profile = await useProfile();
  return (
    <>
      <LayoutSide profile={profile}>{children}</LayoutSide>
    </>
  );
};

export default page;
