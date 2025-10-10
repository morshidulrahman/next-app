import { formatTime, formatTimeToHours } from "./workingConstant";

const CalendarHeatmapChart = ({ data }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Create calendar data
  const heatmapData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = String(day).padStart(2, "0");
    const dayData = data?.[dayKey] || {
      totalActiveTime: 0,
      totalIdleTime: 0,
      totalTime: 0,
      activePercentage: 0,
    };

    heatmapData.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${dayKey}`,
      day: day,
      totalHours: formatTimeToHours(dayData.totalTime || 0),
      activeHours: formatTimeToHours(dayData.totalActiveTime || 0),
      idleHours: formatTimeToHours(dayData.totalIdleTime || 0),
      percentage: dayData.activePercentage || 0,
      totalTime: dayData.totalTime || 0,
      activeTime: dayData.totalActiveTime || 0,
      idleTime: dayData.totalIdleTime || 0,
    });
  }

  return (
    <div className="bg-white rounded-[4px] border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Activity Calendar
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Daily total work hours this month •{" "}
          <span className="font-medium text-blue-600">
            EST Florida Time (America/New_York)
          </span>
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-gray-500 text-center py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mx-auto w-full">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="h-12 w-full"></div>
        ))}

        {heatmapData.map((dayData) => {
          const intensity =
            dayData.totalHours === 0
              ? 0
              : dayData.totalHours <= 2
              ? 1
              : dayData.totalHours <= 4
              ? 2
              : dayData.totalHours <= 6
              ? 3
              : dayData.totalHours <= 8
              ? 4
              : 5;

          const colors = [
            "bg-gray-100",
            "bg-blue-100",
            "bg-blue-200",
            "bg-blue-400",
            "bg-blue-600",
            "bg-blue-800",
          ];

          const textColors = [
            "text-gray-600",
            "text-blue-700",
            "text-blue-800",
            "text-white",
            "text-white",
            "text-white",
          ];

          return (
            <div
              key={dayData.day}
              className={`
                h-12 w-full rounded-[4px] flex flex-col items-center justify-center text-xs font-medium
                transition-all duration-200 hover:scale-110 cursor-pointer relative group
                ${colors[intensity]} ${textColors[intensity]}
              `}
            >
              <div className="text-xs font-semibold">{dayData.day}</div>
              <div className="text-[10px] opacity-80">
                {dayData.totalHours}h
              </div>

              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-[4px] px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-semibold mb-1">
                    {new Date(dayData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div>
                      Total Time:{" "}
                      <span className="font-medium">
                        {formatTime(dayData.totalTime)}
                      </span>
                    </div>
                    <div>
                      Active Time:{" "}
                      <span className="font-medium">
                        {formatTime(dayData.activeTime)}
                      </span>
                    </div>
                    <div>
                      Idle Time:{" "}
                      <span className="font-medium">
                        {formatTime(dayData.idleTime)}
                      </span>
                    </div>
                    <div>
                      Productivity:{" "}
                      <span className="font-medium">{dayData.percentage}%</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">Less Hours</span>
        <div className="flex items-center space-x-1">
          {[0, 1, 2, 3, 4, 5].map((level) => {
            const colors = [
              "bg-gray-100",
              "bg-blue-100",
              "bg-blue-200",
              "bg-blue-400",
              "bg-blue-600",
              "bg-blue-800",
            ];
            return (
              <div
                key={level}
                className={`w-3 h-3 rounded-[2px] ${colors[level]}`}
              ></div>
            );
          })}
        </div>
        <span className="text-xs text-gray-500">More Hours</span>
      </div>
    </div>
  );
};

export default CalendarHeatmapChart;
