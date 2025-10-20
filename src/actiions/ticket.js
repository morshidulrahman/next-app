"use server";
import x_axios from "@/lib/axios";
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

// upload files
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
    return {
      success: false,
      message: error.message || "Upload failed",
    };
  }
};

// search division
export const searchDivisionsAction = async (searchTerm = "") => {
  try {
    const response = await x_axios.get(
      `/api/v1/roles?sortBy=createdAt&order=desc&isDeleted=false&page=1&limit=10`,
      {
        params: { globalSearch: searchTerm },
      }
    );
    return response.data.data;
  } catch (error) {
    return {
      success: false,
      divisions: [],
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to search divisions",
    };
  }
};

// search division
export const searchTagsAction = async (searchTerm = "") => {
  try {
    const response = await x_axios_crm.get(`/api/v1/ticket/get-ticket-tags`, {
      params: { globalSearch: searchTerm },
    });
    return response.data.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to search tag",
    };
  }
};

// send message
export const sendMessage = async (data) => {
  try {
    const response = await x_axios_crm.post(
      `/api/v1/ticket/send-message`,
      data
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to send message",
    };
  }
};

export const getTicetMessage = async (id) => {
  try {
    const response = await x_axios_crm.get(`/api/v1/ticket/get-messages/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get message",
    };
  }
};

export const getSingleTicetData = async (id) => {
  try {
    const response = await x_axios_crm.get(
      `/api/v1/ticket/get-ticket-employee/${id}`
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get message",
    };
  }
};

export const getAllTicetList = async (id) => {
  try {
    const response = await x_axios_crm.get(
      `api/v1/ticket/get-all/ticket-employee`
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get message",
    };
  }
};
