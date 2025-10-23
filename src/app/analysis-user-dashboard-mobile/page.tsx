import type { NextPage } from "next";
import Image from "next/image";
import FrameComponent8 from "~/components/analysis-dashboard/frame-component8";

const AnalysisUserDashboardMobile: NextPage = () => {
  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-end pt-[41px] pb-[53px] pl-[34px] pr-[39px] box-border gap-[174px] leading-[normal] tracking-[normal]">
      <section className="self-stretch flex items-start justify-end py-0 pl-0 pr-[3px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex flex-col items-start gap-[42.5px] max-w-full mq266:gap-[21px]">
          <div className="w-[352px] flex items-end gap-[17.5px] max-w-full mq259:flex-wrap">
            <Image
              className="cursor-pointer [border:none] p-0 bg-[transparent] h-[32.5px] w-[32.5px] relative object-contain"
              width={32.5}
              height={32.5}
              sizes="100vw"
              alt=""
              src="/Group@2x.png"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[12.5px] box-border min-w-[196px]">
              <div className="self-stretch h-1 relative rounded-[100px] bg-[#d9d9d9]">
                <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-[#d9d9d9] w-full h-full hidden" />
                <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-Parallel-Main w-5 h-1 z-[1]" />
              </div>
            </div>
          </div>
          <div className="w-[342px] flex items-start pt-0 px-1 pb-[57.5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start gap-2 max-w-full">
              <h1 className="m-0 self-stretch relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
                Leave a rating
              </h1>
              <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium">
                This helps us deliver more of what you need
              </div>
            </div>
          </div>
          <FrameComponent8 />
        </div>
      </section>
      <button className="cursor-pointer border-Parallel-Main border-solid border-[1px] py-[9px] px-[113px] bg-Parallel-Fade-Grey w-[362px] h-[41px] rounded-[64px] box-border overflow-hidden shrink-0 flex items-start justify-center max-w-full hover:bg-[rgba(112,112,112,0.16)] hover:border-[#707070] hover:border-solid hover:hover:border-[1px] hover:box-border mq271:pl-5 mq271:pr-5 mq271:box-border">
        <div className="flex-1 relative text-[15px] tracking-[-0.05em] leading-[19px] font-medium font-[Inter] text-Parallel-Main text-center">
          Continue
        </div>
      </button>
    </div>
  );
};

export default AnalysisUserDashboardMobile;
