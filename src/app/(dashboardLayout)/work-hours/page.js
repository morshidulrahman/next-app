// app/sessions/page.js
import { getEmployeeProfile, getSessions } from "@/actiions/session";
import { SessionsError } from "@/components/dashboard/session/SessionsError";
import SessionsList from "@/components/dashboard/session/SessionsList";
import { SessionsLoading } from "@/components/dashboard/session/SessionsLoading";
import { useProfile } from "@/lib/useProfile";
import {
  getFloridaDateRangeFromLocalDates,
  getUTCDateRangeForLocalDates,
} from "@/utils/timezone";
import { Suspense } from "react";

async function SessionsContent({ searchParams }) {
  try {
    const params = await searchParams;
    const profile = await useProfile();

    if (!profile?.employeeId) {
      throw new Error("Employee ID not found");
    }

    const startDate =
      params.startDate || new Date().toLocaleDateString("en-CA");
    const endDate = params.endDate || new Date().toLocaleDateString("en-CA");
    const timezone = params.timezone || "Asia/Dhaka";
    const isManual = params.isManual === "true";
    const searchTerm = params.search || "";
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "10");
    const sortField = params.sortBy || "startTime";
    const sortOrder = params.order || "desc";

    // Get UTC date range based on timezone
    const { startUTC, endUTC } =
      timezone === "America/New_York"
        ? getFloridaDateRangeFromLocalDates(startDate, endDate)
        : getUTCDateRangeForLocalDates(startDate, endDate);

    // Fetch sessions and employee data in parallel
    const [sessionsResult, employeeResult] = await Promise.all([
      getSessions({
        employeeId: profile.employeeId,
        projectId: params.projectId,
        organizationId: params.organizationId,
        startUTC,
        endUTC,
        isManual,
        searchTerm,
        page,
        limit,
        sortField,
        sortOrder,
        isDeleted: false,
      }),
      getEmployeeProfile(profile.employeeId),
    ]);

    if (!sessionsResult.success) {
      throw new Error(sessionsResult.error);
    }

    return (
      <SessionsList
        initialData={sessionsResult.data}
        employee={employeeResult.data}
        user={profile}
        projectId={params.projectId}
        organizationId={params.organizationId}
      />
    );
  } catch (error) {
    console.error("Error loading sessions:", error);
    return <SessionsError error={error} />;
  }
}

export default async function SessionsPage({ searchParams }) {
  const params = await searchParams;
  return (
    <div className="container mx-auto">
      <Suspense fallback={<SessionsLoading />}>
        <SessionsContent searchParams={params} />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Work Sessions - Time Tracker",
  description: "View and manage your work sessions",
};
