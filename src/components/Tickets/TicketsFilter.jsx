"use client";

import useTickets from "@/hooks/useTickets";
import { useState, useCallback, useRef, useEffect } from "react";
import { IoCaretDownSharp, IoCloseSharp } from "react-icons/io5";

const TicketsFilter = () => {
  const {
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
    divisionSearchTerm,
    setDivisionSearchTerm,
    divisionSearchResults,
    setDivisionSearchResults,
    selectedDivision,
    setSelectedDivision,
    isSearchingDivision,
    searchDivisions,
    debouncedSearchDivisions,
    resetFilters,
    isFilterVisible,
    setIsFilterVisible,
    searchTags,
    tagSearchTerm,
    setTagSearchTerm,
    setSelectedTag,
    setTagSearchResults,
    tagSearchResults,
    isSearchingTag,
    debouncedSearchTags,
    isLoadingTickets,
    showEditModal,
  } = useTickets();

  // Local states for dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});
  // const [tagSearch, setTagSearch] = useState('');
  // const [selectedTags, setSelectedTags] = useState([]);

  // Sample tags (you can fetch these from your API)
  // const availableTags = ['Bug', 'Feature Request', 'Support', 'Enhancement', 'Documentation', 'Training', 'Hardware', 'Software'];

  // Filter options
  const sortByOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "title", label: "Title" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "reopened", label: "Reopened" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  // Handle division input focus/blur
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

  // Handle division selection
  const handleDivisionSelect = useCallback(
    (selectedDiv) => {
      setDivisionSearchTerm(selectedDiv.roleName);
      setSelectedDivision(selectedDiv);
      setDivision(selectedDiv._id);
      setDivisionSearchResults([]);
    },
    [
      setSelectedDivision,
      setDivision,
      setDivisionSearchTerm,
      setDivisionSearchResults,
    ]
  );

  // Handle tag input focus/blur
  const handleTagInputFocus = useCallback(() => {
    if (!tagSearchTerm.trim()) {
      searchTags("");
    }
  }, [tagSearchTerm, searchTags]);

  const handleTagInputBlur = useCallback(() => {
    setTimeout(() => {
      setTagSearchResults([]);
    }, 200);
  }, [setTagSearchResults]);

  // Handle Tag selection
  const handleTagSelect = useCallback(
    (tag) => {
      setTagSearchTerm(tag);
      setSelectedTag(tag);
      setTag(tag);
      setTagSearchResults([]);
    },
    [setSelectedTag, setTag, setTagSearchTerm, setTagSearchResults]
  );

  // Handle tag selection
  // const handleTagSelect = (tag) => {
  //     if (!selectedTags.includes(tag)) {
  //         setSelectedTags([...selectedTags, tag]);
  //     }
  //     setTagSearch('');
  // };

  // const removeTag = (tagToRemove) => {
  //     setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  // };

  // Filter tags based on search
  // const filteredTags = availableTags.filter(tag =>
  //     tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
  //     !selectedTags.includes(tag)
  // );

  // Handle clear all filters
  const handleClearAll = () => {
    resetFilters();
    // setSelectedTags([]);
    // setTagSearch('');
    setDivisionSearchTerm("");
    setSelectedDivision({});
    setTagSearchTerm("");
    setSelectedTag("");
    setOpenDropdowns({});
  };

  // Handle apply filters
  // const handleApply = () => {
  //     // Here you can add any additional logic for applying filters
  //     // The filters are already applied through the state changes
  //     console.log('Filters applied:', {
  //         sortBy,
  //         sortOrder,
  //         status,
  //         priority,
  //         division,
  //         tags: selectedTags
  //     });
  //     setOpenDropdowns({});
  // };

  // Individual DropdownSelect component with its own ref
  const DropdownSelect = ({ label, value, options, onChange, placeholder }) => {
    const dropdownName = label.toLowerCase().replace(" ", "_");
    const isOpen = openDropdowns[dropdownName];
    const dropdownRef = useRef(null);

    // Handle click outside for this specific dropdown
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [dropdownName]: false,
          }));
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen, dropdownName]);

    return (
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div
          className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 cursor-pointer flex items-center justify-between focus:ring-2 focus:ring-blue-500"
          onClick={() => toggleDropdown(dropdownName)}
        >
          <span className="text-sm">
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <IoCaretDownSharp
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-3 text-sm hover:bg-gray-100 cursor-pointer ${
                  value === option.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-900"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpenDropdowns((prev) => ({
                    ...prev,
                    [dropdownName]: false,
                  }));
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  // console.log("tag search: ", tagSearchResults);
  if (isLoadingTickets) return;

  return (
    // <div className={`transition-all duration-300 ease-in-out ${isFilterVisible ? 'w-[25%]' : 'w-0'}`}>
    //     <div className="bg-white border-l border-t border-b rounded-md border-gray-200 flex flex-col">
    <div
      className={`transition-all duration-300 ease-in-out ${
        isFilterVisible ? "w-[25%]" : "w-0"
      }`}
    >
      <div className="sticky top-0 bg-white border-l border-t border-b rounded-md border-gray-200 flex flex-col shadow-md shadow-gray-100">
        {/* <div className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${isFilterVisible ? 'translate-x-0' : 'translate-x-full'} w-full max-w-sm`}>
            <div className="h-full bg-white border-l border-gray-200 flex flex-col shadow-lg"> */}
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <IoCloseSharp className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Sort Order */}
          <DropdownSelect
            label="Order"
            value={sortOrder}
            options={sortOrderOptions}
            onChange={setSortOrder}
            placeholder="Select order"
          />

          {/* Sort By */}
          <DropdownSelect
            label="Sort By"
            value={sortBy}
            options={sortByOptions}
            onChange={setSortBy}
            placeholder="Select sort field"
          />

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Division
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search divisions..."
                value={divisionSearchTerm}
                onChange={(e) => {
                  setDivisionSearchTerm(e.target.value);
                  debouncedSearchDivisions(e.target.value);
                  if (!e.target.value) {
                    setDivision("");
                    setSelectedDivision({});
                  }
                }}
                onFocus={handleDivisionInputFocus}
                onBlur={handleDivisionInputBlur}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {isSearchingDivision && !showEditModal && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {(divisionSearchResults.length && !showEditModal) > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {divisionSearchResults.map((div) => (
                    <div
                      key={div._id}
                      className="p-3 text-sm hover:bg-gray-100 cursor-pointer text-gray-900"
                      onClick={() => handleDivisionSelect(div)}
                    >
                      {div.roleName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Filter */}
          <DropdownSelect
            label="Priority"
            value={priority}
            options={priorityOptions}
            onChange={setPriority}
            placeholder="Select priority"
          />

          {/* Status Filter */}
          <DropdownSelect
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
            placeholder="Select status"
          />

          {/* Tags Filter */}
          {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Tags
                        </label>

                        Tag Search Input
                        <div className="relative mb-3">
                            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={tagSearch}
                                onChange={(e) => setTagSearch(e.target.value)}
                                placeholder="Search tags..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        Selected Tags
                        {selectedTags.length > 0 && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        Available Tags
                        {tagSearch && filteredTags.length > 0 && (
                            <div className="border border-gray-200 rounded-md max-h-32 overflow-y-auto">
                                {filteredTags.map((tag) => (
                                    <div
                                        key={tag}
                                        onClick={() => handleTagSelect(tag)}
                                        className="p-2 text-sm hover:bg-gray-100 cursor-pointer text-gray-900"
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              Search By Tags
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearchTerm}
                onChange={(e) => {
                  setTagSearchTerm(e.target.value);
                  debouncedSearchTags(e.target.value);
                  if (!e.target.value) {
                    setTag("");
                    setSelectedTag("");
                  }
                }}
                onFocus={handleTagInputFocus}
                onBlur={handleTagInputBlur}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {isSearchingTag && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {tagSearchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {tagSearchResults.map((tag) => (
                    <div
                      key={tag}
                      className="p-3 text-sm hover:bg-gray-100 cursor-pointer text-gray-900"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-4 pb-6 border-gray-200 space-y-2">
          {/* <button
                        onClick={handleApply}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-[4px] hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Apply Filters
                    </button> */}
          <button
            onClick={handleClearAll}
            className="w-full bg-gray-300 text-black px-4 py-2 rounded-[4px] hover:bg-gray-400 transition-colors text-sm font-medium mt-2"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketsFilter;
