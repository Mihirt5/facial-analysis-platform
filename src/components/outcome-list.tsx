import { Check } from "lucide-react";
import React from "react";

type NumberedListProps = {
  items: string[];
  start?: number;
  className?: string;
};

export default function OutcomeList({
  items,
  className = "",
}: NumberedListProps) {
  return (
    <ol className={`divide-y divide-gray-200 ${className}`}>
      {items.map((text, index) => {
        return (
          <li key={index} className="flex items-center space-x-4 py-4">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-[1px] border-[#464646] bg-[#46464645]/27 text-sm font-semibold text-black tabular-nums">
              <Check className="h-4 w-4" />
            </span>
            <h3 className="text-gray-900">{text}</h3>
          </li>
        );
      })}
    </ol>
  );
}
