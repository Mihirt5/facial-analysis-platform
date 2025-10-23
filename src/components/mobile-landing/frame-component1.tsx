"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Style from "./style";

export type FrameComponent1Type = {
  className?: string;

  /** Style props */
  frameDivMarginTop?: CSSProperties["marginTop"];
};

const FrameComponent1: NextPage<FrameComponent1Type> = ({
  className = "",
  frameDivMarginTop,
}) => {
  const frameDivStyle: CSSProperties = useMemo(() => {
    return {
      marginTop: frameDivMarginTop,
    };
  }, [frameDivMarginTop]);

  return (
    <div
      className={`mt-[-51px] flex flex-col items-start pt-[82px] px-2 pb-[164px] box-border relative gap-[55px] shrink-0 max-w-[106%] text-left text-[42px] text-[#fff] font-[Inter] mq282:gap-[27px] ${className}`}
      style={frameDivStyle}
    >
      <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] z-[2]">
        Facial Health Indicators
      </h1>
      <div className="w-[259px] h-[83px] flex flex-col items-start gap-3 text-xl">
        <Style thickness={64} />
        <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] leading-[25px] font-medium font-[inherit] z-[2]">
          Your biomarkers in range
        </h3>
      </div>
    </div>
  );
};

export default FrameComponent1;
