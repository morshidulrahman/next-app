"use client";
import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

const SortFilterDropdown = ({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: "startTime", label: "Start Time" },
    { value: "endTime", label: "End Time" },
    { value: "activeTime", label: "Active Time" },
    { value: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest(".sort-dropdown")) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[150px] min-w-0 sort-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sort By
      </label>
      <div
        className="flex items-center border-gray-300 cursor-pointer text-[14px] leading-[20.125px] relative rounded-[4px] border px-[12px] py-[10.5px] bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all"
        tabIndex={0}
        onClick={() => setIsSortOpen(!isSortOpen)}
      >
        <h6 className="text-sm font-medium leading-[19.92px] whitespace-nowrap overflow-hidden">
          {sortOptions.find((opt) => opt.value === sortField)?.label}
        </h6>
        <div
          className="absolute right-[12px] top-1/2 transform -translate-y-1/2 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          <ArrowUpDown
            className={`w-4 h-4 text-gray-500 transition-transform`}
          />
        </div>
      </div>
      {isSortOpen && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-[4px] shadow-md mt-1 z-10">
          {sortOptions.map((option) => (
            <li
              key={option.value}
              className={`px-[12px] py-[8px] text-[14px] hover:bg-gray-100 cursor-pointer ${
                sortField === option.value ? "bg-[#1677ff]/5 font-semibold" : ""
              }`}
              onClick={() => {
                setSortField(option.value);
                setIsSortOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortFilterDropdown;
