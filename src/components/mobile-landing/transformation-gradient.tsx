import type { NextPage } from "next";
import Image from "next/image";

export type TransformationGradientType = {
  className?: string;
};

const TransformationGradient: NextPage<TransformationGradientType> = ({
  className = "",
}) => {
  return (
    <section
      className={`self-stretch h-[520px] flex items-start pt-0 pb-[40px] px-4 sm:px-[18px] box-border max-w-full mt-[-2.3px] relative text-left text-[28px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="self-stretch flex-1 rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex flex-col items-end pt-6 px-3 sm:px-[15px] pb-[21px] box-border relative gap-[174px] max-w-full mq397:gap-[87px]">
        <div className="w-[2653.4px] h-[1600px] relative bg-[#ffefd9] hidden max-w-full z-[0]" />
        <div className="w-[4458.3px] h-[2593.3px] relative [filter:blur(848.8px)] rounded-[50%] [background:linear-gradient(87.2deg,_#fff_31.25%,_#e5320f_69.79%,_#ea9924)] [transform:_rotate(-41.8deg)] hidden max-w-full z-[1]" />
        <div className="w-[2280.8px] h-[1320.2px] relative [filter:blur(424.4px)] rounded-[50%] [background:linear-gradient(50.68deg,_rgba(254,_254,_254,_0.94)_24.03%,_rgba(229,_50,_15,_0.94)_81.25%,_rgba(233,_115,_24,_0.94))] [transform:_rotate(-41.8deg)] hidden max-w-full z-[2]" />
        <div className="w-[1229.9px] h-[1326.7px] relative [filter:blur(594.2px)] rounded-[50%] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] hidden max-w-full z-[3]" />
        <div className="w-[2605px] h-[2810.4px] relative [filter:blur(594.2px)] rounded-[50%] bg-[rgba(131,31,0,0.8)] hidden max-w-full z-[4]" />
        <Image
          className="w-[2653.4px] h-[1600px] relative object-cover hidden z-[5]"
          width={2653.4}
          height={1600}
          sizes="100vw"
          alt=""
          src="/Rectangle@2x.png"
        />
        <Image
          className="w-[2653.4px] h-[1600px] absolute !!m-[0 important] bottom-[-1084px] left-[-1235px] object-cover z-[1]"
          width={2653.4}
          height={1600}
          sizes="100vw"
          alt=""
          src="/Noise-Texture@2x.png"
        />
        <div className="w-full max-w-[353px] min-h-[72px] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 px-2 sm:px-0">
          <div className="flex flex-col items-start pt-[11px] px-0 pb-0 flex-shrink-0">
            <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] leading-[108.63%] font-medium font-[inherit] z-[1] whitespace-nowrap">
              <span className="inline">{`Parallel `}</span>
              <span className="inline">Membership</span>
            </h1>
          </div>
          <div className="h-10 w-[134px] rounded-[5px] bg-[rgba(255,255,255,0.17)] overflow-hidden shrink-0 flex items-center justify-center box-border z-[1] text-sm">
            <div className="relative tracking-[-0.05em] font-medium whitespace-nowrap">
              Premium Plan
            </div>
          </div>
        </div>
        <div className="self-stretch flex-1 flex items-start justify-end py-0 px-1 box-border max-w-full text-[56px]">
          <div className="self-stretch flex-1 flex flex-col items-start gap-6 max-w-full mq359:gap-[18px]">
            <div className="flex-1 flex items-start py-0 px-2.5 pt-4">
              <div className="self-stretch flex flex-col items-start gap-2">
                <div className="w-[200px] flex-1 flex items-start gap-1">
                  <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-semibold font-[inherit] z-[1] leading-none">
                    $29
                  </h1>
                  <div className="h-[56px] w-[85px] flex flex-col items-start pt-[38px] px-0 pb-0 box-border text-[18px]">
                    <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-normal font-[inherit] z-[1] leading-none">
                      per month
                    </h3>
                  </div>
                </div>
                <h3 className="m-0 relative text-[18px] tracking-[-0.05em] font-normal font-[inherit] z-[1]">
                  No hidden fees. Cancel anytime
                </h3>
              </div>
            </div>
            <a href="/mobile/onboarding" className="cursor-pointer [border:none] py-3 px-4 bg-[#fff] self-stretch h-[52px] rounded-[5px] overflow-hidden shrink-0 flex items-center justify-center box-border z-[2] hover:bg-[#e6e6e6] no-underline">
              <div className="relative text-[18px] tracking-[-0.05em] font-medium font-[Inter] text-[#000] text-left inline-block min-w-[120px]">{`Get Access → `}</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationGradient;
