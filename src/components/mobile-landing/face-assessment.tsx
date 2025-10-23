import type { NextPage } from "next";
import Image from "next/image";

export type FaceAssessmentType = {
  className?: string;
};

const FaceAssessment: NextPage<FaceAssessmentType> = ({ className = "" }) => {
  return (
    <section className={`self-stretch flex items-start pt-0 pb-[24px] px-[22px] box-border max-w-full mt-[-2.3px] relative ${className}`}>
      <div className="w-full rounded-[5px] overflow-hidden">
        <Image
          src="/New Parallel Design.png"
          alt="Parallel analysis design"
          width={1600}
          height={1200}
          sizes="100vw"
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default FaceAssessment;
