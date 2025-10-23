import type { NextPage } from "next";
import { Fragment } from "react";

export type FrameComponent4Type = {
  className?: string;
  badgeText?: string;
  items: { title: string; description: string }[];
};

const FrameComponent4: NextPage<FrameComponent4Type> = ({ className = "", badgeText = "8 Months", items }) => {
  return (
    <div
      className={`self-stretch flex flex-col items-start gap-4 max-w-full text-center text-[#000] font-[Inter] ${className}`}
    >
      <div className="w-full flex justify-center mb-2">
        <div className="rounded-[5px] border-[#000] border-solid border-[1px] flex items-center justify-center px-3 py-1 bg-white">
          <div className="relative tracking-[-0.02em] font-medium text-[clamp(11px,2.8vw,13px)] text-center">
            {badgeText}
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-stretch gap-5 max-w-full">
        {items.map((item, idx) => (
          <Fragment key={idx}>
            <div className="self-stretch flex items-start px-3 sm:px-4 box-border max-w-full">
              <div className="flex-1 min-w-0 flex flex-col items-start gap-2 max-w-full text-left">
                <div className="w-full flex items-start px-3 sm:px-5 box-border">
                  <h3 className="m-0 w-full relative break-words text-[clamp(16px,4.6vw,20px)] leading-tight tracking-[-0.03em] font-medium">
                    {item.title}
                  </h3>
                </div>
                <div className="w-full px-3 sm:px-5 box-border text-[clamp(12px,3.4vw,14px)] leading-relaxed tracking-[-0.02em] text-pretty">
                  {item.description}
                </div>
              </div>
            </div>
            {idx < items.length - 1 && (
              <div className="self-stretch h-px relative border-[#000] border-solid border-t-[1px] box-border" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default FrameComponent4;
