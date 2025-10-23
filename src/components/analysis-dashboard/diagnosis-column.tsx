import type { NextPage } from "next";
import Image from "next/image";

export type DiagnosisColumnType = {
  className?: string;
  group70: string;
};

const DiagnosisColumn: NextPage<DiagnosisColumnType> = ({
  className = "",
  group70,
}) => {
  return (
    <div
      className={`self-stretch flex items-start flex-wrap content-start gap-[15px] text-left text-[19px] text-Parallel-Main font-[Inter] ${className}`}
    >
      <div className="flex flex-col items-start pt-[5px] px-0 pb-0">
        <Image
          className="w-full h-[54px] relative z-[1]"
          loading="lazy"
          width={54}
          height={54}
          sizes="100vw"
          alt=""
          src={group70}
        />
      </div>
      <div className="flex-1 flex flex-col items-start min-w-[158px]">
        <div className="relative tracking-[-0.05em] leading-[38px] font-medium shrink-0">
          Get Your Focus Diagnosis
        </div>
        <div className="self-stretch flex items-start pt-0 px-0 pb-0 text-[15px] text-[#a0a0a0]">
          <div className="mt-[-12px] relative tracking-[-0.05em] leading-[38px] font-medium shrink-0">
            You successfully started your journey
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisColumn;
