"use client";

import type { NextPage } from "next";
import { useSession } from "~/lib/auth-client";

export type FrameComponent8Type = {
  className?: string;
};

const FrameComponent8: NextPage<FrameComponent8Type> = ({
  className = "",
}) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div
      className={`w-full bg-Parallel-Main flex items-center justify-center pt-3 pb-[12px] px-4 box-border text-center text-[10px] text-[#fff] font-inter font-light ${className}`}
    >
      <div className="relative tracking-[-0.05em] leading-[1.4] font-medium max-w-[460px] mx-auto">
        {`Join thousands of women using science-based beauty to enhance their natural radiance. `}
        <a href={isLoggedIn ? "/create-analysis" : "/mobile/onboarding"} className="[text-decoration:underline]">
          {isLoggedIn ? "Dashboard" : "Start Now"}
        </a>
        {` →`}
      </div>
    </div>
  );
};

export default FrameComponent8;
