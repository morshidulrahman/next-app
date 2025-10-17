"use client";
import { toast } from "sonner";
import { useCallback, useRef, useState, useEffect } from "react";
import { IoCloseOutline, IoImageOutline, IoLinkOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import useTickets from "@/hooks/useTickets";
import useAxiosSecureAuth from "@/hooks/useAxiosSecureAuth";
import { uploadFileToRemoteIntegrity } from "@/actiions/ticket";

const TicketsForm = ({ employeeId }) => {
  const {
    formData,
    setFormData,
    tags,
    setTags,
    newTag,
    setNewTag,
    selectedTicket,
    updateTicket,
    createTicket,
    ticketsRefetch,
    closeModal,
    addTag,
    removeTag,

    divisionSearchTerm,
    setDivisionSearchTerm,
    divisionSearchResults,
    setDivisionSearchResults,
    setSelectedDivision,
    searchDivisions,
    debouncedSearchDivisions,
    isSearchingDivision,
    debouncedSearchTags,
    searchTags,
    tagSearchResults,
    setTagSearchResults,
    isSearchingTag,
    refetchStats,
  } = useTickets();

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const axiosSecureAuth = useAxiosSecureAuth();
  // New states for dropdown functionality
  const [assignmentType, setAssignmentType] = useState("division"); // 'division' or 'group'
  const [isAssignmentDropdownOpen, setIsAssignmentDropdownOpen] =
    useState(false);
  const [individualSearchTerm, setIndividualSearchTerm] = useState("");
  const [individualSearchResults, setIndividualSearchResults] = useState([]);
  const [selectedIndividuals, setSelectedIndividuals] = useState([]);
  const [isSearchingIndividuals, setIsSearchingIndividuals] = useState(false);

  const assignmentDropdownRef = useRef(null);
  const individualDropdownRef = useRef(null);

  // Handle clicks outside dropdowns
  const handleClickOutside = useCallback((event) => {
    if (
      assignmentDropdownRef.current &&
      !assignmentDropdownRef.current.contains(event.target)
    ) {
      setIsAssignmentDropdownOpen(false);
    }
    if (
      individualDropdownRef.current &&
      !individualDropdownRef.current.contains(event.target)
    ) {
      setIndividualSearchResults([]);
    }
  }, []);

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Search individuals function
  const searchIndividuals = useCallback(
    async (searchTerm = "") => {
      setIsSearchingIndividuals(true);
      try {
        const response = await axiosSecureAuth.get(`/api/v1/users`, {
          params: {
            globalSearch: searchTerm,
            sortBy: "createdAt",
            order: "desc",
            isDeleted: false,
            page: 1,
            limit: 1000,
          },
        });
        if (response.status === 200) {
          const allUsers = response.data.data.data || [];

          // Filter out already selected individuals
          const filteredUsers = allUsers.filter(
            (user) =>
              !selectedIndividuals.some((selected) => selected._id === user._id)
          );

          setIndividualSearchResults(filteredUsers);
        } else {
          setIndividualSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching individuals:", error);
        setIndividualSearchResults([]);
      } finally {
        setIsSearchingIndividuals(false);
      }
    },
    [axiosSecureAuth, selectedIndividuals]
  ); // Add selectedIndividuals as dependency

  // Debounced search for individuals
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  const debouncedSearchIndividuals = useCallback(
    debounce(searchIndividuals, 300),
    [debounce, searchIndividuals]
  );

  // Handle individual input focus
  const handleIndividualInputFocus = useCallback(() => {
    if (!individualSearchTerm.trim()) {
      searchIndividuals("");
    }
  }, [individualSearchTerm, searchIndividuals]);

  // Handle individual selection
  const handleIndividualSelect = useCallback(
    (individual) => {
      // Check if individual is already selected
      if (
        !selectedIndividuals.find((selected) => selected._id === individual._id)
      ) {
        setSelectedIndividuals((prev) => [...prev, individual]);
      }
      setIndividualSearchTerm("");
      setIndividualSearchResults([]);
    },
    [selectedIndividuals]
  );

  // Remove selected individual
  const removeSelectedIndividual = useCallback((individualId) => {
    setSelectedIndividuals((prev) =>
      prev.filter((individual) => individual._id !== individualId)
    );
  }, []);

  // Update search results when selectedIndividuals changes
  useEffect(() => {
    if (individualSearchResults.length > 0) {
      // Re-filter the current search results when selectedIndividuals changes
      const filteredResults = individualSearchResults.filter(
        (user) =>
          !selectedIndividuals.some((selected) => selected._id === user._id)
      );
      setIndividualSearchResults(filteredResults);
    }
  }, [selectedIndividuals]); // Only depend on selectedIndividuals

  // Handle assignment type change
  const handleAssignmentTypeChange = (type) => {
    setAssignmentType(type);
    setIsAssignmentDropdownOpen(false);

    // Clear relevant states when switching
    if (type === "division") {
      setSelectedIndividuals([]);
      setIndividualSearchTerm("");
      setIndividualSearchResults([]);
    } else {
      setDivisionSearchTerm("");
      setDivisionSearchResults([]);
      setSelectedDivision({});
      setFormData((prev) => ({ ...prev, division: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let attachments = [];

    try {
      // Upload files if any are selected
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

      const submittedData = {
        ...formData,
        tags: tags,
        status: "open",
        createdBy: employeeId,
        attachments: attachments,
        type: assignmentType,
        ...(assignmentType === "group" && {
          participants: selectedIndividuals.map((individual) => individual._id),
        }),
      };

      console.log("Submitted data: ", submittedData);

      if (selectedTicket) {
        await updateTicket.mutateAsync({
          id: selectedTicket._id,
          data: submittedData,
        });
      } else {
        await createTicket.mutateAsync(submittedData);
      }

      await ticketsRefetch();
      await refetchStats();

      // Reset form including files
      setSelectedFiles([]);
      setUploadProgress({});
      setSelectedIndividuals([]);
      setIndividualSearchTerm("");
      setAssignmentType("division");
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  // File handling functions
  const handleFileSelect = (event, type) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const newFiles = files.map((file) => {
      const fileId = Date.now() + Math.random();
      let preview = null;

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
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
      const response = await uploadFileToRemoteIntegrity(formData);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
      return response;
    } catch (error) {
      console.error("File upload error:", error.message);
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      throw error;
    }
  };

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

  // Handle tag input focus/blur
  const handleTagInputFocus = useCallback(() => {
    if (!newTag.trim()) {
      searchTags("");
    }
  }, [newTag, searchTags]);

  const handleTagInputBlur = useCallback(() => {
    setTimeout(() => {
      setTagSearchResults([]);
    }, 200);
  }, [setTagSearchResults]);

  // Handle Tag selection - Direct approach using setTags from useTickets
  const handleTagSelect = useCallback(
    (selectedTag) => {
      // Add the tag directly when clicked
      if (selectedTag.trim() && !tags.includes(selectedTag.trim())) {
        // Directly update the tags array using setTags from useTickets hook
        setTags((prevTags) => [...prevTags, selectedTag.trim()]);
      }
      // Clear the input and search results
      setNewTag("");
      setTagSearchResults([]);
    },
    [tags, setTags, setNewTag, setTagSearchResults]
  );

  // Handle tag key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Handle company input focus/blur
  const handleDivisionInputFocus = useCallback(() => {
    if (!divisionSearchTerm.trim()) {
      searchDivisions("");
    }
  }, [divisionSearchTerm, searchDivisions]);

  const handleDivisionInputBlur = useCallback(() => {
    setTimeout(() => {
      setDivisionSearchResults([]);
    }, 200);
  }, [setDivisionSearchResults]);

  // Handle company selection
  const handleDivisionSelect = useCallback(
    (division) => {
      setDivisionSearchTerm(division.roleName);
      setSelectedDivision(division);

      setFormData((prevState) => ({
        ...prevState,
        division: division?._id,
      }));

      setDivisionSearchResults([]);
    },
    [
      setSelectedDivision,
      setFormData,
      setDivisionSearchTerm,
      setDivisionSearchResults,
    ]
  );

  const isSubmitting = createTicket.isPending || updateTicket.isPending;
  const buttonText = selectedTicket ? "Update Ticket" : "Create Ticket";

  return (
    <form onSubmit={handleSubmit} className="p-1 bg-white rounded-[4px]">
      <div className="space-y-3">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Ticket title"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className="mt-2 block w-full p-2 border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Additional details..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>

          {/* Upload Buttons */}
          <div className="flex items-center space-x-3 mb-3">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-[4px] text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
              onClick={() => imageInputRef.current?.click()}
            >
              <IoImageOutline size={16} />
              Upload Images
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-[4px] text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
              onClick={() => fileInputRef.current?.click()}
            >
              <IoLinkOutline size={16} />
              Upload Files
            </button>

            {selectedFiles.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {selectedFiles.length} file
                {selectedFiles.length !== 1 ? "s" : ""} selected
              </span>
            )}

            {selectedFiles.length > 0 && (
              <button
                type="button"
                onClick={removeAllFiles}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                disabled={isSubmitting}
              >
                Remove All
              </button>
            )}
          </div>

          <input
            type="file"
            ref={imageInputRef}
            onChange={(e) => handleFileSelect(e, "image")}
            accept="image/*"
            className="hidden"
            disabled={isSubmitting}
            multiple
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e, "file")}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar"
            disabled={isSubmitting}
            multiple
          />

          {/* File Preview Section */}
          {selectedFiles.length > 0 && (
            <div className="border border-gray-300 rounded-[4px] p-3 bg-gray-50">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
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
                      disabled={isSubmitting}
                    >
                      <IoCloseOutline size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-5">
          {/* Priority */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-2 block w-full p-[9px] border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              required
              disabled={isSubmitting}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Assignment Type Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Type <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={assignmentDropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsAssignmentDropdownOpen(!isAssignmentDropdownOpen)
                }
                className="mt-2 w-full px-2 py-[6px] border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm flex items-center justify-between"
                disabled={isSubmitting}
              >
                <span>
                  {assignmentType === "division"
                    ? "Select Division"
                    : "Select Individual"}
                </span>
                <MdOutlineKeyboardArrowDown
                  className={`w-[27px] h-[27px] text-black font-bold transition-transform ${
                    isAssignmentDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAssignmentDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-900"
                    onClick={() => handleAssignmentTypeChange("division")}
                  >
                    Select Division
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-900"
                    onClick={() => handleAssignmentTypeChange("group")}
                  >
                    Select Individual
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Input Based on Assignment Type */}
        {assignmentType === "division" ? (
          // Division Selection (existing code)
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Division <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a division..."
                disabled={selectedTicket}
                value={divisionSearchTerm || ""}
                onChange={(e) => {
                  setDivisionSearchTerm(e.target.value);
                  debouncedSearchDivisions(e.target.value);
                  if (!e.target.value) {
                    setFormData((prevState) => ({
                      ...prevState,
                      division: "",
                    }));
                  }
                }}
                onFocus={handleDivisionInputFocus}
                onBlur={handleDivisionInputBlur}
                className={`w-full p-2 focus:outline-none shadow-sm mt-2 block border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm ${
                  selectedTicket && "cursor-not-allowed"
                }`}
              />
              {isSearchingDivision && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {divisionSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
                  {divisionSearchResults.map((division) => (
                    <div
                      key={division._id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        handleDivisionSelect(division);
                        setDivisionSearchTerm(division.roleName);
                        setDivisionSearchResults([]);
                      }}
                    >
                      {division.roleName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Individual Selection (updated functionality with filtering)
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Individuals <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={individualDropdownRef}>
              <input
                type="text"
                placeholder="Search for individuals..."
                value={individualSearchTerm}
                onChange={(e) => {
                  setIndividualSearchTerm(e.target.value);
                  debouncedSearchIndividuals(e.target.value);
                }}
                onFocus={handleIndividualInputFocus}
                className="w-full p-2 focus:outline-none shadow-sm mt-2 block border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm"
              />
              {isSearchingIndividuals && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {individualSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[4px] shadow-lg max-h-52 overflow-y-auto">
                  {individualSearchResults.map((individual) => (
                    <div
                      key={individual._id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3"
                      onClick={() => handleIndividualSelect(individual)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {individual.avatar ? (
                          <img
                            src={individual.avatar}
                            alt={individual.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {individual.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {individual.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{individual.username} •{" "}
                          {individual.position || "No position"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Individuals Display */}
            {selectedIndividuals.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Individuals ({selectedIndividuals.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedIndividuals.map((individual) => (
                    <div
                      key={individual._id}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {individual.avatar ? (
                          <img
                            src={individual.avatar}
                            alt={individual.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {individual.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <span>{individual.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedIndividual(individual._id)}
                        className="ml-1 text-blue-600 hover:text-blue-800 flex-shrink-0"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>

            {/* Add new tag */}
            <div className="relative">
              <input
                name="newTag"
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  debouncedSearchTags(e.target.value);
                }}
                onFocus={handleTagInputFocus}
                onBlur={handleTagInputBlur}
                onKeyDown={handleKeyPress}
                className="flex-1 w-full p-2 border border-gray-300 rounded-[4px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none sm:text-sm"
                placeholder="Add a tag and press Enter"
                disabled={isSubmitting}
              />
              {isSearchingTag && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {tagSearchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-[4px] shadow-md max-h-32 overflow-y-auto">
                  {tagSearchResults.map((tag) => (
                    <div
                      key={tag}
                      className="p-2 text-sm hover:bg-gray-100 cursor-pointer text-gray-900"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Display current tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {tags.length === 0 && (
            <p className="text-gray-600 text-sm">No tags added yet.</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-12">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-[4px] hover:bg-gray-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-[4px] border border-gray-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default TicketsForm;
