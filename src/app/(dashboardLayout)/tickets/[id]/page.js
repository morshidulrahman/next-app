import TicketReply from "@/components/Tickets/TicketReply";
import { useProfile } from "@/lib/useProfile";
import React from "react";

const page = async ({ params }) => {
  const user = await useProfile();
  const { id } = await params;

  return (
    <>
      <TicketReply id={id} user={user} />
    </>
  );
};

export default page;
