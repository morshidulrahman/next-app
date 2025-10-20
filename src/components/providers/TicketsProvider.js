"use client";
/* eslint-disable no-useless-catch */
import { createContext, useCallback, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PropTypes from "prop-types";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { searchDivisionsAction, searchTagsAction } from "@/actiions/ticket";

export const TicketsContext = createContext(null);

const queryClient = new QueryClient();

export const TicketsProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();

  // ------------STATES------------
  // Modal and UI states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedNote, setSelectedNote] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Tag management
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Filter & pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [globalSearch, setGlobalSearch] = useState("");
  const [debouncedGlobalSearch, setDebouncedGlobalSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [division, setDivision] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);

  // Stats card filters - NEW
  const [selectedFilters, setSelectedFilters] = useState({
    priority: "",
    status: "",
  });

  // division & tag search
  const [divisionSearchTerm, setDivisionSearchTerm] = useState("");
  const [divisionSearchResults, setDivisionSearchResults] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState({});
  const [isSearchingDivision, setIsSearchingDivision] = useState(false);

  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [tagSearchResults, setTagSearchResults] = useState([]);
  const [selectedTag, setSelectedTag] = useState({});
  const [isSearchingTag, setIsSearchingTag] = useState(false);

  const [tag, setTag] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    division: "",
    tags: [],
    firstResponse: new Date(),
  });

  const [noteData, setNoteData] = useState({
    content: "",
  });

  // Debounced search functions
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  // Create debounced search function
  const debouncedSearchUpdate = useCallback(
    debounce((searchTerm) => {
      setDebouncedGlobalSearch(searchTerm);
    }, 1000),
    [debounce]
  );

  // Update debounced search when globalSearch changes
  const updateGlobalSearch = useCallback(
    (searchTerm) => {
      setGlobalSearch(searchTerm);
      debouncedSearchUpdate(searchTerm);
    },
    [debouncedSearchUpdate]
  );

  // -----------DATA FETCHING--------------
  // Fetch ticket statistics
  const {
    data: ticketStats = {},
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["ticketStats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        "/api/v1/ticket/get-employee/ticket-stats"
      );
      return data.data;
    },
  });

  // Fetch all tickets - Updated to use debouncedGlobalSearch
  const {
    data: ticketsData = { tickets: [], metadata: {} },
    isLoading: isLoadingTickets,
    refetch: ticketsRefetch,
    isFetching: isFetchingTickets,
  } = useQuery({
    queryKey: [
      "ticket",
      page,
      limit,
      debouncedGlobalSearch,
      status,
      priority,
      division,
      sortBy,
      sortOrder,
      tag,
      selectedFilters,
    ],
    queryFn: async () => {
      // Build query parameters
      const queryParams = new URLSearchParams({
        globalSearch: debouncedGlobalSearch, // Use debounced search
        page: page.toString(),
        limit: limit.toString(),
        status: selectedFilters.status || status, // Use card filter first, then sidebar filter
        priority: selectedFilters.priority || priority, // Use card filter first, then sidebar filter
        division,
        sortBy,
        order: sortOrder,
        tags: tag,
        isDeleted: false,
      });

      const { data } = await axiosSecure.get(
        `/api/v1/ticket/get-all/ticket-employee?${queryParams}`
      );

      return {
        tickets: data.data || [],
        metadata: {
          totalTickets: data.data.meta?.total || 0,
          totalPages: data.data.meta?.totalPages || 0,
          currentPage: data.data.meta?.currentPage || 1,
        },
      };
    },
  });

  // search divisions
  const searchDivisions = useCallback(
    async (searchTerm = "") => {
      setIsSearchingDivision(true);
      try {
        const response = await searchDivisionsAction(searchTerm);
        setDivisionSearchResults(response);
        setIsSearchingDivision(false);
        return response;
      } catch (error) {
        console.error("Error searching Companies:", error);
        setDivisionSearchResults([]);
      } finally {
        setIsSearchingDivision(false);
      }
    },
    [searchDivisionsAction]
  );

  // search tags
  const searchTags = useCallback(
    async (searchTerm = "") => {
      setIsSearchingTag(true);
      try {
        const response = await searchTagsAction(searchTerm);
        console.log(response, "res");
        setTagSearchResults(response);
      } catch (error) {
        console.error("Error searching Companies:", error);
        setTagSearchResults([]);
      } finally {
        setIsSearchingTag(false);
      }
    },
    [searchTagsAction]
  );

  // ----------MUTATIONS-------------
  // Create ticket mutation
  const createTicket = useMutation({
    mutationFn: (newTicket) =>
      axiosSecure.post("/api/v1/ticket/create-ticket-employee", newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries(["ticketStats"]); // Refresh stats
      toast.success("Ticket created successfully");
      setShowEditModal(false);
      clearFormData();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create ticket");
    },
  });

  // Update ticket mutation
  const updateTicket = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axiosSecure.patch(`/api/v1/ticket/${id}`, data);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries(["ticketStats"]); // Refresh stats
      toast.success("Ticket updated successfully");
      setShowEditModal(false);
      clearFormData();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update ticket");
    },
  });

  // ------------UTILITY FUNCTIONS------------
  const clearFormData = () => {
    setFormData({
      title: "",
      description: "",
      priority: "",
      division: "",
      tags: [],
      firstResponse: new Date(),
    });
    setNoteData({
      content: "",
    });
    setTags([]);
    setSelectedTicket(null);
    setSelectedNote({});

    setDivisionSearchTerm("");
    setDivisionSearchResults([]);
    setSelectedDivision({});
    setTagSearchTerm("");
    setTagSearchResults([]);
    setSelectedTag("");
  };

  const openCreateModal = () => {
    clearFormData();
    setShowEditModal(true);
  };

  const openEditModal = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority || "",
      division: ticket.division || "",
      tags: ticket.tags || [],
      firstResponse: ticket.firstResponse || new Date(),
    });
    setTags(ticket.tags || []);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    clearFormData();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const resetFilters = () => {
    setPage(1);
    setGlobalSearch("");
    setDebouncedGlobalSearch(""); // Reset debounced search too
    setStatus("");
    setPriority("");
    setDivision("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setTag("");
    setDivisionSearchTerm("");
    setSelectedDivision({});
    setTagSearchTerm("");
    setSelectedTag("");
    // Reset stats card filters - NEW
    setSelectedFilters({
      priority: "",
      status: "",
    });
  };

  // NEW - Handle stats card filter changes
  const handleStatsFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      // Toggle filter - if same value is clicked, remove it
      if (newFilters[type] === value) {
        newFilters[type] = "";
      } else {
        newFilters[type] = value;
      }

      return newFilters;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const debouncedSearchDivisions = useCallback(debounce(searchDivisions, 300), [
    debounce,
    searchDivisions,
  ]);
  const debouncedSearchTags = useCallback(debounce(searchTags, 300), [
    debounce,
    searchTags,
  ]);

  // ---------SET CONTEXT VALUES--------------
  const contextValue = {
    // Data
    ticketsData,
    isLoadingTickets,
    isFetchingTickets,
    ticketStats, // NEW
    isLoadingStats, // NEW
    refetchStats, // NEW

    // Modal states
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedTicket,
    setSelectedTicket,
    showNoteModal,
    setShowNoteModal,
    showDeleteNoteModal,
    setShowDeleteNoteModal,

    // Form data
    formData,
    setFormData,
    noteData,
    setNoteData,

    // Tags
    tags,
    setTags,
    newTag,
    setNewTag,

    // Filters and pagination
    page,
    setPage,
    limit,
    setLimit,
    globalSearch,
    setGlobalSearch: updateGlobalSearch, // Use the debounced version
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    status,
    setStatus,
    priority,
    setPriority,
    division,
    setDivision,
    tag,
    setTag,
    isFilterVisible,
    setIsFilterVisible,
    selectedFilters,
    handleStatsFilterChange,
    openDropdown,
    setOpenDropdown,

    // searching-division
    divisionSearchTerm,
    setDivisionSearchTerm,
    divisionSearchResults,
    setDivisionSearchResults,
    selectedDivision,
    setSelectedDivision,
    isSearchingDivision,
    setIsSearchingDivision,

    // tags-tags
    tagSearchTerm,
    setTagSearchTerm,
    tagSearchResults,
    setTagSearchResults,
    selectedTag,
    setSelectedTag,
    isSearchingTag,
    setIsSearchingTag,
    selectedNote,
    setSelectedNote,

    // Mutations
    createTicket,
    updateTicket,

    // Functions
    ticketsRefetch,
    clearFormData,
    openCreateModal,
    openEditModal,
    closeModal,
    addTag,
    removeTag,
    resetFilters,
    searchDivisions,
    debouncedSearchDivisions,
    searchTags,
    debouncedSearchTags,
    formatDate,
  };

  return (
    <TicketsContext.Provider value={contextValue}>
      {children}
    </TicketsContext.Provider>
  );
};

TicketsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TicketsProvider;
