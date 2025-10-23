"use client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FocusPage: NextPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  const submit = (value: string) => {
    setSelected(value);
    const prev = JSON.parse(localStorage.getItem("onboardingDraft") || "{}");
    localStorage.setItem(
      "onboardingDraft",
      JSON.stringify({ ...prev, focus: value }),
    );
    setTimeout(() => router.push("/onboarding/treatments"), 150);
  };

  const Button = ({ value, minw }: { value: string; minw?: string }) => (
    <button
      onClick={() => submit(value)}
      className={`cursor-pointer [border:none] pt-3.5 pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center mq302:pl-5 mq302:pr-5 mq302:box-border ${selected === value ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"}`}
    >
      <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${minw ?? ""} ${selected === value ? "text-Parallel-Main" : "text-[#fff]"}`}>
        {value}
      </div>
    </button>
  );

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
            Primary Aesthetic Focus
          </h1>
          <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">
            Choose one option below.
          </div>
        </div>
      </section>
      <section className="self-stretch h-[506px] flex items-start py-0 px-1 box-border max-w-full">
        <div className="flex-1 flex flex-col items-start gap-3.5 max-w-full">
          <Button value="Sharper definition" />
          <Button value="Clearer skin" />
          <Button value="Balanced symmetry" />
          <Button value="Overall upgrade" />
          <Button value="Other" />
        </div>
      </section>
    </div>
  );
};

export default FocusPage;

