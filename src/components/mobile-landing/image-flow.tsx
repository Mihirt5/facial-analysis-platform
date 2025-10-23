import type { NextPage } from "next";
import Image from "next/image";
import FrameComponent4 from "./frame-component4";

export type ImageFlowType = {
  className?: string;
};

const ImageFlow: NextPage<ImageFlowType> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex items-start pt-0 pb-[50.3px] pl-[22px] pr-[21px] box-border max-w-full mt-[-2.3px] relative ${className}`}
    >
      <div className="flex-1 rounded-[5px] bg-[#f3f3f3] border-[#000] border-solid border-[1px] box-border overflow-hidden flex flex-col items-start pt-[23px] pb-[34px] pl-5 pr-[19px] gap-[24.7px] max-w-full">
        <div className="self-stretch flex items-start gap-1.5">
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover"
            width={174.5}
            height={203.3}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-15@2x.png"
          />
          <Image
            className="flex-1 relative rounded-[5px] max-w-full overflow-hidden max-h-full object-cover"
            width={174.5}
            height={203.3}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-2@2x.png"
          />
        </div>
        <Image
          className="w-[174.7px] relative rounded-[5px] max-h-full object-cover hidden"
          width={174.7}
          height={203.1}
          sizes="100vw"
          alt=""
          src="/remi-turcotte-OQ6DP54awvw-unsplash-12@2x.png"
        />
        <Image
          className="w-[174.7px] relative rounded-[5px] max-h-full object-cover hidden"
          width={174.7}
          height={203.1}
          sizes="100vw"
          alt=""
          src="/remi-turcotte-OQ6DP54awvw-unsplash-25@2x.png"
        />
        <div className="self-stretch h-[203px] relative hidden">
          <Image
            className="absolute h-full top-[0px] bottom-[0px] left-[0px] rounded-[5px] max-h-full w-[174.3px] object-cover"
            width={174.3}
            height={203}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-13@2x.png"
          />
          <Image
            className="absolute h-full top-[0px] bottom-[0px] left-[180.7px] rounded-[5px] max-h-full w-[174.3px] object-cover"
            width={174.3}
            height={203}
            sizes="100vw"
            alt=""
            src="/remi-turcotte-OQ6DP54awvw-unsplash-23@2x.png"
          />
        </div>
        <FrameComponent4
          badgeText="4 Months"
          items={[
            {
              title: "Non-Surgical Jawline Contouring",
              description:
                "An immediate-results treatment uses a biocompatible filler to add precise volume and definition. It can correct asymmetry and strengthen a weak chin.",
            },
            {
              title: "Targeted Submental Fat Reduction",
              description:
                "A non-surgical treatment uses targeted injections to eliminate stubborn pockets of fat under the chin, creating a more defined neck and a sharper profile.",
            },
            {
              title: "Internal Collagen Support",
              description:
                "A simple daily regimen of oral supplements that supports the body's natural production of collagen.",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default ImageFlow;
