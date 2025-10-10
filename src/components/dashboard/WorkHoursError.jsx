"use client";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkHoursError = ({ error, reset }) => {
  const router = useRouter();

  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[4px] border border-red-100 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-[4px] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Failed to Load Dashboard
            </h3>
            <p className="text-gray-600 text-sm">
              {error?.message ||
                "We couldn't load your work hours data. This might be a temporary issue."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-[4px] hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-[4px] hover:bg-gray-200 transition-colors"
            >
              Go to Home
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
