import { BarChart3, Calendar as CalendarIcon, FileText } from "lucide-react";

// View mode selector component
const ViewModeSelector = ({ viewMode, setViewMode }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        View Mode
      </label>
      <div className="flex border rounded-[4px] overflow-hidden">
        <button
          className={`flex items-center justify-center px-[12px] py-[10.5px] text-sm ${
            viewMode === "list"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setViewMode("list")}
        >
          <FileText size={16} className="mr-1" />
          List
        </button>
        <button
          className={`flex items-center justify-center px-[12px] py-[10.5px] text-sm ${
            viewMode === "timeline"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setViewMode("timeline")}
        >
          <BarChart3 size={16} className="mr-1" />
          Timeline
        </button>
        <button
          className={`flex items-center justify-center px-[12px] py-[10.5px] text-sm ${
            viewMode === "calendar"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setViewMode("calendar")}
        >
          <CalendarIcon size={16} className="mr-1" />
          Calendar
        </button>
        <button
          className={`flex items-center justify-center px-[12px] py-[10.5px] text-sm ${
            viewMode === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setViewMode("weekly")}
        >
          <CalendarIcon size={16} className="mr-1" />
          Weekly
        </button>
      </div>
    </div>
  );
};

export default ViewModeSelector;
