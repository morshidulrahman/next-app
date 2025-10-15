"use client";

import { useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next/client"; // ✅ use cookies-next

const authApiBaseUrl = process.env.NEXT_PUBLIC_API_AUTH_URL;

if (!authApiBaseUrl && process.env.NODE_ENV !== "production") {
  console.warn(
    "useAxiosSecureAuth: Missing NEXT_PUBLIC_API_AUTH_URL (or API_AUTH_URL) – requests will be relative to the current origin."
  );
}

// 🔗 Create a reusable axios instance
export const axiosSecureAuth = axios.create({
  baseURL: authApiBaseUrl,
});

const useAxiosSecureAuth = () => {
  useEffect(() => {
    // ✅ Request interceptor
    const reqInterceptor = axiosSecureAuth.interceptors.request.use(
      (config) => {
        const token = getCookie("remote-ui-jwt"); // 🍪 cleaner and SSR-safe
        console.log(token, "token from cookies-next");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor
    const resInterceptor = axiosSecureAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("Auth error in interceptor", error?.response);

        if (
          error?.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // You could trigger logout, token refresh, or redirect here
        }

        return Promise.reject(error);
      }
    );

    // 🧹 Cleanup interceptors on unmount
    return () => {
      axiosSecureAuth.interceptors.request.eject(reqInterceptor);
      axiosSecureAuth.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return axiosSecureAuth;
};

export default useAxiosSecureAuth;
