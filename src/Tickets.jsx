"use client";
import LoadingSpinner from "./components/Loading";
import TicketsFilter from "./components/Tickets/TicketsFilter";
import TicketsList from "./components/Tickets/TicketsList";
import TicketsModal from "./components/Tickets/TicketsModal";
import TicketsPagination from "./components/Tickets/TicketsPagination";
import TicketStatsCards from "./components/Tickets/TicketStatsCards";
import TicketsToolbar from "./components/Tickets/TicketsToolbar";
import useTickets from "./hooks/useTickets";

const Tickets = () => {
  const {
    isFilterVisible,
    isLoadingTickets,
    ticketStats,
    isLoadingStats,
    selectedFilters,
    handleStatsFilterChange,
  } = useTickets();

  if (isLoadingTickets) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Statistics Cards */}
      <TicketStatsCards
        ticketStats={ticketStats}
        selectedFilters={selectedFilters}
        onFilterChange={handleStatsFilterChange}
        isLoadingStats={isLoadingStats}
      />
      <div className="bg-white rounded-[4px] border border-gray-200 p-4 mt-4">
        <TicketsToolbar />

        {/* Main Content Area with Sidebar */}
        <div className="flex">
          {/* Tickets List container adjusts width based on filter visibility */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isFilterVisible ? "w-3/4" : "w-full"
            }`}
          >
            <TicketsList />
            <TicketsPagination />
          </div>

          {/* Filter Sidebar */}
          <TicketsFilter />
        </div>

        <TicketsModal />
      </div>
    </>
  );
};

export default Tickets;
