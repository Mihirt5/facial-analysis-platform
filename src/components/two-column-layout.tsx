import type { ReactNode } from "react";

interface TwoColumnLayoutProps {
  children: ReactNode;
  rightPanelTitle?: string;
  rightPanelContent?: ReactNode;
}

export function TwoColumnLayout({
  children,
  rightPanelTitle = "Preview",
  rightPanelContent,
}: TwoColumnLayoutProps) {
  return (
    <div className="grid min-h-svh gap-0 lg:grid-cols-2">
      {/* Left panel: Main content */}
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-auto">
        <div className="flex justify-center gap-2 md:justify-start">
          <span className="font-sans text-sm font-semibold tracking-wide text-gray-900">
            Parallel Labs
          </span>
        </div>

        <div className="flex flex-1 items-start justify-center">
          {children}
        </div>
      </div>

      {/* Right panel: Preview/content */}
      <div className="relative flex min-h-[50vh] flex-col p-4 lg:min-h-0 lg:p-6">
        {rightPanelContent ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl border bg-white p-0 shadow-sm">
            {rightPanelContent}
          </div>
        ) : (
          <div className="h-full w-full rounded-xl border bg-gray-100" />
        )}
        <div className="mt-2 text-sm font-medium text-gray-400">{rightPanelTitle}</div>
      </div>
    </div>
  );
}
