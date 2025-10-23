import { redirect } from "next/navigation";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { auth } from "~/server/utils/auth";
import { api } from "~/trpc/server";
import { UploadFacesClient } from "../create-analysis/_components/upload-faces-client";
import { UploadIntakeClient } from "../create-analysis/_components/upload-intake-client";
import type { Metadata } from "next";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export const metadata: Metadata = {
  title: "Test Create Analysis | Parallel",
  description: "Test create analysis functionality without subscription",
};

export default async function TestCreateAnalysisPage() {
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  // Redirect to auth if not authenticated
  if (!session?.user) {
    redirect("/auth");
  }

  // Skip subscription check for testing
  // const subscriptionData = await api.subscription.isSubscribed();
  // if (!subscriptionData.isSubscribed) {
  //   redirect("/payment");
  // }

  const existingAnalysis = await api.analysis.getFirstAnalysis();

  // Redirect to analysis if user already has one
  if (existingAnalysis) {
    redirect("/analysis");
  }

  // Check if user has completed intake
  const existingIntake = await api.intake.getMine();

  // If intake is completed, show upload faces directly
  if (existingIntake) {
    return (
      <TwoColumnLayout rightPanelTitle="TEST CREATE ANALYSIS">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Test Mode</h3>
            <p className="text-yellow-700 text-sm">
              This is a test version that bypasses subscription requirements. 
              You can test the full create-analysis functionality here.
            </p>
          </div>
          <UploadFacesClient />
        </div>
      </TwoColumnLayout>
    );
  }

  // If no intake completed, show the intake form
  return (
    <TwoColumnLayout rightPanelTitle="TEST CREATE ANALYSIS">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Test Mode</h3>
          <p className="text-yellow-700 text-sm">
            This is a test version that bypasses subscription requirements. 
            You can test the full create-analysis functionality here.
          </p>
        </div>
        <UploadIntakeClient userName={session.user.name} />
      </div>
    </TwoColumnLayout>
  );
}
