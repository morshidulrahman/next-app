"use client";
/* eslint-disable react/prop-types */
import { formatToTimeOnly } from "@/utils/formatTime";
import { useEffect, useState } from "react";

const StatusTimeline = ({ ticket }) => {
  const [statusHistory, setStatusHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status configurations for colors and labels
  const statusConfig = {
    open: {
      label: "Open",
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    "in-progress": {
      label: "In Progress",
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
    resolved: {
      label: "Resolved",
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    closed: {
      label: "Closed",
      color: "bg-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
    },
    reopened: {
      label: "Reopened",
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
  };

  // Fetch status history from the ticket data directly
  useEffect(() => {
    if (ticket && ticket.statusHistory) {
      setStatusHistory(ticket.statusHistory);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [ticket]);

  // Format time only
  const formatTime = (dateString) => {
    return formatToTimeOnly(dateString);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get status action text
  const getStatusAction = (status, index) => {
    if (index === 0) {
      return "Created";
    }

    switch (status) {
      case "open":
        return "Opened";
      case "in-progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      case "reopened":
        return "Reopened";
      default:
        return statusConfig[status]?.label || status;
    }
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 -mt-1 border-b pb-2">
          Status Timeline
        </h3>
        <div className="animate-pulse space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900  mb-3 -mt-1 border-b pb-2">
        Status Timeline
      </h3>

      <div className="relative">
        {statusHistory.length === 0 ? (
          <p className="text-gray-500  text-sm">No timeline data available</p>
        ) : (
          <div className="space-y-4">
            {statusHistory.map((entry, index) => {
              const config = statusConfig[entry.status] || statusConfig["open"];
              const isLast = index === statusHistory.length - 1;
              const isFirst = index === 0;

              return (
                <div
                  key={entry._id || index}
                  className="relative flex items-start gap-3"
                >
                  {/* Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-[5px] top-6 w-[2px] h-[50px] bg-gray-200"></div>
                  )}

                  {/* Status Dot */}
                  <div
                    className={`w-3 h-3 rounded-full ${config.color} relative z-10 flex-shrink-0 mt-2`}
                  ></div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    {/* Status Action */}
                    <div className="flex items-center justify-between mb-1">
                      {/* current status */}
                      <span className="text-sm font-medium text-gray-900 ">
                        {getStatusAction(entry.status, index)}
                      </span>

                      {/* date & time */}
                      <div className="flex flex-col items-end text-xs text-gray-500 ">
                        <span>{formatTime(entry.timestamp)}</span>
                        <span>{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>

                    {/* User Info - Skip for first entry (creation) as it's handled by main ticket info */}
                    {!isFirst && entry.name && (
                      <div className="flex items-center gap-2 mt-1">
                        {/* User Avatar */}
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {entry.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>

                        {/* User Name - Clickable link */}
                        <span className="text-xs text-gray-600">
                          by{" "}
                          <span
                            // to={`/dashboard/user/${entry.userName}`}
                            className="font-bold"
                            // onClick={(e) => e.stopPropagation()}
                          >
                            {entry.name}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Show creator info for first entry */}
                    {isFirst && ticket.createdBy && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {ticket.createdBy.avatar ? (
                            <img
                              src={ticket.createdBy.avatar}
                              alt={ticket.createdBy.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {ticket.createdBy.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600">
                          by{" "}
                          <span
                            // to={`/dashboard/user/${ticket.createdBy.username}`}
                            className="font-bold"
                            // onClick={(e) => e.stopPropagation()}
                          >
                            {ticket.createdBy.name}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Future Timeline Dot - Only show if ticket is not closed */}
            {ticket.status !== "closed" && (
              <div className="relative flex items-start gap-3 opacity-50">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white relative z-10 flex-shrink-0 mt-1"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-400">Next update...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTimeline;
