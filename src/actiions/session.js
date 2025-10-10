"use server";

import x_axios_crm from "@/lib/axiosCrm";
import x_axios_tracker from "@/lib/axiosTracker";
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
