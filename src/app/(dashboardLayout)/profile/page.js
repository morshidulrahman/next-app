import { useProfile } from "@/lib/useProfile";
import { getEmployeeProfile } from "@/actiions/session";
import ProfileCard from "@/components/Profile/ProfileCard";

export default async function ProfilePage() {
  const user = await useProfile();
  const employeeId = user?.employeeId;

  let profile = null;
  if (employeeId) {
    const result = await getEmployeeProfile(employeeId);
    if (result.success) profile = result.data;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>
      <ProfileCard profile={profile} employeeId={employeeId} />
    </div>
  );
}
