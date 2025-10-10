import x_axios_tracker from "@/lib/axiosTracker";
import { formatError } from "@/lib/utils";

export async function get_monthly_stas(employeeId) {
  try {
    const response = await x_axios_tracker.get(
      `/api/v1/stats/monthly/${employeeId}`
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    return formatError(error);
  }
}

export async function get_monthly_calender_data(employeeId) {
  try {
    const timezone = "America/New_York";
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const response = await x_axios_tracker.get(
      `/api/v1/sessions/calendar?employeeId=${employeeId}&year=${year}&month=${month}&timezone=${timezone}`
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    return formatError(error);
  }
}
