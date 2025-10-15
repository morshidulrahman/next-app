import { useProfile } from "@/lib/useProfile";
import Tickets from "@/Tickets";

const page = async () => {
  const user = await useProfile();
  const employeeId = user?.employeeId;
  return (
    <div>
      <Tickets employeeId={employeeId} />
    </div>
  );
};

export default page;
