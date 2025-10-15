"use client";

import useTickets from "@/hooks/useTickets";

const TicketsPagination = () => {
  const { page, setPage, limit, setLimit, ticketsData } = useTickets();

  const metadata = ticketsData.metadata;

  return (
    <div className="flex items-center justify-between px-6 py-6 border-gray-200">
      {/* Entries Per Page Selection */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Show</span>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300  rounded-[4px] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-700 ">entries</span>
      </div>

      {/* Showing Entries Info */}
      <div className="text-sm text-gray-700 ">
        Showing {(page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, metadata.totalTickets)} of{" "}
        {metadata.totalTickets} entries
      </div>

      {/* Pagination Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300  rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white  text-gray-700 hover:bg-gray-50 "
        >
          Previous
        </button>

        {[...Array(metadata.totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setPage(idx + 1)}
            className={`px-4 py-2 border border-gray-300  rounded-md ${
              page === idx + 1
                ? "bg-blue-500  text-white"
                : "bg-white  text-gray-700  hover:bg-gray-50 "
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
          disabled={page === metadata.totalPages}
          className="px-4 py-2 border border-gray-300  rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white  text-gray-700  hover:bg-gray-50 "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TicketsPagination;
