"use client";
import axios from "axios";
import { useEffect } from "react";
import { getCookie } from "cookies-next/client";

const crmApiBaseUrl = process.env.NEXT_PUBLIC_API_CRM_URL;

export const axiosSecure = axios.create({
  baseURL: crmApiBaseUrl,
});

const useAxiosSecure = () => {
  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = getCookie("remote-ui-jwt");
        console.log(token, "token from cookies-next");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Optionally: handle logout or token refresh here
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
