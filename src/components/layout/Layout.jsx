import { Sidebar } from "./Sidebar";
import LogoutButton from "../ui/LogoutButton";

const LayoutSide = ({ children, profile }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Employee Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    profile?.avatar?.trim()
                      ? profile.avatar
                      : "https://i.ibb.co/ZzLC3NQR/man-Avater.jpg"
                  }
                  alt={profile?.name || profile?.username || "User"}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.name || profile?.username || "User"}
                  </span>

                  {profile?.position && (
                    <span className="text-xs text-gray-500">
                      {profile.position}
                    </span>
                  )}
                </div>
              </div>
              {/* logout button */}
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutSide;
