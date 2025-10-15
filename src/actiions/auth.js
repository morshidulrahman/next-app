"use server";

import x_axios from "@/lib/axios";
import x_axios_crm from "@/lib/axiosCrm";
import { cookies } from "next/headers";

const login = async ({ email, password }) => {
  console.log("Login attempt:", { email, password });

  try {
    const res = await x_axios.post("/api/v1/auth/login/employee", {
      email,
      password,
    });

    const result = res.data?.data;

    if (result) {
      const cookieStore = await cookies();

      if (result.token) {
        cookieStore.set("remote-ui-jwt", result.token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      if (result.employee) {
        cookieStore.set("remote-ui-profile", JSON.stringify(result.employee), {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return { success: true, result };
    }

    return { success: true, data: res.data };
  } catch (err) {
    console.error("Login error:", err);

    return {
      success: false,
      error: err.response?.data?.message || err.message || "Login failed",
      statusCode: err.response?.status || 500,
    };
  }
};

const register = async (payload) => {
  const roleId =
    process.env.DEFAULT_EMPLOYEE_ROLE_ID || "685a3458ab3b53d133344a50";

  const requestBody = {
    username:
      payload.username || (payload.email ? payload.email.split("@")[0] : ""),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    employeeId: payload.employeeId,
    avatar: payload.avatar,
    position: payload.position,
    roleId,
    role: payload.role || "user",
    note: payload.note || "New User",
    status: payload.status || "active",
  };

  try {
    const res = await x_axios.post(
      "/api/v1/employees/register",
      requestBody
    );

    if (res.data?.success === false) {
      return {
        success: false,
        error: res.data?.message || "Registration failed",
        statusCode: res.status,
      };
    }

    const responsePayload = res.data?.data ?? res.data ?? {};
    const token =
      responsePayload?.token ?? responsePayload?.data?.token ?? null;
    const employee =
      responsePayload?.employee ?? responsePayload?.data?.employee ?? null;

    if (responsePayload) {
      const cookieStore = await cookies();

      if (token) {
        cookieStore.set("remote-ui-jwt", token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      if (employee) {
        cookieStore.set("remote-ui-profile", JSON.stringify(employee), {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return {
        success: true,
        data: responsePayload,
        autoLogin: Boolean(token),
      };
    }

    return { success: true, data: res.data, autoLogin: false };
  } catch (err) {
    console.error("Register error:", err);
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Registration failed",
      statusCode: err.response?.status || 500,
    };
  }
};

const lookupEmployeeById = async (employeeId) => {
  if (!employeeId?.trim()) {
    return {
      success: false,
      error: "Employee ID is required",
    };
  }

  try {
    const res = await x_axios_crm.get(
      `/api/v1/employee/public/${encodeURIComponent(employeeId.trim())}`
    );

    if (res.data?.success && res.data?.data) {
      return { success: true, data: res.data.data };
    }

    return {
      success: false,
      error: res.data?.message || "Employee not found",
    };
  } catch (err) {
    console.error("Employee lookup error:", err);
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "Employee lookup failed",
      statusCode: err.response?.status || 500,
    };
  }
};

const auth_logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("remote-ui-jwt");
    cookieStore.delete("remote-ui-profile");
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, error: "Logout failed" };
  }
};

export { login, register, lookupEmployeeById, auth_logout };
