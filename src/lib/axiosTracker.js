"use server";
import axios from "axios";
import { cookies } from "next/headers";

const x_axios_tracker = axios.create({
  baseURL: process.env.API_TRACKER_URL,
  timeout: 0,
  withCredentials: true,
});

x_axios_tracker.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("remote-ui-jwt")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

x_axios_tracker.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const cookieStore = await cookies();
    if (error.response?.status === 401) {
      cookieStore.delete("remote-ui-jwt");
      cookieStore.delete("remote-ui-profile");
    }
    return Promise.reject(error);
  }
);

export default x_axios_tracker;
