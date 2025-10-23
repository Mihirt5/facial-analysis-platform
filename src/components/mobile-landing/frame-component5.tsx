"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useSession } from "~/lib/auth-client";

export type FrameComponent5Type = {
  className?: string;
};

const FrameComponent5: NextPage<FrameComponent5Type> = ({ className = "" }) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <header
      className={`self-stretch h-[73.3px] flex items-start pt-0 pb-[18.3px] pl-6 pr-[17px] box-border max-w-full mt-[-2.3px] relative ${className}`}
    >
      <div className="flex-1 flex items-start justify-between gap-5 max-w-full">
        <Image
          className="w-14 relative max-h-full object-cover"
          loading="lazy"
          width={56}
          height={55}
          sizes="100vw"
          alt=""
          src="/parallel-alexander-final-12@2x.png"
        />
        <div className="h-11 flex flex-col items-start pt-[11px] px-0 pb-0 box-border">
          <div className="flex-1 flex items-start gap-[7px]">
            {!isLoggedIn ? (
              <>
                <a href="/auth" className="cursor-pointer border-Parallel-Main border-solid border-[0.5px] pt-[9px] px-[17px] pb-2.5 bg-[transparent] self-stretch w-[63px] rounded box-border overflow-hidden shrink-0 flex items-start hover:bg[rgba(112,112,112,0.09)] hover:border-[#707070] hover:border-solid hover:hover:border-[0.5px] hover:box-border no-underline">
                  <div className="relative text-[10px] font-semibold font-[Inter] text-Parallel-Main text-center">
                    Login
                  </div>
                </a>
                <a href="/mobile/onboarding" className="cursor-pointer [border:none] pt-2.5 pb-[11px] pl-[15px] pr-[13px] bg-[transparent] rounded [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex items-center justify-center hover:opacity-90 no-underline">
                  <div className="relative text-[10px] font-semibold font-[Inter] text-[#fff] whitespace-pre-wrap text-center">{`Join Now  → `}</div>
                </a>
              </>
            ) : (
              <a href="/create-analysis" className="cursor-pointer [border:none] pt-2.5 pb-[11px] pl-[15px] pr-[13px] bg-[transparent] rounded [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex items-center justify-center hover:opacity-90 no-underline">
                <div className="relative text-[10px] font-semibold font-[Inter] text-[#fff] whitespace-pre-wrap text-center">{`Dashboard  → `}</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default FrameComponent5;
