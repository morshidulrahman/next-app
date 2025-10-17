import React from "react";
import TicketsProvider from "./TicketsProvider";
import { QueryProvider } from "./TanStackQueryProvider";

const Provider = ({ children }) => {
  return (
    <QueryProvider>
      <TicketsProvider>{children}</TicketsProvider>
    </QueryProvider>
  );
};

export default Provider;
