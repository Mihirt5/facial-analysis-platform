"use client";
import type { NextPage } from "next";
import FrameComponent8 from "./locofy/components/frame-component8";
import { CheckoutButton } from "./_components/payment-buttons";

const LocofyPaywall: NextPage = () => {
  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-center pt-10 pb-10 px-4 box-border gap-6 leading-[normal] tracking-[normal]">
      <div className="text-center max-w-[420px]">
        <h1 className="text-2xl font-semibold text-Parallel-Main">
          Start your free week and gain 2+ hours back
        </h1>
      </div>
      <div className="w-full max-w-[420px]">
        <FrameComponent8 />
      </div>
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="mb-3 text-center text-gray-700">
          <div className="text-lg font-medium">Try Free for 7 days</div>
          <div className="text-sm">$0.27/day ($99.99/year)</div>
        </div>
        <CheckoutButton label="Try for $0.00" />
        <div className="mt-3 text-center text-sm text-gray-500">No payment due now!</div>
      </div>
    </div>
  );
};

export default LocofyPaywall;


