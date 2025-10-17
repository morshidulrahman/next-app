import { getTicetMessage } from "@/actiions/ticket";
import TicketReply from "@/components/Tickets/TicketReply";
import { useProfile } from "@/lib/useProfile";
import React from "react";

const page = async ({ params }) => {
  const user = await useProfile();
  const { id } = await params;

  const result = await getTicetMessage(id);

  return (
    <>
      <TicketReply id={id} user={user} exitingMessage={result?.data || []} />
    </>
  );
};

export default page;
