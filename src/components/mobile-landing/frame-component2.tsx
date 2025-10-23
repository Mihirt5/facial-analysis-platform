import type { NextPage } from "next";
import Image from "next/image";
import ArrowDown from "./ArrowDown";

export type FrameComponent2Type = {
  className?: string;
  prop?: string;
  understandOverallFacialHealth?: string;
};

const FrameComponent2: NextPage<FrameComponent2Type> = ({
  className = "",
  prop,
  understandOverallFacialHealth,
}) => {
  return (
    <div
      className={`self-stretch h-[126.9px] flex flex-col items-start pt-0 px-0 pb-[8.9px] box-border gap-[6px] text-left text-[21px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="w-full flex items-center justify-center py-0 px-4 box-border">
        <div className="h-9 w-9 relative rounded-[50%] border-[#fff] border-solid border-[1px] flex items-center justify-center bg-transparent">
          <h3 className="m-0 relative leading-none text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] text-center">
            {prop}
          </h3>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start gap-[6px] text-center text-[13px]">
        <div className="relative tracking-[-0.05em] [transform:_rotate(0.1deg)] shrink-0">
          {understandOverallFacialHealth}
        </div>
        <div className="self-stretch flex items-center justify-center py-2">
          <ArrowDown stroke="#fff" height={30} />
        </div>
      </div>
    </div>
  );
};

export default FrameComponent2;
