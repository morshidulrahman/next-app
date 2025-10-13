import { format } from "date-fns";
import { Clock, Image, Laptop, Link as LinkIcon, X } from "lucide-react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import { formatInTimeZone } from "date-fns-tz";
import { formatTime } from "./SessionsList";

const DaySessionsModal = ({
  sessions,
  date,
  onClose,
  onViewSession,
  timezone,
}) => {
  const parts = date.split("-");
  const localDate = new Date(parts[0], parts[1] - 1, parts[2]);

  const formatTimeInTimezone = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const displayTimeZone =
        timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

      return formatInTimeZone(date, displayTimeZone, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-40 transition-all overflow-y-auto">
      <div className="bg-white rounded-[4px] shadow-xl p-6 max-w-2xl w-full max-h-[80vh] mx-4 my-8 transform transition-all duration-300 ease-out overflow-hidden">
        <div className="flex justify-between items-center border-b border-b-gray-300 pb-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Sessions for {format(localDate, "MMMM d, yyyy")}
            {timezone && (
              <span className="text-sm text-gray-500 ml-2">({timezone})</span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              onClick={() => onViewSession(session)}
              className="p-4 border border-gray-300 rounded-[4px] hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Clock size={16} className="text-blue-600 mr-2" />
                  <span className="font-medium">
                    {formatTimeInTimezone(session.startTime)} -{" "}
                    {session.endTime ? (
                      formatTimeInTimezone(session.endTime)
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        Session Running
                      </p>
                    )}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatTime(session.activeTime + session.idleTime)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <FiCheckCircle className="mr-1 text-green-500" />
                  <span>Active: {formatTime(session.activeTime)}</span>
                </div>
                <div className="flex items-center">
                  <FiXCircle className="mr-1 text-yellow-500" />
                  <span>Idle: {formatTime(session.idleTime)}</span>
                </div>
              </div>

              {session.userNote && (
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {session.userNote}
                </div>
              )}

              {/* Activity indicators */}
              <div className="mt-3 flex space-x-2">
                {session.applications.length > 0 && (
                  <div className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-[4px]">
                    <Laptop size={12} className="mr-1" />
                    <span>{session.applications.length}</span>
                  </div>
                )}

                {session.links.length > 0 && (
                  <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-[4px]">
                    <LinkIcon size={12} className="mr-1" />
                    <span>{session.links.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaySessionsModal;
