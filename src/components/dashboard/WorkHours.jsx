"use client";
import { useMemo } from "react";
import {
  Clock,
  TrendingUp,
  Zap,
  Target,
  PlayCircle,
  BarChart3,
} from "lucide-react";

import ProductivityChart from "./workinghours/ProductivityChart";
import StatsCard from "./workinghours/StatsCard";
import CalendarHeatmapChart from "./workinghours/CalendarHeatmapChart";
import ActivityChart from "./workinghours/ActivityChart";
import { formatTime, formatTimeToHours } from "./workinghours/workingConstant";
import { useRouter } from "next/navigation";

export const WorkHours = ({ monthlyStats, monthlyCalendarData }) => {
  const router = useRouter();

  const processedData = useMemo(() => {
    const defaultStats = {
      totalHours: 0,
      activeHours: 0,
      idleHours: 0,
      activePercentage: 0,
      sessionCount: 0,
    };

    const stats = monthlyStats || defaultStats;

    // Calculate productivity data for pie chart
    const activePercentage = stats.activePercentage || 0;
    const productivityData = [
      { name: "Active", value: activePercentage },
      { name: "Idle", value: 100 - activePercentage },
    ];

    // Generate chart data
    let chartData = [];
    if (monthlyCalendarData) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      chartData = [];
      for (let day = 1; day <= Math.min(daysInMonth, 31); day++) {
        const dayKey = String(day).padStart(2, "0");
        const dayData = monthlyCalendarData[dayKey] || {
          totalActiveTime: 0,
          totalIdleTime: 0,
          totalTime: 0,
        };

        chartData.push({
          day: day.toString(),
          totalTime: formatTimeToHours(dayData.totalTime || 0),
          activeTime: formatTimeToHours(dayData.totalActiveTime || 0),
          idleTime: formatTimeToHours(dayData.totalIdleTime || 0),
        });
      }
    } else {
      chartData = [
        {
          day: "This Month",
          totalTime: formatTimeToHours(stats.totalHours || 0),
          activeTime: formatTimeToHours(stats.activeHours || 0),
          idleTime: formatTimeToHours(stats.idleHours || 0),
        },
      ];
    }

    const sessionCount = stats.totalSessions || 0;
    const avgSessionTime =
      sessionCount > 0 ? (stats.activeHours || 0) / sessionCount : 0;

    return {
      totalTime: stats.totalHours || 0,
      activeTime: stats.activeHours || 0,
      idleTime: stats.idleHours || 0,
      productivity: stats.activePercentage || 0,
      sessionCount,
      avgSessionTime,
      productivityData,
      chartData,
      calendarData: monthlyCalendarData,
    };
  }, [monthlyStats, monthlyCalendarData]);

  const handleViewAllSessions = () => {
    router.push("/work-hours");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Monthly Tracker Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your monthly productivity and work patterns •{" "}
            <span className="font-medium text-blue-600">EST Florida Time</span>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Time"
          value={formatTime(processedData.totalTime)}
          subtitle="Total work time this month"
          icon={Clock}
          gradient="from-emerald-500 to-emerald-600"
          delay={0}
        />

        <StatsCard
          title="Active Time"
          value={formatTime(processedData.activeTime)}
          subtitle="Time spent actively working"
          icon={Zap}
          gradient="from-blue-500 to-blue-600"
          delay={100}
        />

        <StatsCard
          title="Total Sessions"
          value={processedData.sessionCount.toLocaleString()}
          subtitle="Work sessions this month"
          icon={PlayCircle}
          gradient="from-purple-500 to-purple-600"
          delay={200}
        />

        <StatsCard
          title="Productivity"
          value={`${processedData.productivity}%`}
          subtitle="Active vs idle time ratio"
          icon={Target}
          gradient="from-orange-500 to-orange-600"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <div className="h-full">
            <ActivityChart data={processedData.chartData} />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="h-full">
            <ProductivityChart data={processedData.productivityData} />
          </div>
        </div>
      </div>

      {/* Calendar Heatmap and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarHeatmapChart data={processedData.calendarData} />
        </div>

        {/* Monthly Overview Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[4px] border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Time</span>
              <span className="font-medium text-emerald-600">
                {formatTime(processedData.totalTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Time</span>
              <span className="font-medium">
                {formatTime(processedData.activeTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Idle Time</span>
              <span className="font-medium">
                {formatTime(processedData.idleTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Daily Total</span>
              <span className="font-medium">
                {formatTime(Math.round(processedData.totalTime / 31))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Session</span>
              <span className="font-medium">
                {formatTime(processedData.avgSessionTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Efficiency</span>
              <span
                className={`font-medium ${
                  processedData.productivity >= 80
                    ? "text-emerald-600"
                    : processedData.productivity >= 60
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {processedData.productivity >= 80
                  ? "Excellent"
                  : processedData.productivity >= 60
                  ? "Good"
                  : "Needs Focus"}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-200">
            <button
              onClick={handleViewAllSessions}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-[4px] hover:bg-blue-50 hover:text-blue-600 transition-colors border border-blue-200 cursor-pointer"
            >
              <BarChart3 size={16} />
              <span>View Detailed Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
