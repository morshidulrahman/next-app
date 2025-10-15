import React from "react";
import { TanStackQueryProvider } from "./TanStackQueryProvider";
import TicketsProvider from "./TicketsProvider";

const Provider = ({ children }) => {
  return (
    <TanStackQueryProvider>
      <TicketsProvider>{children}</TicketsProvider>
    </TanStackQueryProvider>
  );
};

export default Provider;
