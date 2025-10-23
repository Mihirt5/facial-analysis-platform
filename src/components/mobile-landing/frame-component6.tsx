import type { NextPage } from "next";
import Image from "next/image";

export type FrameComponent6Type = {
  className?: string;
};

const FrameComponent6: NextPage<FrameComponent6Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch h-[464.3px] flex items-start justify-center pt-0 pb-[25.3px] pl-[23px] pr-[21px] box-border max-w-full relative text-left text-[25px] text-[#000] font-[Inter] ${className}`}
    >
      <div className="w-[396px] rounded-[5px] border-[#000] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-col items-end pt-[21px] pb-0 px-0 gap-[23px] max-w-full">
        <div className="w-full flex flex-col items-start text-left gap-[5.4px] max-w-full px-6">
          <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] [transform:_rotate(0.1deg)]">
            Your face, quantified
          </h2>
          <div className="relative text-[15px] tracking-[-0.05em] max-w-[320px]">
            We analyze over 100 aspects of your face to understand your personal
            facial aesthetics.
          </div>
        </div>
        <div className="w-full h-[323px] rounded-[5px] bg-[rgba(255,255,255,0.1)] overflow-hidden shrink-0 flex flex-col items-start box-border relative text-[42px] text-[#fff]">
          <div className="absolute inset-0 z-[0]">
            <Image
              className="w-full h-full object-cover"
              width={927}
              height={462}
              sizes="100vw"
              alt=""
              src="/janko-ferlic-ZNVGL-Pcf74-unsplash-1@2x.png"
              priority
            />
          </div>
          <div className="relative z-[2] flex flex-col items-start pt-[50px] px-2 pb-[50px] gap-[30px] w-full">
            <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
              Perceived Facial Age
            </h1>
            <div className="flex flex-col items-start gap-[7px]">
              <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
                26
              </h2>
              <h3 className="m-0 relative text-xl tracking-[-0.05em] leading-[25px] font-medium font-[inherit]">
                2.5 years younger than your chronological age
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent6;