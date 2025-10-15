import React from "react";
import TicketsModal from "./TicketsModal";
import { useProfile } from "@/lib/useProfile";

const TicketModalWrapper = async () => {
  const user = await useProfile();
  const employeeId = user?.employeeId;
  return (
    <div>
      <TicketsModal employeeId={employeeId} />
    </div>
  );
};

export default TicketModalWrapper;
