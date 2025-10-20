"use client";
import { useState } from "react";
import { FiCalendar, FiMessageCircle } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import ParticipantsAvatars from "./ParticipantsAvatars";
import useTickets from "@/hooks/useTickets";
import Link from "next/link";
import useProfileClient from "@/lib/useProfileclient";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const TicketsList = () => {
  const { ticketsData, isLoadingTickets } = useTickets();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const profile = useProfileClient();
  const axiosSecure = useAxiosSecure();
  const employeeId = profile?._id;

  // Priority and Status options
  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "high",
      label: "High",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  const statusOptions = [
    {
      value: "open",
      label: "Open",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "resolved",
      label: "Resolved",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "closed",
      label: "Closed",
      color: "bg-gray-200 text-gray-900 border-gray-200",
    },
    {
      value: "reopened",
      label: "Reopened",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  ];

  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  // Hook to fetch comments count for each ticket
  const useCommentsCount = (ticketId) => {
    return useQuery({
      queryKey: ["ticketComments", ticketId],
      queryFn: async () => {
        const response = await axiosSecure.get(
          `/api/v1/ticket/get-messages/${ticketId}`
        );
        return response.data.data || [];
      },
      enabled: !!ticketId,
      staleTime: 30000, // Cache for 30 seconds
    });
  };

  // Component to display comment count
  const CommentCount = ({ ticketId }) => {
    const { data: comments = [] } = useCommentsCount(ticketId);
    return (
      <div className="flex items-center gap-1">
        <FiMessageCircle className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600">{comments.length}</span>
      </div>
    );
  };

  // Function to get file icon based on file type
  const getFileIcon = (filename, type) => {
    const extension = type || filename.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📊";
      case "txt":
        return "📄";
      case "zip":
      case "rar":
        return "📦";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return null; // Will show image preview
      default:
        return "📎";
    }
  };

  // Function to check if file is an image
  const isImageFile = (filename, type) => {
    const extension = type || filename.split(".").pop().toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension);
  };

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle description expansion
  const toggleDescription = (ticketId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  if (isLoadingTickets) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tickets = ticketsData?.tickets?.data || [];

  return (
    <div className="px-5">
      {/* Tickets Grid */}
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            href={`/tickets/${ticket._id}`}
            className="block bg-white border border-gray-200 rounded-[4px] hover:shadow-md hover:bg-gray-50 duration-300 transition-shadow overflow-hidden cursor-pointer"
          >
            <div className="p-4">
              {/* Header with Creator Info, Date, and Status/Priority */}
              <div className="flex items-start justify-between mb-4">
                {/* Left: Creator Info and Date */}
                <div className="flex items-center gap-3">
                  {/* Creator Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ticket?.createdBy?.avatar ? (
                      <img
                        src={ticket?.createdBy?.avatar}
                        alt={ticket?.createdBy?.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-medium text-gray-600">
                        {ticket?.createdBy?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Creator Name and Date */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {ticket?.createdBy?.name || "Unknown User"}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDateTime(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status and Priority */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-sm font-medium border ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {priorityOptions.find(
                      (opt) => opt.value === ticket.priority
                    )?.label || ticket.priority}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-sm font-medium border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {statusOptions.find((opt) => opt.value === ticket.status)
                      ?.label || ticket.status}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-3">
                {ticket?.title}
              </h3>

              {/* Description with See More */}
              <div className="mb-3">
                <p className="text-gray-700 leading-relaxed">
                  {expandedDescriptions[ticket._id] ||
                  ticket?.description?.length <= 200
                    ? ticket?.description
                    : `${ticket?.description?.slice(0, 200)}...`}
                </p>
                {ticket?.description?.length > 200 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDescription(ticket._id);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium mt-1 transition-colors"
                  >
                    {expandedDescriptions[ticket._id] ? "See less" : "See more"}
                  </button>
                )}
              </div>

              {/* Attachments Display - Large Size */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {ticket.attachments.slice(0, 4).map((attachment, index) => (
                      <div key={index} className="relative group">
                        {isImageFile(attachment.filename, attachment.type) ? (
                          // Image Preview - Large
                          <div className="relative">
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="w-full h-24 sm:h-28 object-cover rounded-[4px] border border-gray-200 hover:opacity-80 transition-opacity group-hover:shadow-lg duration-300"
                            />
                            {/* Overlay for additional files */}
                            {index === 3 && ticket.attachments.length > 4 && (
                              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-[4px] flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  +{ticket.attachments.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          // File Icon - Large
                          <div
                            className="w-full h-24 sm:h-28 bg-gray-50 border border-gray-200 rounded-[4px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors group-hover:shadow-lg duration-300"
                            title={attachment.filename}
                          >
                            <span className="text-2xl mb-1">
                              {getFileIcon(
                                attachment.filename,
                                attachment.type
                              )}
                            </span>
                            <span className="text-xs text-gray-600 text-center px-2 leading-tight">
                              {attachment.type?.toUpperCase() || "FILE"}
                            </span>
                            <span className="text-xs text-gray-500 text-center px-2 leading-tight truncate w-full">
                              {attachment.filename.length > 12
                                ? `${attachment.filename.slice(0, 12)}...`
                                : attachment.filename}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer with Comments Count, Division, and Tags */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {/* Left: Comments Count and Division */}
                <div className="flex items-center gap-7">
                  {/* Comments Count */}
                  <CommentCount ticketId={ticket._id} />

                  {/* Division */}
                  {ticket?.division?.roleName ? (
                    <div className="flex items-center gap-1">
                      <FaRegBuilding className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {ticket?.division?.roleName}
                      </span>
                    </div>
                  ) : ticket?.participants ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      {/* <HiOutlineUserGroup className="h-5 w-5" /> */}
                      <ParticipantsAvatars
                        participants={ticket?.participants.filter(
                          (id) => id !== employeeId
                        )}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <FaRegBuilding className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">N/A</span>
                    </div>
                  )}
                </div>

                {/* Right: Tags */}
                <div className="flex flex-wrap gap-2 justify-end">
                  {ticket.tags && ticket.tags.length > 0 ? (
                    ticket.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md font-medium bg-white text-gray-700 border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No tags</span>
                  )}
                  {ticket.tags && ticket.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      +{ticket.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No tickets found
          </h3>
          <p className="text-gray-500">
            Get started by creating your first ticket.
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketsList;
