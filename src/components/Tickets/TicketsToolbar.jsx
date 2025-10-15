"use client";
import useTickets from "@/hooks/useTickets";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { HiOutlineFilter } from "react-icons/hi";

const TicketsToolbar = () => {
  const {
    globalSearch,
    setGlobalSearch,
    openCreateModal,
    isFilterVisible,
    setIsFilterVisible,
    openDropdown,
  } = useTickets();

  // const handleRefresh = async () => {
  //     await ticketsRefetch();
  // }

  return (
    <div className="flex justify-between items-center p-3 xl:p-6 gap-3">
      {/* Search Input */}
      <div
        className={`relative w-[250px] ${
          openDropdown === "priority" && "-z-10"
        }`}
      >
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search tickets..."
          className="pl-10 pr-4 py-2 border border-gray-300 font-light rounded-[4px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all w-full outline-none placeholder:text-sm"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      {/* action buttons */}
      <div className="flex items-center space-x-1 xl:space-x-3">
        {/* create ticket */}
        <button
          onClick={openCreateModal}
          className="items-center appearance-none bg-[rgb(22,119,255)] hover:bg-[#0958D9] box-border text-white cursor-pointer flex text-[14px] font-normal justify-center leading-[24.5px] min-w-[64px] relative capitalize select-none align-middle px-[6px] xl:px-[12px] py-[11.5px] rounded-[4px] whitespace-nowrap"
        >
          <span className="flex ml-[-4px] box-border xl:mr-[4px]">
            <span
              role="img"
              aria-label="plus"
              className="items-center text-white flex leading-[0px] text-center text-[14px] box-border"
            >
              <AiOutlinePlus className="text-white font-semibold text-base " />
            </span>
          </span>
          <span className="text-sm">Create Ticket</span>
        </button>

        {/* refresh */}
        {/* <div
                    onClick={handleRefresh}
                    className="bg-blue-50 text-blue-600 rounded-[4px] text-sm hover:bg-blue-100 transition-colors border border-blue-200 p-[5px] cursor-pointer"
                    title="Refresh"
                >
                    <IoMdRefresh className={`text-3xl ${isLoadingTickets || isFetchingTickets ? 'animate-spin' : ''} ${isFetchingTickets ? 'opacity-70' : ''}`} />
                </div> */}

        {/* filter */}
        <div
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={`rounded-[4px] text-sm transition-colors border p-[8px] cursor-pointer ${
            isFilterVisible
              ? "bg-[rgb(22,119,255)] text-white border-blue-600"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
          }`}
          title="Filter"
        >
          <HiOutlineFilter className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default TicketsToolbar;
