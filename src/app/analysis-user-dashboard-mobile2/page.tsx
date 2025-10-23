"use client";
import type { NextPage } from "next";
import { useState } from "react";
import DiagnosisColumn from "~/components/analysis-dashboard/diagnosis-column";

const AnalysisUserDashboardMobile2: NextPage = () => {
  const [diagnosisColumnItems] = useState([
    {
      group70: "/Group-70.svg",
    },
    {
      group70: "/Group-74.svg",
    },
    {
      group70: "/Group-73.svg",
    },
    {
      group70: "/Group-75.svg",
    },
  ]);
  return (
    <div className="w-full h-[912px] relative [background:linear-gradient(180.09deg,_#000,_#f0f0f0)] overflow-hidden flex flex-col items-end pt-[101px] px-7 pb-[346px] box-border gap-20 leading-[normal] tracking-[normal] mq259:h-auto">
      <section className="self-stretch flex items-start justify-end py-0 pl-5 pr-[19px] box-border max-w-full shrink-0 text-center text-3xl text-[#fff] font-[Inter]">
        <div className="flex-1 flex flex-col items-end gap-[46px] shrink-0 max-w-full mq258:gap-[23px]">
          <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] leading-[38px] font-semibold font-[inherit]">
            Start your free week and gain 2+ hours back
          </h1>
          <div className="self-stretch flex items-start justify-end py-0 pl-[19px] pr-3.5">
            <div className="flex-1 flex flex-col items-start gap-[29px]">
              {diagnosisColumnItems.map((item, index) => (
                <DiagnosisColumn key={index} group70={item.group70} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="w-[7px] h-[267px] relative [background:linear-gradient(180deg,_#fff,_#c6c6c6)] hidden" />
      <section className="self-stretch shadow-[0px_4px_30.7px_2px_rgba(0,_0,_0,_0.25)] rounded-[15px] bg-[#fff] overflow-hidden flex flex-col items-start pt-12 px-[17px] pb-[519px] gap-7 shrink-0 text-left text-lg text-[#a0a0a0] font-[Inter]">
        <div className="self-stretch h-12 relative rounded-[100px] [background:linear-gradient(90.98deg,_#4a4a4a,_#c1c1c1_50%,_#4a4a4a)] overflow-hidden shrink-0 hidden whitespace-nowrap">
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[13px] left-[calc(50%_-_58px)] text-lg font-bold font-[Inter] text-[#fff] text-center inline-block min-w-[117px]">
            Try for $0.00
          </button>
        </div>
        <div className="flex items-start py-0 px-[79px] mq350small:pl-5 mq350small:pr-5 mq350small:box-border">
          <div className="flex flex-col items-start gap-5">
            <div className="flex items-start py-0 pl-[21px] pr-[26px]">
              <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
                Try Free for 7 days
              </div>
            </div>
            <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
              $0.27/day ($99.99/year)
            </div>
          </div>
        </div>
        <button className="cursor-pointer [border:none] py-[13px] pl-[117px] pr-[116px] bg-[transparent] self-stretch h-12 rounded-[100px] [background:linear-gradient(90.98deg,_#4a4a4a,_#c1c1c1_50%,_#4a4a4a)] overflow-hidden shrink-0 flex items-start justify-center box-border z-[1] mq266:pl-5 mq266:pr-5 mq266:box-border">
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-lg font-bold font-[Inter] text-[#fff] text-center inline-block">
            Try for $0.00
          </button>
        </button>
        <div className="flex items-start py-0 pl-[86px] pr-[92px] mq350small:pl-5 mq350small:pr-5 mq350small:box-border">
          <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
            No payment due now!
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisUserDashboardMobile2;
