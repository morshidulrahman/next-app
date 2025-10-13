import { format } from "date-fns";
import { Clock, Eye, Laptop, Link as LinkIcon } from "lucide-react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { TbCalendarClock } from "react-icons/tb";
import { formatInTimeZone } from "date-fns-tz";
import { formatTime } from "./SessionsList";

// Timeline view component
const TimelineView = ({ sessions, onViewSession, timezone }) => {
  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = format(new Date(session.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  const sortedDates = Object.keys(sessionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div
          key={date}
          className="overflow-hidden bg-white shadow-md rounded-[4px]"
        >
          <div className="border-b bg-gray-50 border-b-gray-300 px-4 py-3">
            <h3 className="font-medium text-gray-900 text-md">
              {format(new Date(date), "EEEE, MMMM d, yyyy")}
            </h3>
          </div>

          <div className="p-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 bg-gray-200 left-[19px] w-0.5"></div>

              <div className="space-y-6">
                {sessionsByDate[date].map((session) => {
                  const startTime = new Date(session.startTime);
                  const endTime = session.endTime
                    ? new Date(session.endTime)
                    : startTime;

                  return (
                    <div key={session._id} className="relative flex">
                      {/* Timeline dot */}
                      <div className="absolute top-0 left-0 flex w-10 justify-center">
                        <div className="z-10 mt-1 h-5 w-5 rounded-full border-2 border-white bg-blue-500 shadow"></div>
                      </div>

                      {/* Session card */}
                      <div className="ml-12 flex-grow">
                        <div
                          className="cursor-pointer border border-gray-300 transition-shadow rounded-[4px] hover:shadow-md"
                          onClick={() => onViewSession(session)}
                        >
                          <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 p-3">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-blue-600" />

                              <span className="text-sm font-medium">
                                {formatInTimeZone(
                                  new Date(session.startTime),
                                  timezone || "UTC",
                                  "h:mm a"
                                )}{" "}
                                -{" "}
                                {session.endTime ? (
                                  formatInTimeZone(
                                    new Date(session.endTime),
                                    timezone || "UTC",
                                    "h:mm a"
                                  )
                                ) : (
                                  <p className="text-sm text-green-600 font-medium">
                                    Session Running
                                  </p>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium text-gray-700">
                                {formatTime(
                                  session.activeTime + session.idleTime
                                )}
                              </span>
                              <Eye size={16} className="text-gray-500" />
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="mb-2 flex justify-between">
                              <div className="flex items-center text-sm text-gray-600">
                                <FiCheckCircle className="mr-1 text-green-500" />
                                <span>
                                  Active: {formatTime(session.activeTime)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FiXCircle className="mr-1 text-yellow-500" />
                                <span>
                                  Idle: {formatTime(session.idleTime)}
                                </span>
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
                                <div className="flex items-center text-xs text-gray-500">
                                  <Laptop size={14} className="mr-1" />
                                  <span>{session.applications.length}</span>
                                </div>
                              )}

                              {session.links.length > 0 && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <LinkIcon size={14} className="mr-1" />
                                  <span>{session.links.length}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}

      {sortedDates.length === 0 && (
        <div className="bg-white p-8 text-center shadow-md rounded-[4px]">
          <TbCalendarClock size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No Sessions Found
          </h3>
          <p className="text-gray-500">
            No sessions available for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
