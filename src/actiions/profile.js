"use server";

import x_axios_crm from "@/lib/axiosCrm";
import { revalidatePath } from "next/cache";

export async function updateEmployeeProfile({ employeeId, data }) {
  if (!employeeId) {
    return { success: false, error: "Missing employeeId" };
  }

  try {
    const res = await x_axios_crm.patch(`/api/v1/employee/${employeeId}`, data);
    // Revalidate any paths that may show updated profile info
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, data: res.data?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update profile",
    };
  }
}

