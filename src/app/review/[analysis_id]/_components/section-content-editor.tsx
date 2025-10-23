"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Edit2, Save, X, ImageIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";

interface SectionContentEditorProps {
  section: {
    key: string;
    name: string;
    displayOrder: number;
    content: {
      id: string;
      image?: string | null;
      explanation?: string | null;
      updatedAt: Date;
    } | null;
  };
  subtabName: string;
  analysisId: string;
  analysisStatus: string;
  onUpdate: () => void;
}

export function SectionContentEditor({
  section,
  analysisId,
  analysisStatus,
  onUpdate,
}: SectionContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    explanation: section.content?.explanation ?? "",
    image: section.content?.image ?? "",
  });

  const updateContent = api.review.updateSectionContent.useMutation({
    onSuccess: () => {
      toast.success("Section updated successfully");
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
      sectionKey: section.key,
      explanation: formData.explanation,
      image: formData.image,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      explanation: section.content?.explanation ?? "",
      image: section.content?.image ?? "",
    });
  };

  const hasContent = section.content?.explanation ?? section.content?.image;
  const isComplete = section.content?.explanation && section.content?.image;
  const isAnalysisComplete = analysisStatus === "complete";

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{section.name}</CardTitle>
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
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <h4 className="mb-3 font-medium text-gray-900">Reference Image</h4>
            {formData.image ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={formData.image}
                    alt={`${section.name} reference`}
                    className="h-48 w-full max-w-md rounded-lg border object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9Ijk2IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAwIDEzNkMyMDAgMTI3LjE2MyAxOTEuODM3IDExOSAxODAgMTE5QzE2OC4xNjMgMTE5IDE2MCAxMjcuMTYzIDE2MCAxMzYiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMTYwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
                    }}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setFormData((prev) => ({
                          ...prev,
                          image: res[0]?.url ?? "",
                        }));
                        toast.success("Image uploaded successfully");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-sm text-gray-500">
                    Upload a reference image for {section.name}
                  </p>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setFormData((prev) => ({
                          ...prev,
                          image: res[0]?.url ?? "",
                        }));
                        toast.success("Image uploaded successfully");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Explanation Section */}
          <div>
            <h4 className="mb-3 font-medium text-gray-900">
              Analysis Explanation
            </h4>
            <textarea
              value={formData.explanation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              placeholder={`Enter detailed analysis and explanation for ${section.name}...`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={6}
            />
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
            <CardTitle className="text-lg">{section.name}</CardTitle>
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
          {/* Display current image */}
          {section.content?.image && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Reference Image
              </h4>
              <img
                src={section.content.image}
                alt={`${section.name} reference`}
                className="h-32 w-full max-w-sm rounded-lg border object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjY0IiByPSIyNCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjQwIDEwNEMyNDAgOTUuMTYzIDIzMS44MzcgODcgMjIwIDg3QzIwOC4xNjMgODcgMjAwIDk1LjE2MyAyMDAgMTA0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
            </div>
          )}

          {/* Display current explanation */}
          {section.content?.explanation ? (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Analysis
              </h4>
              <p className="text-sm leading-relaxed text-gray-700">
                {section.content.explanation}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center">
              <p className="text-sm text-gray-500">
                No analysis provided yet for {section.name}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => setIsEditing(true)}
                disabled={isAnalysisComplete}
                title={
                  isAnalysisComplete
                    ? "Cannot edit completed analysis"
                    : undefined
                }
              >
                <Edit2 className="mr-1 h-4 w-4" />
                {isAnalysisComplete ? "Locked" : "Add Analysis"}
              </Button>
            </div>
          )}

          {section.content?.updatedAt && (
            <p className="text-xs text-gray-400">
              Last updated:{" "}
              {new Date(section.content.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
