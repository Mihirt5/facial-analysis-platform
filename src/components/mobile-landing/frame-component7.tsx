import type { NextPage } from "next";
import Image from "next/image";
import Style from "./style";

export type FrameComponent7Type = {
  className?: string;
};

const FrameComponent7: NextPage<FrameComponent7Type> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch h-[464.3px] flex items-start justify-center pt-0 px-[22px] pb-[25.3px] box-border max-w-full relative text-left text-[25px] text-[#000] font-[Inter] ${className}`}
    >
      <div className="w-[396px] rounded-[5px] border-[#000] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-col items-end pt-[21px] pb-0 px-0 gap-[23px] max-w-full">
        <div className="w-full flex flex-col items-start text-left gap-[5.4px] max-w-full px-6">
          <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] [transform:_rotate(0.1deg)]">
            Focus on overall facial harmony
          </h2>
          <div className="relative text-[15px] tracking-[-0.05em] max-w-[320px]">
            We study the signals in your face to uncover key indicators of your
            health and wellness.
          </div>
        </div>
        <div className="w-full h-[323px] rounded-[5px] bg-[rgba(255,255,255,0.1)] overflow-hidden shrink-0 flex flex-col items-start box-border relative text-[42px] text-[#fff]">
          <div className="absolute inset-0 z-[0]">
            <Image
              className="w-full h-full object-cover"
              width={927}
              height={469}
              sizes="100vw"
              alt=""
              src="/janko-ferlic-ZNVGL-Pcf74-unsplash-1@2x.png"
            />
          </div>
          <div className="relative z-[2] flex flex-col items-start pt-[50px] px-2 pb-[50px] w-full h-full">
            <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] mb-[55px]">
              Facial Health Indicators
            </h1>
            <div className="flex flex-col items-start gap-3">
              <div className="w-[92px] h-[46px] relative">
                <Style thickness={64} />
              </div>
              <h3 className="m-0 relative text-xl tracking-[-0.05em] leading-[25px] font-medium font-[inherit]">
                Your biomarkers in range
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent7;