"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
} from "date-fns";
import { FiActivity, FiTrendingUp } from "react-icons/fi";
import { toast } from "sonner";
import { getWeeklyCalendarStats } from "@/actions/sessions";

// Format time from seconds to hours and minutes
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Get current date in specified timezone
const getCurrentDateInTimezone = (timezone) => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find((part) => part.type === "year").value);
  const month = parseInt(parts.find((part) => part.type === "month").value) - 1;
  const day = parseInt(parts.find((part) => part.type === "day").value);

  return new Date(year, month, day);
};

const LoadingComponent = () => (
  <div className="h-32 border rounded-[4px] p-2 flex flex-col justify-center items-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
  </div>
);

const WeeklyCalendarView = ({
  startDate,
  endDate,
  employeeId,
  timezone,
  onViewSession,
  setSelectedDaySessions,
  setSelectedDate,
  setShowDaySessionsModal,
}) => {
  const [isPending, startTransition] = useTransition();
  const [calendarStats, setCalendarStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate calendar weeks from start to end date
  const weeks = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const weekStart = startOfWeek(start, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(end, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeksArray = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArray.push(days.slice(i, i + 7));
    }

    return weeksArray;
  }, [startDate, endDate]);

  // Fetch calendar stats when date range or timezone changes
  useEffect(() => {
    const fetchCalendarStats = async () => {
      if (!employeeId) return;

      setIsLoading(true);
      startTransition(async () => {
        const result = await getWeeklyCalendarStats({
          employeeId,
          startDate,
          endDate,
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
  }, [employeeId, startDate, endDate, timezone]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isInSelectedRange = (date) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return date >= start && date <= end;
  };

  return (
    <div className="bg-white rounded-[4px] shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(parseISO(startDate), "MMMM dd")} -{" "}
          {format(parseISO(endDate), "MMMM dd, yyyy")} ({timezone})
        </h3>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-4 mb-4">
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
      )}

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

        {/* Calendar days */}
        {isLoading
          ? Array.from({ length: weeks.flat().length }).map((_, index) => (
              <LoadingComponent key={`loader-${index}`} />
            ))
          : weeks.flat().map((date, index) => {
              const dayKey = format(date, "yyyy-MM-dd");
              const isInRange = isInSelectedRange(date);

              // Check if today in the SELECTED timezone
              const todayInTimezone = getCurrentDateInTimezone(timezone);
              const isToday =
                todayInTimezone.getDate() === date.getDate() &&
                todayInTimezone.getMonth() === date.getMonth() &&
                todayInTimezone.getFullYear() === date.getFullYear();

              // Get stats for this day from calendarStats
              const dayStats = calendarStats[dayKey] || {
                totalActiveTime: 0,
                totalIdleTime: 0,
                totalTime: 0,
                activePercentage: 0,
                sessions: [],
              };

              const handleDayClick = async () => {
                if (!isInRange || dayStats.totalTime === 0 || isPending) return;

                console.log("Selected date:", dayKey);

                try {
                  // Use the sessions already fetched and grouped
                  setSelectedDaySessions(dayStats.sessions || []);
                  setSelectedDate(dayKey);
                  setShowDaySessionsModal(true);
                } catch (error) {
                  console.error("Error setting day sessions:", error);
                  toast.error("Failed to load day sessions");
                }
              };

              return (
                <div
                  key={`day-${index}`}
                  onClick={handleDayClick}
                  className={`
                    h-32 border rounded-[4px] p-2 transition-all duration-200 
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
                    ${
                      !isInRange
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    ${isPending ? "opacity-50 cursor-wait" : ""}
                    hover:shadow-md
                  `}
                >
                  {/* Top Row: Day Number */}
                  <div
                    className={`text-right text-xs font-semibold ${
                      isToday ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {format(date, "d")}
                  </div>

                  {/* KPI: Total Hours */}
                  {isInRange && dayStats.totalTime > 0 ? (
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
                  ) : isInRange ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs italic">
                      No activity
                    </div>
                  ) : null}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default WeeklyCalendarView;
