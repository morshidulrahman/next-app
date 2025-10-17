"use client";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useState, useEffect, useMemo, useCallback } from "react";

const ParticipantsAvatars = ({
  participants = [],
  maxDisplay = 4,
  size = "sm",
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  // Memoize participants array to prevent unnecessary re-renders
  const memoizedParticipants = useMemo(
    () => participants,
    [JSON.stringify(participants)]
  );

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "h-6 w-6",
      avatar: "h-6 w-6",
      text: "text-xs",
      overlap: "-ml-1",
      more: "text-xs px-1",
    },
    md: {
      container: "h-8 w-8",
      avatar: "h-8 w-8",
      text: "text-xs",
      overlap: "-ml-2",
      more: "text-xs px-2",
    },
    lg: {
      container: "h-10 w-10",
      avatar: "h-10 w-10",
      text: "text-sm",
      overlap: "-ml-2",
      more: "text-sm px-2",
    },
  };

  const config = sizeConfig[size];

  // Memoize the fetch function to prevent recreation on every render
  const fetchUsers = useCallback(
    async (participantIds) => {
      if (!participantIds || participantIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosSecure.get("/api/v1/users", {
          params: {
            page: 1,
            limit: 100,
            sortBy: "createdAt",
            order: "desc",
            isDeleted: false,
          },
        });

        if (response.status === 200) {
          const allUsers = response.data.data.data || [];

          // Filter users that match the participant IDs
          const participantUsers = participantIds
            .map((participantId) =>
              allUsers.find((user) => user._id === participantId)
            )
            .filter((user) => user !== undefined);

          setUsers(participantUsers);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load participants");
      } finally {
        setLoading(false);
      }
    },
    [axiosSecure]
  );

  // Use effect with proper dependencies and early return
  useEffect(() => {
    // Early return if no participants
    if (!memoizedParticipants.length) {
      setUsers([]);
      setLoading(false);
      return;
    }

    // Check if we already have the users we need
    const currentUserIds = users.map((user) => user._id);
    const participantIds = memoizedParticipants;

    // Only fetch if participants have changed
    const participantsChanged =
      participantIds.length !== currentUserIds.length ||
      !participantIds.every((id) => currentUserIds.includes(id));

    if (participantsChanged) {
      fetchUsers(participantIds);
    }
  }, [memoizedParticipants, fetchUsers]); // Remove users from dependencies to prevent infinite loop

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center">
        {[...Array(Math.min(maxDisplay, memoizedParticipants.length))].map(
          (_, index) => (
            <div
              key={index}
              className={`${config.container} ${
                index > 0 ? config.overlap : ""
              } rounded-full bg-gray-200 animate-pulse border-2 border-white shadow-sm`}
            />
          )
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center text-red-500 text-sm">
        <span>Failed to load participants</span>
      </div>
    );
  }

  // No participants
  if (users.length === 0) {
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <span>No participants</span>
      </div>
    );
  }

  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <div className="flex items-center">
      {/* Avatar Stack */}
      <div className="flex items-center">
        {displayUsers.map((user, index) => (
          <div
            key={user._id}
            className={`${config.container} ${
              index > 0 ? config.overlap : ""
            } relative group`}
            title={user.name || user.username}
          >
            <div
              className={`${config.avatar} rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200 flex items-center justify-center`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}

              {/* Fallback text avatar */}
              <div
                className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium ${
                  config.text
                } ${user.avatar ? "hidden" : "flex"}`}
                style={{ display: user.avatar ? "none" : "flex" }}
              >
                {(user.name || user.username || "U").charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {user.name || user.username}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}

        {/* Show +n more if there are remaining users */}
        {remainingCount > 0 && (
          <div
            className={`${config.container} ${config.overlap} rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center`}
            title={`${remainingCount} more participant${
              remainingCount > 1 ? "s" : ""
            }`}
          >
            <span
              className={`${config.text} text-gray-600 font-medium ${config.more}`}
            >
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsAvatars;
