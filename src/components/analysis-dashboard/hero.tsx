import type { NextPage } from "next";
import Image from "next/image";

export type HeroType = {
  className?: string;
};

const Hero: NextPage<HeroType> = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch rounded-lg bg-Parallel-Main overflow-hidden flex flex-col items-start pt-[19px] pb-[25px] pl-[19px] pr-3.5 gap-5 text-left text-[13px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="self-stretch flex items-start justify-between gap-5 mq258:flex-wrap">
        <div className="flex items-end gap-2">
          <Image
            className="h-[37px] w-[37px] relative"
            width={37}
            height={37}
            sizes="100vw"
            alt=""
            src="/Group-51.svg"
          />
          <div className="flex flex-col items-start justify-end pt-0 px-0 pb-0.5">
            <div className="flex flex-col items-start gap-[3px]">
              <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
                Ryan Phillips
              </div>
              <div className="relative text-[10px] tracking-[-0.05em] leading-[13px] font-medium text-[#a0a0a0]">
                @ryanp34
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start pt-1.5 px-0 pb-0">
          <Image
            className="self-stretch h-[10.6px] relative max-w-full overflow-hidden shrink-0 w-full"
            loading="lazy"
            width={53}
            height={10.6}
            sizes="100vw"
            alt=""
            src="/Group-53.svg"
          />
        </div>
      </div>
      <div className="w-[279px] relative text-xs tracking-[-0.05em] leading-[13px] font-medium inline-block">
        Crazy how accurate the prediction is!! I love this app
      </div>
    </div>
  );
};

export default Hero;
