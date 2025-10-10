// components/dashboard/WorkHoursLoading.jsx
export const WorkHoursLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 bg-gray-200 rounded-[4px] w-80"></div>
        <div className="h-5 bg-gray-200 rounded-[4px] w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[4px] border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-[4px]"></div>
                  <div className="h-3 bg-gray-200 rounded-[4px] w-24"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-[4px] w-20"></div>
                <div className="h-2 bg-gray-200 rounded-[4px] w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[4px] border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded-[4px] w-48 mb-4"></div>
            <div className="h-80 bg-gray-200 rounded-[4px]"></div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[4px] border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded-[4px] w-32 mb-4"></div>
            <div className="h-72 bg-gray-200 rounded-[4px]"></div>
          </div>
        </div>
      </div>

      {/* Calendar and Overview Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[4px] border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded-[4px] w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-[4px]"></div>
          </div>
        </div>
        <div className="bg-white rounded-[4px] border border-gray-100 p-6">
          <div className="h-6 bg-gray-200 rounded-[4px] w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded-[4px]"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
