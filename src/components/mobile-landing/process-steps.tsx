"use client";
import type { NextPage } from "next";

const ProcessSteps: NextPage = () => {
  const steps = [
    {
      number: "1",
      title: "Get your expert facial analysis"
    },
    {
      number: "2", 
      title: "Visualise your ideal self with a morph"
    },
    {
      number: "3",
      title: "Get your personalized glow-up plan"
    },
    {
      number: "4",
      title: "Track progress and see dramatic results"
    }
  ];

  return (
    <section className="w-full px-[21px] py-4 flex flex-col items-center">
      {/* 4 Separate Cards with Connecting Lines */}
      {steps.map((step, index) => (
        <div key={index} className="w-full flex flex-col items-center">
          {/* Card - Fixed height and reduced padding */}
          <div className="w-full h-[70px] rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex flex-col items-center justify-center px-4 gap-1">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 relative rounded-[50%] border-[#fff] border-solid border-[1px] flex items-center justify-center bg-transparent">
                <h3 className="m-0 relative leading-none text-[14px] tracking-[-0.05em] font-medium text-center text-white">
                  {step.number}
                </h3>
              </div>
            </div>
            <div className="relative text-[13px] tracking-[-0.05em] font-medium text-center text-white px-2 leading-tight">
              {step.title}
            </div>
          </div>
          
          {/* Connecting Line (except for last step) - Black and connected */}
          {index < steps.length - 1 && (
            <div className="w-[2px] h-4 bg-black"></div>
          )}
        </div>
      ))}
      
      {/* Join Now Button - Separate with space */}
      <div className="w-full mt-6">
        <a
          href="/mobile/onboarding"
          className="cursor-pointer [border:none] py-2.5 px-[65px] bg-[transparent] w-full h-11 rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] box-border overflow-hidden flex items-center justify-center hover:opacity-90 no-underline"
        >
          <div className="relative text-base font-medium font-[Inter] text-[#fff] text-center">
            Join Now →
          </div>
        </a>
      </div>
    </section>
  );
};

export default ProcessSteps;
