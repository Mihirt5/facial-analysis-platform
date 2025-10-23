"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Analysis } from "~/types/types";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  intake: Analysis["user"]["intake"] | null;
  customerName: string;
}

export function IntakeModal({
  isOpen,
  onClose,
  intake,
  customerName,
}: IntakeModalProps) {
  const formatEthnicities = (ethnicities: string[], other?: string | null) => {
    const list = [...ethnicities];
    if (other?.trim()) {
      list.push(other);
    }
    return list.join(", ");
  };

  const formatTreatments = (treatments: string[], other?: string | null) => {
    const list = [...treatments];
    if (other?.trim()) {
      list.push(other);
    }
    return list.join(", ");
  };

  const formatFocus = (focus: string, other?: string | null) => {
    if (focus === "Other" && other?.trim()) {
      return other;
    }
    return focus;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {!intake ? (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Intake Information</DialogTitle>
            <DialogDescription>Customer: {customerName}</DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Intake Form Submitted
            </h3>
            <p className="text-sm text-gray-500">
              This customer has not completed their intake form yet.
            </p>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Intake Information</DialogTitle>
            <DialogDescription>Customer: {customerName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {intake.firstName} {intake.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age Bracket
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {intake.ageBracket}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{intake.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ethnicities
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatEthnicities(
                      intake.ethnicities,
                      intake.ethnicityOther,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Aesthetic Focus */}
            <div>
              <h3 className="text-md mb-2 font-medium text-gray-900">
                Primary Focus
              </h3>
              <div>
                <p className="mt-1 text-sm text-gray-900">
                  {formatFocus(intake.focus, intake.focusOther)}
                </p>
              </div>
            </div>

            {/* Treatments */}
            <div>
              <h3 className="text-md mb-2 font-medium text-gray-900">
                Previous Treatments
              </h3>
              <div>
                <p className="mt-1 text-sm text-gray-900">
                  {formatTreatments(intake.treatments, intake.treatmentsOther)}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 gap-4 text-xs text-gray-500 md:grid-cols-2">
                <div>
                  <span className="font-medium">Submitted:</span>{" "}
                  {new Date(intake.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(intake.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
