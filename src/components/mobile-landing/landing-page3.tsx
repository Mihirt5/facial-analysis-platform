import type { NextPage } from "next";
import FrameComponent3 from "./frame-component3";

export type LandingPage3Type = {
  className?: string;
};

const LandingPage3: NextPage<LandingPage3Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch h-[95.3px] flex items-start pt-0 px-[21px] pb-[12.3px] box-border max-w-full mt-[-2.3px] relative ${className}`}
    >
      <div className="flex-1 flex items-start relative max-w-full">
        <div className="h-[358px] w-px absolute !!m-[0 important] top-[-181px] right-[198px] border-[#000] border-solid border-r-[1px] box-border" />
        <FrameComponent3
          prop="3"
          getYourExpertFacialAnalysis="Get your personalized glow-up plan"
        />
      </div>
    </section>
  );
};

export default LandingPage3;
