"use client";

import { useState } from "react";
import { Clock, Link as LinkIcon, Trash2, X } from "lucide-react";

import { formatDateDisplay, formatTime } from "./SessionsList";

// Session details modal component
const SessionDetailsModal = ({ session, onClose, onDelete, timezone }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total time
  const totalTime = session.activeTime + session.idleTime;
  const activePercentage = Math.round((session.activeTime / totalTime) * 100);
  const idlePercentage = Math.round((session.idleTime / totalTime) * 100);

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all overflow-y-auto">
      <div className="bg-white rounded-[4px] shadow-xl p-6 max-w-4xl w-full h-[calc(100vh-200px)] mx-4 my-8 transform transition-all duration-300 ease-out overflow-hidden">
        <div className="overflow-y-scroll h-full pr-2">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Session Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>

            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "applications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("applications")}
            >
              Applications ({session.applications.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "links"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("links")}
            >
              Links ({session.links.length})
            </button>
          </div>

          {/* Tab content */}
          <div className="mt-4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Start Time
                      </h4>
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-blue-600" />
                        {formatDateDisplay(session.startTime, timezone)}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        End Time
                      </h4>
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-blue-600" />
                        {session.endTime ? (
                          formatDateDisplay(session.endTime, timezone)
                        ) : (
                          <p className="text-sm text-green-600 font-medium">
                            Session Running
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Timezone
                      </h4>
                      <div className="text-gray-900">
                        {session.timezone || "UTC"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Time Distribution
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 rounded-[4px] bg-green-500"></div>
                        <span className="text-sm">
                          Active: {formatTime(session.activeTime)} (
                          {activePercentage}%)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 rounded-[4px] bg-yellow-500"></div>
                        <span className="text-sm">
                          Idle: {formatTime(session.idleTime)} ({idlePercentage}
                          %)
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-[4px] overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${activePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Total Time
                      </h4>
                      <div className="text-xl font-semibold text-gray-900">
                        {formatTime(totalTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {session.userNote && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Notes
                    </h4>
                    <div className="p-3 bg-gray-50 rounded-[4px] text-gray-700">
                      {session.userNote}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "applications" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.applications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center p-3 border rounded-[4px]"
                    >
                      <div className="w-10 h-10 flex-shrink-0 mr-3">
                        <img
                          src={"/exeImage.png"}
                          alt={app.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">
                          {app.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(app.timeSpent)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {Math.round((app.timeSpent / totalTime) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {session.applications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No application data available
                  </div>
                )}
              </div>
            )}

            {activeTab === "links" && (
              <div>
                <div className="space-y-3">
                  {session.links.map((link) => (
                    <div
                      key={link._id}
                      className="flex items-center p-3 border rounded-[4px]"
                    >
                      <div className="w-8 h-8 flex-shrink-0 mr-3 bg-blue-100 rounded-[4px] flex items-center justify-center">
                        <LinkIcon size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">
                          {link.title}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateDisplay(link.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>

                {session.links.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No links available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;
