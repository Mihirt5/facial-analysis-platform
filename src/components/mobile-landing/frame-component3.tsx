import type { NextPage } from "next";

export type FrameComponent3Type = {
  className?: string;
  prop?: string;
  getYourExpertFacialAnalysis?: string;
};

const FrameComponent3: NextPage<FrameComponent3Type> = ({
  className = "",
  prop,
  getYourExpertFacialAnalysis,
}) => {
  return (
    <div
      className={`flex-1 rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex flex-col items-center pt-[15px] px-4 pb-[18.5px] box-border gap-2 max-w-full z-[1] text-center text-[13px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="relative tracking-[-0.05em] font-medium hidden min-w-[6.6px]">
        1
      </div>
      <div className="w-full flex items-center justify-center py-0 px-4">
        <div className="h-9 w-9 relative rounded-[50%] border-[#fff] border-solid border-[1px] flex items-center justify-center bg-transparent">
          <h3 className="m-0 relative leading-none text-[21px] tracking-[-0.05em] font-medium text-center">
            {prop}
          </h3>
        </div>
      </div>
      <div className="self-stretch relative text-base tracking-[-0.05em] font-medium text-center [transform:_rotate(0.1deg)]">
        {getYourExpertFacialAnalysis}
      </div>
    </div>
  );
};

export default FrameComponent3;
