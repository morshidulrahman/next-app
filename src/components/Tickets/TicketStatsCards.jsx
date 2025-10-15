"use client";
import { useState, useRef, useEffect } from "react";
import { TbTilde, TbUrgent } from "react-icons/tb";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineCheck, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa6";
import { HiOutlineArchiveBox, HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { LuArchiveRestore, LuBellRing } from "react-icons/lu";
import useTickets from "@/hooks/useTickets";

const TicketStatsCards = ({
  ticketStats = {},
  selectedFilters = {},
  onFilterChange,
  isLoadingStats = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState({
    priority: "urgent",
    status: "open",
  });

  const { openDropdown, setOpenDropdown } = useTickets();

  const dropdownRefs = useRef({});

  // Priority options with colors and text icons
  const priorityOptions = [
    {
      value: "urgent",
      label: "Urgent",
      color:
        "border-red-300 shadow-md shadow-red-100/70 text-red-700 hover:bg-red-100",
      icon: (
        <LuBellRing className="w-5 h-5 flex items-center justify-center text-red-600 font-bold text-lg" />
      ),
      bgGradient: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
      iconBg: "bg-red-200",
    },
    {
      value: "high",
      label: "High",
      color:
        "border-orange-300 shadow-md shadow-orange-100/70 text-orange-700 hover:bg-orange-100",
      icon: (
        <FaArrowUp className="w-5 h-5 flex items-center justify-center text-orange-600 font-bold text-lg" />
      ),
      bgGradient:
        "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
      iconBg: "bg-orange-200",
    },
    {
      value: "medium",
      label: "Medium",
      color:
        "border-yellow-300 shadow-md shadow-yellow-100/70 text-yellow-700 hover:bg-yellow-100",
      icon: (
        <TbTilde className="w-5 h-5 flex items-center justify-center text-yellow-600 font-bold text-lg" />
      ),
      bgGradient:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
      iconBg: "bg-yellow-200",
    },
    {
      value: "low",
      label: "Low",
      color:
        "border-green-300 shadow-md shadow-green-100/70 text-green-700 hover:bg-green-100",
      icon: (
        <FaArrowDown className="w-5 h-5 flex items-center justify-center text-green-600 font-bold text-lg" />
      ),
      bgGradient:
        "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
      iconBg: "bg-green-200",
    },
  ];

  // Status options with colors and text icons
  const statusOptions = [
    {
      value: "open",
      label: "Open",
      color:
        "border-blue-300 shadow-md shadow-blue-100/70 text-blue-700 hover:bg-blue-100",
      // icon: <GoIssueOpened className="w-4 h-4 flex items-center justify-center text-blue-600 font-bold text-lg" />,
      icon: (
        <HiOutlineArchiveBox className="w-5 h-5 flex items-center justify-center text-blue-600 font-bold text-lg" />
      ),
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      iconBg: "bg-blue-200",
    },
    {
      value: "closed",
      label: "Closed",
      color:
        "border-gray-300 shadow-md shadow-gray-100/70 text-gray-700 hover:bg-gray-100",
      icon: (
        <HiOutlineArchiveBoxXMark className="w-5 h-5 flex items-center justify-center text-gray-600 font-bold text-lg" />
      ),
      bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
      iconBg: "bg-gray-200",
    },
    {
      value: "reopened",
      label: "Reopened",
      color:
        "border-blue-300 shadow-md shadow-blue-100/70 text-blue-700 hover:bg-blue-100",
      icon: (
        <LuArchiveRestore className="w-[18.5px] h-[18.5px] flex items-center justify-center text-blue-600 font-light text-lg " />
      ),
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      iconBg: "bg-blue-200",
    },
  ];

  // Fixed cards configuration
  const fixedCards = [
    {
      id: "in-progress",
      label: "In Progress",
      value: "in-progress",
      type: "status",
      color:
        "border-purple-300 shadow-md shadow-purple-100/70 text-purple-700 hover:bg-purple-100",
      icon: (
        <RiProgress3Line className="w-5 h-5 flex items-center justify-center text-purple-600 font-bold text-lg" />
      ),
      bgGradient:
        "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
      iconBg: "bg-purple-200",
      count: ticketStats?.statusCounts?.["in-progress"] || 0,
    },
    {
      id: "resolved",
      label: "Resolved",
      value: "resolved",
      type: "status",
      color:
        "border-emerald-300 shadow-md shadow-emerald-100/70 text-emerald-700 hover:bg-emerald-100",
      icon: (
        <MdOutlineCheck className="w-5 h-5 flex items-center justify-center text-emerald-600 font-bold text-lg" />
      ),
      bgGradient:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
      iconBg: "bg-emerald-200",
      count: ticketStats?.statusCounts?.resolved || 0,
    },
  ];

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;

      Object.keys(dropdownRefs.current).forEach((key) => {
        const ref = dropdownRefs.current[key];
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  // Handle dropdown toggle
  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  // Handle option selection
  const handleOptionSelect = (type, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [type]: value,
    }));
    setOpenDropdown(null);

    // If this card is currently active (filtered), update the filter too
    if (selectedFilters?.[type]) {
      handleCardClick(type, value);
    }
  };

  // Handle card click for filtering
  const handleCardClick = (type, value) => {
    if (onFilterChange) {
      onFilterChange(type, value);
    }
  };

  // Get current option for dropdowns
  const getCurrentOption = (type, options) => {
    let currentValue;
    if (type === "priority") {
      currentValue = selectedFilters?.priority || selectedOptions.priority;
    } else {
      currentValue = selectedFilters?.status || selectedOptions.status;
    }
    return options.find((opt) => opt.value === currentValue) || options[0];
  };

  // Check if card is active (filtered)
  const isCardActive = (type, value) => {
    if (type === "priority") {
      return selectedFilters?.priority === value;
    }
    return selectedFilters?.status === value;
  };

  if (isLoadingStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white  rounded-[4px] border border-gray-200  p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200  rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200  rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-7">
      {/* Priority Card */}
      <div className="relative">
        <div
          className={`rounded-[4px] border-2 transition-all duration-300 cursor-pointer transform hover:shadow-md ${
            isCardActive(
              "priority",
              getCurrentOption("priority", priorityOptions).value
            )
              ? getCurrentOption("priority", priorityOptions).bgGradient +
                " shadow-lg scale-[103%]"
              : getCurrentOption("priority", priorityOptions).color
          }`}
          onClick={() =>
            handleCardClick(
              "priority",
              getCurrentOption("priority", priorityOptions).value
            )
          }
        >
          <div
            className={`p-5 rounded-[4px] ${
              !isCardActive(
                "priority",
                getCurrentOption("priority", priorityOptions).value
              )
                ? "bg-white"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-[4px] ${
                    getCurrentOption("priority", priorityOptions).iconBg
                  }`}
                >
                  {getCurrentOption("priority", priorityOptions).icon}
                </div>
                <div
                  className="relative"
                  ref={(el) => {
                    if (el) dropdownRefs.current["priority"] = el;
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("priority");
                    }}
                    className="flex items-center space-x-1 text-sm font-semibold hover:opacity-75 transition-opacity"
                  >
                    <span>
                      {getCurrentOption("priority", priorityOptions).label}
                    </span>
                    {/* <span >▼</span> */}
                    <MdOutlineKeyboardArrowDown
                      className={`w-5 h-5 inline-flex items-center justify-center transition-transform text-xs ${
                        openDropdown === "priority" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === "priority" && (
                    <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200  rounded-lg shadow-lg z-50">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect("priority", option.value);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50  first:rounded-t-lg last:rounded-b-lg transition-colors text-gray-900"
                        >
                          <span className="flex-shrink-0">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">
                  {ticketStats?.priorityCounts?.[
                    getCurrentOption("priority", priorityOptions).value
                  ] || 0}
                </div>
                <div className="text-xs opacity-75">tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="relative">
        <div
          className={`rounded-[4px] border-2 transition-all duration-300 cursor-pointer transform  hover:shadow-md ${
            isCardActive(
              "status",
              getCurrentOption("status", statusOptions).value
            )
              ? getCurrentOption("status", statusOptions).bgGradient +
                " shadow-lg scale-[103%]"
              : getCurrentOption("status", statusOptions).color
          }`}
          onClick={() =>
            handleCardClick(
              "status",
              getCurrentOption("status", statusOptions).value
            )
          }
        >
          <div
            className={`p-5 rounded-[4px] ${
              !isCardActive(
                "status",
                getCurrentOption("status", statusOptions).value
              )
                ? "bg-white"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-[4px] ${
                    getCurrentOption("status", statusOptions).iconBg
                  }`}
                >
                  {getCurrentOption("status", statusOptions).icon}
                </div>
                <div
                  className="relative"
                  ref={(el) => {
                    if (el) dropdownRefs.current["status"] = el;
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("status");
                    }}
                    className="flex items-center space-x-1 text-sm font-semibold hover:opacity-75 transition-opacity"
                  >
                    <span>
                      {getCurrentOption("status", statusOptions).label}
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`w-5 h-5 inline-flex items-center justify-center transition-transform text-xs ${
                        openDropdown === "status" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === "status" && (
                    <div className="absolute top-full left-0 mt-2 w-32 bg-white  border border-gray-200  rounded-lg shadow-lg z-50">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect("status", option.value);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-gray-900 "
                        >
                          <span className="flex-shrink-0">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">
                  {ticketStats?.statusCounts?.[
                    getCurrentOption("status", statusOptions).value
                  ] || 0}
                </div>
                <div className="text-xs opacity-75">tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Cards (In Progress & Resolved) */}
      {fixedCards.map((card) => (
        <div key={card.id}>
          <div
            className={` rounded-[4px] border-2 transition-all duration-300 cursor-pointer transform  hover:shadow-md ${
              isCardActive(card.type, card.value)
                ? card.bgGradient + " shadow-lg scale-[103%]"
                : card.color
            }`}
            onClick={() => handleCardClick(card.type, card.value)}
          >
            <div
              className={`p-5 rounded-[4px] ${
                !isCardActive(card.type, card.value) ? "bg-white" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-[4px] ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="text-sm font-semibold">{card.label}</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{card.count}</div>
                  <div className="text-xs opacity-75">tickets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketStatsCards;
