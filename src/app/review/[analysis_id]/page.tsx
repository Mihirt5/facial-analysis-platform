"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Check, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClaudeAnalysisButton } from "./_components/claude-analysis-button";

interface AnalysisReviewPageProps {
  params: Promise<{
    analysis_id: string;
  }>;
}

export default function AnalysisReviewPage({ params }: AnalysisReviewPageProps) {
  const router = useRouter();
  const [analysisId, setAnalysisId] = useState<string>("");

  // Resolve params promise
  useEffect(() => {
    params
      .then((resolvedParams) => {
        setAnalysisId(resolvedParams.analysis_id);
      })
      .catch((error) => {
        console.error("Error resolving params:", error);
        // Set a fallback or handle the error appropriately
        setAnalysisId("");
      });
  }, [params]);

  // Get analysis info to determine status
  const { data: analysisInfo, isLoading: analysisLoading } = api.review.getAnalysisById.useQuery({
    id: analysisId,
  }, {
    enabled: !!analysisId, // Only run query when analysisId is available
  });

  // Debug logging
  useEffect(() => {
    console.log('AnalysisReviewPage render - analysisId:', analysisId);
  }, [analysisId]);

  // Function to refresh completion status
  const refreshCompletionStatus = () => {
    if (
      typeof window !== "undefined" &&
      "refreshCompletionStatus" in window &&
      typeof (window as { refreshCompletionStatus?: () => void })
        .refreshCompletionStatus === "function"
    ) {
      (
        window as { refreshCompletionStatus: () => void }
      ).refreshCompletionStatus();
    }
  };

  const markCompleteMutation = api.review.markAnalysisComplete.useMutation({
    onSuccess: () => {
      refreshCompletionStatus();
      router.refresh();
    },
    onError: (error) => {
      console.error("Error marking analysis complete:", error);
      alert(
        "Error marking analysis complete: " +
          (error?.message ?? "Unknown error"),
      );
    },
  });

  const markIncompleteMutation = api.review.markAnalysisIncomplete.useMutation({
    onSuccess: () => {
      refreshCompletionStatus();
      router.refresh();
    },
    onError: (error) => {
      console.error("Error marking analysis incomplete:", error);
      alert(
        "Error marking analysis incomplete: " +
          (error?.message ?? "Unknown error"),
      );
    },
  });

  const handleMarkComplete = () => {
    if (
      confirm(
        "Are you sure you want to mark this analysis as complete? This will make it available to the user.",
      )
    ) {
      markCompleteMutation.mutate({ analysisId });
    }
  };

  const handleMarkIncomplete = () => {
    if (
      confirm(
        "Are you sure you want to mark this analysis as incomplete? This will hide it from the user.",
      )
    ) {
      markIncompleteMutation.mutate({ analysisId });
    }
  };

  const analysisStatus = analysisInfo?.status;

  if (analysisLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisInfo) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500">Analysis not found</p>
          <Button
            onClick={() => router.push("/review/orders")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push("/review/orders")}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Review</h1>
          <p className="text-sm text-gray-500">ID: {analysisId}</p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Analysis Status
            <Badge
              variant={
                analysisStatus === "complete"
                  ? "default"
                  : analysisStatus === "ready"
                  ? "secondary"
                  : "outline"
              }
              className={
                analysisStatus === "complete"
                  ? "bg-green-100 text-green-800"
                  : analysisStatus === "ready"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {analysisStatus === "complete"
                ? "Complete"
                : analysisStatus === "ready"
                ? "Ready"
                : "In Progress"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {analysisStatus === "complete"
              ? "This analysis has been processed and is available to the user."
              : analysisStatus === "ready"
              ? "Analysis is complete. Ready to be marked as complete for the user."
              : "Analysis is in progress or not yet started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* All Photos Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Uploaded Photos</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {analysisInfo.frontPicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Front Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.frontPicture}
                        alt="Front photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
                {analysisInfo.leftPicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Left Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.leftPicture}
                        alt="Left photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
                {analysisInfo.rightPicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Right Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.rightPicture}
                        alt="Right photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
                {analysisInfo.leftSidePicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Left Side Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.leftSidePicture}
                        alt="Left side photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
                {analysisInfo.rightSidePicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Right Side Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.rightSidePicture}
                        alt="Right side photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
                {analysisInfo.hairlinePicture && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">Hairline Photo</h4>
                    <div className="relative">
                      <img
                        src={analysisInfo.hairlinePicture}
                        alt="Hairline photo"
                        className="h-32 w-full rounded-lg object-contain bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Admin Feedback</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  {analysisStatus === "complete"
                    ? "Analysis has been reviewed and approved for the user."
                    : analysisStatus === "ready"
                    ? "Analysis is complete. Ready for admin review."
                    : "Analysis is pending processing."}
                </p>
                {analysisInfo.user && (
                  <div className="mt-3 text-xs text-gray-500">
                    <p><strong>User:</strong> {analysisInfo.user.name}</p>
                    <p><strong>Email:</strong> {analysisInfo.user.email}</p>
                    <p><strong>Created:</strong> {new Date(analysisInfo.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Generate Analysis Button */}
              {analysisStatus !== "complete" && (
                <ClaudeAnalysisButton
                  analysisId={analysisId}
                  onSuccess={() => {
                    refreshCompletionStatus();
                    router.refresh();
                  }}
                />
              )}
              
              {analysisStatus === "ready" && (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markCompleteMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              )}
              {analysisStatus === "complete" && (
                <Button
                  onClick={handleMarkIncomplete}
                  disabled={markIncompleteMutation.isPending}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Mark Incomplete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
