"use client";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Frame1StatesDefault } from "../Frame1StatesDefault/Frame1StatesDefault";
import { SemicircleStyle2Thickness64 } from "../SemicircleStyle2Thickness64/SemicircleStyle2Thickness64";
import { DonutCount3Thickness48 } from "../DonutCount3Thickness48/DonutCount3Thickness48";
import BeforeAfterSlider from "../../../src/components/ui/before-after-slider";

export interface ILandingPageV2Props {
  className?: string;
}

export const LandingPageV2 = ({
  className,
  ...props
}: ILandingPageV2Props): ReactElement => {
  const DESIGN_WIDTH = 2084;
  const DESIGN_HEIGHT = 9854; // Footer ends at 9281 + 573 = 9854 (no extra space)
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const s = window.innerWidth / DESIGN_WIDTH;
      // Ensure minimum scale of 0.6 to prevent too small
      setScale(Math.max(s, 0.6));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
      <div style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale, position: "relative", margin: "0 auto", overflow: "hidden" }}>
        <div
          className={"bg-[#ffffff] w-[2084px] h-[9854px] relative overflow-hidden " + className}
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: "top left", 
            margin: 0
          }}
        >
        <div
          className="bg-[#f3f3f3] rounded-[15px] w-[1296px] h-[870px] absolute left-[50%] top-[2849px] overflow-hidden"
          style={{ translate: "-50%" }}
        >
          <div className="bg-[#ffffff] rounded-[15px] w-[1206px] h-[143px] absolute left-11 top-11 overflow-hidden">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[27px] font-medium absolute right-[53.23%] left-[3.65%] w-[43.12%] bottom-[59.44%] top-[21.68%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Additional Features of your jaw{" "}
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[15px] leading-[19px] font-medium absolute right-[45.52%] left-[3.65%] w-[50.83%] bottom-[21.68%] top-[51.75%] h-[26.57%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Your nose has a structured tip which is somewhat fleshy. This is a
              common South Asian feature though it does not accentuate the size
              of the nose and compliments the narrow width well{" "}
            </div>
          </div>
          <div className="bg-[#ffffff] rounded-[15px] w-[855px] h-[143px] absolute left-[395px] top-[688px] overflow-hidden">
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-[27px] font-medium absolute right-[34.04%] left-[5.15%] w-[60.82%] bottom-[59.44%] top-[21.68%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Evaluation{" "}
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-sm leading-[19px] font-medium absolute right-[23.16%] left-[5.15%] w-[71.7%] bottom-[8.39%] top-[51.75%] h-[39.86%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Your jaw exhibits a relatively obtuse gonial angle with a smooth
              mandibular plane. The chin projects modestly with minimal anterior
              protrusion, creating a narrower lower third. This configuration
              contributes to a more gracile mandibular profile rather than a
              strongly angular or square contour.{" "}
            </div>
          </div>
          <div className="bg-[#ffffff] rounded-[15px] w-[855px] h-[465px] absolute left-[395px] top-[205px] overflow-hidden">
            <img
              className="w-[855px] h-[747px] absolute left-0 top-[-282px]"
              style={{ objectFit: "cover", aspectRatio: "855/747" }}
              src="chat-gpt-image-aug-14-2025-01-42-52-pm-10.png"
            />
            <div
              className="text-[#ffffff] text-right font-['Inter-Medium',_sans-serif] text-[11px] font-medium uppercase absolute right-[2.46%] left-[90.29%] w-[7.25%] bottom-[4.73%] top-[92.47%] h-[2.8%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              FILLER TEXT{" "}
            </div>
          </div>
          <div className="bg-parallel-fade-grey rounded-[15px] border-solid border-parallel-main border w-[335px] h-[143px] absolute left-11 top-[205px] overflow-hidden">
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl font-medium absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[9.79%] top-[71.33%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Ideal{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-[11px] font-medium uppercase absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[78.32%] top-[9.79%] h-[11.89%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Chin projection{" "}
            </div>
          </div>
          <div className="bg-[#ffffff] rounded-[15px] w-[335px] h-[143px] absolute left-11 top-[366px] overflow-hidden">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl font-medium absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[9.79%] top-[71.33%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              129°{" "}
            </div>
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[11px] font-medium uppercase absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[78.32%] top-[9.79%] h-[11.89%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Gonial angle{" "}
            </div>
          </div>
          <div className="bg-[#ffffff] rounded-[15px] w-[335px] h-[143px] absolute left-11 top-[527px] overflow-hidden">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl font-medium absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[9.79%] top-[71.33%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Dominant{" "}
            </div>
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[11px] font-medium uppercase absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[78.32%] top-[9.79%] h-[11.89%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Lower third prominence{" "}
            </div>
          </div>
          <div className="bg-[#ffffff] rounded-[15px] w-[335px] h-[143px] absolute left-11 top-[688px] overflow-hidden">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl font-medium absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[9.79%] top-[71.33%] h-[18.88%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Slight Curve{" "}
            </div>
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[11px] font-medium uppercase absolute right-[10.15%] left-[7.16%] w-[82.69%] bottom-[78.32%] top-[9.79%] h-[11.89%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Jawline definition{" "}
            </div>
          </div>
        </div>
        <div className="bg-[#f3f3f3] rounded-[15px] border-solid border-[#4a4a4a] border w-[394px] h-[283px] absolute left-[331px] top-[3586px] overflow-hidden">
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[65.7%] left-[10.41%] bottom-[67.84%] top-[31.1%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[37.34%] left-[48.48%] bottom-[67.84%] top-[31.1%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[72.84%] left-[10.41%] w-[16.75%] bottom-[81.98%] top-[11.31%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Breathing Type{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[57.61%] left-[10.41%] w-[31.98%] bottom-[75.62%] top-[17.67%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Nose Breather{" "}
            </div>
          </div>
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[65.7%] left-[10.41%] bottom-[39.58%] top-[59.36%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[37.34%] left-[48.48%] bottom-[39.58%] top-[59.36%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[72.59%] left-[10.41%] w-[17.01%] bottom-[53.71%] top-[39.58%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Chin Recession{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[77.66%] left-[10.41%] w-[11.93%] bottom-[47.35%] top-[45.94%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              False{" "}
            </div>
          </div>
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[65.7%] left-[10.41%] bottom-[11.31%] top-[87.63%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[37.34%] left-[48.48%] bottom-[11.31%] top-[87.63%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[76.65%] left-[10.41%] w-[12.94%] bottom-[25.44%] top-[67.84%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Hyoid Bone{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[78.68%] left-[10.41%] w-[10.91%] bottom-[19.08%] top-[74.2%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Ideal{" "}
            </div>
          </div>
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[24.59%] left-[51.52%] bottom-[67.84%] top-[31.1%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[-3.77%] left-[89.59%] bottom-[67.84%] top-[31.1%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[31.73%] left-[51.52%] w-[16.75%] bottom-[81.98%] top-[11.31%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Chin Projection{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[37.56%] left-[51.52%] w-[10.91%] bottom-[75.62%] top-[17.67%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Ideal{" "}
            </div>
          </div>
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[24.59%] left-[51.52%] bottom-[39.58%] top-[59.36%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[-3.77%] left-[89.59%] bottom-[39.58%] top-[59.36%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[31.47%] left-[51.52%] w-[17.01%] bottom-[53.71%] top-[39.58%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Chin Recession{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[36.55%] left-[51.52%] w-[11.93%] bottom-[47.35%] top-[45.94%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              0mm{" "}
            </div>
          </div>
          <div className="w-[150px] h-[59px] static">
            <div className="w-[150px] h-[3px] static">
              <div className="bg-parallel-main rounded-tl-[57px] rounded-bl-[54px] w-[23.89%] h-[1.06%] absolute right-[24.59%] left-[51.52%] bottom-[11.31%] top-[87.63%] overflow-hidden"></div>
              <div
                className="bg-[#b8b8b8] rounded-tl-[57px] rounded-bl-[54px] w-[14.18%] h-[1.06%] absolute right-[-3.77%] left-[89.59%] bottom-[11.31%] top-[87.63%] overflow-hidden"
                style={{
                  transformOrigin: "0 0",
                  transform: "rotate(0deg) scale(-1, 1)",
                }}
              ></div>
            </div>
            <div
              className="text-[#a0a0a0] text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-[19px] font-medium absolute right-[37.06%] left-[51.52%] w-[11.42%] bottom-[25.44%] top-[67.84%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Hyoid Sag{" "}
            </div>
            <div
              className="text-parallel-main text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[32.74%] left-[51.52%] w-[15.74%] bottom-[19.08%] top-[74.2%] h-[6.71%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              No sag{" "}
            </div>
          </div>
        </div>
        <div className="bg-[#f3f3f3] rounded-[15px] border-solid border-[#4a4a4a] border w-[375px] h-[186px] absolute left-[1475px] top-[2943px] overflow-hidden">
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[80.27%] left-[6.13%] w-[13.6%] bottom-[77.96%] top-[11.83%] h-[10.22%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Steps{" "}
          </div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[5.87%] left-[16.8%] w-[77.33%] bottom-[56.99%] top-[33.87%] h-[9.14%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Use SPF and Lycopene to improve skin tone, etc{" "}
          </div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[5.33%] left-[17.33%] w-[77.33%] bottom-[35.48%] top-[55.38%] h-[9.14%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Use SPF and Lycopene to improve skin tone, etc{" "}
          </div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[5.33%] left-[17.33%] w-[77.33%] bottom-[13.98%] top-[76.88%] h-[9.14%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Use SPF and Lycopene to improve skin tone, etc{" "}
          </div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[15px] font-medium absolute right-[88.75%] left-[9.01%] w-[2.24%] bottom-[55.23%] top-[33.73%] h-[11.04%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            1{" "}
          </div>
          <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#4a4a4a] border w-[8%] h-[16.13%] absolute right-[85.87%] left-[6.13%] bottom-[53.76%] top-[30.11%]"></div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[15px] font-medium absolute right-[88.67%] left-[8.93%] w-[2.4%] bottom-[33.26%] top-[54.92%] h-[11.83%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            2{" "}
          </div>
          <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#4a4a4a] border w-[8%] h-[16.13%] absolute right-[85.87%] left-[6.13%] bottom-[32.26%] top-[51.61%]"></div>
          <div
            className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[15px] font-medium absolute right-[89.01%] left-[8.75%] w-[2.24%] bottom-[12.22%] top-[76.74%] h-[11.04%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            3{" "}
          </div>
          <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#4a4a4a] border w-[8%] h-[16.13%] absolute right-[85.87%] left-[6.13%] bottom-[10.75%] top-[73.12%]"></div>
        </div>
        <div className="rounded-[15px] w-[1696px] h-[2366px] absolute left-[calc(50%_-_847px)] top-[6776px] overflow-hidden">
          <img
            className="w-[2653.37px] h-[1600px] absolute left-[-285px] top-[-51px]"
            style={{ objectFit: "cover" }}
            src="noise-texture0.png"
          />
          <div
            className="rounded-[10px] border-solid border-[#000000] border w-[329px] h-[50px] absolute left-[50%] top-[13px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div
              className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%] whitespace-nowrap"
              style={{ translate: "-50% -50%" }}
            >
              Client Transformation{" "}
            </div>
          </div>
          <div className="w-[716px] h-[410px] static">
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[102px] top-[511px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-10.png"
            />
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[466px] top-[511px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-20.png"
            />
          </div>
          <div className="w-[716px] h-[410px] static">
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[884px] top-[511px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-11.png"
            />
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[1248px] top-[511px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-21.png"
            />
          </div>
          <div className="w-[716px] h-[410px] static">
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[884px] top-[959px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="Screenshot 2025-10-01 at 12.28.13 AM.png"
            />
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[1248px] top-[959px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="Screenshot 2025-10-01 at 12.41.35 AM.png"
            />
          </div>
          <div className="w-[716px] h-[410px] static">
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-24 top-[959px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-13.png"
            />
            <img
              className="rounded-3xl border-solid border-[#ffffff] border w-[352px] h-[410px] absolute left-[460px] top-[959px]"
              style={{ objectFit: "cover", aspectRatio: "352/410" }}
              src="remi-turcotte-oq-6-dp-54-awvw-unsplash-23.png"
            />
          </div>
          <div
            className="bg-[#ffffff] rounded-[14px] w-[1645px] h-[837px] absolute left-[50%] top-[1498px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div className="w-[748px] h-[77px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-3xl font-medium absolute left-[calc(50%_-_669.5px)] top-[81px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Complete facial analysis{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-[19px] font-normal absolute left-[calc(50%_-_668.5px)] top-[135px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Get an in-depth, personalized breakdown of your unique facial features
                with 30+ detailed measurements.{" "}
              </div>
            </div>
            <img
              className="w-[38px] h-[38px] absolute left-[81px] top-[101px] overflow-visible"
              src="group-360.svg"
            />
            <div className="w-[563px] h-[77px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-3xl font-medium absolute left-[calc(50%_-_668.5px)] top-[227px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Personalized beauty enhancement plan{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-[19px] font-normal absolute left-[calc(50%_-_667.5px)] top-[281px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Receive a gentle, step-by-step roadmap to enhance your
                natural beauty and radiance.{" "}
              </div>
            </div>
            <img
              className="w-[38px] h-[38px] absolute left-[81px] top-[247px] overflow-visible"
              src="group-370.svg"
            />
            <div className="w-[666px] h-[77px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-3xl font-medium absolute left-[calc(50%_-_667.5px)] top-[373px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Beauty scores and progress tracking{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-[19px] font-normal absolute left-[calc(50%_-_666.5px)] top-[427px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Track your beauty metrics and celebrate your
                transformation journey over time.{" "}
              </div>
            </div>
            <img
              className="w-[38px] h-[38px] absolute left-[81px] top-[393px] overflow-visible"
              src="group-380.svg"
            />
            <div className="w-[668px] h-[77px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-3xl font-medium absolute left-[calc(50%_-_666.5px)] top-[519px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Before-and-after visualization of your glow up{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-[19px] font-normal absolute left-[calc(50%_-_665.5px)] top-[573px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                See what you could look like after your personalized
                transformation journey.{" "}
              </div>
            </div>
            <img
              className="w-[38px] h-[38px] absolute left-[81px] top-[539px] overflow-visible"
              src="group-390.svg"
            />
            <div className="w-[489px] h-[77px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-3xl font-medium absolute left-[calc(50%_-_665.5px)] top-[665px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Expert support when you need it{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-[19px] font-normal absolute left-[calc(50%_-_664.5px)] top-[719px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Get personalized guidance from our beauty experts
                directly through your dashboard.{" "}
              </div>
            </div>
            <img
              className="w-[38px] h-[38px] absolute left-[81px] top-[685px] overflow-visible"
              src="group-400.svg"
            />
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[calc(50%_-_-323.5px)] top-[89px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              BEFORE{" "}
            </div>
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[calc(50%_-_-708.5px)] top-[89px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              AFTER{" "}
            </div>
            <div
              className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[808px] h-0 absolute left-[81px] top-[195px]"
              style={{ marginTop: "-1px" }}
            ></div>
            <div
              className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[808px] h-0 absolute left-[81px] top-[342px]"
              style={{ marginTop: "-1px" }}
            ></div>
            <div
              className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[808px] h-0 absolute left-[81px] top-[489px]"
              style={{ marginTop: "-1px" }}
            ></div>
            <div
              className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[808px] h-0 absolute left-[81px] top-[636px]"
              style={{ marginTop: "-1px" }}
            ></div>
            <div
              className="rounded-[15px] w-[656px] h-[775px] absolute left-[calc(50%_-_-137.5px)] top-[30px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <img
                className="w-[2653.37px] h-[1600px] absolute left-[-1235px] top-0"
                style={{ objectFit: "cover" }}
                src="noise-texture1.png"
              />
              <div
                className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[43px] font-medium absolute left-[calc(50%_-_292px)] top-[31px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Parallel <br />
                Membership{" "}
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-SemiBold',_sans-serif] text-[85px] font-semibold absolute left-[calc(50%_-_292px)] top-[469px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                $29{" "}
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_142px)] top-[515px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                per month{" "}
              </div>
              <div className="bg-[rgba(255,255,255,0.17)] rounded-[10px] w-72 h-16 absolute left-[calc(50%_-_-10px)] top-[41px] overflow-hidden">
                <div
                  className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-2xl font-medium absolute left-[50%] top-[50%]"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  Premium Plan{" "}
                </div>
              </div>
              <a href="/intake" className="bg-[#ffffff] rounded-[10px] w-[590px] h-16 absolute left-[calc(50%_-_292px)] top-[662px] overflow-hidden">
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-2xl font-medium absolute left-[50%] top-[50%]"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  Get Access →{" "}
                </div>
              </a>
              <div
                className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-xl font-normal absolute left-[calc(50%_-_292px)] top-[575px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                No hidden fees. Cancel anytime{" "}
              </div>
            </div>
          </div>
          <div
            className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[50%] top-[330px] w-[724px]"
            style={{ letterSpacing: "-0.05em", translate: "-50%" }}
          >
            Join 3,000+ women embracing their beauty journey.{" "}
          </div>
          <div
            className="text-[#000000] text-center font-['TimesTen-Italic',_serif] text-[82px] font-italic absolute left-[50%] top-[104px]"
            style={{
              letterSpacing: "-0.05em",
              translate: "-50%",
            }}
          >
              Real Transformations by<br />
            Parallel Women
          </div>
        </div>
        <div
          className="bg-[#ffffff] rounded-[15px] w-[1685px] h-[2778px] absolute left-[50%] top-[3955px] overflow-hidden"
          style={{ translate: "-50%" }}
        >
          <div
            className="rounded-[15px] border-solid border-[#ffffff] border w-[1685px] h-96 absolute left-0 top-[836px] overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
            }}
          >
            {/* Removed texture overlay to keep a clean, uniform gradient fill */}
            <div
              className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-[60px] font-medium absolute left-[50%] top-8"
              style={{ letterSpacing: "-0.05em", translate: "-50%" }}
            >
              The New Way{" "}
            </div>
            <div className="absolute left-0 right-0 top-[120px] px-10 flex items-start">
              {/* Item 1 */}
              <div className="w-[260px] flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">1</span>
                </div>
                <div className="text-white text-center font-['Inter-Medium',_sans-serif] text-[25px] leading-[30px] font-medium mt-5">
                  Understand your<br />unique beauty
                </div>
              </div>
              {/* Arrow 1-2 */}
              <div className="flex-1 flex items-start justify-center mt-[28px]">
                <svg className="w-[160px] h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#fff" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#fff"/>
                </svg>
              </div>
              {/* Item 2 */}
              <div className="w-[260px] flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">2</span>
                </div>
                <div className="text-white text-center font-['Inter-Medium',_sans-serif] text-[25px] leading-[30px] font-medium mt-5">
                  Science-based<br />beauty analysis
                </div>
              </div>
              {/* Arrow 2-3 */}
              <div className="flex-1 flex items-start justify-center mt-[28px]">
                <svg className="w-[160px] h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#fff" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#fff"/>
                </svg>
              </div>
              {/* Item 3 */}
              <div className="w-[260px] flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">3</span>
                </div>
                <div className="text-white text-center font-['Inter-Medium',_sans-serif] text-[25px] leading-[30px] font-medium mt-5">
                  Visualize your beautiful,<br />personalized results
                </div>
              </div>
              {/* Arrow 3-4 */}
              <div className="flex-1 flex items-start justify-center mt-[28px]">
                <svg className="w-[160px] h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#fff" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#fff"/>
                </svg>
              </div>
              {/* Item 4 */}
                <div className="w-[260px] flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">4</span>
                </div>
                <div className="text-white text-center font-['Inter-Medium',_sans-serif] text-[25px] leading-[30px] font-medium mt-5">
                  Receive your personalized<br />beauty roadmap
                </div>
              </div>
              {/* Arrow 4-5 */}
              <div className="flex-1 flex items-start justify-center mt-[28px]">
                <svg className="w-[160px] h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#fff" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#fff"/>
                </svg>
              </div>
              {/* Item 5 */}
                <div className="w-[260px] flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">5</span>
                </div>
                <div className="text-white text-center font-['Inter-Medium',_sans-serif] text-[25px] leading-[30px] font-medium mt-5">
                  Enhance naturally<br />without unnecessary procedures
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1583px] h-[270px] static">
            <div
              className="border-solid border-[#fe7c3f] border-t border-r-[0] border-b-[0] border-l-[0] w-[904px] h-0 absolute left-[401px] top-[2463px]"
              style={{ marginTop: "-1px" }}
            ></div>
            <div
              className="rounded-[15px] w-[380px] h-[270px] absolute left-[calc(50%_-_390.5px)] top-[2328px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <div className="w-[60px] h-[60px] static">
                <div
                  className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute left-[63px] top-[76px] w-[60px] h-[60px] flex items-center justify-center"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  2{" "}
                </div>
                <div className="bg-[rgba(254,124,63,0.00)] rounded-[50%] border-solid border-[#ffffff] border w-[60px] h-[60px] absolute left-[33px] top-[46px]"></div>
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_156.88px)] top-44 w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Visualise your ideal self with a morph{" "}
              </div>
            </div>
            <div
              className="rounded-[15px] w-[380px] h-[270px] absolute left-[calc(50%_-_-10.5px)] top-[2328px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <div className="w-[60px] h-[60px] static">
                <div
                  className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute left-[63px] top-[76px] w-[60px] h-[60px] flex items-center justify-center"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  3{" "}
                </div>
                <div className="bg-[rgba(254,124,63,0.00)] rounded-[50%] border-solid border-[#ffffff] border w-[60px] h-[60px] absolute left-[33px] top-[46px]"></div>
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_156.88px)] top-44 w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Get your glow-up protocol{" "}
              </div>
            </div>
            <div
              className="rounded-[15px] w-[380px] h-[270px] absolute left-[calc(50%_-_-411.5px)] top-[2328px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <div className="w-[60px] h-[60px] static">
                <div
                  className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute left-[63px] top-[76px] w-[60px] h-[60px] flex items-center justify-center"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  4{" "}
                </div>
                <div className="bg-[rgba(254,124,63,0.00)] rounded-[50%] border-solid border-[#ffffff] border w-[60px] h-[60px] absolute left-[33px] top-[46px]"></div>
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_156.88px)] top-44 w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Track progress and see dramatic results{" "}
              </div>
            </div>
            <div
              className="rounded-[15px] w-[380px] h-[270px] absolute left-[calc(50%_-_791.5px)] top-[2328px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <div className="w-[60px] h-[60px] static">
                <div
                  className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute left-[63px] top-[76px] w-[60px] h-[60px] flex items-center justify-center"
                  style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
                >
                  1{" "}
                </div>
                <div className="bg-[rgba(254,124,63,0.00)] rounded-[50%] border-solid border-[#ffffff] border w-[60px] h-[60px] absolute left-[33px] top-[46px]"></div>
              </div>
              <div
                className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_156.88px)] top-44 w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Get your expert facial analysis{" "}
              </div>
            </div>
          </div>
          <div
            className="rounded-[15px] border-solid border-[#000000] border w-[1685px] h-[380px] absolute left-[50%] top-[413px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div
              className="text-[#000000] text-center font-['Inter-ExtraLight',_sans-serif] text-[60px] font-extralight absolute left-[50%] top-8"
              style={{ letterSpacing: "-0.05em", translate: "-50%" }}
            >
              The Old Way{" "}
            </div>
            <div className="absolute left-0 right-0 top-[126px] px-10 flex items-center">
              {/* Item 1 */}
              <div className="w-[221.4px] flex flex-col items-center">
                <div className="relative w-[60px] h-[60px]">
                  <div className="rounded-full border border-black w-full h-full absolute inset-0"></div>
                  <div className="text-black text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>1</div>
                </div>
                <div className="text-black text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium mt-6">Obsess over single flaws</div>
              </div>
              {/* Arrow 1-2 */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-[140px] h-3" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#000" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#000"/>
                </svg>
              </div>
              {/* Item 2 */}
              <div className="w-[221.4px] flex flex-col items-center">
                <div className="relative w-[60px] h-[60px]">
                  <div className="rounded-full border border-black w-full h-full absolute inset-0"></div>
                  <div className="text-black text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>2</div>
                </div>
                <div className="text-black text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium mt-6">Rely on clinics and sales tactics</div>
              </div>
              {/* Arrow 2-3 */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-[140px] h-3" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#000" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#000"/>
                </svg>
              </div>
              {/* Item 3 */}
              <div className="w-[221.4px] flex flex-col items-center">
                <div className="relative w-[60px] h-[60px]">
                  <div className="rounded-full border border-black w-full h-full absolute inset-0"></div>
                  <div className="text-black text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>3</div>
                </div>
                <div className="text-black text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium mt-6">Little to no objective analysis</div>
              </div>
              {/* Arrow 3-4 */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-[140px] h-3" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#000" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#000"/>
                </svg>
              </div>
              {/* Item 4 */}
              <div className="w-[251.28px] flex flex-col items-center">
                <div className="relative w-[60px] h-[60px]">
                  <div className="rounded-full border border-black w-full h-full absolute inset-0"></div>
                  <div className="text-black text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>4</div>
                </div>
                <div className="text-black text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium mt-6">Risk of over-treatment or procedures</div>
              </div>
              {/* Arrow 4-5 */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-[140px] h-3" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6 H132" stroke="#000" strokeWidth="2"/>
                  <path d="M132 0 L140 6 L132 12 Z" fill="#000"/>
                </svg>
              </div>
              {/* Item 5 */}
              <div className="w-[246.36px] flex flex-col items-center">
                <div className="relative w-[60px] h-[60px]">
                  <div className="rounded-full border border-black w-full h-full absolute inset-0"></div>
                  <div className="text-black text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>5</div>
                </div>
                <div className="text-black text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium mt-6">Disappointing, unnatural outcomes</div>
              </div>
            </div>
            <div className="hidden">
            <div className="w-[221.52px] h-[136.44px] static">
              <div className="relative w-[60px] h-[60px] absolute left-[161.12px] top-44">
                <div className="rounded-[50%] border-solid border-[#000000] border w-full h-full absolute inset-0"></div>
                <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>1</div>
              </div>
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_727.38px)] top-[252px] w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Obsess over single flaws{" "}
              </div>
            </div>
            <div className="w-[221.52px] h-[136.44px] static">
              <div className="relative w-[60px] h-[60px] absolute left-[469.65px] top-44">
                <div className="rounded-[50%] border-solid border-[#000000] border w-full h-full absolute inset-0"></div>
                <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>2</div>
              </div>
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_418.85px)] top-[252px] w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Rely on clinics and sales tactics{" "}
              </div>
            </div>
            <div className="w-[221.52px] h-[136.44px] static">
              <div className="relative w-[60px] h-[60px] absolute left-[778.17px] top-44">
                <div className="rounded-[50%] border-solid border-[#000000] border w-full h-full absolute inset-0"></div>
                <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>3</div>
              </div>
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[50%] top-[252px] w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  translate: "-50%",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Little to no objective analysis{" "}
              </div>
            </div>
            <div className="w-[221.58px] h-[166.44px] static">
              <div className="relative w-[60px] h-[60px] absolute left-[1086.7px] top-44">
                <div className="rounded-[50%] border-solid border-[#000000] border w-full h-full absolute inset-0"></div>
                <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>4</div>
              </div>
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_-198.2px)] top-[252px] w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Risk of over-treatment or procedures{" "}
              </div>
            </div>
            <div className="w-[221.52px] h-[136.44px] static">
              <div className="relative w-[60px] h-[60px] absolute left-[1395.22px] top-44">
                <div className="rounded-[50%] border-solid border-[#000000] border w-full h-full absolute inset-0"></div>
                <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-4xl font-medium absolute inset-0 flex items-center justify-center" style={{ letterSpacing: "-0.05em" }}>5</div>
              </div>
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_-506.72px)] top-[252px] w-[221.4px]"
                style={{
                  letterSpacing: "-0.05em",
                  transformOrigin: "0 0",
                  transform: "rotate(0.115deg) scale(1, 1)",
                }}
              >
                Disappointing, unnatural outcomes{" "}
              </div>
            </div>
            <img
              className="w-[135px] h-0 absolute left-[274px] top-[206px] overflow-visible"
              src="line-181.svg"
            />
            <img
              className="w-[135px] h-0 absolute left-[582px] top-[206px] overflow-visible"
              src="line-191.svg"
            />
            <img
              className="w-[135px] h-0 absolute left-[890px] top-[206px] overflow-visible"
              src="line-201.svg"
            />
            <img
              className="w-[135px] h-0 absolute left-[1208px] top-[206px] overflow-visible"
              src="line-211.svg"
            />
            </div>
          </div>
          <div
            className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[50%] top-[232px] w-[724px]"
            style={{ letterSpacing: "-0.05em", translate: "-50%" }}
          >
            Every face is unique. We analyze over 100 aspects of your face to
            understand your personal beauty and enhance your natural radiance.{" "}
          </div>
            <div
              className="text-[#000000] text-center font-['TimesTen-Italic',_serif] text-[82px] font-italic absolute left-[50%] top-24"
              style={{
                letterSpacing: "-0.05em",
                translate: "-50%",
              }}
            >
              A New Way to Glow Up
            </div>
          <div
            className="rounded-[10px] border-solid border-[#000000] border w-[329px] h-[50px] absolute left-[50%] top-[9px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%]"
              style={{ translate: "-50% -50%" }}
            >
              Our New Approach{" "}
            </div>
          </div>
          <div
            className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_332.5px)] top-[1539px] w-[724px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Every face is unique. We analyze over 100 aspects of your face to
            understand your personal facial aesthetics.{" "}
          </div>
            <div
              className="text-[#000000] text-center font-['TimesTen-Italic',_serif] text-[82px] font-italic absolute left-[50%] top-[1411px]"
              style={{ letterSpacing: "-0.05em", translate: "-50%" }}
            >
              Your Personalized Glow Up Plan
            </div>
          <div className="rounded-[10px] border-solid border-[#000000] border w-[465px] h-[50px] absolute left-[calc(50%_-_211.5px)] top-[1326px] overflow-hidden">
            <div
              className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%] whitespace-nowrap"
              style={{ translate: "-50% -50%" }}
            >
              Expert Advice Enhanced by Technology{" "}
            </div>
          </div>
          <img
            className="rounded-3xl w-[458px] h-[532px] absolute left-[373px] top-[1704px]"
            style={{ objectFit: "cover", aspectRatio: "458/532" }}
            src="remi-turcotte-oq-6-dp-54-awvw-unsplash-14.png"
          />
          <img
            className="rounded-3xl w-[458px] h-[532px] absolute left-[854px] top-[1704px]"
            style={{ objectFit: "cover", aspectRatio: "458/532" }}
            src="remi-turcotte-oq-6-dp-54-awvw-unsplash-24.png"
          />
          <div className="rounded-[14px] border-solid border-[#ffffff] border w-[145px] h-11 absolute left-[calc(50%_-_183.5px)] top-[1727px] overflow-hidden">
            <div
              className="text-[#ffffff] text-center font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%]"
              style={{ translate: "-50% -50%" }}
            >
              Before{" "}
            </div>
          </div>
          <div className="rounded-[14px] border-solid border-[#ffffff] border w-[145px] h-11 absolute left-[calc(50%_-_-304.5px)] top-[1727px] overflow-hidden">
            <div
              className="text-[#ffffff] text-center font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%]"
              style={{ translate: "-50% -50%" }}
            >
              After{" "}
            </div>
          </div>
          <a
          href="/intake"
          className="rounded-[10px] border-solid border-[#e6eaf2] border w-[397px] h-[78px] absolute left-[50%] top-[2683px] overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #da4453 0%, #89216b 100%)",
            translate: "-50%",
          }}
          >
            <div
              className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[28px] font-medium absolute left-[50%] top-[50%]"
              style={{ translate: "-50% -50%" }}
            >
              Join Now →{" "}
            </div>
          </a>
        </div>
        <div
          className="rounded-[15px] w-[1696px] h-[1529px] absolute left-[50%] top-[65px] overflow-hidden"
          style={{ translate: "-50%" }}
        >
          <img
            className="w-[2653.37px] h-[1600px] absolute left-[-285px] top-0"
            style={{ objectFit: "cover" }}
            src="noise-texture2.png"
          />
          <div
            className="bg-[#ffffff] rounded-[14px] w-[1645px] h-[920px] absolute left-[50%] top-[740px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            {/* Checklist items */}
            <div className="absolute left-[81px] top-[123px] flex flex-col gap-[50px]">
              {/* Item 1 */}
              <div className="grid grid-cols-[48px_1fr] items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d3d3d3] border-[#4a4a4a] border-2 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Feel confident and beautiful
                </div>
              </div>
              
              {/* Divider 1 */}
              <div
                className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[980px] h-0 ml-[24px]"
                style={{ marginTop: "-1px", marginBottom: "-1px" }}
              ></div>

              {/* Item 2 */}
              <div className="grid grid-cols-[48px_1fr] items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d3d3d3] border-[#4a4a4a] border-2 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Enhance your professional presence
                </div>
              </div>

              {/* Divider 2 */}
              <div
                className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[980px] h-0 ml-[24px]"
                style={{ marginTop: "-1px", marginBottom: "-1px" }}
              ></div>

              {/* Item 3 */}
              <div className="grid grid-cols-[48px_1fr] items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d3d3d3] border-[#4a4a4a] border-2 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Radiate natural elegance
                </div>
              </div>

              {/* Divider 3 */}
              <div
                className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[980px] h-0 ml-[24px]"
                style={{ marginTop: "-1px", marginBottom: "-1px" }}
              ></div>

              {/* Item 4 */}
              <div className="grid grid-cols-[48px_1fr] items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d3d3d3] border-[#4a4a4a] border-2 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Attract meaningful connections
                </div>
              </div>

              {/* Divider 4 */}
              <div
                className="border-solid border-[#a0a0a0] border-t border-r-[0] border-b-[0] border-l-[0] w-[980px] h-0 ml-[24px]"
                style={{ marginTop: "-1px", marginBottom: "-1px" }}
              ></div>

              {/* Item 5 */}
              <div className="grid grid-cols-[48px_1fr] items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d3d3d3] border-[#4a4a4a] border-2 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div
                  className="text-[#4a4a4a] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Embrace your best self
                </div>
              </div>
            </div>
            <div className="rounded-3xl w-[483px] h-[634px] absolute left-[1119px] top-[46px] overflow-hidden">
              <BeforeAfterSlider
                beforeImage="/remi-turcotte-oq-6-dp-54-awvw-unsplash-15.png"
                afterImage="/remi-turcotte-oq-6-dp-54-awvw-unsplash-14.png"
                initialPosition={33}
                reverse={false}
                className="w-full h-full"
              />
            </div>
            {/* Removed legacy non-functional slider UI elements (line, knob, labels) now that interactive slider is in place */}
          </div>
          <a
          href="/intake"
          className="rounded-[10px] border-solid border-[#e6eaf2] border w-[397px] h-[78px] absolute left-[50%] top-[620px] overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #da4453 0%, #89216b 100%)",
            translate: "-50%",
          }}
          >
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-[28px] font-normal absolute left-[calc(50%_-_78.5px)] top-[50%]"
              style={{ translate: "0 -50%" }}
            >
              Start Now →{" "}
            </div>
          </a>
        
          <div
            className="rounded-[10px] border-solid border-[#000000] border w-[329px] h-[50px] absolute left-[50%] top-[262px] overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div
              className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%] whitespace-nowrap"
              style={{ translate: "-50% -50%" }}
            >
              Science-Based Beauty
            </div>
          </div>
          <div
            className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[50%] top-[480px] w-[724px]"
            style={{ letterSpacing: "-0.05em", translate: "-50%" }}
          >
            Get your personalized facial analysis, transformation visualization, and beauty enhancement plan based
            on 2000+ clinical studies.{" "}
          </div>
          <div
            className="text-[#000000] text-center font-['TimesTen-Italic',_serif] text-[82px] font-italic absolute left-[50%] top-[333px]"
            style={{
              letterSpacing: "-0.05em",
              translate: "-50%",
            }}
          >
            Become Your Most Radiant Self
          </div>
          <div
            className="bg-[rgba(255,255,255,0.17)] rounded-[13px] border-solid border-[#5e4747] border w-[1504px] h-[100px] absolute left-[50%] top-16 overflow-hidden"
            style={{ translate: "-50%" }}
          >
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[21px] font-normal absolute left-[calc(50%_-_685px)] top-[50%]"
              style={{ letterSpacing: "-0.05em", translate: "0 -50%" }}
            >
              Why Glow-up{" "}
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[21px] font-normal absolute left-[calc(50%_-_510px)] top-[50%]"
              style={{ letterSpacing: "-0.05em", translate: "0 -50%" }}
            >
              How it works{" "}
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[21px] font-normal absolute left-[calc(50%_-_341px)] top-[50%]"
              style={{ letterSpacing: "-0.05em", translate: "0 -50%" }}
            >
              FAQ{" "}
            </div>
            <a
              href="/auth"
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[21px] font-normal absolute left-[calc(50%_-_-470px)] top-[50%]"
              style={{ letterSpacing: "-0.05em", translate: "0 -50%" }}
            >
              Login{" "}
            </a>
            <a
              href="/intake"
              className="rounded-[10px] w-[195px] h-[78px] absolute left-[1296px] top-[11px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #da4453 0%, #b73355 33%, #9c2958 66%, #89216b 100%)",
              }}
            >
              <div
                className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-7"
                style={{ translate: "-50%" }}
              >
                Join Now →{" "}
              </div>
            </a>
            <img
              className="w-[76px] h-[76px] absolute left-[707px] top-3"
              style={{ objectFit: "cover", aspectRatio: "1" }}
              src="parallel-alexander-final-10.png"
            />
          </div>
          <div className="flex items-center justify-center gap-2 absolute left-[50%] top-[580px]" style={{ translate: "-50%" }}>
            <div
              className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-base font-normal"
              style={{ letterSpacing: "-0.05em" }}
            >
              4.8
            </div>
            <img
              className="w-[111px] h-[22.2px] overflow-visible"
              src="group-1490.svg"
            />
            <div
              className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-base font-normal"
              style={{ letterSpacing: "-0.05em" }}
            >
              1000+ Reviews
            </div>
          </div>
        </div>
        <div className="w-[1645px] h-[446.95px] static">
          <div className="w-[1645px] h-[270.95px] static">
            <img
              className="rounded-[25px] w-[525.82px] h-[270.95px] absolute left-[779.59px] top-[1770px]"
              style={{ objectFit: "cover", aspectRatio: "525.82/270.95" }}
              src="olga-kovalski-z-pua-6-bxdk-zi-unsplash-10.png"
            />
            <img
              className="rounded-[25px] w-[270.95px] h-[525.82px] absolute left-[220px] top-[2040.95px]"
              style={{
                transformOrigin: "0 0",
                transform: "rotate(-90deg) scale(1, 1)",
                objectFit: "cover",
                aspectRatio: "270.95/525.82",
              }}
              src="edrece-stansberry-92-widq-xwf-y-unsplash-10.png"
            />
            <img
              className="rounded-[25px] w-[270.95px] h-[525.82px] absolute left-[1339.18px] top-[2040.95px]"
              style={{
                transformOrigin: "0 0",
                transform: "rotate(-90deg) scale(1, 1)",
                objectFit: "cover",
                aspectRatio: "270.95/525.82",
              }}
              src="josep-martins-cc-mcua-ox-1-jk-unsplash-10.png"
            />
          </div>
          <div className="w-[303.12px] h-[151px] static">
            <div className="w-[34px] h-[34px] static">
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[19px] font-medium absolute left-[calc(50%_-_810.1px)] top-[1600.53px] w-[10.2px] h-[24.93px] flex items-center justify-center"
                style={{ letterSpacing: "-0.05em" }}
              >
                1{" "}
              </div>
              <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#000000] border w-[34px] h-[34px] absolute left-[220px] top-[1594px]"></div>
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_821.88px)] top-[1637px] w-[221.4px]"
              style={{
                letterSpacing: "-0.05em",
                transformOrigin: "0 0",
                transform: "rotate(0.115deg) scale(1, 1)",
              }}
            >
              Your face,<br />
              quantified{" "}
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[15px] font-normal absolute left-[calc(50%_-_821.88px)] top-[1709px] w-[303px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              We analyze over 100 aspects of your face to understand your
              personal facial aesthetics.{" "}
            </div>
          </div>
          <div className="w-[303.12px] h-[151px] static">
            <div className="w-[34px] h-[34px] static">
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[19px] font-medium absolute left-[calc(50%_-_251.1px)] top-[1600.53px] w-[10.2px] h-[24.93px] flex items-center justify-center"
                style={{ letterSpacing: "-0.05em" }}
              >
                2{" "}
              </div>
              <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#000000] border w-[34px] h-[34px] absolute left-[780px] top-[1594px]"></div>
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_261.88px)] top-[1637px] w-[221.4px]"
              style={{
                letterSpacing: "-0.05em",
                transformOrigin: "0 0",
                transform: "rotate(0.115deg) scale(1, 1)",
              }}
            >
              Focus on overall facial harmony{" "}
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[15px] font-normal absolute left-[calc(50%_-_261.88px)] top-[1709px] w-[303px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              We study the signals in your face to uncover key indicators of
              your health and wellness.{" "}
            </div>
          </div>
          <div className="w-[303.12px] h-[151px] static">
            <div className="w-[34px] h-[34px] static">
              <div
                className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-[19px] font-medium absolute left-[calc(50%_-_-308.9px)] top-[1607.53px] w-[10.2px] h-[24.93px] flex items-center justify-center"
                style={{ letterSpacing: "-0.05em" }}
              >
                3{" "}
              </div>
              <div className="bg-[rgba(173,173,173,0.00)] rounded-[50%] border-solid border-[#000000] border w-[34px] h-[34px] absolute left-[1340px] top-[1601px]"></div>
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Medium',_sans-serif] text-[25px] font-medium absolute left-[calc(50%_-_-298.12px)] top-[1644px] w-[221.4px]"
              style={{
                letterSpacing: "-0.05em",
                transformOrigin: "0 0",
                transform: "rotate(0.115deg) scale(1, 1)",
              }}
            >
              Your facial age, unlocked{" "}
            </div>
            <div
              className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-[15px] font-normal absolute left-[calc(50%_-_-298.12px)] top-[1716px] w-[303px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Facial biomarkers reveal the biological age your features project.{" "}
            </div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.10)] rounded-[15px] w-[17.32%] h-[3.17%] absolute right-[65.26%] left-[17.42%] bottom-[77.61%] top-[19.22%] overflow-hidden">
          <img
            className="w-[256.79%] h-[469px] absolute left-[49%] top-[-15px]"
            style={{
              objectFit: "cover",
              aspectRatio: "927/469",
              transform: "translateX(-50%)",
            }}
            src="janko-ferlic-znvgl-pcf-74-unsplash-10.png"
          />
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[25px] font-medium absolute right-[20.5%] left-[7.76%] w-[71.75%] bottom-[8.36%] top-[76.16%] h-[15.48%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            2.5 years younger than your chronological age{" "}
          </div>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[42px] font-medium absolute right-[18.56%] left-[7.76%] w-[73.68%] bottom-[58.82%] top-[9.6%] h-[31.58%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Perceived Facial Age{" "}
          </div>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[42px] font-medium absolute right-[78.12%] left-[7.76%] w-[14.13%] bottom-[26.01%] top-[58.2%] h-[15.79%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            26{" "}
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.10)] rounded-[15px] w-[17.32%] h-[3.17%] absolute right-[38.48%] left-[44.19%] bottom-[77.61%] top-[19.22%] overflow-hidden">
          <img
            className="w-[256.79%] h-[469px] absolute left-[49%] top-[-15px]"
            style={{
              objectFit: "cover",
              aspectRatio: "927/469",
              transform: "translateX(-50%)",
            }}
            src="janko-ferlic-znvgl-pcf-74-unsplash-11.png"
          />
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[25px] font-medium absolute right-[20.5%] left-[7.76%] w-[71.75%] bottom-[16.1%] top-[76.16%] h-[7.74%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Your biomarkers in range{" "}
          </div>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[42px] font-medium absolute right-[18.56%] left-[7.76%] w-[73.68%] bottom-[58.82%] top-[9.6%] h-[31.58%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Facial Health Indicators{" "}
          </div>
          <SemicircleStyle2Thickness64
            thickness="64"
            visibleComponent={true}
            className="!w-[92px] !h-[46px] !absolute !left-7 !top-[188px]"
          ></SemicircleStyle2Thickness64>
        </div>
        <div className="bg-[rgba(255,255,255,0.10)] rounded-[15px] w-[17.32%] h-[3.17%] absolute right-[11.71%] left-[70.97%] bottom-[77.61%] top-[19.22%] overflow-hidden">
          <img
            className="w-[256.79%] h-[469px] absolute left-[49%] top-[-15px]"
            style={{
              objectFit: "cover",
              aspectRatio: "927/469",
              transform: "translateX(-50%)",
            }}
            src="janko-ferlic-znvgl-pcf-74-unsplash-12.png"
          />
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[25px] font-medium absolute right-[20.5%] left-[7.76%] w-[71.75%] bottom-[16.1%] top-[76.16%] h-[7.74%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            71 in range{" "}
          </div>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[42px] font-medium absolute right-[18.56%] left-[7.76%] w-[73.68%] bottom-[58.82%] top-[9.6%] h-[31.58%]"
            style={{ letterSpacing: "-0.05em" }}
          >
            12 out of range{" "}
          </div>
          <div className="flex flex-col gap-24 items-center justify-center w-[97.51%] h-[74.3%] absolute right-[-8.31%] left-[10.8%] bottom-[-2.79%] top-[28.48%]">
            <DonutCount3Thickness48
              count="3"
              thickness="48"
              className="!shrink-0 !w-28 !h-28"
            ></DonutCount3Thickness48>
          </div>
        </div>
        <div
          className="text-[#000000] text-center font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[50%] top-[2668px] w-[724px]"
          style={{ letterSpacing: "-0.05em", translate: "-50%" }}
        >
          Every face is unique. We analyze over 50 aspects of your face to
          understand your personal facial aesthetics.{" "}
        </div>
            <div
              className="text-[#000000] text-center font-['TimesTen-Italic',_serif] text-[82px] font-italic absolute left-[50%] top-[2532px]"
              style={{
                letterSpacing: "-0.05em",
                translate: "-50%",
              }}
            >
              Discover Your True Beauty
            </div>
        <div
          className="rounded-[10px] border-solid border-[#000000] border w-[329px] h-[50px] absolute left-[50%] top-[2445px] overflow-hidden"
          style={{ translate: "-50%" }}
        >
          <div
            className="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-lg font-normal absolute left-[50%] top-[50%]"
            style={{ translate: "-50% -50%" }}
          >
            Our New Approach{" "}
          </div>
        </div>
        <div className="bg-[#f3f3f3] rounded-[15px] border-solid border-[#4a4a4a] border w-[375px] h-[355px] absolute left-[1386px] top-[3427px] overflow-hidden">
          <div className="w-[319px] h-[78px] static">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[5.6%] left-[9.33%] w-[85.07%] bottom-[84.23%] top-[10.99%] h-[4.79%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Product Recommendation{" "}
            </div>
            <div className="w-[153px] h-[42px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[49.87%] left-[23.73%] w-[26.4%] bottom-[72.96%] top-[22.25%] h-[4.79%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Topical GHK-CU{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[10px] font-medium absolute right-[57.07%] left-[23.73%] w-[19.2%] bottom-[69.58%] top-[27.04%] h-[3.38%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                For skin dullness{" "}
              </div>
              <div className="w-[42px] h-[42px] static">
                <div className="w-[42px] h-[42px] absolute left-[35px] top-[75px]">
                  <div className="w-[42px] h-[42px] absolute left-0 top-0">
                    <div className="bg-[#e7e7e7] rounded-[5px] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-parallel-fade-grey rounded-[64px] border-solid border-parallel-main border w-[36.27%] h-[8.73%] absolute right-[11.47%] left-[52.27%] bottom-[68.73%] top-[22.54%] overflow-hidden">
              <div
                className="text-parallel-main text-center font-['Inter-Medium',_sans-serif] text-[15px] leading-[19px] font-medium absolute left-[50%] top-[50%] w-[76px]"
                style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
              >
                Shop Here{" "}
              </div>
            </div>
          </div>
          <div className="w-[319px] h-[78px] static">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[5.6%] left-[9.33%] w-[85.07%] bottom-[56.62%] top-[38.59%] h-[4.79%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Product Recommendation{" "}
            </div>
            <div className="w-[136px] h-[42px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[63.2%] left-[23.73%] w-[13.07%] bottom-[45.35%] top-[49.86%] h-[4.79%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Panoxyl{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[10px] font-medium absolute right-[54.4%] left-[23.73%] w-[21.87%] bottom-[41.97%] top-[54.65%] h-[3.38%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                For acne/red spots{" "}
              </div>
              <div className="w-[42px] h-[42px] static">
                <div className="w-[42px] h-[42px] absolute left-[35px] top-[173px]">
                  <div className="bg-[#e7e7e7] rounded-[5px] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]"></div>
                  <img
                    className="w-[100%] h-[42px] absolute right-[0%] left-[0%] top-0"
                    style={{ objectFit: "cover", aspectRatio: "1" }}
                    src="panoxyl-10.png"
                  />
                </div>
              </div>
            </div>
            <div className="bg-parallel-fade-grey rounded-[64px] border-solid border-parallel-main border w-[36.27%] h-[8.73%] absolute right-[11.47%] left-[52.27%] bottom-[41.13%] top-[50.14%] overflow-hidden">
              <div
                className="text-parallel-main text-center font-['Inter-Medium',_sans-serif] text-[15px] leading-[19px] font-medium absolute left-[50%] top-[50%] w-[76px]"
                style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
              >
                Shop Here{" "}
              </div>
            </div>
          </div>
          <div className="w-[319px] h-[78px] static">
            <div
              className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute right-[5.6%] left-[9.33%] w-[85.07%] bottom-[29.01%] top-[66.2%] h-[4.79%]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Product Recommendation{" "}
            </div>
            <div className="w-[127px] h-[42px] static">
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium absolute right-[62.4%] left-[23.73%] w-[13.87%] bottom-[17.75%] top-[77.46%] h-[4.79%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                Gua Sha{" "}
              </div>
              <div
                className="text-[#4a4a4a] text-left font-['Inter-Medium',_sans-serif] text-[10px] font-medium absolute right-[56.8%] left-[23.73%] w-[19.47%] bottom-[14.37%] top-[82.25%] h-[3.38%]"
                style={{ letterSpacing: "-0.05em" }}
              >
                For inflammation{" "}
              </div>
              <div className="w-[42px] h-[42px] static">
                <div className="bg-[#e7e7e7] rounded-[5px] w-[11.2%] h-[11.83%] absolute right-[79.47%] left-[9.33%] bottom-[11.83%] top-[76.34%]"></div>
              </div>
            </div>
            <div className="bg-parallel-fade-grey rounded-[64px] border-solid border-parallel-main border w-[36.27%] h-[8.73%] absolute right-[11.47%] left-[52.27%] bottom-[13.52%] top-[77.75%] overflow-hidden">
              <div
                className="text-parallel-main text-center font-['Inter-Medium',_sans-serif] text-[15px] leading-[19px] font-medium absolute left-[50%] top-[50%] w-[76px]"
                style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
              >
                Shop Here{" "}
              </div>
            </div>
          </div>
          <img
            className="w-[46px] h-[46px] absolute left-[35px] top-[75px]"
            style={{ objectFit: "cover", aspectRatio: "1" }}
            src="throne-ghkcu-10.png"
          />
          <img
            className="w-[58px] h-[58px] absolute left-[29px] top-[263px]"
            style={{ objectFit: "cover", aspectRatio: "1" }}
            src="gua-sha-10.png"
          />
        </div>
          <div
            className="w-[2084px] h-[573px] absolute left-0 top-[9281px] overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #da4453 0%, #89216b 100%)",
            }}
          >
          <img
            className="w-full h-full absolute left-0 top-0"
            style={{ objectFit: "cover" }}
            src="noise-texture3.png"
          />
          <div className="w-[232px] h-[348px] static">
            <div
              className="text-[#ffffff] text-left font-['Inter-SemiBold',_sans-serif] text-3xl font-semibold absolute left-[calc(50%_-_-9px)] top-[103px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Company/{" "}
            </div>
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-9px)] top-[181px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Products{" "}
            </div>
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-9px)] top-[259px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Research{" "}
            </div>
            <a
              href="mailto:alexander@parallellabs.co"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-9px)] top-[337px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Contact Us
            </a>
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-9px)] top-[415px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Become a Partner{" "}
            </div>
          </div>
          <div className="w-[217px] h-48 static">
            <div
              className="text-[#ffffff] text-left font-['Inter-SemiBold',_sans-serif] text-3xl font-semibold absolute left-[calc(50%_-_-334px)] top-[103px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Others/{" "}
            </div>
            <a
              href="https://parallellabs.co/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-334px)] top-[181px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Privacy Policy
            </a>
            <a
              href="https://parallellabs.co/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-334px)] top-[259px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Terms of Service
            </a>
          </div>
          <div className="w-[130px] h-[348px] static">
            <div
              className="text-[#ffffff] text-left font-['Inter-SemiBold',_sans-serif] text-3xl font-semibold absolute left-[calc(50%_-_-644px)] top-[103px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Connect/{" "}
            </div>
            <div
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-644px)] top-[181px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              LinkedIn{" "}
            </div>
            <a
              href="https://www.youtube.com/@parallelalexander"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-644px)] top-[259px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Youtube
            </a>
            <a
              href="https://www.instagram.com/parallelalexander/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-644px)] top-[337px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@parallelalexander"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] text-left font-['Inter-Regular',_sans-serif] text-3xl font-normal absolute left-[calc(50%_-_-644px)] top-[415px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              Tiktok
            </a>
          </div>
          <a href="/intake" className="bg-[rgba(255,255,255,0.17)] rounded-[10px] w-[451px] h-16 absolute left-[calc(50%_-_791px)] top-[415px] overflow-hidden">
            <div
              className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-2xl font-medium absolute left-[calc(50%_-_61.5px)] top-[50%]"
              style={{ letterSpacing: "-0.05em", translate: "0 -50%" }}
            >
              Join Now →{" "}
            </div>
          </a>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-[43px] font-medium absolute left-[calc(50%_-_667px)] top-[91px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            Parallel{" "}
          </div>
          <img
            className="w-[142px] h-[142px] absolute left-11 top-[46px]"
            style={{ objectFit: "cover", aspectRatio: "1" }}
            src="parallel-alexander-final-11.png"
          />
        </div>
        <div className="w-[2084px] h-[69px] absolute left-0 top-0" style={{ background: "linear-gradient(90deg, #da4453 0%, #89216b 100%)" }}>
          <div
            className="text-[#ffffff] text-left font-['Inter-Medium',_sans-serif] text-xl leading-[19px] font-medium absolute left-[50%] top-[50%]"
            style={{ letterSpacing: "-0.05em", translate: "-50% -50%" }}
          >
            <span>
              <span className="join-thousands-using-the-science-of-facial-aesthetics-to-look-their-best-start-now-span">
                Join thousands using the science of facial aesthetics to look
                their best.
              </span>
              <a href="/intake" className="underline ml-4">
                Start Now →
              </a>
            </span>{" "}
          </div>
        </div>
        </div>
      </div>
  );
};
