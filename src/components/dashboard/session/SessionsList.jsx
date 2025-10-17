"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import {
  ArrowUpDown,
  Clock,
  BarChart3,
  Laptop,
  Link as LinkIcon,
  Eye,
} from "lucide-react";
import { TbCalendarClock } from "react-icons/tb";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { HiMiniXMark } from "react-icons/hi2";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { useRouter } from "next/navigation";
import CalendarView from "./CalendarView";
import SessionDetailsModal from "./SessionDetailsModal";
import DaySessionsModal from "./DaySessionsModal";
import DateRangeSelector from "./DateRangeSelector";
import SortFilterDropdown from "./SortFilterDropdown";
import ViewModeSelector from "./ViewModeSelector";
import TimelineView from "./TimelineView";
import WeeklyCalendarView from "./WeeklyCalendarView";
import FormattedTime from "./FormattedTime";

// Format time from seconds to hours and minutes
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const formatDateDisplay = (dateString, timezone = null) => {
  if (!dateString) return "";
  try {
    const displayTimeZone =
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
  } catch {
    return "Invalid date";
  }
};

const SessionsList = ({ initialData, employee, user }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortField, setSortField] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRange, setDateRange] = useState("today");
  const [previousDateRange, setPreviousDateRange] = useState("today");

  const localDate = new Date().toLocaleDateString("en-CA");
  const [startDate, setStartDate] = useState(localDate);
  const [endDate, setEndDate] = useState(localDate);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDaySessionsModal, setShowDaySessionsModal] = useState(false);
  const [selectedDaySessions, setSelectedDaySessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [isManual, setIsManual] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Dhaka");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Handle preset date ranges automatically
  useEffect(() => {
    // Skip if dateRange is custom (user manually sets dates)
    if (dateRange === "custom") return;

    const today = new Date();

    switch (dateRange) {
      case "today": {
        const todayDate = format(today, "yyyy-MM-dd");
        setStartDate(todayDate);
        setEndDate(todayDate);
        break;
      }

      case "yesterday": {
        const yesterday = subDays(today, 1);
        const yesterdayDate = format(yesterday, "yyyy-MM-dd");
        setStartDate(yesterdayDate);
        setEndDate(yesterdayDate);
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

      default:
        break;
    }
  }, [dateRange]);

  // Handle view mode change
  const handleViewModeChange = (newViewMode) => {
    if (dateRange === "custom" && newViewMode === "calendar") {
      setViewMode("weekly");
      return;
    }

    if (newViewMode === "calendar" && viewMode !== "calendar") {
      // Switching TO calendar view
      setPreviousDateRange(dateRange);
      setDateRange("month");
      // Dates will be set by the useEffect above
    } else if (
      viewMode === "calendar" &&
      (newViewMode === "list" || newViewMode === "timeline")
    ) {
      // Switching FROM calendar view
      setDateRange(previousDateRange);
      // Dates will be set by the useEffect above
    }

    setViewMode(newViewMode);
  };

  // Auto-switch view mode based on date range
  useEffect(() => {
    if (dateRange === "custom") {
      setViewMode("weekly");
    } else if (
      dateRange === "today" ||
      dateRange === "yesterday" ||
      dateRange === "week"
    ) {
      setViewMode("list");
    } else if (dateRange === "month") {
      setViewMode("calendar");
    }
  }, [dateRange]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (isManual) params.set("isManual", isManual);
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (sortField) params.set("sortField", sortField);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (timezone) params.set("timezone", timezone);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [
    startDate,
    endDate,
    isManual,
    searchTerm,
    page,
    limit,
    sortField,
    sortOrder,
    timezone,
  ]);

  // Handle delete session
  const handleDeleteSession = async (sessionId) => {
    startTransition(async () => {
      const result = await deleteSession(sessionId);

      if (result.success) {
        toast.success("Session deleted successfully!");
        setShowDetailsModal(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete session");
      }
    });
  };

  // Handle view session
  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const displaySessions = initialData?.sessions || [];
  const { totalActiveTime, totalIdleTime, totalTime, activePercentage } =
    initialData?.statistics || {};

  return (
    <div className="p-2 space-y-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="flex flex-col lg:flex-row justify-start items-start gap-4 px-2 sm:px-2 md:px-2 border-l-2 border-blue-500">
          <h2 className="max-w-full sm:max-w-md md:max-w-lg text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center lg:text-left leading-tight tracking-tight">
            {employee ? `${employee.employeeName}'s Sessions` : "Sessions"}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap justify-start gap-4">
          {/* Manual Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manually Added
            </label>
            <button
              onClick={() => setIsManual((prev) => !prev)}
              className={`flex items-center px-2 py-[10px] rounded-[4px] border transition-all ${
                isManual
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              <span className="xl:mr-2">
                {isManual ? <IoMdCheckmark /> : <HiMiniXMark />}
              </span>
              <span className="text-sm whitespace-nowrap w-auto">
                Show Manual
              </span>
            </button>
          </div>

          <DateRangeSelector
            dateRange={dateRange}
            setDateRange={setDateRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            defaultTime={localDate}
          />

          <SortFilterDropdown
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <ViewModeSelector
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
          />

          {/* Timezone Toggle */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mt-auto">
              <div className="inline-flex rounded-[4px] border border-blue-600 bg-blue-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setTimezone("America/New_York")}
                  className={`px-[12px] py-[10.5px] text-sm font-semibold transition-colors duration-200 ${
                    timezone === "America/New_York"
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  America/New_York
                </button>
                <button
                  onClick={() => setTimezone("Asia/Dhaka")}
                  className={`px-[12px] py-[10.5px] text-sm font-semibold transition-colors duration-200 ${
                    timezone === "Asia/Dhaka"
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Asia/Dhaka
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border border-blue-300 hover:border-blue-500 transition-all duration-700 shadow-blue-100/70 hover:shadow-blue-100 hover:scale-[103%]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatTime(totalTime || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TbCalendarClock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-green-300 hover:border-green-500 transition-all duration-700 shadow-green-100/70 hover:shadow-green-100 hover:scale-[103%]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Time</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatTime(totalActiveTime || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-300 hover:border-yellow-500 transition-all duration-700 shadow-yellow-100/70 hover:shadow-yellow-100 hover:scale-[103%]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Idle Time</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatTime(totalIdleTime || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FiXCircle size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-300 hover:border-indigo-500 transition-all duration-700 shadow-indigo-100/70 hover:shadow-indigo-100 hover:scale-[103%]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Productivity</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {activePercentage || 0}%
              </h3>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <BarChart3 size={24} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${activePercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
          {displaySessions.length === 0 ? (
            <div className="p-8 text-center">
              <TbCalendarClock
                size={48}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Sessions Found
              </h3>
              <p className="text-gray-500 mb-6">
                No sessions available for the selected date range.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100/70 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        if (sortField === "startTime") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("startTime");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Start Time</span>
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Idle Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displaySessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          {formatDateDisplay(session.createdAt, timezone)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          {session.endTime ? (
                            formatDateDisplay(session.updatedAt, timezone)
                          ) : (
                            <p className="text-sm text-green-600 font-medium">
                              Session Running
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCheckCircle
                            size={16}
                            className="mr-2 text-green-500"
                          />
                          <FormattedTime seconds={session.activeTime} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiXCircle
                            size={16}
                            className="mr-2 text-yellow-500"
                          />
                          <FormattedTime seconds={session.idleTime} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock size={16} className="mr-2 text-blue-500" />
                          <FormattedTime
                            seconds={session.activeTime + session.idleTime}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {session.isManual && (
                            <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-[4px]">
                              <FaRegCheckCircle size={12} className="mr-1" />
                              <span>Manual</span>
                            </div>
                          )}
                          {session.applications?.length > 0 && (
                            <div className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              <Laptop size={12} className="mr-1" />
                              <span>{session.applications.length}</span>
                            </div>
                          )}
                          {session.links?.length > 0 && (
                            <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              <LinkIcon size={12} className="mr-1" />
                              <span>{session.links.length}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MdOutlineStickyNote2
                            size={16}
                            className="mr-2 text-gray-500"
                          />
                          {session.userNote ? (
                            <div className="flex items-center text-xs">
                              <span className="text-xs text-gray-600">
                                {(() => {
                                  const words =
                                    session.userNote?.split(" ") || [];
                                  const firstLine = words.slice(0, 5).join(" ");
                                  const secondLine = words
                                    .slice(5, 9)
                                    .join(" ");
                                  const needsEllipsis = words.length > 9;

                                  return (
                                    <>
                                      {firstLine}
                                      <br />
                                      {secondLine}
                                      {needsEllipsis ? "..." : ""}
                                    </>
                                  );
                                })()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600 line-clamp-1">
                              No Notes
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewSession(session)}
                            className="p-1.5 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors border border-blue-300 shadow-md shadow-blue-100"
                            title="View Session"
                            disabled={isPending}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination for List View */}
      {viewMode === "list" && displaySessions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border border-t-0 border-gray-300 bg-white rounded-b-[4px]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to first page when changing limit
              }}
              className="px-2 py-1 border border-gray-300 rounded-[4px] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, initialData?.metadata?.totalSessions || 0)}{" "}
            of {initialData?.metadata?.totalSessions || 0} entries
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isPending}
              className="px-4 py-2 border border-gray-300 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>

            {[...Array(initialData?.metadata?.totalPages || 0)].map(
              (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  disabled={isPending}
                  className={`px-4 py-2 border border-gray-300 rounded-[4px] ${
                    page === idx + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(initialData?.metadata?.totalPages || 1, p + 1)
                )
              }
              disabled={
                page === (initialData?.metadata?.totalPages || 1) || isPending
              }
              className="px-4 py-2 border border-gray-300 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <TimelineView
          sessions={displaySessions}
          onViewSession={handleViewSession}
          timezone={timezone}
        />
      )}

      {/* Pagination for Timeline View */}
      {viewMode === "timeline" && displaySessions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border border-t-0 border-gray-300 bg-white rounded-b-[4px]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded-[4px] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, initialData?.metadata?.totalSessions || 0)}{" "}
            of {initialData?.metadata?.totalSessions || 0} entries
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isPending}
              className="px-4 py-2 border border-gray-300 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>

            {[...Array(initialData?.metadata?.totalPages || 0)].map(
              (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  disabled={isPending}
                  className={`px-4 py-2 border border-gray-300 rounded-[4px] ${
                    page === idx + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(initialData?.metadata?.totalPages || 1, p + 1)
                )
              }
              disabled={
                page === (initialData?.metadata?.totalPages || 1) || isPending
              }
              className="px-4 py-2 border border-gray-300 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <CalendarView
          sessions={displaySessions}
          timezone={timezone}
          onViewSession={handleViewSession}
          setSelectedDaySessions={setSelectedDaySessions}
          setSelectedDate={setSelectedDate}
          setShowDaySessionsModal={setShowDaySessionsModal}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          currentStartDate={startDate}
          currentEndDate={endDate}
          employeeId={employee?.employeeId || user?.employeeId}
        />
      )}

      {/* Weekly Calendar View */}
      {viewMode === "weekly" && (
        <WeeklyCalendarView
          startDate={startDate}
          endDate={endDate}
          employeeId={employee?.employeeId || user?.employeeId}
          timezone={timezone}
          onViewSession={handleViewSession}
          setSelectedDaySessions={setSelectedDaySessions}
          setSelectedDate={setSelectedDate}
          setShowDaySessionsModal={setShowDaySessionsModal}
        />
      )}

      {showDetailsModal && selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          user={user}
          onClose={() => setShowDetailsModal(false)}
          onDelete={handleDeleteSession}
          timezone={timezone}
        />
      )}

      {/* Day Sessions Modal */}
      {showDaySessionsModal && (
        <DaySessionsModal
          sessions={selectedDaySessions}
          date={selectedDate}
          onClose={() => setShowDaySessionsModal(false)}
          timezone={timezone}
          onViewSession={(session) => {
            setShowDaySessionsModal(false);
            handleViewSession(session);
          }}
        />
      )}
    </div>
  );
};

export default SessionsList;
