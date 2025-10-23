import type { NextPage } from "next";
import ImageBefore from "./image-before";

export type ResultOverlayType = {
  className?: string;
};

const ResultOverlay: NextPage<ResultOverlayType> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch h-[258.3px] flex items-start pt-0 pb-[33.3px] pl-[22px] pr-5 box-border max-w-full mt-[-2.3px] relative text-center text-[11px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="flex-1 flex items-start gap-2.5 max-w-full">
        <ImageBefore
          remiTurcotteOQDPawvwUnsplash="/remi-turcotte-OQ6DP54awvw-unsplash-14@2x.png"
          before="Before"
        />
        <ImageBefore
          imageBeforePadding="10px 10px 193px"
          imageBeforeBackgroundImage="url('/remi-turcotte-OQ6DP54awvw-unsplash-22@2x.png')"
          remiTurcotteOQDPawvwUnsplash="/remi-turcotte-OQ6DP54awvw-unsplash-22@2x.png"
          processFlowPadding="2px 22px 3px 23px"
          before="After"
        />
      </div>
    </section>
  );
};

export default ResultOverlay;
