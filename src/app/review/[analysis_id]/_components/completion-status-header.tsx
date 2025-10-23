"use client";

import { api } from "~/trpc/react";

interface CompletionStatusHeaderProps {
  analysisId: string;
  analysisTitle: string;
}

export function CompletionStatusHeader({
  analysisId,
  analysisTitle,
}: CompletionStatusHeaderProps) {
  const {
    data: completionStatus,
    isLoading,
    refetch,
  } = api.analysis.checkAnalysisCompletion.useQuery({ analysisId });

  // Expose refetch function globally so other components can trigger updates
  if (typeof window !== "undefined") {
    (
      window as Window & { refreshCompletionStatus?: () => void }
    ).refreshCompletionStatus = () => void refetch();
  }

  if (isLoading) {
    return (
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {analysisTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              ID: {analysisId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!completionStatus) {
    return (
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {analysisTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              ID: {analysisId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {analysisTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            ID: {analysisId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
              completionStatus.status === "complete"
                ? "border-green-200 bg-green-100 text-green-800"
                : completionStatus.status === "ready"
                  ? "border-blue-200 bg-blue-100 text-blue-800"
                  : "border-orange-200 bg-orange-100 text-orange-800"
            }`}
          >
            {completionStatus.status === "complete"
              ? "Complete"
              : completionStatus.status === "ready"
                ? "Ready for Review"
                : "In Progress"}
          </span>
          {completionStatus.status !== "complete" && (
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <span>
                Processing...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
