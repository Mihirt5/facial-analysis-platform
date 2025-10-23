"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useSession } from "~/lib/auth-client";
import FrameComponent8 from "~/components/mobile-landing/frame-component8";
import FrameComponent5 from "~/components/mobile-landing/frame-component5";
import FrameComponent6 from "~/components/mobile-landing/frame-component6";
import FrameComponent7 from "~/components/mobile-landing/frame-component7";
import FacialAgeHealth from "~/components/mobile-landing/facial-age-health";
import FaceAssessment from "~/components/mobile-landing/face-assessment";
import Comparison from "~/components/mobile-landing/comparison";
import ResultOverlay from "~/components/mobile-landing/result-overlay";
import LandingPage2 from "~/components/mobile-landing/landing-page2";
import LandingPage1 from "~/components/mobile-landing/landing-page1";
import ProcessSteps from "~/components/mobile-landing/process-steps";
import LandingPage3 from "~/components/mobile-landing/landing-page3";
import LandingPage4 from "~/components/mobile-landing/landing-page4";
import LandingPage5 from "~/components/mobile-landing/landing-page5";
import ImageFlow from "~/components/mobile-landing/image-flow";
import TransformationGradient from "~/components/mobile-landing/transformation-gradient";
import LandingPage from "~/components/mobile-landing/landing-page";
import Footer from "~/components/mobile-landing/footer";
import BeforeAfterSlider from "~/components/ui/before-after-slider";

const MobileLanding: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="w-full relative bg-[#fff] overflow-hidden flex flex-col items-start leading-[normal] tracking-[normal] text-left text-xs text-[#000] font-inter font-light">
      <div className="w-full flex items-start pt-0 px-0 pb-[19.3px] box-border shrink-0">
        <FrameComponent8 />
      </div>
      <FrameComponent5 />
      <div className="self-stretch h-[40.8px] flex items-start pt-0 px-0 pb-[40.3px] box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-Parallel-Main border-solid border-t-[0.5px] box-border max-w-full" />
      </div>
      <div className="self-stretch h-[41.3px] flex items-center justify-center pt-0 pb-[15.3px] px-4 box-border mt-[-2.3px] relative text-[9px]">
        <div className="h-[26px] rounded-[5px] border-Parallel-Main border-solid border-[1px] box-border overflow-hidden flex items-center justify-center pt-[5px] pb-1.5 px-[30px] whitespace-nowrap">
          <div className="relative font-normal">Science-Based Beauty</div>
        </div>
      </div>
      <div className="self-stretch flex items-center justify-center pt-0 pb-[15.3px] px-4 shrink-0 mt-[-2.3px] relative text-center text-[33px]">
        <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] italic font-normal" style={{ fontFamily: 'Times Ten, serif' }}>
          Become Your Most Radiant Self
        </h2>
      </div>
      <div className="self-stretch flex items-center justify-center pt-0 px-[75px] pb-[18.3px] box-border mt-[-2.3px] relative text-center">
        <div className="relative tracking-[-0.05em] font-light">
          Get your personalized facial analysis, transformation visualization and beauty enhancement plan based
          on 2000+ clinical studies.
        </div>
      </div>
      <div className="self-stretch h-[36.3px] flex items-start justify-center pt-0 px-5 pb-[24.1px] box-border mt-[-2.3px] relative text-[9px]">
        <div className="self-stretch flex items-start gap-1">
          <div className="self-stretch w-[13px] flex flex-col items-start pt-px px-0 pb-0 box-border">
            <div className="relative tracking-[-0.05em]">4.8</div>
          </div>
          <Image
            className="h-[12.2px] w-[61px] relative"
            loading="lazy"
            width={61}
            height={12}
            sizes="100vw"
            alt=""
            src="/Group-149.svg"
            style={{ width: "auto", height: "auto" }}
          />
          <div className="w-[60px] relative tracking-[-0.05em] inline-block whitespace-nowrap">
            1000+ Reviews
          </div>
        </div>
      </div>
      <section className="self-stretch h-[87.3px] flex items-start justify-center pt-0 pb-[43.3px] pl-[21px] pr-5 box-border mt-[-2.3px] relative">
        <a
          href={isLoggedIn ? "/create-analysis" : "/mobile/onboarding"}
          className="cursor-pointer [border:none] pt-3 px-[62px] pb-[13px] bg-[transparent] rounded-[5px] [background:linear-gradient(90deg,_#da4453_0%,_#b73355_33%,_#9c2958_66%,_#89216b_100%)] overflow-hidden flex items-center justify-center hover:opacity-90 no-underline"
        >
          <div className="relative text-base font-medium font-[Inter] text-[#fff] text-left inline-block min-w-[97px]">
            {isLoggedIn ? "Dashboard → " : "Start Now → "}
          </div>
        </a>
      </section>
      {/* Moved up: Visualize section with new subtext and FaceAssessment */}
      <div className="self-stretch h-[41.3px] flex items-center justify-center pt-0 pb-[15.3px] px-4 box-border mt-[-2.3px] relative text-[9px]">
        <div className="h-[26px] rounded-[5px] border-Parallel-Main border-solid border-[1px] box-border overflow-hidden flex items-center justify-center pt-[5px] pb-1.5 px-[30px] whitespace-nowrap">
          <div className="relative font-normal">Our New Approach</div>
        </div>
      </div>
      <FaceAssessment />
      <div className="flex items-center pt-0 px-[42px] pb-[23.6px] mt-[-2.3px] relative text-base text-Parallel-Main mq259:pl-5 mq259:pr-5 mq259:box-border">
        <div className="flex items-center gap-[21.3px]">
          <Image
            className="h-[21.7px] w-[21.7px] relative flex-shrink-0"
            loading="lazy"
            width={21.7}
            height={21.7}
            sizes="100vw"
            alt=""
            src="/Group-37.svg"
          />
          <div className="relative tracking-[-0.05em]">
            Feel confident and beautiful
          </div>
        </div>
      </div>
      <div className="self-stretch h-[22.3px] flex items-start pt-0 pb-[21.3px] pl-[22px] pr-5 box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <div className="flex items-center pt-0 px-[42px] pb-[23.3px] mt-[-2.3px] relative text-base text-Parallel-Main mq302:pl-5 mq302:pr-5 mq302:box-border">
        <div className="flex items-center gap-[21.3px]">
          <Image
            className="h-[21.7px] w-[21.7px] relative flex-shrink-0"
            loading="lazy"
            width={21.7}
            height={21.7}
            sizes="100vw"
            alt=""
            src="/Group-37.svg"
          />
          <div className="relative tracking-[-0.05em]">
            Enhance your professional presence
          </div>
        </div>
      </div>
      <div className="self-stretch h-[22.6px] flex items-start pt-0 pb-[21.6px] pl-[22px] pr-5 box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <div className="flex items-center pt-0 px-[42px] pb-[22.9px] box-border max-w-full mt-[-2.3px] relative text-base text-Parallel-Main mq396:pl-5 mq396:pr-5 mq396:box-border">
        <div className="flex items-center gap-[21.3px]">
          <Image
            className="h-[21.7px] w-[21.7px] relative flex-shrink-0"
            loading="lazy"
            width={21.7}
            height={21.7}
            sizes="100vw"
            alt=""
            src="/Group-37.svg"
          />
          <div className="relative tracking-[-0.05em]">
            Radiate natural elegance
          </div>
        </div>
      </div>
      <div className="self-stretch h-[23px] flex items-start pt-0 pb-[22px] pl-[22px] pr-5 box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <div className="flex items-center pt-0 px-[42px] pb-[22.6px] box-border max-w-full mt-[-2.3px] relative text-base text-Parallel-Main mq328:pl-5 mq328:pr-5 mq328:box-border">
        <div className="flex items-center gap-[21.3px]">
          <Image
            className="h-[21.7px] w-[21.7px] relative flex-shrink-0"
            loading="lazy"
            width={21.7}
            height={21.7}
            sizes="100vw"
            alt=""
            src="/Group-37.svg"
          />
          <div className="relative tracking-[-0.05em]">
            Attract meaningful connections
          </div>
        </div>
      </div>
      <div className="self-stretch h-[23.3px] flex items-start pt-0 pb-[22.3px] pl-[22px] pr-5 box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <div className="flex items-center pt-0 px-[42px] pb-[52.6px] box-border mt-[-2.3px] relative text-base text-Parallel-Main mq279:pl-5 mq279:pr-5 mq279:box-border">
        <div className="flex items-center gap-[21.3px]">
          <Image
            className="h-[21.7px] w-[21.7px] relative flex-shrink-0"
            loading="lazy"
            width={21.7}
            height={21.7}
            sizes="100vw"
            alt=""
            src="/Group-37.svg"
          />
          <div className="relative tracking-[-0.05em]">
            Embrace your best self
          </div>
        </div>
      </div>
      <FrameComponent6 />
      <div className="h-1"></div>
      <FrameComponent7 />
      <div className="h-8"></div>
      <FacialAgeHealth />
      {/* Heading + subtext moved here to sit directly above the slider */}
      <div className="self-stretch flex items-center justify-center pt-0 px-6 pb-3 mt-[-2.3px] relative text-center">
        <h2 className="m-0 relative text-[clamp(22px,7.5vw,28px)] tracking-[-0.05em] italic font-normal" style={{ fontFamily: 'Times Ten, serif' }}>
          Visualize Your Beautiful Future
        </h2>
      </div>
      <div className="self-stretch flex items-center justify-center pt-0 px-6 pb-8 box-border mt-[-2.3px] relative text-center">
        <div className="relative tracking-[-0.05em] max-w-[320px] mx-auto">
          See a beautiful projection of your enhanced features based on thousands of transformation studies
        </div>
      </div>
      {/* Moved down: Slider morph section now lives here */}
      <section className="self-stretch h-[555.3px] flex items-start pt-0 pb-[35.3px] pl-[22px] pr-[21px] box-border max-w-full mt-[-2.3px] relative">
        <div className="flex-1 flex items-start relative max-w-full">
          <BeforeAfterSlider
            beforeImage="/remi-turcotte-oq-6-dp-54-awvw-unsplash-14.png"
            afterImage="/remi-turcotte-oq-6-dp-54-awvw-unsplash-15.png"
            className="w-full h-[520px] rounded-[5px] overflow-hidden"
            initialPosition={33}
          />
        </div>
      </section>
      <div className="self-stretch h-[41.3px] flex items-center justify-center pt-0 pb-[15.3px] px-4 box-border mt-[-2.3px] relative text-[9px]">
        <div className="h-[26px] rounded-[5px] border-Parallel-Main border-solid border-[1px] box-border overflow-hidden flex items-center justify-center pt-[5px] pb-1.5 px-[30px] whitespace-nowrap">
          <div className="relative font-normal">Our New Approach</div>
        </div>
      </div>
      <div className="self-stretch flex items-center justify-center pt-0 px-6 pb-3 mt-[-2.3px] relative text-center">
        <h2 className="m-0 relative text-[clamp(22px,7.5vw,28px)] tracking-[-0.05em] italic font-normal" style={{ fontFamily: 'Times Ten, serif' }}>
          A New Way to Glow Up
        </h2>
      </div>
      <Comparison />
      <div className="self-stretch h-[41.3px] flex items-center justify-center pt-0 pb-[15.3px] px-4 box-border mt-[-2.3px] relative text-[9px]">
        <div className="h-[26px] rounded-[5px] border-Parallel-Main border-solid border-[1px] box-border overflow-hidden flex items-center justify-center pt-[5px] pb-1.5 px-[30px] whitespace-nowrap">
          <div className="relative font-normal">Expert Advice Enhanced by Technology</div>
        </div>
      </div>
      <div className="self-stretch flex items-center justify-center pt-0 px-6 pb-8 box-border mt-[-2.3px] relative text-center text-[33px]">
        <h2 className="m-0 relative text-[length:inherit] tracking-[-0.05em] italic font-normal" style={{ fontFamily: 'Times Ten, serif' }}>
          Your Personalized Glow Up Plan
        </h2>
      </div>
      <ResultOverlay />
      <ProcessSteps />
      <div className="self-stretch h-[41.3px] flex items-center justify-center pt-0 pb-[15.3px] px-4 box-border mt-[-2.3px] relative text-[9px]">
        <div className="h-[26px] rounded-[5px] border-Parallel-Main border-solid border-[1px] box-border overflow-hidden flex items-center justify-center pt-[5px] pb-1.5 px-[30px] whitespace-nowrap">
          <div className="relative font-normal">Client Transformation</div>
        </div>
      </div>
      <section className="self-stretch flex items-center justify-center pt-4 pb-6 px-4 box-border mt-[-2.3px] relative text-center text-[clamp(24px,8vw,33px)] text-[#000]" style={{ fontFamily: 'Times Ten, serif' }}>
        <h1 className="m-0 max-w-[400px] w-full relative leading-[1.2] tracking-[-0.05em] inline-block italic font-normal">
          <span className="block">{`Real Transformations by `}</span>
          <span className="block">Parallel Women</span>
        </h1>
      </section>
      <div className="self-stretch h-[54.3px] flex items-start pt-0 px-[75px] pb-[39.3px] box-border mt-[-2.3px] relative text-center">
        <div className="flex-1 relative tracking-[-0.05em]">
          Join 3,000+ women embracing their beauty journey.
        </div>
      </div>
      <LandingPage4 />
      <LandingPage5 />
      <ImageFlow />
      <TransformationGradient />
      <section className="self-stretch h-[89.3px] flex items-center pt-0 pb-[27.3px] pl-[37px] pr-[34px] box-border max-w-full mt-[-2.3px] relative text-left text-[21px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex items-center gap-[13.9px] max-w-full">
          <div className="flex flex-col items-start justify-center pt-0 px-0 pb-0 flex-shrink-0">
            <Image
              className="w-[36.3px] h-[36.3px] relative shrink-0"
              width={36.3}
              height={36.3}
              sizes="100vw"
              alt=""
              src="/Group-196.svg"
            />
          </div>
          <div className="flex-1 flex flex-col items-start gap-[7px] shrink-0">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-normal font-[inherit]">
              Complete facial analysis
            </h3>
            <div className="relative text-xs tracking-[-0.05em]">
              Get an in-depth, personalized breakdown of your unique facial features
              with 30+ detailed measurements.
            </div>
          </div>
        </div>
      </section>
      <div className="self-stretch h-[27.3px] flex items-start pt-0 pb-[26.3px] pl-[25px] pr-[17px] box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <LandingPage personalizedFacialImprovement="Personalized beauty enhancement plan" />
      <div className="self-stretch flex items-start justify-start pt-[10px] pl-[88px] pr-[38px] pb-[27.3px] mt-[-2.3px] relative text-Parallel-Main">
        <div className="relative tracking-[-0.05em] text-left max-w-[320px]">
          Receive personalized guidance to enhance your
          natural beauty and radiance.
        </div>
      </div>
      <div className="self-stretch h-[27.3px] flex items-start pt-0 pb-[26.3px] pl-[19px] pr-[23px] box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <section className="self-stretch h-[95.3px] flex items-center pt-0 pb-[27.3px] pl-[38px] pr-[18px] box-border max-w-full mt-[-2.3px] relative text-left text-[21px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex items-center gap-[13.7px] max-w-full">
          <div className="flex flex-col items-start justify-center pt-0 px-0 pb-0 flex-shrink-0">
            <Image
              className="w-[36.3px] h-[36.3px] relative shrink-0"
              loading="lazy"
              width={36.3}
              height={36.3}
              sizes="100vw"
              alt=""
              src="/Group-196.svg"
            />
          </div>
          <div className="flex-1 flex flex-col items-start gap-[7px] shrink-0 max-w-full">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-normal font-[inherit]">
              Beauty scores & progress tracking
            </h3>
            <div className="relative text-xs tracking-[-0.05em]">
              Track your beauty metrics and celebrate your
              transformation journey over time.
            </div>
          </div>
        </div>
      </section>
      <div className="self-stretch h-[27.3px] flex items-start pt-0 pb-[26.3px] pl-[19px] pr-[23px] box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <LandingPage
        landingPageWidth="unset"
        landingPagePadding="0px 18px 0px 38px"
        landingPageAlignSelf="stretch"
        personalizedFacialImprovement="Before-and-after visualization of your glow up"
      />
      <div className="self-stretch h-[57.3px] flex items-start justify-start pt-[10px] pl-[88px] pr-[47px] pb-[27.3px] box-border mt-[-2.3px] relative text-Parallel-Main mq399:pl-5 mq399:pr-5 mq399:box-border">
        <div className="relative tracking-[-0.05em] text-left max-w-[320px]">
          See what you could look like after your personalized transformation.
        </div>
      </div>
      <div className="self-stretch h-[27.3px] flex items-start pt-0 pb-[26.3px] pl-[19px] pr-[23px] box-border max-w-full mt-[-2.3px] relative">
        <div className="self-stretch flex-1 relative border-[#a0a0a0] border-solid border-t-[1px] box-border max-w-full" />
      </div>
      <section className="self-stretch flex items-center pt-0 pb-[67.3px] pl-[38px] pr-[18px] box-border max-w-full mt-[-2.3px] relative text-left text-[21px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex items-center gap-[13.7px] max-w-full">
          <div className="flex flex-col items-start justify-center pt-0 px-0 pb-0 flex-shrink-0">
            <Image
              className="w-[36.3px] h-[36.3px] relative shrink-0"
              loading="lazy"
              width={36.3}
              height={36.3}
              sizes="100vw"
              alt=""
              src="/Group-196.svg"
            />
          </div>
          <div className="flex-1 flex flex-col items-start gap-[7px] min-w-[217px] shrink-0 max-w-full">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-normal font-[inherit]">
              Expert support when you need it
            </h3>
            <div className="relative text-xs tracking-[-0.05em]">
              Get personalized guidance from our beauty experts
              directly through your dashboard.
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MobileLanding;