"use client";
import type { NextPage } from "next";
import { useState } from "react";
import Hero from "./hero";

export type FrameComponent8Type = {
  className?: string;
};

const FrameComponent8: NextPage<FrameComponent8Type> = ({ className = "" }) => {
  const [heroItems] = useState([{}, {}, {}]);
  return (
    <div
      className={`self-stretch flex items-start py-0 pl-2 pr-0 box-border max-w-full text-left text-[13px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="flex-1 flex flex-col items-start gap-[13px] max-w-full">
        {heroItems.map((item, index) => (
          <Hero key={index} />
        ))}
      </div>
    </div>
  );
};

export default FrameComponent8;


