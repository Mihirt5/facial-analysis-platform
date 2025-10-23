"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Edit2, Save, X, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AdditionalFeaturesEditorProps {
  subtab: {
    key: string;
    name: string;
    additionalFeatures: {
      id: string;
      text?: string | null;
      updatedAt: Date;
    } | null;
  };
  analysisId: string;
  analysisStatus: string;
  onUpdate: () => void;
}

export function AdditionalFeaturesEditor({
  subtab,
  analysisId,
  analysisStatus,
  onUpdate,
}: AdditionalFeaturesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    additionalFeatures: subtab.additionalFeatures?.text ?? "",
  });

  const updateContent = api.review.updateSectionContent.useMutation({
    onSuccess: () => {
      toast.success("Additional features updated successfully");
      setIsEditing(false);
      onUpdate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    updateContent.mutate({
      analysisId,
      sectionKey: subtab.key, // Use subtab key for additional features
      additionalFeatures: formData.additionalFeatures,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      additionalFeatures: subtab.additionalFeatures?.text ?? "",
    });
  };

  const hasContent = subtab.additionalFeatures?.text;
  const isComplete = subtab.additionalFeatures?.text; // For additional features, text content means complete
  const isAnalysisComplete = analysisStatus === "complete";

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">
                Additional Features - {subtab.name}
              </CardTitle>
              <Badge variant="outline">Editing</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateContent.isPending}
              >
                <Save className="mr-1 h-4 w-4" />
                {updateContent.isPending ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className="mb-3 font-medium text-gray-900">
              Additional Features Text
            </h4>
            <textarea
              value={formData.additionalFeatures}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalFeatures: e.target.value,
                }))
              }
              placeholder={`Enter required additional features description that will appear at the top of the ${subtab.name} tab...`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
            />
            <p className="mt-2 text-xs text-gray-500">
              This required text will replace the placeholder text shown to
              users at the top of the {subtab.name} analysis tab.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${
        isAnalysisComplete
          ? "border-gray-300 bg-gray-50"
          : isComplete
            ? "border-green-200"
            : hasContent
              ? "border-yellow-200"
              : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-lg">Additional Features</CardTitle>
            {isAnalysisComplete && (
              <Badge variant="default" className="bg-gray-100 text-gray-800">
                Analysis Complete
              </Badge>
            )}
            {!isAnalysisComplete && isComplete && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Complete
              </Badge>
            )}
            {!isAnalysisComplete && hasContent && !isComplete && (
              <Badge
                variant="outline"
                className="border-yellow-400 text-yellow-700"
              >
                In Progress
              </Badge>
            )}
            {!isAnalysisComplete && !hasContent && (
              <Badge variant="outline" className="text-gray-500">
                Not Started
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={isAnalysisComplete}
            title={
              isAnalysisComplete ? "Cannot edit completed analysis" : undefined
            }
          >
            <Edit2 className="mr-1 h-4 w-4" />
            {isAnalysisComplete
              ? "Locked"
              : hasContent
                ? "Edit"
                : "Add Content"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasContent ? (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Additional Features
              </h4>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm leading-relaxed text-gray-700">
                  {subtab.additionalFeatures?.text}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 py-6 text-center">
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="0 text-sm font-medium">
                No additional features text set
              </p>
              <p className="mt-1 text-xs text-gray-400">
                This text will appear at the top of the {subtab.name} analysis
                tab and is required for completion
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setIsEditing(true)}
                disabled={isAnalysisComplete}
                title={
                  isAnalysisComplete
                    ? "Cannot edit completed analysis"
                    : undefined
                }
              >
                <Edit2 className="mr-1 h-4 w-4" />
                {isAnalysisComplete ? "Locked" : "Add Content"}
              </Button>
            </div>
          )}

          {subtab.additionalFeatures?.updatedAt && (
            <p className="text-xs text-gray-400">
              Last updated:{" "}
              {new Date(subtab.additionalFeatures.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
