"use server";

import x_axios_crm from "@/lib/axiosCrm";
import x_axios_tracker from "@/lib/axiosTracker";
import {
  getFloridaDateRangeFromLocalDates,
  getUTCDateRangeForLocalDates,
} from "@/utils/timezone";
import { revalidatePath } from "next/cache";

// Get sessions with filters
export async function getSessions({
  employeeId,
  projectId,
  organizationId,
  startUTC,
  endUTC,
  isManual = false,
  searchTerm = "",
  page = 1,
  limit = 10,
  sortField = "startTime",
  sortOrder = "desc",
  isDeleted = false,
}) {
  try {
    let url = "/api/v1/sessions?";

    if (employeeId) url += `employeeId=${employeeId}&`;
    if (projectId) url += `projectId=${projectId}&`;
    if (organizationId) url += `organizationId=${organizationId}&`;
    if (startUTC) url += `startDate=${startUTC}&`;
    if (endUTC) url += `endDate=${endUTC}&`;
    if (isManual) url += `isManual=${isManual}&`;
    if (searchTerm) url += `globalSearch=${searchTerm}&`;
    url += `page=${page}&limit=${limit}&sortBy=${sortField}&order=${sortOrder}&isDeleted=${isDeleted}`;

    const { data } = await x_axios_tracker.get(url);

    return {
      success: true,
      data: {
        sessions: data.data || [],
        metadata: {
          totalSessions: data.meta?.total || 0,
          totalPages: data.meta?.totalPages || 0,
          currentPage: data.meta?.currentPage || 1,
        },
        statistics: {
          totalActiveTime: data.statistics?.totalActiveTime || 0,
          totalIdleTime: data.statistics?.totalIdleTime || 0,
          totalTime: data.statistics?.totalTime || 0,
          activePercentage: data.statistics?.activePercentage || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch sessions",
      data: {
        sessions: [],
        metadata: {
          totalSessions: 0,
          totalPages: 0,
          currentPage: 1,
        },
        statistics: {
          totalActiveTime: 0,
          totalIdleTime: 0,
          totalTime: 0,
          activePercentage: 0,
        },
      },
    };
  }
}

// Delete session
export async function deleteSession(sessionId) {
  try {
    await x_axios_tracker.delete(`/api/v1/sessions/${sessionId}`);

    // Revalidate the sessions page
    revalidatePath("/sessions");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Session deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting session:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete session",
    };
  }
}

// Get employee profile
export async function getEmployeeProfile(employeeId) {
  try {
    const { data } = await x_axios_crm.get(`/api/v1/employee/${employeeId}`);

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch employee profile",
      data: null,
    };
  }
}

// Get calendar stats for a specific month
export async function getCalendarStats({ employeeId, year, month, timezone }) {
  try {
    const response = await x_axios_tracker.get(
      `/api/v1/sessions/calendar?employeeId=${employeeId}&year=${year}&month=${String(
        month
      ).padStart(2, "0")}&timezone=${timezone}`
    );

    return {
      success: true,
      data: response.data.data || {},
    };
  } catch (error) {
    console.error("Error fetching calendar stats:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch calendar stats",
      data: {},
    };
  }
}

// Get sessions for a specific day
export async function getDaySessions({ employeeId, startUTC, endUTC }) {
  try {
    const response = await x_axios_tracker.get(
      `/api/v1/sessions?employeeId=${employeeId}&startDate=${startUTC}&endDate=${endUTC}`
    );

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching day sessions:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch day sessions",
      data: [],
    };
  }
}

// Get weekly calendar stats with sessions grouped by day
export async function getWeeklyCalendarStats({
  employeeId,
  startDate,
  endDate,
  timezone,
}) {
  try {
    // Convert date range using timezone utilities
    const { startUTC, endUTC } =
      timezone === "America/New_York"
        ? getFloridaDateRangeFromLocalDates(startDate, endDate)
        : getUTCDateRangeForLocalDates(startDate, endDate);

    const response = await x_axios_tracker.get(
      `/api/v1/sessions?employeeId=${employeeId}&startDate=${startUTC}&endDate=${endUTC}&page=1&limit=1000&sortBy=startTime&order=desc`
    );

    const sessions = response.data.data || [];

    // Group sessions by day in selected timezone
    const grouped = {};
    sessions.forEach((session) => {
      const sessionDate = new Date(session.startTime);
      let localDateString;

      if (timezone === "America/New_York") {
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        localDateString = formatter.format(sessionDate);
      } else {
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Dhaka",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        localDateString = formatter.format(sessionDate);
      }

      if (!grouped[localDateString]) {
        grouped[localDateString] = {
          totalActiveTime: 0,
          totalIdleTime: 0,
          totalTime: 0,
          activePercentage: 0,
          sessions: [],
        };
      }

      grouped[localDateString].totalActiveTime += session.activeTime || 0;
      grouped[localDateString].totalIdleTime += session.idleTime || 0;
      grouped[localDateString].totalTime +=
        (session.activeTime || 0) + (session.idleTime || 0);
      grouped[localDateString].sessions.push(session);
    });

    // Calculate percentages
    Object.keys(grouped).forEach((date) => {
      const dayData = grouped[date];
      dayData.activePercentage =
        dayData.totalTime > 0
          ? Math.round((dayData.totalActiveTime / dayData.totalTime) * 100)
          : 0;
    });

    return {
      success: true,
      data: grouped,
    };
  } catch (error) {
    console.error("Error fetching weekly calendar stats:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch weekly calendar stats",
      data: {},
    };
  }
}
