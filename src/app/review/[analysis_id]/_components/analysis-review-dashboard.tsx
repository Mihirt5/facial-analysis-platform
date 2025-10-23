"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SectionContentEditor } from "./section-content-editor";
import { FillerContentButton } from "./filler-content-button";
import { ClaudeAnalysisButton } from "./claude-analysis-button";
import { AdditionalFeaturesEditor } from "./additional-features-editor";
import { Eye, Square, Droplets, Check, X, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AnalysisProcessorClient } from "~/components/analysis-processor-client";

interface AnalysisReviewDashboardProps {
  analysisId: string;
}

const subtabIcons = {
  eye_area: Eye,
  nose: Square,
  jaw: Square,
  skin: Droplets,
};

export function AnalysisReviewDashboard({
  analysisId,
}: AnalysisReviewDashboardProps) {
  const router = useRouter();
  const [activeSubtab, setActiveSubtab] = useState<string | null>(null);

  const {
    data: analysisStructure,
    isLoading,
    refetch,
  } = api.review.getAnalysisStructure.useQuery({ analysisId }, {
    enabled: !!analysisId && analysisId.length > 0, // Only run query when analysisId is available and not empty
  });

  // Get analysis info to determine status
  const { data: analysisInfo } = api.review.getAnalysisById.useQuery({
    id: analysisId,
  }, {
    enabled: !!analysisId && analysisId.length > 0, // Only run query when analysisId is available and not empty
  });

  const [openProcessDialog, setOpenProcessDialog] = useState(false);

  // Function to refresh completion status in header
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
      router.refresh(); // Refresh the page to update status
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
      router.refresh(); // Refresh the page to update status
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
        "Are you sure you want to mark this analysis as complete? This will prevent further editing.",
      )
    ) {
      markCompleteMutation.mutate({ analysisId });
    }
  };

  const handleMarkIncomplete = () => {
    if (
      confirm(
        "Are you sure you want to mark this analysis as incomplete? This will allow editing again.",
      )
    ) {
      markIncompleteMutation.mutate({ analysisId });
    }
  };

  const analysisStatus = analysisInfo?.status;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading analysis structure...</p>
        </div>
      </div>
    );
  }

  if (!analysisStructure || analysisStructure.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Structure</CardTitle>
          <CardDescription>Unable to load analysis structure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-gray-500">No analysis structure available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Facial Analysis Review
            <div className="flex items-center gap-3">
              {analysisStatus !== "complete" && (
                <Button
                  onClick={() => setOpenProcessDialog(true)}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Process Analysis
                </Button>
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
              <ClaudeAnalysisButton
                analysisId={analysisId}
                onSuccess={() => {
                  void refetch();
                  refreshCompletionStatus();
                }}
              />
              <FillerContentButton
                analysisId={analysisId}
                onSuccess={() => {
                  void refetch();
                  refreshCompletionStatus();
                }}
              />
            </div>
          </CardTitle>
          <CardDescription>
            {analysisStatus === "complete"
              ? "This analysis has been marked as complete. Editing is disabled."
              : "Review and annotate each section of the facial analysis with explanations and reference images. Each subtab requires additional features text."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Process Analysis Dialog */}
          <Dialog open={openProcessDialog} onOpenChange={setOpenProcessDialog}>
            <DialogContent className="max-w-2xl p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Process Analysis</DialogTitle>
              </DialogHeader>
              <div className="p-6 pt-0">
                {analysisInfo && (
                  <AnalysisProcessorClient
                    analysisId={analysisId}
                    images={{
                      front: analysisInfo.frontPicture,
                      left: analysisInfo.leftPicture,
                      right: analysisInfo.rightPicture,
                      leftSide: analysisInfo.leftSidePicture,
                      rightSide: analysisInfo.rightSidePicture,
                    }}
                    onComplete={() => {
                      setOpenProcessDialog(false);
                      void refetch();
                      refreshCompletionStatus();
                    }}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Tabs
            value={activeSubtab ?? analysisStructure[0]?.key}
            onValueChange={setActiveSubtab}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-4">
              {analysisStructure.map((subtab) => {
                const IconComponent =
                  subtabIcons[subtab.key as keyof typeof subtabIcons];
                return (
                  <TabsTrigger
                    key={subtab.key}
                    value={subtab.key}
                    className="flex items-center gap-2"
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span className="hidden sm:inline">{subtab.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {analysisStructure.map((subtab) => (
              <TabsContent
                key={subtab.key}
                value={subtab.key}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {subtab.name} Analysis
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete the analysis for each {subtab.name.toLowerCase()}{" "}
                    section and the required additional features below
                  </p>
                </div>

                <div className="grid gap-4">
                  {subtab.sections
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((section) => (
                      <SectionContentEditor
                        key={section.key}
                        section={section}
                        subtabName={subtab.name}
                        analysisId={analysisId}
                        analysisStatus={analysisStatus ?? "in_progress"}
                        onUpdate={() => {
                          void refetch();
                          refreshCompletionStatus();
                        }}
                      />
                    ))}

                  {/* Additional Features Editor - positioned with other sections */}
                  <AdditionalFeaturesEditor
                    subtab={subtab}
                    analysisId={analysisId}
                    analysisStatus={analysisStatus ?? "in_progress"}
                    onUpdate={() => {
                      void refetch();
                      refreshCompletionStatus();
                    }}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
