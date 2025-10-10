"use client";
import { useEffect, useState } from "react";
import {
  addDays,
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IoCaretDownSharp } from "react-icons/io5";

// Date range selector component
const DateRangeSelector = ({
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  defaultTime,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const handleRangeChange = (range) => {
    if (range === "custom") {
      setShowCustomPicker(true);
      setSelectingStart(true);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    } else {
      setShowCustomPicker(false);
      setDateRange(range);
      const today = new Date();

      switch (range) {
        case "today":
          setStartDate(format(today, "yyyy-MM-dd"));
          setEndDate(format(today, "yyyy-MM-dd"));
          break;
        case "yesterday": {
          const yesterday = subDays(today, 1);
          setStartDate(format(yesterday, "yyyy-MM-dd"));
          setEndDate(format(yesterday, "yyyy-MM-dd"));
          break;
        }
        case "week": {
          const weekStart = subDays(today, 6);
          setStartDate(format(weekStart, "yyyy-MM-dd"));
          setEndDate(format(today, "yyyy-MM-dd"));
          break;
        }
        case "month": {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          setStartDate(format(monthStart, "yyyy-MM-dd"));
          setEndDate(format(today, "yyyy-MM-dd"));
          break;
        }
      }
    }
    setIsOpen(false);
  };

  const rangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
    { value: "custom", label: "Custom Range" },
  ];

  // Calendar generation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));

  const handleDateClick = (day) => {
    const selectedDate = format(new Date(year, month, day), "yyyy-MM-dd");

    if (selectingStart) {
      setTempStartDate(selectedDate);
      setTempEndDate("");
      setSelectingStart(false);
    } else {
      if (selectedDate >= tempStartDate) {
        setTempEndDate(selectedDate);
      } else {
        setTempStartDate(selectedDate);
        setTempEndDate(tempStartDate);
      }
    }
  };

  const applyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setDateRange("custom");
      setShowCustomPicker(false);
      setIsOpen(false);
    }
  };

  const cancelCustomRange = () => {
    setShowCustomPicker(false);
    setIsOpen(false);
    setTempStartDate(defaultTime);
    setTempEndDate(defaultTime);
    setStartDate(defaultTime);
    setEndDate(defaultTime);
    setDateRange(dateRange === "custom" ? "month" : dateRange);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isDateInRange = (day) => {
    if (!tempStartDate) return false;
    const date = format(new Date(year, month, day), "yyyy-MM-dd");
    if (!tempEndDate) return date === tempStartDate;
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isDateStart = (day) => {
    const date = format(new Date(year, month, day), "yyyy-MM-dd");
    return date === tempStartDate;
  };

  const isDateEnd = (day) => {
    const date = format(new Date(year, month, day), "yyyy-MM-dd");
    return date === tempEndDate;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest(".date-range-dropdown")) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[200px] date-range-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date Range
      </label>
      <div
        className="flex items-center cursor-pointer text-[14px] leading-[20.125px] relative rounded-[4px] border px-[12px] py-[10.5px] bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
        <h6 className="text-sm font-medium leading-[19.92px] whitespace-nowrap overflow-hidden">
          {rangeOptions.find((opt) => opt.value === dateRange)?.label}
        </h6>
        <IoCaretDownSharp className="absolute right-[12px] top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
      </div>

      {isOpen && !showCustomPicker && (
        <div className="absolute top-full left-0 w-[200px] bg-white border border-gray-300 rounded-[1px] shadow-md mt-1 z-10">
          <ul>
            {rangeOptions.map((option) => (
              <li
                key={option.value}
                className={`px-[12px] py-[8px] text-[14px] hover:bg-gray-100 cursor-pointer ${
                  dateRange === option.value
                    ? "bg-[#1677ff]/5 font-semibold"
                    : ""
                }`}
                onClick={() => handleRangeChange(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCustomPicker && (
        <div className="absolute top-full left-0 w-[400px] bg-white border border-gray-300 rounded-[1px] shadow-lg mt-1 z-20 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">From: </span>
                <span className="font-medium">
                  {tempStartDate || "Select start date"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">To: </span>
                <span className="font-medium">
                  {tempEndDate || "Select end date"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before first day of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="h-8"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isInRange = isDateInRange(day);
              const isStart = isDateStart(day);
              const isEnd = isDateEnd(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                                        h-8 w-8 text-sm rounded hover:bg-blue-100 transition-colors
                                        ${
                                          isStart || isEnd
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : isInRange
                                            ? "bg-blue-100 text-blue-700"
                                            : "hover:bg-gray-100"
                                        }
                                    `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex space-x-2">
              <button
                onClick={cancelCustomRange}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={applyCustomRange}
                disabled={!tempStartDate || !tempEndDate}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
