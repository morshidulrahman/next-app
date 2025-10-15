"use client";
import { TicketsContext } from "@/components/providers/TicketsProvider";
import { useContext } from "react";

const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
};

export default useTickets;
