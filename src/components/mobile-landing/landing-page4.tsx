import type { NextPage } from "next";
import Image from "next/image";
import FrameComponent4 from "./frame-component4";

export type LandingPage4Type = {
  className?: string;
};

const LandingPage4: NextPage<LandingPage4Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex items-start pt-0 pb-[29.3px] pl-[22px] pr-[21px] box-border max-w-full mt-[-2.3px] relative text-center text-[13px] text-[#000] font-[Inter] ${className}`}
    >
      <div className="flex-1 rounded-[5px] bg-[#f3f3f3] border-[#000] border-solid border-[1px] box-border overflow-hidden flex flex-col items-start pt-[23px] pb-[34px] pl-5 pr-[19px] gap-[26px] max-w-full">
        <div className="self-stretch flex items-start gap-[5.5px]">
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover"
            loading="lazy"
            width={173.6}
            height={201.8}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-1@2x.png"
          />
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover"
            width={173.6}
            height={201.8}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-26@2x.png"
          />
        </div>
        <FrameComponent4
          badgeText="6 Months"
          items={[
            {
              title: "Skincare for Texture & Tone",
              description:
                "A specialized skincare regimen that promotes rapid cell turnover. The result is smoother skin and a more uniform tone.",
            },
            {
              title: "Jawline & Skin Firming",
              description:
                "A treatment program using advanced topical serums and supplements. It boosts your skin's natural ability to produce collagen and elastin for a tighter, firmer jawline.",
            },
            {
              title: "Beard for Jaw Width",
              description:
                "We use products to stimulate and enhance beard growth, filling out the lower face to create the visual effect of a wider, more defined jawline.",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default LandingPage4;
