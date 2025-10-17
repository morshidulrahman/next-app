"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  IoCaretDownSharp,
  IoCloseOutline,
  IoImageOutline,
  IoLinkOutline,
  IoSendSharp,
} from "react-icons/io5";
import { MdOutlineNoteAlt } from "react-icons/md";
import { toast } from "sonner";
import io from "socket.io-client";
import { AiOutlineDelete } from "react-icons/ai";
import { GoLink } from "react-icons/go";
import useProfileClient from "@/lib/useProfileclient.js";
import useAxiosSecure from "@/hooks/useAxiosSecure.jsx";
import useAxiosSecureAuth from "@/hooks/useAxiosSecureAuth.jsx";
import RichCommentInput from "./RichCommentInput.jsx";
import "./RichCommentInput.css";
import ParticipantsAvatars from "./ParticipantsAvatars.jsx";
import StatusTimeline from "./StatusTimeline.jsx";
import { formatToTimeOnly } from "@/utils/formatTime.js";
import Link from "next/link.js";
import useTickets from "@/hooks/useTickets.js";
import {
  getTicetMessage,
  sendMessage,
  uploadFileToRemoteIntegrity,
} from "@/actiions/ticket.js";
import LoadingSpinner from "../Loading.jsx";

const TicketReply = ({ id, user, exitingMessage }) => {
  const { formatDate } = useTickets();
  const axiosSecure = useAxiosSecure();
  const axiosSecureAuth = useAxiosSecureAuth();
  const socket = useRef(null);

  // Comment system states
  const [messages, setMessages] = useState(exitingMessage);
  const [newComment, setNewComment] = useState("");

  // User mention states
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [isSearchingMentions, setIsSearchingMentions] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);

  // Updated file states for multiple files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const commentsEndRef = useRef(null);
  // const textareaRef = useRef(null);
  const richInputRef = useRef(null);
  const mentionDropdownRef = useRef(null);

  const [expandedDropdowns, setExpandedDropdowns] = useState({});
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Refs for dropdowns - using ref object to store multiple refs
  const dropdownRefs = useRef({});
  const optionsMenuRef = useRef(null);

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
      label: "Reopen",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  ];

  // FETCH TICKET DATA
  const {
    data: singleTicket = [],
    refetch: singleTicketRefetch,
    isFetching: isFetchingSingleTicket,
    isLoading: isLoadingSingleTicket,
  } = useQuery({
    queryKey: ["singleTicket", id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/v1/ticket/get-ticket-employee/${id}`
      );
      return res.data;
    },
  });

  // Search users for mentions
  const searchUsers = async (searchTerm = "") => {
    setIsSearchingMentions(true);
    try {
      const response = await axiosSecureAuth.get(`/api/v1/users`, {
        params: {
          globalSearch: searchTerm,
          sortBy: "createdAt",
          order: "desc",
          isDeleted: false,
          page: 1,
          limit: 10,
        },
      });

      if (response.status === 200) {
        const allUsers = response.data.data.data || [];
        // Filter out already mentioned users and current user
        const filteredUsers = allUsers.filter(
          (searchUser) =>
            !mentionedUsers.some(
              (mentioned) => mentioned.username === searchUser.username
            ) && searchUser._id !== user._id
        );
        setMentionSuggestions(filteredUsers);
      } else {
        setMentionSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setMentionSuggestions([]);
    } finally {
      setIsSearchingMentions(false);
    }
  };

  // Handle textarea input change
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;

    setNewComment(value);
    setCursorPosition(position);

    // Check for @ mention
    const textBeforeCursor = value.substring(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Check if there's a space or newline after @ (which would end the mention)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionStartIndex(lastAtIndex);
        setMentionSearchTerm(textAfterAt);
        setShowMentionDropdown(true);
        searchUsers(textAfterAt);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Handle mention selection
  const handleMentionSelect = (selectedUser) => {
    const beforeMention = newComment.substring(0, mentionStartIndex);
    const afterCursor = newComment.substring(cursorPosition);
    const newText = beforeMention + `@${selectedUser.username} ` + afterCursor;

    setNewComment(newText);
    setMentionedUsers((prev) => [...prev, selectedUser]);
    setShowMentionDropdown(false);
    setMentionSuggestions([]);

    // Focus back to rich input and set cursor position
    setTimeout(() => {
      if (richInputRef.current) {
        const newCursorPosition =
          beforeMention.length + selectedUser.username.length + 2; // +2 for @ and space
        richInputRef.current.focus();
        richInputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  // Extract mentioned users from comment text
  const extractMentionedUsers = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      const mentionedUser = mentionedUsers.find(
        (user) => user.username === username
      );
      if (mentionedUser) {
        mentions.push(mentionedUser._id);
      }
    }

    return mentions;
  };

  // Render comment content with clickable mentions
  const renderCommentContent = (content, participants = []) => {
    if (!content) return "";

    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a username
        return (
          <Link
            key={index}
            href={`/dashboard/user/${part}`}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            @{part}
          </Link>
        );
      }
      return part;
    });
  };

  // Setup socket connection
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_SOCKET_URL);

    socket.current.on("connect", () => {
      socket.current.emit("joinTicket", { ticketId: id });
    });

    socket.current.on("disconnect", () => {
      console.log(" Socket disconnected");
    });

    socket.current.on("message", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    socket.current.on("ticketMessage", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    socket.current.on("newComment", (newMessage) => {
      console.log("📩 New comment received:", newMessage);
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle clicks outside dropdowns and options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown clicks
      Object.keys(dropdownRefs.current).forEach((key) => {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target)) {
          setExpandedDropdowns((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });

      // Handle options menu clicks
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }

      // Handle mention dropdown clicks
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(event.target)
      ) {
        setShowMentionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Updated file handling functions for multiple files
  const handleFileSelect = (event, type) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const newFiles = files.map((file) => {
      const fileId = Date.now() + Math.random(); // Generate unique ID
      let preview = null;

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, preview: e.target.result } : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      return {
        id: fileId,
        file,
        type: file.type.startsWith("image/") ? "image" : "file",
        preview: null,
        name: file.name,
        size: file.size,
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset input values
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const uploadFile = async (file, fileId) => {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Update progress to show upload starting
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      const response = await uploadFileToRemoteIntegrity(formData);
      // Update progress to show upload complete
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

      return response;
    } catch (error) {
      console.log("File upload error:", error.message);
      // Remove progress on error
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      throw error;
    }
  };

  //handleSendComment function

  // Alternative solution - Refetch messages after sending
  const handleSendComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() && selectedFiles.length === 0) return;

    setIsSending(true);

    try {
      let attachments = [];

      // Upload files logic (same as before)
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (selectedFile) => {
          try {
            const uploadedFile = await uploadFile(
              selectedFile.file,
              selectedFile.id
            );
            const filename = uploadedFile.data.key.split("/").pop();
            const fileExtension = filename.split(".").pop().toLowerCase();

            return {
              filename: filename,
              url: uploadedFile.data.url,
              type: fileExtension,
              size: selectedFile.file.size,
            };
          } catch (error) {
            console.error(`Failed to upload ${selectedFile.name}:`, error);
            toast.error(`Failed to upload ${selectedFile.name}`);
            return null;
          }
        });

        const uploadResults = await Promise.all(uploadPromises);
        attachments = uploadResults.filter((result) => result !== null);
      }

      // Extract mentioned user IDs from the comment
      const participants = extractMentionedUsers(newComment);

      const payload = {
        ticketId: id,
        sender: user?._id,
        content: newComment.trim(),
        attachments,
        participants,
      };

      const response = await sendMessage(payload);

      // Instead of adding to local state, refetch messages to get complete data
      if (response.data && response.data.data) {
        // Refetch messages to get the complete data with role information
        try {
          const messagesResponse = await getTicetMessage(id);
          setMessages(messagesResponse.data.data || []);
        } catch (err) {
          console.error("Error refetching messages", err);
          // Fallback to adding the message locally if refetch fails
          const sentMessage = response.data.data;
          setMessages((prev) => {
            if (prev.some((msg) => msg._id === sentMessage._id)) {
              return prev;
            }
            return [...prev, sentMessage];
          });
        }
      }

      // Reset form
      setNewComment("");
      setSelectedFiles([]);
      setUploadProgress({});
      setMentionedUsers([]);
      setShowMentionDropdown(false);

      toast.success("Comment sent successfully");
    } catch (error) {
      console.error("Failed to send comment", error);
      toast.error("Failed to send comment");
    } finally {
      setIsSending(false);
    }
  };

  // Helper function to get file type icon
  const getFileTypeIcon = (file) => {
    if (file.file.type.startsWith("image/")) {
      return "🖼️";
    } else if (file.file.type.includes("pdf")) {
      return "📄";
    } else if (
      file.file.type.includes("word") ||
      file.file.type.includes("document")
    ) {
      return "📝";
    } else if (
      file.file.type.includes("sheet") ||
      file.file.type.includes("excel")
    ) {
      return "📊";
    } else if (
      file.file.type.includes("zip") ||
      file.file.type.includes("rar")
    ) {
      return "📦";
    } else {
      return "📎";
    }
  };

  // Function to get file icon based on file type (for attachments)
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
        return "🖼️";
      default:
        return "📎";
    }
  };

  // Function to check if file is an image
  const isImageFile = (filename, type) => {
    const extension = type || filename.split(".").pop().toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension);
  };

  // Function to get available status options based on current status
  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  // Copy link function
  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard");
      setShowOptionsMenu(false);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  if (isLoadingSingleTicket) {
    return <LoadingSpinner />;
  }

  const ticket = singleTicket?.data || {};
  // console.log("from Ticket reply: ", ticket, user);
  // const hasTicketAccess = ticket?.participants.includes(user?.id)
  const hasTicketAccess = ticket?.createdBy?._id === user?._id;

  return (
    <>
      <div className="flex gap-6 bg-white border border-gray-100 p-3 rounded-[4px]">
        {/* Main Content */}
        <div className="flex-1 space-y-3 flex flex-col">
          <div className="bg-white px-6 py-4 border border-gray-200 rounded-[4px]">
            {/* Ticket Title */}

            <div className="flex items-start justify-between gap-5">
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
            </div>

            {/* Ticket Description and Details */}
            <div className="space-y-3 mt-5">
              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {ticket.description}
              </p>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {ticket.attachments.map((attachment, index) => {
                    const isImage = isImageFile(
                      attachment.filename,
                      attachment.type
                    );

                    return (
                      <div key={index} className="group">
                        {isImage ? (
                          // Full Image Display
                          <div className="relative">
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="w-full h-48 object-cover rounded-[4px] border border-gray-200 hover:opacity-90 transition-opacity group-hover:shadow-lg duration-300 cursor-pointer"
                              onClick={() =>
                                window.open(attachment.url, "_blank")
                              }
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                              {attachment.filename
                                .split(".")
                                .pop()
                                .toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          // File Display
                          <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors group-hover:shadow-md duration-300 h-48 flex-col justify-center">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-2xl">
                                {getFileIcon(
                                  attachment.filename,
                                  attachment.type
                                )}
                              </span>
                            </div>
                            <div className="text-center">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline block"
                                title={attachment.filename}
                              >
                                {attachment.filename.length > 20
                                  ? `${attachment.filename.slice(0, 20)}...`
                                  : attachment.filename}
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                {attachment.type?.toUpperCase() || "FILE"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {attachment.size
                                  ? `${(attachment.size / 1024 / 1024).toFixed(
                                      2
                                    )} MB`
                                  : "Unknown size"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col pt-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold mb-5 text-gray-800">
                Responses
              </h3>
              <hr className="flex-1 border-t border-gray-200 mb-5 mr-3" />
            </div>

            {/* Multiple Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <div className="border border-gray-300 rounded-[4px] p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <button
                      type="button"
                      onClick={removeAllFiles}
                      className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                      disabled={isSending}
                    >
                      Remove All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((fileObj) => (
                      <div
                        key={fileObj.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {fileObj.preview ? (
                            <img
                              src={fileObj.preview}
                              alt="Preview"
                              className="w-10 h-10 object-cover rounded border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">
                                {getFileTypeIcon(fileObj)}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {fileObj.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(fileObj.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {uploadProgress[fileObj.id] !== undefined && (
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${uploadProgress[fileObj.id]}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(fileObj.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-2 flex-shrink-0"
                          disabled={isSending}
                        >
                          <IoCloseOutline size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-7">
              {/* Comment Input Box */}
              <div className="mb-6 bg-white">
                <div className="border border-gray-300 rounded-[4px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all relative">
                  <form onSubmit={handleSendComment} className="p-3">
                    <div className="relative">
                      {/* <textarea
                                                ref={textareaRef}
                                                placeholder="Add a reply... (Type @ to mention users)"
                                                className="w-full border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-400 min-h-[60px] bg-transparent"
                                                value={newComment}
                                                onChange={handleTextareaChange}
                                                disabled={isSending}
                                                rows={3}
                                            /> */}

                      <RichCommentInput
                        ref={richInputRef}
                        value={newComment}
                        onChange={handleTextareaChange}
                        placeholder="Add a reply... (Type @ to mention users)"
                        disabled={isSending}
                        mentionedUsers={mentionedUsers}
                      />

                      {/* Mention Dropdown */}
                      {showMentionDropdown && (
                        <div
                          ref={mentionDropdownRef}
                          className="absolute z-50 w-full max-w-xs bg-white border border-gray-300 rounded-[4px] shadow-lg max-h-60 overflow-y-auto"
                          style={{
                            top: "50%",
                            left: "0",
                          }}
                        >
                          {isSearchingMentions ? (
                            <div className="p-3 text-center">
                              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                              <p className="text-sm text-gray-500 mt-2">
                                Searching users...
                              </p>
                            </div>
                          ) : mentionSuggestions.length > 0 ? (
                            <div className="py-1">
                              {mentionSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion._id}
                                  type="button"
                                  onClick={() =>
                                    handleMentionSelect(suggestion)
                                  }
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {suggestion.avatar ? (
                                      <img
                                        src={suggestion.avatar}
                                        alt={suggestion.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-sm font-medium text-gray-600">
                                        {suggestion.name
                                          ?.charAt(0)
                                          ?.toUpperCase() || "U"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">
                                      {suggestion.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      @{suggestion.username} •{" "}
                                      {suggestion.position || "No position"}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 text-center text-sm text-gray-500">
                              No users found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors"
                          disabled={isSending}
                          onClick={() => imageInputRef.current?.click()}
                          title="Upload Images"
                        >
                          <IoImageOutline size={18} />
                        </button>

                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors"
                          disabled={isSending}
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload Files"
                        >
                          <IoLinkOutline size={18} />
                        </button>

                        <input
                          type="file"
                          ref={imageInputRef}
                          onChange={(e) => handleFileSelect(e, "image")}
                          accept="image/*"
                          className="hidden"
                          disabled={isSending}
                          multiple
                        />

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileSelect(e, "file")}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar"
                          disabled={isSending}
                          multiple
                        />

                        {selectedFiles.length > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-[4px]">
                            {selectedFiles.length} file
                            {selectedFiles.length !== 1 ? "s" : ""} selected
                          </span>
                        )}

                        {/* {mentionedUsers.length > 0 && (
                                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-[4px]">
                                                        {mentionedUsers.length} user{mentionedUsers.length !== 1 ? 's' : ''} mentioned
                                                    </span>
                                                )} */}
                      </div>

                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-1"
                        disabled={
                          isSending ||
                          !hasTicketAccess ||
                          (!newComment.trim() && selectedFiles.length === 0)
                        }
                        title={`${hasTicketAccess ? "" : "Not Allowed"}`}
                      >
                        <IoSendSharp size={16} />
                        <span>{isSending ? "Sending..." : "Send"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 space-y-2 ">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  messages.map((comment) => {
                    return (
                      <div key={comment._id} className="flex gap-2">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                            {comment.sender?.avatar ? (
                              <img
                                src={comment.sender.avatar}
                                alt={comment.sender.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-white">
                                {comment.sender?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0 mb-5">
                          {/* Header with name and timestamp */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {comment.sender?.name || "Unknown User"}
                            </span>
                            <span className="bg-blue-500 rounded-[6px] px-2 py-0.5 text-white text-xs">
                              {comment?.sender?.roleId?.roleName
                                ? comment.sender.roleId.roleName
                                    .charAt(0)
                                    .toUpperCase() +
                                  comment.sender.roleId.roleName
                                    .slice(1)
                                    .toLowerCase()
                                : "Employee"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}{" "}
                              at {formatToTimeOnly(comment.createdAt)}
                            </span>
                          </div>

                          <div className="bg-white border border-gray-300 p-3 rounded-[4px] hover:shadow-sm duration-300 flex flex-col gap-2 hover:border-blue-300 hover:bg-blue-50">
                            {/* Comment text with mentions */}
                            {comment.content && (
                              <div>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                                  {renderCommentContent(
                                    comment.content,
                                    comment.participants
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Attachments */}
                            {comment.attachments?.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {comment.attachments.map(
                                  (attachment, index) => {
                                    const isImage = isImageFile(
                                      attachment.filename,
                                      attachment.type
                                    );

                                    return (
                                      <div key={index} className="group">
                                        {isImage ? (
                                          // Image Preview
                                          <div className="relative">
                                            <img
                                              src={attachment.url}
                                              alt={attachment.filename}
                                              className="w-full h-32 object-cover rounded-[4px] border border-gray-200 hover:opacity-80 cursor-pointer transition-opacity group-hover:shadow-lg duration-300"
                                              onClick={() =>
                                                window.open(
                                                  attachment.url,
                                                  "_blank"
                                                )
                                              }
                                            />
                                            {/* Overlay for additional files if needed */}
                                            {index === 2 &&
                                              comment.attachments.length >
                                                3 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-[4px] flex items-center justify-center">
                                                  <span className="text-white text-xs font-semibold">
                                                    +
                                                    {comment.attachments
                                                      .length - 3}
                                                  </span>
                                                </div>
                                              )}
                                          </div>
                                        ) : (
                                          // File Icon
                                          <div
                                            className="w-full h-32 bg-gray-50 border border-gray-200 rounded-[4px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors group-hover:shadow-lg duration-300 cursor-pointer"
                                            title={attachment.filename}
                                            onClick={() =>
                                              window.open(
                                                attachment.url,
                                                "_blank"
                                              )
                                            }
                                          >
                                            <span className="text-lg mb-1">
                                              {getFileIcon(
                                                attachment.filename,
                                                attachment.type
                                              )}
                                            </span>
                                            <span className="text-xs text-gray-600 text-center px-1 leading-tight">
                                              {attachment.type?.toUpperCase() ||
                                                "FILE"}
                                            </span>
                                            <span className="text-xs text-gray-500 text-center px-1 leading-tight truncate w-full">
                                              {attachment.filename.length > 8
                                                ? `${attachment.filename.slice(
                                                    0,
                                                    8
                                                  )}...`
                                                : attachment.filename}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {/* <div ref={commentsEndRef} /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Post Info */}
        <div className="sticky top-0 w-[27%] bg-white border border-gray-200 rounded-[4px] px-4 pt-2 pb-7 h-fit">
          {/* Header with three dots menu */}
          <div className="flex items-center justify-between mb-4 pb-1  border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Post Info</h3>
            <div className="flex items-center justify-center">
              <div
                onClick={handleCopyLink}
                className="p-2 rounded-[4px] hover:cursor-pointer hover:bg-gray-100"
                title="Copy Link"
              >
                <GoLink className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Post Info Content */}
          <div className="space-y-4">
            <div className="space-y-2 border-b border-gray-200 pb-3">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                <div className="relative">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium transition-opacity border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {statusOptions.find((opt) => opt.value === ticket.status)
                      ?.label || ticket.status}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Priority
                </span>
                <div
                  className="relative"
                  ref={(el) =>
                    (dropdownRefs.current[`${ticket._id}-priority`] = el)
                  }
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium transition-opacity border ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {priorityOptions.find(
                      (opt) => opt.value === ticket.priority
                    )?.label || ticket.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-b border-gray-200 pb-2">
              {/* Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Date</span>
                <span className="text-sm text-gray-900">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Author
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {ticket?.createdBy?.avatar ? (
                      <img
                        src={ticket?.createdBy?.avatar}
                        alt={ticket?.createdBy?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        {ticket?.createdBy?.name?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-900 ">
                    {ticket?.createdBy?.name || "Unknown User"}
                  </span>
                </div>
              </div>

              {/* Division */}
              {ticket?.division?.roleName ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 ">
                    Division
                  </span>
                  <span className="text-sm text-gray-900  bg-gray-100 px-2 py-1 rounded-[4px]">
                    {ticket?.division?.roleName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Assigned To
                  </span>
                  <ParticipantsAvatars
                    participants={ticket?.participants.filter(
                      (id) => id !== user?._id
                    )}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="border-b border-gray-200 pb-3">
                {/* <span className="text-sm font-medium text-gray-600 block mb-2">Tags</span> */}
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800  "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <StatusTimeline ticket={ticket} axiosSecure={axiosSecure} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketReply;
