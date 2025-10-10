"use client";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export const SessionsError = ({ error, reset }) => {
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
        <div className="bg-white rounded-lg border border-red-100 shadow-sm p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Failed to Load Sessions
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {error?.message ||
                "We couldn't load your sessions data. This might be a temporary issue."}
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-32 text-red-600">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw size={18} />
              <span className="font-medium">Try Again</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <Home size={18} />
              <span className="font-medium">Go Home</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Still having issues?{" "}
              <a
                href="/support"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Help Card */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Quick Tip:</strong> Try refreshing your browser or clearing
            your cache if the problem persists.
          </p>
        </div>
      </div>
    </div>
  );
};
