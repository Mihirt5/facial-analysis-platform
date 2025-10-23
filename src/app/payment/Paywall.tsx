"use client";

import Image from "next/image";
import { CheckoutButton } from "./_components/payment-buttons";

export default function Paywall() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-[#f0f0f0] to-[#dcdcdc] px-4 py-8">
      <div className="w-full max-w-[560px] rounded-2xl bg-white/70 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur">
        <div className="mx-auto mb-8 max-w-[480px] text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Start your free week and
            <br />
            gain 2+ hours back
          </h1>
        </div>

        <div className="space-y-6">
          {[
            { icon: "check", title: "Get Your Focus Diagnosis" },
            { icon: "lock", title: "Get Your Focus Diagnosis" },
            { icon: "bell", title: "Get Your Focus Diagnosis" },
            { icon: "star", title: "Get Your Focus Diagnosis" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                {/* simple emoji icons to match quick visual */}
                <span className="text-xl">
                  {item.icon === "check" && "✓"}
                  {item.icon === "lock" && "🔓"}
                  {item.icon === "bell" && "🔔"}
                  {item.icon === "star" && "★"}
                </span>
              </div>
              <div>
                <div className="text-base font-medium text-gray-900">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500">
                  You successfully started your journey
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
          <div className="mb-4 text-center text-gray-700">
            <div className="text-lg font-medium">Try Free for 7 days</div>
            <div className="text-sm">$0.27/day ($99.99/year)</div>
          </div>
          <CheckoutButton label="Try for $0.00" />
          <div className="mt-3 text-center text-sm text-gray-500">
            No payment due now!
          </div>
        </div>
      </div>
    </div>
  );
}


