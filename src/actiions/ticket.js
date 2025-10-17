"use server";
import x_axios_crm from "@/lib/axiosCrm";

/**
 * Fetch employee tickets with optional filters and pagination.
 */
export const fetchAllTickets = async (queryParams) => {
  try {
    const response = await x_axios_crm.get(
      `/api/v1/ticket/get-all/ticket-employee?${queryParams}`
    );

    console.log("ticket call", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("fetchAllTickets error:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch tickets",
      statusCode: error.response?.status ?? 500,
    };
  }
};

export const uploadFileToRemoteIntegrity = async (formData) => {
  try {
    const response = await fetch(
      "https://files.remoteintegrity.com/api/files/faba4ad7-862a-4a20-9f33-73cf0286aa4c/upload",
      {
        method: "POST",
        headers: {
          "x-api-key":
            "99cd5d53a736d4f65458e4a943e86dcb6701ddf10fc7d09efca918933975bdf0",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ uploadFileToRemoteIntegrity error:", error);
    return {
      success: false,
      message: error.message || "Upload failed",
    };
  }
};
