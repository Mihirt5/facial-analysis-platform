import type { NextPage } from "next";
import Image from "next/image";
import FrameComponent4 from "./frame-component4";

export type LandingPage5Type = {
  className?: string;
};

const LandingPage5: NextPage<LandingPage5Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex items-start pt-0 pb-[29.3px] pl-[22px] pr-[21px] box-border max-w-full mt-[-2.3px] relative ${className}`}
    >
      <div className="flex-1 rounded-[5px] bg-[#f3f3f3] border-[#000] border-solid border-[1px] box-border overflow-hidden flex flex-col items-start pt-[23px] pb-[34px] pl-5 pr-[19px] gap-[25px] max-w-full">
        <div className="self-stretch flex items-start gap-[6.4px]">
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover shrink-0"
            width={174.3}
            height={203}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-13@2x.png"
            priority
            unoptimized
          />
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover shrink-0"
            width={174.3}
            height={203}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-23@2x.png"
            priority
            unoptimized
          />
        </div>
        <FrameComponent4
          badgeText="8 Months"
          items={[
            {
              title: "Jaw Muscle Slimming",
              description:
                "A non-invasive procedure using injections to reduce the size of overdeveloped jaw muscles. It creates a softer, more V-shaped facial contour.",
            },
            {
              title: "Advanced Skin Remodeling",
              description:
                "A program that utilizes cutting-edge serums to signal the skin to repair itself. It leads to long-term skin remodeling and improved jawline firmness.",
            },
            {
              title: "Overall Facial Definition",
              description:
                "A holistic approach focused on products designed to reduce facial puffiness, allowing your underlying bone structure to become more pronounced.",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default LandingPage5;
