import { Suspense } from "react";
import { WorkHours } from "@/components/dashboard/WorkHours";
import { WorkHoursLoading } from "@/components/dashboard/WorkHoursLoading";
import { WorkHoursError } from "@/components/dashboard/WorkHoursError";
import { useProfile } from "@/lib/useProfile";
import {
  get_monthly_calender_data,
  get_monthly_stas,
} from "@/actiions/working";

async function DashboardContent() {
  try {
    const profile = await useProfile();

    if (!profile?.employeeId) {
      throw new Error("Employee ID not found");
    }

    const [monthly_statsData, monthly_calenderData] = await Promise.all([
      get_monthly_stas(profile.employeeId),
      get_monthly_calender_data(profile.employeeId),
    ]);

    const monthlyStats = monthly_statsData?.data || null;
    const monthlyCalendarData = monthly_calenderData?.data || null;

    return (
      <WorkHours
        monthlyStats={monthlyStats}
        monthlyCalendarData={monthlyCalendarData}
      />
    );
  } catch (error) {
    return <WorkHoursError error={error} />;
  }
}

export default function Page() {
  return (
    <>
      <Suspense fallback={<WorkHoursLoading />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
