"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

export type LandingPage1Type = {
  className?: string;
  prop?: string;
  visualiseYourIdealSelfWith?: string;

  /** Style props */
  landingPageHeight?: CSSProperties["height"];
  landingPagePadding?: CSSProperties["padding"];
  frameDivPadding?: CSSProperties["padding"];
  frameDivWidth?: CSSProperties["width"];
  frameDivPadding1?: CSSProperties["padding"];
};

const LandingPage1: NextPage<LandingPage1Type> = ({
  className = "",
  landingPageHeight,
  landingPagePadding,
  frameDivPadding,
  frameDivWidth,
  frameDivPadding1,
  prop,
  visualiseYourIdealSelfWith,
}) => {
  const landingPageStyle: CSSProperties = useMemo(() => {
    return {
      height: landingPageHeight,
      padding: landingPagePadding,
    };
  }, [landingPageHeight, landingPagePadding]);

  const frameDiv4Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const frameDiv5Style: CSSProperties = useMemo(() => {
    return {
      width: frameDivWidth,
      padding: frameDivPadding1,
    };
  }, [frameDivWidth, frameDivPadding1]);

  return (
    <section
      className={`self-stretch h-[95.3px] flex items-start pt-0 px-[21px] pb-[12.3px] box-border max-w-full mt-[-2.3px] relative text-left text-[13px] text-[#fff] font-[Inter] ${className}`}
      style={landingPageStyle}
    >
      <div
        className="flex-1 rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex flex-col items-center pt-[15px] px-4 pb-[18.5px] box-border gap-2 max-w-full z-[1] text-center text-[13px] text-[#fff] font-[Inter]"
        style={frameDiv4Style}
      >
        <div className="w-full flex items-center justify-center py-0 px-4">
          <div className="h-9 w-9 relative rounded-[50%] border-[#fff] border-solid border-[1px] flex items-center justify-center bg-transparent">
            <h3 className="m-0 relative leading-none text-[21px] tracking-[-0.05em] font-medium text-center">
              {prop}
            </h3>
          </div>
        </div>
        <div className="self-stretch relative text-base tracking-[-0.05em] font-medium text-center [transform:_rotate(0.1deg)]">
          {visualiseYourIdealSelfWith}
        </div>
      </div>
    </section>
  );
};

export default LandingPage1;
