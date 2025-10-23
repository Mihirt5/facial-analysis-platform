"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type MobileLayoutType = {
  className?: string;
  group55: string;
  front?: string;
  onUpload?: (file: File) => void;
  isUploaded?: boolean;

  /** Style props */
  mobileLayoutHeight?: CSSProperties["height"];
  mobileLayoutPadding?: CSSProperties["padding"];
  groupIconBorder?: CSSProperties["border"];
  groupIconPadding?: CSSProperties["padding"];
  groupIconBackgroundColor?: CSSProperties["backgroundColor"];
};

const MobileLayout: NextPage<MobileLayoutType> = ({
  className = "",
  mobileLayoutHeight,
  mobileLayoutPadding,
  group55,
  groupIconBorder,
  groupIconPadding,
  groupIconBackgroundColor,
  front,
  onUpload,
  isUploaded,
}) => {
  const mobileLayoutStyle: CSSProperties = useMemo(() => {
    return {
      height: mobileLayoutHeight,
      padding: mobileLayoutPadding,
    };
  }, [mobileLayoutHeight, mobileLayoutPadding]);

  const groupIconStyle: CSSProperties = useMemo(() => {
    return {
      border: groupIconBorder,
      padding: groupIconPadding,
      backgroundColor: groupIconBackgroundColor,
    };
  }, [groupIconBorder, groupIconPadding, groupIconBackgroundColor]);

  return (
    <section
      className={`self-stretch h-[103px] flex items-start justify-end py-0 pl-1 pr-px box-border max-w-full text-left text-xl text-Parallel-Main font-[Inter] ${className}`}
      style={mobileLayoutStyle}
    >
      <div className="flex-1 flex items-start gap-[23px] max-w-full mq259:flex-wrap">
        {isUploaded ? (
          <img
            className="h-[103px] w-[103px] relative mq259:flex-1 object-cover rounded-[8px]"
            src={group55}
            alt=""
            style={groupIconStyle}
          />
        ) : (
          <Image
            className="h-[103px] w-[103px] relative mq259:flex-1"
            loading="lazy"
            width={103}
            height={103}
            sizes="100vw"
            alt=""
            src={group55}
            style={groupIconStyle}
          />
        )}
        <div className="h-[97px] flex-1 flex flex-col items-start pt-1.5 px-0 pb-0 box-border">
          <div className="self-stretch flex-1 flex flex-col items-start gap-[18px]">
            <div className="w-[118px] flex-1 flex flex-col items-start gap-[3px]">
              <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
                {front}
              </h3>
              <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium text-[#a0a0a0] whitespace-nowrap">
                Face camera directly
              </div>
            </div>
            <label className="cursor-pointer border-Parallel-Main border-solid border-[1px] py-[5px] px-[50px] bg-Parallel-Fade-Grey self-stretch h-[33px] rounded-[64px] box-border overflow-hidden shrink-0 flex items-start hover:bg-[rgba(112,112,112,0.16)] hover:border-[#707070] hover:border-solid hover:hover:border-[1px] hover:box-border">
              <div className="flex-1 relative text-xs tracking-[-0.05em] leading-[19px] font-medium font-[Inter] text-Parallel-Main text-center">
                {isUploaded ? "Change Photo" : "Upload Photo"}
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpload) {
                    onUpload(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileLayout;
