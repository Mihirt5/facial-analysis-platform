import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/utils/auth";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { AnalysisTable } from "~/components/analysis-table";
import { SubscriptionUsersTable } from "~/components/subscription-users-table";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export default async function ReviewPage() {
  try {
    // Get session on server side
    const session = await auth.api.getSession({
      headers: await getSanitizedHeaders(),
    });

    // Redirect if not authenticated
    if (!session?.user) {
      redirect("/auth");
    }

    // Check if user has reviewer/admin access and get data
    const { hasAccess } = await api.review.checkAccess();

    // If user doesn't have access, redirect to /auth
    // which is effectively a catch all route
    if (!hasAccess) {
      redirect("/auth");
    }
  } catch (error) {
    console.error("Error in ReviewPage authentication:", error);
    redirect("/auth");
  }

  let stats: any;
  let analyses: any[] = [];
  let usersWithSubscriptionsButNoAnalyses: any[] = [];
  let hitrate: any;
  let hitrate72h: any;
  
  try {
    [
      stats,
      analyses,
      usersWithSubscriptionsButNoAnalyses,
      hitrate,
      hitrate72h,
    ] = await Promise.all([
      api.review.getDashboardStats(),
      api.review.getAllAnalyses(),
      api.review.getUsersWithSubscriptionsButNoAnalyses(),
      api.review.getHitrate(),
      api.review.get72HourHitrate(),
    ]);
  } catch (error) {
    console.error("Error loading review data:", error);
    throw error;
  }
  
  // Ensure analyses is always an array
  if (!analyses || !Array.isArray(analyses)) {
    analyses = [];
  }

  return (
    <>
      <SidebarTrigger className="absolute top-2 left-2 z-10" />
      {/* Main content */}
      <main className="min-h-screen flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="sm:px-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage analyses, morphs, and recommendations</p>
            </div>

            {/* Compact Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{stats?.inProgress || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">In Progress</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats?.ready || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Ready</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
              </div>
            </div>

            {/* Analyses table */}
            <AnalysisTable analyses={analyses} />

            {/* Subscribed users without analyses */}
            {usersWithSubscriptionsButNoAnalyses.length > 0 && (
              <div className="mt-8">
                <SubscriptionUsersTable
                  users={usersWithSubscriptionsButNoAnalyses}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
