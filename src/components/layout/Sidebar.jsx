"use client";

import { SIDEBAR_ITEMS } from "@/utils/constant";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="rounded-lg">
            <Image
              height={32}
              width={32}
              src="https://i.ibb.co.com/k6P3pGVZ/output-onlinepngtools-1.png"
              alt={"Logo"}
              className="h-8 w-8"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">RemoteIntegrity</h2>
            <p className="text-xs text-gray-600">Employee Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path; // Check current path

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-l-2 border-primary-600"
                    : "text-gray-700 hover:bg-gray-100 rounded-lg hover:text-gray-900"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 w-fit">
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 max-w-[220px]">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-sm font-medium text-gray-800">
              Desktop Application
            </div>
            <div className="text-xs text-gray-600 text-center">
              Download our desktop app to track your work hours
            </div>
            <Link
              href="/download"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-xs font-medium text-center transition-colors"
            >
              Go to Download Page
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
