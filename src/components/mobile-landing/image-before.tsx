"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type ImageBeforeType = {
  className?: string;
  remiTurcotteOQDPawvwUnsplash: string;
  before?: string;

  /** Style props */
  imageBeforePadding?: CSSProperties["padding"];
  imageBeforeBackgroundImage?: CSSProperties["backgroundImage"];
  processFlowPadding?: CSSProperties["padding"];
};

const ImageBefore: NextPage<ImageBeforeType> = ({
  className = "",
  imageBeforePadding,
  imageBeforeBackgroundImage,
  remiTurcotteOQDPawvwUnsplash,
  processFlowPadding,
  before,
}) => {
  const imageBeforeStyle: CSSProperties = useMemo(() => {
    return {
      padding: imageBeforePadding,
      backgroundImage: imageBeforeBackgroundImage,
    };
  }, [imageBeforePadding, imageBeforeBackgroundImage]);

  const processFlowStyle: CSSProperties = useMemo(() => {
    return {
      padding: processFlowPadding,
    };
  }, [processFlowPadding]);

  return (
    <div
      className={`flex-1 rounded-[5px] flex items-start justify-end pt-3 px-2.5 pb-[191px] bg-[url('/remi-turcotte-OQ6DP54awvw-unsplash-14@2x.png')] bg-cover bg-no-repeat bg-[top] text-center text-[11px] text-[#fff] font-[Inter] ${className}`}
      style={imageBeforeStyle}
    >
      <Image
        className="w-[194px] relative rounded-[5px] max-h-full object-cover hidden"
        width={194}
        height={225}
        sizes="100vw"
        alt=""
        src={remiTurcotteOQDPawvwUnsplash}
      />
      <div
        className="h-[22px] w-[73px] rounded-[5px] border-[#fff] border-solid border-[1px] box-border overflow-hidden shrink-0 flex items-start pt-0.5 pb-[3px] pl-[19px] pr-[17px] z-[1]"
        style={processFlowStyle}
      >
        <div className="relative">{before}</div>
      </div>
    </div>
  );
};

export default ImageBefore;
