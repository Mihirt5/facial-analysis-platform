"use client";

import type { Analysis } from "~/types/types";
import { IntakeModal } from "../intake-modal";
import { useState } from "react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";

interface IntakeButtonProps {
  analysis: Analysis;
  onIntakeClick?: (
    intake: Analysis["user"]["intake"],
    customerName: string,
  ) => void;
}

export function IntakeButton({ analysis }: IntakeButtonProps) {
  const [selectedIntake, setSelectedIntake] = useState<{
    intake: Analysis["user"]["intake"];
    customerName: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatIntakeStatus = (intake: Analysis["user"]["intake"]) => {
    if (!intake) {
      return {
        status: "Not Completed",
        color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      };
    }

    return {
      status: "Completed",
      color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    };
  };

  const handleIntakeClick = (
    e: React.MouseEvent,
    intake: Analysis["user"]["intake"],
    customerName: string,
  ) => {
    e.stopPropagation(); // Prevent row click
    setSelectedIntake({ intake, customerName });
    setIsModalOpen(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleIntakeClick(e, analysis.user.intake, analysis.user.name);
            }}
            className={`inline-flex w-fit cursor-pointer items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${formatIntakeStatus(analysis.user.intake).color}`}
          >
            {formatIntakeStatus(analysis.user.intake).status}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View User Intake</p>
        </TooltipContent>
      </Tooltip>

      <IntakeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedIntake(null), 250);
        }}
        intake={selectedIntake?.intake ?? null}
        customerName={selectedIntake?.customerName ?? ""}
      />
    </>
  );
}
