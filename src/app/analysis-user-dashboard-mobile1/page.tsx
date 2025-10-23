"use client";
import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import MobileLayout from "~/components/analysis-dashboard/mobile-layout";

const AnalysisUserDashboardMobile1: NextPage = () => {
  const [mobileLayoutItems] = useState([
    {
      mobileLayoutHeight: "103px",
      mobileLayoutPadding: "0px 1px 0px 4px",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Front",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Left 3/4 ",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Left Side",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Right 3/4",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Right Side",
    },
    {
      mobileLayoutHeight: "121px",
      mobileLayoutPadding: "0px 1px 18px 4px",
      group55: "/Group-55.svg",
      groupIconBorder: "none",
      groupIconPadding: "0",
      groupIconBackgroundColor: "transparent",
      front: "Hairline",
    },
  ]);
  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-end pt-[41px] pb-[49px] pl-[34px] pr-[39px] box-border gap-[29px] leading-[normal] tracking-[normal] text-left text-[13px] text-[#a0a0a0] font-[Inter]">
      <div className="self-stretch h-[46px] flex items-start justify-end pt-0 pb-[13.5px] pl-0 pr-[15px] box-border max-w-full">
        <div className="flex-1 flex items-end gap-[17.5px] max-w-full">
          <Image
            className="cursor-pointer [border:none] p-0 bg-[transparent] h-[32.5px] w-[32.5px] relative object-contain"
            width={32.5}
            height={32.5}
            sizes="100vw"
            alt=""
            src="/Group@2x.png"
          />
          <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[12.5px]">
            <div className="self-stretch h-1 relative rounded-[100px] bg-[#d9d9d9]">
              <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-[#d9d9d9] w-full h-full hidden" />
              <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-Parallel-Main w-5 h-1 z-[1]" />
            </div>
          </div>
        </div>
      </div>
      <section className="self-stretch flex items-start justify-end pt-0 pb-2.5 pl-1 pr-[29px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex flex-col items-start gap-[13px] max-w-full">
          <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
            <p className="m-0">Upload 5 Neutral-Lighting Selfies</p>
          </h1>
          <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium text-[#a0a0a0]">{`This enables baseline scan & future progress comparisons.`}</div>
        </div>
      </section>
      {mobileLayoutItems.map((item, index) => (
        <MobileLayout
          key={index}
          mobileLayoutHeight={item.mobileLayoutHeight}
          mobileLayoutPadding={item.mobileLayoutPadding}
          group55={item.group55}
          groupIconBorder={item.groupIconBorder}
          groupIconPadding={item.groupIconPadding}
          groupIconBackgroundColor={item.groupIconBackgroundColor}
          front={item.front}
        />
      ))}
      <div className="self-stretch h-[69px] flex flex-col items-start gap-[15px] max-w-full">
        <div className="w-[362px] h-[13px] flex items-start py-0 px-[85px] box-border max-w-full mq258:pl-5 mq258:pr-5 mq258:box-border">
          <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
            Upload 6 more photos to continue
          </div>
        </div>
        <button className="cursor-pointer border-Parallel-Main border-solid border-[1px] py-[9px] px-5 bg-[rgba(0,0,0,0.09)] self-stretch h-[41px] rounded-[64px] box-border overflow-hidden shrink-0 flex items-start justify-center hover:bg-[rgba(51,51,51,0.09)] hover:border-[#707070] hover:border-solid hover:hover:border-[1px] hover:box-border">
          <div className="w-[134px] relative text-[15px] tracking-[-0.05em] leading-[19px] font-medium font-[Inter] text-Parallel-Main text-center inline-block shrink-0">
            Continue
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnalysisUserDashboardMobile1;
