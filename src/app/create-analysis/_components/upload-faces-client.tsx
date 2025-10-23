"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";

interface UploadedImage {
  url: string;
  key: string;
}

interface FaceImages {
  front: UploadedImage | null;
  leftThreeQuarter: UploadedImage | null;
  rightThreeQuarter: UploadedImage | null;
  leftSide: UploadedImage | null;
  rightSide: UploadedImage | null;
  hairline: UploadedImage | null;
}

const imageTypes = [
  {
    key: "front" as keyof FaceImages,
    title: "1. Front Facing",
    description: "Look directly at the camera with a neutral expression",
    icon: "👤",
  },
  {
    key: "leftThreeQuarter" as keyof FaceImages,
    title: "2. 3/4 Left",
    description: "Turn your head 45 degrees to the left",
    icon: "↖️",
  },
  {
    key: "rightThreeQuarter" as keyof FaceImages,
    title: "3. 3/4 Right",
    description: "Turn your head 45 degrees to the right",
    icon: "↗️",
  },
  {
    key: "leftSide" as keyof FaceImages,
    title: "4. Side Profile Left",
    description: "Turn your head completely to the left (90 degrees)",
    icon: "⬅️",
  },
  {
    key: "rightSide" as keyof FaceImages,
    title: "5. Side Profile Right",
    description: "Turn your head completely to the right (90 degrees)",
    icon: "➡️",
  },
  {
    key: "hairline" as keyof FaceImages,
    title: "6. Hairline",
    description: "Tilt chin slightly down; keep forehead and hairline in frame",
    icon: "💇",
  },
];

export function UploadFacesClient() {
  const router = useRouter();
  const [images, setImages] = useState<FaceImages>({
    front: null,
    leftThreeQuarter: null,
    rightThreeQuarter: null,
    leftSide: null,
    rightSide: null,
    hairline: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const createAnalysisMutation = api.analysis.create.useMutation({
    onSuccess: (data) => {
      if (data?.id) {
        router.push(`/analysis`);
      }
    },
    onError: (error) => {
      console.error("Failed to create analysis:", error);
      setIsSubmitting(false);
    },
  });

  const intakeUpsertMutation = api.intake.upsert.useMutation();

  const handleImageUpload = (
    type: keyof FaceImages,
    files: { url: string; key: string }[],
  ) => {
    if (files?.[0]) {
      setImages((prev) => ({
        ...prev,
        [type]: { url: files[0]?.url, key: files[0]?.key },
      }));
      // Advance to next step automatically if available
      const nextIndex = imageTypes.findIndex((t) => t.key === type) + 1;
      if (nextIndex < imageTypes.length) {
        setCurrentStepIndex(nextIndex);
      }
    }
  };

  const removeImage = (type: keyof FaceImages) => {
    setImages((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const allImagesUploaded = Object.values(images).every((img) => img !== null);
  const uploadedCount = Object.values(images).filter((img) => img !== null).length;
  const clampedIndex = Math.max(
    0,
    Math.min(currentStepIndex, imageTypes.length - 1),
  );
  const currentType = imageTypes[clampedIndex];

  const handleSubmit = async () => {
    if (!allImagesUploaded) return;

    setIsSubmitting(true);

    try {
      // Apply any onboarding draft data server-side now if available
      const draftRaw = typeof window !== "undefined" ? localStorage.getItem("onboardingDraft") : null;
      if (draftRaw) {
        try {
          const draft = JSON.parse(draftRaw);
          // Best-effort save of intake before creating analysis
          await intakeUpsertMutation.mutateAsync({
            data: {
              firstName: draft.firstName || "",
              lastName: draft.lastName || "",
              ageBracket: draft.ageBracket || "18-24",
              country: draft.country || "USA",
              ethnicities: draft.ethnicities || ["Other"],
              focus: draft.focus || "Overall upgrade",
              treatments: draft.treatments || ["None"],
            },
            completed: true,
          } as any);
        } catch (e) {
          console.warn("Failed to apply onboarding draft before analysis create", e);
        }
      }

      await createAnalysisMutation.mutateAsync({
        frontPicture: images.front!.url,
        leftPicture: images.leftThreeQuarter!.url,
        rightPicture: images.rightThreeQuarter!.url,
        leftSidePicture: images.leftSide!.url,
        rightSidePicture: images.rightSide!.url,
      });
      // After successful submission, clear draft and prevent revisiting
      if (typeof window !== "undefined") {
        localStorage.removeItem("onboardingDraft");
      }
    } catch (error) {
      console.error("Error creating analysis:", error);
      setIsSubmitting(false);
    }
  };

  if (!currentType) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-3">
        {imageTypes.map((t, idx) => {
          const done = images[t.key] !== null;
          const active = idx === currentStepIndex;
          return (
            <div key={t.key} className="flex items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-700"
                }`}
                title={t.title}
              >
                {idx + 1}
              </div>
              {idx < imageTypes.length - 1 && (
                <div className="mx-2 h-0.5 w-8 bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step upload card */}
      <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 text-center">
          <div className="mb-2 text-4xl">{currentType.icon}</div>
          <h3 className="mb-1 font-['Tobias'] text-2xl font-bold text-gray-900">
            {currentType.title}
          </h3>
          <p className="text-sm text-gray-600">{currentType.description}</p>
        </div>

        {images[currentType.key] ? (
          <div className="space-y-4">
            <img
              src={images[currentType.key]!.url}
              alt={`${currentType.title} preview`}
              className="h-72 w-full rounded-xl border object-cover"
            />
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => removeImage(currentType.key)}
              >
                Replace
              </Button>
              {currentStepIndex < imageTypes.length - 1 ? (
                <Button onClick={() => setCurrentStepIndex((i) => i + 1)}>
                  Next Pose
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allImagesUploaded || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed p-6 text-center">
            {/* Native capture hint on mobile via hidden file input */}
            <label className="mx-auto mb-3 inline-block cursor-pointer rounded-md bg-gray-900 px-6 py-2 text-white hover:bg-black">
              Take or Upload Photo
              <input
                type="file"
                accept="image/*,.heic,.heif"
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Fallback: use UploadThing button programmatically
                }}
              />
            </label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Upload successful:", res);
                handleImageUpload(currentType.key, res);
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                alert(`Upload failed: ${error.message}`);
              }}
              onUploadBegin={(file) => {
                console.log("Upload started:", file);
              }}
              appearance={{
                button:
                  "mx-auto bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-md",
                allowedContent: "text-xs text-gray-500 mt-2",
              }}
            />
            <p className="mt-3 text-xs text-gray-500">
              Tap to open camera or choose from photos. Neutral expression, clear lighting.
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails of completed poses */}
      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-6">
        {imageTypes.map((t) => (
          <div key={t.key} className="rounded-lg border bg-white p-2">
            <div className="mb-1 text-center text-xs font-medium text-gray-700">
              {t.title.replace(/^\d+\.\s*/, "")}
            </div>
            <div className="aspect-square w-full overflow-hidden rounded">
              {images[t.key] ? (
                <img
                  src={images[t.key]!.url}
                  alt={t.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                  {t.icon}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
