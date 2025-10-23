"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";

interface EmailButtonProps {
  email: string;
  className?: string;
}

export function CopyEmailButton({ email, className }: EmailButtonProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleEmailCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      // Force the tooltip to be open after the click
      setIsTooltipOpen(true);

      setTimeout(() => {
        setCopiedEmail(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    // 4. Remove the `key` prop and add `open` and `onOpenChange`
    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            void handleEmailCopy(email);
          }}
          className={`inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 transition-all duration-150 ease-in-out ring-inset hover:bg-blue-100 active:scale-95 ${
            className ?? ""
          }`}
        >
          {email}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {copiedEmail === email ? "Copied!" : "Click to copy email"}
      </TooltipContent>
    </Tooltip>
  );
}
