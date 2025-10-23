"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

interface FillerContentButtonProps {
  analysisId: string;
  onSuccess?: () => void;
}

export function FillerContentButton({
  analysisId,
  onSuccess,
}: FillerContentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createFillerMutation = api.review.createFillerContent.useMutation({
    onSuccess: (result) => {
      console.log("Filler content created:", result);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error creating filler content:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleCreateFiller = async () => {
    setIsLoading(true);
    createFillerMutation.mutate({ analysisId });
  };

  return (
    <Button
      onClick={handleCreateFiller}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="border-orange-200 text-orange-700 hover:bg-orange-50"
    >
      {isLoading ? "Creating..." : "🧪 Create Filler Content"}
    </Button>
  );
}
