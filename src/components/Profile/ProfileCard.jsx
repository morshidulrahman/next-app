"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ProfileCard({ profile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});
  const [isPending, startTransition] = useTransition();

  if (!profile) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 text-gray-700">
        Failed to load profile.
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
      gender: profile.gender || "",
      bankName: profile.bankName || "",
      bankBranch: profile.bankBranch || "",
      accountHolderName: profile.accountHolderName || "",
      accountNumber: profile.accountNumber || "",
      routingNumber: profile.routingNumber || "",
      swiftCode: profile.swiftCode || "",
      accountHolderAddress: profile.accountHolderAddress || "",
      accountHolderEmail: profile.accountHolderEmail || "",
      accountHolderPhone: profile.accountHolderPhone || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onSave) return;
    startTransition(async () => {
      const res = await onSave(formData);
      if (res?.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Optimistically update local profile object
        Object.assign(profile, formData);
      } else {
        toast.error(res?.error || "Failed to update profile");
      }
    });
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, type) => {
    return `${amount}/${type}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "employment", label: "Employment" },
    { id: "banking", label: "Banking Details" },
    { id: "rates", label: "Rate History" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar || "https://i.ibb.co/ZzLC3NQR/man-Avater.jpg"}
              alt={profile.employeeName}
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile.employeeName}</h2>
              <p className="text-primary-100">{profile.positionName}</p>
              <p className="text-primary-200 text-sm">ID: {profile._id}</p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    profile.employeeStatus
                  )}`}
                >
                  {profile.employeeStatus?.charAt(0).toUpperCase() +
                    profile.employeeStatus?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right text-white">
            <p className="text-primary-100 text-sm">Company</p>
            <p className="text-lg font-semibold">{profile.companyId?.name || "N/A"}</p>
            <p className="text-primary-200 text-sm">Avg Work Hours: {profile.avgWorkHours}h</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {!isEditing ? (
          <div className="space-y-6">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.employeeName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.employeeEmail}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.dob ? formatDate(profile.dob) : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">
                    {profile.gender || "N/A"}
                  </p>
                </div>

                {profile.note && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.note}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "employment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.positionName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.companyId?.name || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.createdAt ? formatDate(profile.createdAt) : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">
                    {profile.employeeStatus}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Work Hours</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.avgWorkHours} hours</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {formatCurrency(profile.actualRate, profile.actualRateType)}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "banking" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.bankName || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Branch</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.bankBranch || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.accountHolderName || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                    {profile.accountNumber ? `****${profile.accountNumber.slice(-4)}` : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">{profile.routingNumber || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">{profile.swiftCode || "N/A"}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Address</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.accountHolderAddress || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Email</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.accountHolderEmail || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Phone</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.accountHolderPhone || "N/A"}</p>
                </div>
              </div>
            )}

            {activeTab === "rates" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Salary Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-blue-700">Current Salary:</span>
                      <p className="font-medium text-blue-900">
                        {formatCurrency(profile.actualRate, profile.actualRateType)}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.futureActualRates && profile.futureActualRates.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Future Salary Changes</h4>
                    <div className="space-y-3">
                      {profile.futureActualRates.map((rate) => (
                        <div key={rate._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatCurrency(rate.actualRate, rate.actualRateType)}
                              </p>
                              <p className="text-sm text-gray-600">Effective from: {formatDate(rate.date)}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Scheduled
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No future rate changes scheduled</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob || ""}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName || ""}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Branch</label>
                  <input
                    type="text"
                    value={formData.bankBranch || ""}
                    onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter bank branch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.accountHolderName || ""}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber || ""}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={formData.routingNumber || ""}
                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter routing number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    value={formData.swiftCode || ""}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter SWIFT code"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Address</label>
                  <textarea
                    value={formData.accountHolderAddress || ""}
                    onChange={(e) => setFormData({ ...formData, accountHolderAddress: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account holder address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Email</label>
                  <input
                    type="email"
                    value={formData.accountHolderEmail || ""}
                    onChange={(e) => setFormData({ ...formData, accountHolderEmail: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account holder email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Phone</label>
                  <input
                    type="tel"
                    value={formData.accountHolderPhone || ""}
                    onChange={(e) => setFormData({ ...formData, accountHolderPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account holder phone"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
