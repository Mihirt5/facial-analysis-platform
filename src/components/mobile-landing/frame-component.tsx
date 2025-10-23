"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";
import ArrowDown from "./ArrowDown";

export type FrameComponentType = {
  className?: string;
  prop?: string;
  obsessOverSingleFlaws?: string;

  /** Style props */
  frameDivPadding?: CSSProperties["padding"];
  frameDivPadding1?: CSSProperties["padding"];
  frameDivPadding2?: CSSProperties["padding"];
};

const FrameComponent: NextPage<FrameComponentType> = ({
  className = "",
  frameDivPadding,
  frameDivPadding1,
  prop,
  obsessOverSingleFlaws,
  frameDivPadding2,
}) => {
  const frameDiv1Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const frameDiv2Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding1,
    };
  }, [frameDivPadding1]);

  const frameDiv3Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding2,
    };
  }, [frameDivPadding2]);

  return (
    <div
      className={`self-stretch flex items-start py-0 pl-3.5 pr-[15px] text-left text-[21px] text-[#000] font-[Inter] ${className}`}
      style={frameDiv1Style}
    >
      <div className="flex-1 flex flex-col items-start gap-[10.2px]">
        <div
          className="self-stretch flex items-center justify-center py-0 px-4"
          style={frameDiv2Style}
        >
          <div className="h-9 w-9 relative rounded-[50%] border-[#000] border-solid border-[1px] flex items-center justify-center bg-transparent">
            <h3 className="m-0 relative leading-none text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] text-center">
              {prop}
            </h3>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start gap-[10px] text-center text-[13px]">{/* normalize gaps */}
          <div className="relative tracking-[-0.05em] [transform:_rotate(0.1deg)]">
            {obsessOverSingleFlaws}
          </div>
          <div className="flex items-center justify-center py-2" style={frameDiv3Style}>
            <ArrowDown stroke="#000" height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;
