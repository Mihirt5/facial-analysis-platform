"use client";
import type { NextPage } from "next";
import Image from "next/image";
import { CheckoutButton } from "./_components/payment-buttons";

const steps = [
  { icon: "/Group-70.svg", title: "Get Your Facial Diagnosis", desc: "Clinical Grade Facial Analysis" },
  { icon: "/Group-74.svg", title: "Unlock Personalized Plan", desc: "Custom treatment recommendations" },
  { icon: "/Group-73.svg", title: "Receive Progress Notifications", desc: "Track your aesthetic journey over time" },
  { icon: "/Group-75.svg", title: "Achieve Your Aesthetic Goals", desc: "Science-backed results you can trust" },
];

const LandingPaywall: NextPage = () => {
  return (
    <div className="w-full min-h-screen relative bg-[linear-gradient(180deg,#6f6f6f_0%,#d9d9d9_35%,#f2f2f2_100%)] overflow-hidden flex flex-col items-center pt-16 px-7 gap-20 leading-[normal] tracking-[normal]">
      <section className="w-full max-w-md text-center text-3xl text-white">
        <h1 className="tracking-[-0.05em] leading-[38px]">
          Start your aesthetic journey Today
        </h1>
        <div className="mt-10 text-left">
          <div className="flex flex-col gap-7">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="pt-1">
                  <Image alt="" src={s.icon} width={54} height={54} />
                </div>
                <div className="text-Parallel-Main">
                  <div className="text-[19px] leading-[38px]">{s.title}</div>
                  <div className="-mt-3 text-[15px] leading-[38px] text-[#a0a0a0]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-md rounded-t-[15px] bg-white shadow-[0_4px_30.7px_2px_rgba(0,0,0,0.25)] p-6 text-center flex-grow flex flex-col justify-center">
        <div className="text-lg text-[#a0a0a0]">
          <div className="mb-2">Monthly Subscription</div>
          <div>$29/month</div>
        </div>
        <div className="mt-6">
          <CheckoutButton label="Subscribe for $29" />
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              // Go back to the last step the user was on (step 4 - treatments)
              // This is the last survey step before signup/payment
              try {
                const raw = localStorage.getItem("onboardingDraft");
                let draft = raw ? JSON.parse(raw) : {};
                
                // If no draft exists (was cleared after completion), create a new one
                // and set step to 4 so user can review their responses
                if (!raw || Object.keys(draft).length === 0) {
                  draft = { step: 4 };
                } else {
                  // Always go to step 4 (treatments) - the last survey step
                  draft.step = 4;
                }
                
                localStorage.setItem("onboardingDraft", JSON.stringify(draft));
              } catch (e) {
                console.error("Failed to set step in localStorage:", e);
              }
              window.location.href = "/mobile/onboarding";
            }}
            className="w-full text-sm text-[#a0a0a0] hover:text-[#707070] transition-colors duration-200 py-2"
          >
            ← Back to survey
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPaywall;


