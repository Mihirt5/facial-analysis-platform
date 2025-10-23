"use client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useState } from "react";

const AnalysisUserDashboardMobile4: NextPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const upsert = api.intake.upsert.useMutation();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save draft locally; server save will happen after sign-in
    const prev = JSON.parse(localStorage.getItem("onboardingDraft") || "{}");
    localStorage.setItem(
      "onboardingDraft",
      JSON.stringify({
        ...prev,
        firstName,
        lastName,
      }),
    );
    router.push("/onboarding/survey");
  };
  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-start pt-[41px] px-[34px] pb-[383px] box-border gap-[42.5px] leading-[normal] tracking-[normal] text-left text-[32px] text-Parallel-Main font-[Inter]">
      <div className="self-stretch flex items-start relative max-w-full">
        <Image
          className="cursor-pointer [border:none] p-0 bg-[transparent] h-[32.5px] flex-1 relative max-w-full overflow-hidden"
          width={372}
          height={32.5}
          sizes="100vw"
          alt=""
          src="/Frame.svg"
        />
        <div className="w-[302px] !!m-[0 important] absolute right-[20px] bottom-[12.5px] rounded-[100px] bg-[#d9d9d9] flex items-start z-[1]">
          <div className="h-1 w-5 relative rounded-[100px] bg-Parallel-Main" />
        </div>
      </div>
      <div className="w-[237px] h-[197.5px] flex items-start pt-0 px-1 pb-[138.5px] box-border">
        <div className="flex flex-col items-start gap-[7px]">
          <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
            Name
          </h1>
          <div className="h-[13px] relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium inline-block">
            <p className="m-0">(Personalize reports and notifications.)</p>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="self-stretch h-[173px] flex items-start py-0 px-1 box-border max-w-full text-left text-base text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex flex-col items-start gap-[13px] max-w-full">
          <div className="self-stretch flex flex-col items-start gap-2.5">
            <div className="relative tracking-[-0.05em] font-medium">
              First Name
            </div>
            <input
              className="[border:none] [outline:none] w-full bg-[#fff] self-stretch h-[51px] relative rounded-[5px] overflow-hidden shrink-0 min-w-[218px]"
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="self-stretch flex flex-col items-start gap-2.5">
            <div className="relative tracking-[-0.05em] font-medium">
              Last Name
            </div>
            <input
              className="[border:none] [outline:none] w-full bg-[#fff] self-stretch h-[51px] relative rounded-[5px] overflow-hidden shrink-0 min-w-[218px]"
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <button type="submit" className="mt-4 rounded-[5px] bg-Parallel-Main px-5 py-3 text-white">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalysisUserDashboardMobile4;
