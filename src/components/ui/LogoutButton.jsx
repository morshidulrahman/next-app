"use client";

import { auth_logout } from "@/actiions/auth";
import { redirect } from "next/navigation";

const LogoutButton = () => {
  const handleLogout = async () => {
    const result = await auth_logout();
    if (result.success) {
      return redirect("/login");
    }
  };
  return (
    <button
      onClick={handleLogout}
      className="inline-flex cursor-pointer items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Logout
    </button>
  );
};

export default LogoutButton;
