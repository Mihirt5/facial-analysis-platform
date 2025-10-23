"use client";
import type { NextPage } from "next";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AnalysisUserDashboardMobile3: NextPage = () => {
  const router = useRouter();
  const [ethnicity, setEthnicity] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const upsert = api.intake.upsert.useMutation();
  const submitEthnicity = async (value: string) => {
    setEthnicity(value);
    setSelected(value);
    const prev = JSON.parse(localStorage.getItem("onboardingDraft") || "{}");
    localStorage.setItem(
      "onboardingDraft",
      JSON.stringify({
        ...prev,
        ethnicities: [value],
      }),
    );
    // brief delay to show selection state before navigating
    setTimeout(() => {
      router.push("/onboarding/focus");
    }, 150);
  };
  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-start pt-[41px] px-[34px] pb-[143px] box-border gap-[42.5px] leading-[normal] tracking-[normal]">
      <div className="w-[352px] flex items-end flex-wrap content-end gap-[17.5px] max-w-full">
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
      <section className="w-[334px] h-[104.5px] flex items-start pt-0 px-1 pb-[45.5px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
        <div className="flex flex-col items-start gap-[7px] max-w-full">
          <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
            Ethnicity (Self-ID)
          </h1>
          <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">
            (Improves harmony benchmarks and skin-tone matching.)
          </div>
        </div>
      </section>
      <section className="self-stretch h-[506px] flex items-start py-0 px-1 box-border max-w-full">
        <div className="flex-1 flex flex-col items-start gap-3.5 max-w-full">
          <button onClick={() => submitEthnicity("African")} className={`cursor-pointer border-Parallel-Main border-solid border-[1px] pt-3 pb-[11px] pl-[151px] pr-[150px] self-stretch h-[51px] rounded-[5px] box-border overflow-hidden shrink-0 flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "African" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[63px] ${selected === "African" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              African
            </div>
          </button>
          <button onClick={() => submitEthnicity("East Asian")} className={`cursor-pointer [border:none] pt-3.5 pb-[13px] pl-[137px] pr-[136px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "East Asian" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`w-[91px] relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[91px] ${selected === "East Asian" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              East Asian
            </div>
          </button>
          <button onClick={() => submitEthnicity("South Asian")} className={`cursor-pointer [border:none] pt-3.5 pb-[13px] pl-[130px] pr-[129px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "South Asian" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`w-[105px] relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[105px] ${selected === "South Asian" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              South Asian
            </div>
          </button>
          <button onClick={() => submitEthnicity("Latino")} className={`cursor-pointer [border:none] pt-3.5 pb-[13px] pl-[155px] pr-[154px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "Latino" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`w-[55px] relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[55px] ${selected === "Latino" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              Latino
            </div>
          </button>
          <button onClick={() => submitEthnicity("Middle-Eastern")} className={`cursor-pointer [border:none] pt-3.5 px-[115px] pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "Middle-Eastern" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`w-[134px] relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${selected === "Middle-Eastern" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              Middle-Eastern
            </div>
          </button>
          <button onClick={() => submitEthnicity("White")} className={`cursor-pointer [border:none] pt-3.5 px-[156px] pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "White" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`w-[52px] relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[52px] ${selected === "White" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              White
            </div>
          </button>
          <button onClick={() => submitEthnicity("Mixed")} className={`cursor-pointer [border:none] pt-3.5 px-[155px] pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === "Mixed" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[54px] ${selected === "Mixed" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              Mixed
            </div>
          </button>
          <button onClick={() => submitEthnicity("Other")} className={`cursor-pointer [border:none] pt-3.5 pb-[13px] pl-[21px] pr-5 self-stretch rounded-[5px] overflow-hidden flex items-start justify-center ${selected === "Other" ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}>
            <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block min-w-[51px] ${selected === "Other" ? "text-Parallel-Main" : "text-[#fff]"}`}>
              Other
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AnalysisUserDashboardMobile3;
