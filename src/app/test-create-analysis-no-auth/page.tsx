"use client";

import { useState } from "react";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { UploadFacesClient } from "../create-analysis/_components/upload-faces-client";
import { UploadIntakeClient } from "../create-analysis/_components/upload-intake-client";

export default function TestCreateAnalysisNoAuthPage() {
  const [hasCompletedIntake, setHasCompletedIntake] = useState(false);
  const [userName, setUserName] = useState("Test User");

  return (
    <TwoColumnLayout rightPanelTitle="TEST CREATE ANALYSIS (NO AUTH)">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Test Mode - No Authentication</h3>
          <p className="text-blue-700 text-sm mb-4">
            This is a test version that completely bypasses authentication and subscription requirements. 
            You can test the full create-analysis functionality here.
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Test User Name:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test user name"
            />
          </div>
        </div>

        {!hasCompletedIntake ? (
          <div>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Step 1: Complete Intake Form</h4>
              <p className="text-green-700 text-sm">
                Fill out the intake form below. This simulates the user onboarding process.
              </p>
            </div>
            <UploadIntakeClient 
              userName={userName}
              onCompleted={() => setHasCompletedIntake(true)}
              showUploadAfterFinish={false}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Step 2: Upload Face Photos</h4>
              <p className="text-green-700 text-sm">
                Now upload your face photos for analysis. This is the main create-analysis functionality.
              </p>
            </div>
            <UploadFacesClient />
          </div>
        )}
      </div>
    </TwoColumnLayout>
  );
}
