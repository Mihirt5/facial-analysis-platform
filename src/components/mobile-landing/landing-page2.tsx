import type { NextPage } from "next";
import FrameComponent3 from "./frame-component3";

export type LandingPage2Type = {
  className?: string;
};

const LandingPage2: NextPage<LandingPage2Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch h-[95.3px] flex items-start pt-0 px-[21px] pb-[12.3px] box-border max-w-full mt-[-2.3px] relative text-left text-[13px] text-[#fff] font-[Inter] ${className}`}
    >
      <FrameComponent3
        prop="1"
        getYourExpertFacialAnalysis="Get your expert facial analysis"
      />
    </section>
  );
};

export default LandingPage2;
