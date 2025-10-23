import type { NextPage } from "next";
import Image from "next/image";

export type FooterType = {
  className?: string;
};

const Footer: NextPage<FooterType> = ({ className = "" }) => {
  return (
    <footer
      className={`self-stretch h-[601px] [background:linear-gradient(180deg,_#da4453,_#89216b)] overflow-hidden shrink-0 flex flex-col items-start pt-[22px] px-4 pb-12 box-border relative gap-[49px] max-w-full mt-[-2.3px] text-left text-[28px] text-[#fff] font-[Inter] ${className}`}
    >
      <div className="w-[2653.4px] h-[1600px] relative bg-[#ffefd9] hidden max-w-full z-[0]" />
      <div className="w-[4458.3px] h-[2593.3px] relative [filter:blur(848.8px)] rounded-[50%] [background:linear-gradient(87.2deg,_#fff_31.25%,_#e5320f_69.79%,_#ea9924)] [transform:_rotate(-41.8deg)] hidden max-w-full z-[1]" />
      <div className="w-[2280.8px] h-[1320.2px] relative [filter:blur(424.4px)] rounded-[50%] [background:linear-gradient(50.68deg,_rgba(254,_254,_254,_0.94)_24.03%,_rgba(229,_50,_15,_0.94)_81.25%,_rgba(233,_115,_24,_0.94))] [transform:_rotate(-41.8deg)] hidden max-w-full z-[2]" />
      <div className="w-[1229.9px] h-[1326.7px] relative [filter:blur(594.2px)] rounded-[50%] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] hidden max-w-full z-[3]" />
      <div className="w-[2605px] h-[2810.4px] relative [filter:blur(594.2px)] rounded-[50%] bg-[rgba(131,31,0,0.8)] hidden max-w-full z-[4]" />
      <Image
        className="w-[2653.4px] h-[1600px] relative object-cover hidden max-w-full z-[5]"
        width={2653.4}
        height={1600}
        sizes="100vw"
        alt=""
        src="/Rectangle@2x.png"
      />
      <Image
        className="w-[2986px] h-[1600px] absolute !!m-[0 important] right-[-1310px] bottom-[-999px] object-cover z-[1]"
        width={2986}
        height={1600}
        sizes="100vw"
        alt=""
        src="/Noise-Texture@2x.png"
      />
      <div className="w-[357px] flex flex-col items-start py-0 pl-0 pr-5 box-border gap-[23px] max-w-full">
        <div className="flex items-start">
          <Image
            className="w-[78px] relative max-h-full object-cover z-[1]"
            width={78}
            height={78}
            sizes="100vw"
            alt=""
            src="/parallel-alexander-final-1@2x.png"
          />
          <div className="flex flex-col items-start pt-[22px] px-0 pb-0">
            <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] z-[1]">
              Parallel
            </h2>
          </div>
        </div>
        <div className="self-stretch flex items-start py-0 pl-[19px] pr-0 text-[19px]">
          <div className="flex-1 flex flex-col items-start gap-3.5">
            <div className="self-stretch flex items-start justify-between gap-5 mq258:flex-wrap">
              <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-semibold font-[inherit] z-[1]">
                Company/
              </h3>
              <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-semibold font-[inherit] z-[1]">
                Connect/
              </h3>
            </div>
            <div className="w-[305px] flex items-start justify-between gap-5">
              <div className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1]">
                Products
              </div>
            </div>
            <div className="w-[305px] flex items-start justify-between gap-5">
              <div className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1]">
                Research
              </div>
              <a href="https://www.youtube.com/@parallelalexander" target="_blank" rel="noopener noreferrer" className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1] text-[#fff] no-underline hover:opacity-80">
                Youtube
              </a>
            </div>
            <div className="self-stretch flex items-start justify-between gap-5 mq266:flex-wrap">
              <a href="mailto:alexander@parallellabs.co" className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1] text-[#fff] no-underline hover:opacity-80">
                Contact Us
              </a>
              <a href="https://www.instagram.com/parallelalexander?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="w-[82px] relative text-[length:inherit] tracking-[-0.05em] font-normal inline-block z-[1] text-[#fff] no-underline hover:opacity-80">
                Instagram
              </a>
            </div>
            <div className="w-[287px] flex items-start justify-between gap-5">
              <div className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1]">
                Become a Partner
              </div>
              <a href="https://www.tiktok.com/@parallelalexander?_t=ZT-8zq6DeDZkV5&_r=1" target="_blank" rel="noopener noreferrer" className="w-[51px] relative text-[length:inherit] tracking-[-0.05em] font-normal inline-block z-[1] text-[#fff] no-underline hover:opacity-80">
                Tiktok
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start py-0 px-[19px] text-[19px]">
        <div className="flex flex-col items-start gap-3.5">
          <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-semibold font-[inherit] z-[1]">
            Others/
          </h3>
          <a href="https://parallellabs.co/privacy-policy" className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1] text-[#fff] no-underline hover:opacity-80">
            Privacy Policy
          </a>
          <a href="https://parallellabs.co/terms-of-service" className="relative text-[length:inherit] tracking-[-0.05em] font-normal z-[1] text-[#fff] no-underline hover:opacity-80">
            Terms of Service
          </a>
        </div>
      </div>
      <div className="self-stretch flex items-start py-0 pl-[19px] pr-3.5 box-border max-w-full">
        <a href="/onboarding/name" className="cursor-pointer [border:none] pt-[18px] pb-4 pl-[25px] pr-5 bg-[rgba(255,255,255,0.17)] flex-1 rounded-[5px] overflow-hidden flex items-start justify-center box-border max-w-full z-[1] hover:bg-[rgba(230,230,230,0.17)] no-underline">
          <div className="relative text-2xl tracking-[-0.05em] font-medium font-[Inter] text-[#fff] text-left inline-block min-w-[126px]">
            Join Now →
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
