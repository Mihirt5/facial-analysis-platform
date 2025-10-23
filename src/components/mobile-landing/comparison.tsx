"use client";
import type { NextPage } from "next";
import { Fragment } from "react";
import ArrowDown from "./ArrowDown";

export type ComparisonType = {
  className?: string;
};

const Comparison: NextPage<ComparisonType> = ({ className = "" }) => {
  const leftSteps = [
    "Obsess over single flaws",
    "Rely on clinics and sales tactics",
    "Little to no objective analysis",
    "Risk of over-treatment or procedures",
    "Disappointing, unnatural outcomes",
  ];
  const rightSteps = [
    "Understand your unique beauty",
    "Science-based beauty analysis",
    "Visualize your beautiful results",
    "Receive a personalized beauty plan",
    "Enhance naturally without procedures",
  ];

  return (
    <section
      className={`self-stretch flex items-start pt-0 pb-[24px] px-[16px] box-border max-w-full mt-[-2.3px] relative text-center text-[22px] text-[#000] font-[Inter] ${className}`}
    >
      <div className="self-stretch flex-1 rounded-[5px] bg-[#f3f3f3] border-[#000] border-solid border-[1px] box-border overflow-hidden pt-[24px] pb-[24px] px-[16px] max-w-full">
        <div className="flex gap-[12px] items-start w-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center justify-center py-0 px-4 mb-[16px]">
              <h3 className="m-0 relative whitespace-nowrap tracking-[-0.05em] font-extralight font-[inherit]">The Old Way</h3>
            </div>
            
            {leftSteps.map((step, i) => (
              <div key={i} className="w-full flex flex-col items-center mb-[16px]">
                <div className="flex items-center justify-center py-0 px-4 mb-[8px]">
                  <div className="h-9 w-9 relative rounded-[50%] border-[#000] border-solid border-[1px] flex items-center justify-center bg-transparent">
                    <h3 className="m-0 relative leading-none text-[21px] tracking-[-0.05em] font-medium text-center">{i + 1}</h3>
                  </div>
                </div>
                <div className="text-[13px] tracking-[-0.05em] text-[#000] mb-[8px]">
                  <div className="max-w-[120px] mx-auto text-center leading-[1.3]">{step}</div>
                </div>
                {i < leftSteps.length - 1 && (
                  <div className="flex items-center justify-center py-2">
                    <ArrowDown stroke="#000" height={30} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column with Dark Card */}
          <div className="w-[210px] mr-[8px] -mt-[28px]">
            <div className="w-full rounded-[12px] [background:linear-gradient(177.11deg,_#da4453,_#89216b)] border-Parallel-Main border-solid border-[1px] px-4 pt-[16px] pb-[24px] mt-[12px] flex flex-col items-center text-[#fff]">
              <div className="flex items-center justify-center w-full mb-[16px]">
                <h3 className="m-0 relative whitespace-nowrap tracking-[-0.05em] font-medium font-[inherit]">The New Way</h3>
              </div>
              
              {rightSteps.map((step, i) => (
                <div key={i} className="w-full flex flex-col items-center mb-[16px]">
                  <div className="flex items-center justify-center py-0 px-4 mb-[8px]">
                    <div className="h-9 w-9 relative rounded-[50%] border-[#fff] border-solid border-[1px] flex items-center justify-center bg-transparent">
                      <h3 className="m-0 relative leading-none text-[21px] tracking-[-0.05em] font-medium text-center">{i + 1}</h3>
                    </div>
                  </div>
                  <div className="text-[13px] tracking-[-0.05em] mb-[8px]">
                    <div className="max-w-[180px] mx-auto text-center leading-[1.3]">{step}</div>
                  </div>
                  {i < rightSteps.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowDown stroke="#fff" height={30} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;