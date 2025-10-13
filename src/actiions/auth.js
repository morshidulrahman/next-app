"use server";

import x_axios from "@/lib/axios";
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
    
    // Return error details for better handling
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Login failed",
      statusCode: err.response?.status || 500
    };
  }
};

export { login };
