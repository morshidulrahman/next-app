"use client";

import { useState, useEffect, useTransition } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FiActivity, FiTrendingUp } from "react-icons/fi";
import { toast } from "sonner";
import { getCalendarStats, getDaySessions } from "@/actiions/session";

// Format time from seconds to hours and minutes
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export function getUTCDateRangeForLocalDate(localDateString) {
  const startLocal = new Date(`${localDateString}T00:00:00`);
  const endLocal = new Date(`${localDateString}T23:59:59.999`);

  return {
    startUTC: startLocal.toISOString(),
    endUTC: endLocal.toISOString(),
  };
}

export function getFloridaDateRangeFromLocalDate(localDateString) {
  const startLocal = new Date(`${localDateString}T00:00:00`);
  const endLocal = new Date(`${localDateString}T23:59:59.999`);

  const startUTC = new Date(
    startLocal.getTime() - startLocal.getTimezoneOffset() * 60000
  );
  const endUTC = new Date(
    endLocal.getTime() - endLocal.getTimezoneOffset() * 60000
  );

  const floridaTZ = "America/New_York";

  function getFloridaUTC(dateUTC, isEnd = false) {
    const floridaDateParts = new Date(
      dateUTC.toLocaleString("en-US", { timeZone: floridaTZ })
    );

    const floridaStartOrEnd = new Date(
      floridaDateParts.getFullYear(),
      floridaDateParts.getMonth(),
      floridaDateParts.getDate(),
      isEnd ? 23 : 0,
      isEnd ? 59 : 0,
      isEnd ? 59 : 0,
      isEnd ? 999 : 0
    );

    return new Date(
      floridaStartOrEnd.getTime() -
        floridaStartOrEnd.getTimezoneOffset() * 60000
    );
  }

  return {
    startUTC: getFloridaUTC(startUTC).toISOString(),
    endUTC: getFloridaUTC(endUTC, true).toISOString(),
  };
}

// Calendar view component
const CalendarView = ({
  employeeId,
  onViewSession,
  setSelectedDaySessions,
  setSelectedDate,
  setShowDaySessionsModal,
  timezone,
}) => {
  const [isPending, startTransition] = useTransition();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarStats, setCalendarStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Fetch calendar stats when month changes
  useEffect(() => {
    const fetchCalendarStats = async () => {
      if (!employeeId) return;

      setIsLoading(true);
      startTransition(async () => {
        const result = await getCalendarStats({
          employeeId,
          year,
          month: month + 1,
          timezone,
        });

        if (result.success) {
          setCalendarStats(result.data);
        } else {
          toast.error(result.error || "Failed to load calendar stats");
        }
        setIsLoading(false);
      });
    };

    fetchCalendarStats();
  }, [employeeId, year, month, timezone]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Navigate between months
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[4px] shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            disabled={isPending || isLoading}
            className="p-1 rounded-[4px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            disabled={isPending || isLoading}
            className="p-1 rounded-[4px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-24 border rounded-[4px] border-gray-300"
          ></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          // Get stats for this day from calendarStats
          const dayKey = String(day).padStart(2, "0");
          const dayStats = calendarStats[dayKey] || {
            totalActiveTime: 0,
            totalIdleTime: 0,
            totalTime: 0,
            activePercentage: 0,
          };

          const handleDayClick = async () => {
            // if (isPending) return;

            const selectedDate = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

            const { startUTC, endUTC } =
              timezone === "America/New_York"
                ? getFloridaDateRangeFromLocalDate(selectedDate)
                : getUTCDateRangeForLocalDate(selectedDate);

            startTransition(async () => {
              const result = await getDaySessions({
                employeeId,
                startUTC,
                endUTC,
              });

              if (result.success) {
                setSelectedDaySessions(result.data);
                setSelectedDate(selectedDate);
                setShowDaySessionsModal(true);
              } else {
                toast.error(result.error || "Failed to load day sessions");
              }
            });
          };

          return (
            <div
              key={`day-${day}`}
              onClick={handleDayClick}
              className={`
                h-32 border border-gray-300 rounded-[4px] p-2 cursor-pointer transition-all duration-200 
                flex flex-col justify-between
                ${
                  isToday
                    ? "bg-blue-50 border-blue-300 hover:bg-blue-100"
                    : "bg-white hover:bg-gray-50"
                } 
                ${
                  dayStats.totalTime > 0
                    ? "border-green-200"
                    : "border-gray-200"
                }
                hover:shadow-md
              `}
            >
              {/* Top Row: Day Number */}
              <div
                className={`text-right text-xs font-semibold ${
                  isToday ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {day}
              </div>

              {/* KPI: Total Hours */}
              {dayStats.totalTime > 0 ? (
                <>
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-sm font-bold text-green-600">
                      {formatTime(dayStats.totalTime)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Total Hours
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="text-xs space-y-1 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiActivity size={11} className="text-gray-400" />
                        Active
                      </span>
                      <span className="font-medium text-gray-700">
                        {formatTime(dayStats.totalActiveTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiTrendingUp
                          size={11}
                          className={
                            dayStats.activePercentage >= 80
                              ? "text-green-500"
                              : dayStats.activePercentage >= 60
                              ? "text-yellow-500"
                              : "text-red-500"
                          }
                        />
                        Productivity
                      </span>
                      <span
                        className={`px-1 py-0.5 rounded-[4px] text-[10px] font-semibold ${
                          dayStats.activePercentage >= 80
                            ? "bg-green-100 text-green-700"
                            : dayStats.activePercentage >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {dayStats.activePercentage}%
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs italic">
                  No activity
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
