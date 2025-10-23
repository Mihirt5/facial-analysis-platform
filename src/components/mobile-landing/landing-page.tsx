"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type LandingPageType = {
  className?: string;
  personalizedFacialImprovement?: string;

  /** Style props */
  landingPageWidth?: CSSProperties["width"];
  landingPagePadding?: CSSProperties["padding"];
  landingPageAlignSelf?: CSSProperties["alignSelf"];
};

const LandingPage: NextPage<LandingPageType> = ({
  className = "",
  landingPageWidth,
  landingPagePadding,
  landingPageAlignSelf,
  personalizedFacialImprovement,
}) => {
  const landingPage1Style: CSSProperties = useMemo(() => {
    return {
      width: landingPageWidth,
      padding: landingPagePadding,
      alignSelf: landingPageAlignSelf,
    };
  }, [landingPageWidth, landingPagePadding, landingPageAlignSelf]);

  return (
    <div
      className={`w-full h-[64.3px] flex items-center py-0 pl-[38px] pr-4 box-border max-w-full mt-[-2.3px] relative text-left text-[21px] text-Parallel-Main font-[Inter] ${className}`}
      style={landingPage1Style}
    >
      <div className="flex-1 flex items-center gap-[13.7px] max-w-full">
        <div className="w-[36.3px] flex flex-col items-start justify-center pt-0 px-0 pb-0 box-border flex-shrink-0">
          <Image
            className="w-[36.3px] h-[36.3px] relative shrink-0"
            loading="lazy"
            width={36.3}
            height={36.3}
            sizes="100vw"
            alt=""
            src="/Group-196.svg"
          />
        </div>
        <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-normal font-[inherit] flex-1 leading-tight">
          {personalizedFacialImprovement}
        </h2>
      </div>
    </div>
  );
};

export default LandingPage;
