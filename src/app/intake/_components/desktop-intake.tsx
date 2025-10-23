"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import type { AestheticFocus, AgeBracket, Country } from "~/types/intake";
import {
  AESTHETIC_FOCUS_OPTIONS,
  AGE_OPTIONS,
  ETHNICITY_OPTIONS,
  TREATMENT_OPTIONS,
} from "~/types/intake";
import { CountryDropdown } from "~/app/create-analysis/_components/intake/country-dropdown";

interface DesktopIntakeProps {
  userName?: string;
  redirectAfterIntake?: string;
}

export function DesktopIntake({ userName, redirectAfterIntake }: DesktopIntakeProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [noiseOffset, setNoiseOffset] = useState(0);
  
  // Animate the noise/gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setNoiseOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const [firstName, setFirstName] = useState<string>(() => {
    if (!userName) return "";
    const [first] = userName.trim().split(/\s+/);
    return first ?? "";
  });
  const [lastName, setLastName] = useState<string>(() => {
    if (!userName) return "";
    const parts = userName.trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(" ") : "";
  });

  const [age, setAge] = useState<AgeBracket | "">("");
  const [country, setCountry] = useState<Country | null>(null);

  const [ethnicities, setEthnicities] = useState<
    (typeof ETHNICITY_OPTIONS)[number][]
  >([]);
  const [ethnicityOther, setEthnicityOther] = useState<string>("");

  const [focus, setFocus] = useState<
    (typeof AESTHETIC_FOCUS_OPTIONS)[number] | ""
  >("");
  const [focusOther, setFocusOther] = useState<string>("");

  const [treatments, setTreatments] = useState<
    (typeof TREATMENT_OPTIONS)[number][]
  >([]);
  const [treatmentsOther, setTreatmentsOther] = useState<string>("");

  const upsert = api.intake.upsert.useMutation();
  
  // Debug: Check if we have session
  useEffect(() => {
    console.log("Desktop Intake Component Mounted");
    console.log("Cookies:", document.cookie);
  }, []);

  const handleTreatmentChange = (
    option: (typeof TREATMENT_OPTIONS)[number],
  ) => {
    setTreatments((prev) => {
      if (option === "None") {
        return ["None"];
      }
      if (prev.includes("None")) {
        return [option];
      }
      if (prev.includes(option)) {
        return prev.filter((t) => t !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const toggleListValue = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  // Validation for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Name
        return firstName.trim() !== "" && lastName.trim() !== "";
      case 1: // Age
        return age !== "";
      case 2: // Country
        return country !== null;
      case 3: // Ethnicity
        return ethnicities.length > 0;
      case 4: // Focus
        return focus !== "";
      case 5: // Treatments
        return treatments.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    const intakeInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ageBracket: age as AgeBracket,
      country: country!.alpha3,
      ethnicities,
      ethnicityOther: ethnicityOther.trim(),
      focus: focus as AestheticFocus,
      focusOther: focusOther.trim(),
      treatments,
      treatmentsOther: treatmentsOther.trim(),
    };

    try {
      console.log("Submitting intake data:", intakeInput);
      await upsert.mutateAsync({
        data: intakeInput,
        completed: true,
      });
      console.log("Intake saved successfully!");
      router.push(redirectAfterIntake || "/payment");
    } catch (error) {
      console.error("Error saving intake:", error);
    }
  };

  const progressPercentage = ((currentStep + 1) / 6) * 100;

  return (
    <div className="bg-[#C0C7D4] h-screen relative overflow-hidden font-['Inter']">
      {/* Left Panel - Animated Blue Gradient with Fractal Noise */}
      <div className="rounded-[15px] w-[910px] h-[calc(100vh-28px)] absolute left-2.5 top-3.5 overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(${noiseOffset}deg, #8B9DC3 0%, #C0C7D4 25%, #DFE3E8 50%, #C0C7D4 75%, #8B9DC3 100%)`,
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* Animated blurred circles for depth */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 transition-transform duration-[3000ms]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(80px)',
            left: '20%',
            top: '10%',
            transform: `translate(${Math.sin(noiseOffset / 30) * 50}px, ${Math.cos(noiseOffset / 30) * 50}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-30 transition-transform duration-[4000ms]"
          style={{
            background: 'radial-gradient(circle, rgba(139,157,195,0.8) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(60px)',
            right: '15%',
            bottom: '20%',
            transform: `translate(${Math.cos(noiseOffset / 40) * 60}px, ${Math.sin(noiseOffset / 40) * 60}px)`,
          }}
        />
        
        {/* SVG noise filter */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <filter id="fractalNoise">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"
              seed={noiseOffset}
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#fractalNoise)" />
        </svg>
        
        {/* Logo */}
        <Image
          src="/untitled-design-58-20.png"
          alt="Parallel Logo"
          width={82}
          height={82}
          className="w-[82px] h-[82px] absolute left-[67px] top-[77px] object-cover z-10"
          priority
        />
        
        {/* Welcome text - smaller */}
        <div className="absolute left-[67px] top-[190px] z-10">
          <h1
            className="text-left font-medium text-[48px] text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Welcome to Parallel
          </h1>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-[510px] h-[calc(100vh-28px)] absolute right-[29px] top-3.5">
        <div className="bg-white rounded-[15px] w-full h-full absolute left-0 top-0 px-12 py-8 overflow-y-auto">
          {/* Progress indicator - back arrow and bar only */}
          <div className="flex items-center gap-4 mb-12">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full border-2 border-[#4a4a4a] flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <div className="flex-1">
              <div className="bg-[#d9d9d9] rounded-[100px] w-full h-[7px]">
                <div
                  className="bg-[#4a4a4a] rounded-[100px] h-[7px] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Step 0: Name */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Name
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  (Personalize reports and notifications.)
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[#2c2c2c] text-sm block mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg w-full h-[52px] px-4 text-[#2c2c2c] text-base focus:outline-none focus:border-[#4a4a4a]"
                  />
                </div>
                <div>
                  <label className="text-[#2c2c2c] text-sm block mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg w-full h-[52px] px-4 text-[#2c2c2c] text-base focus:outline-none focus:border-[#4a4a4a]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Age */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Age Bracket
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  (Adjusts algorithm for age-related skin and bone changes.)
                </p>
              </div>

              <div className="space-y-3">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAge(opt as AgeBracket)}
                    className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                      age === opt
                        ? "bg-[#4a4a4a] text-white"
                        : "bg-white text-[#2c2c2c] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Country */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Country
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  Where are you located?
                </p>
              </div>

              <CountryDropdown onChange={setCountry} placeholder="Select a country" />
            </div>
          )}

          {/* Step 3: Ethnicity */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Ethnicity
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  (Select all that apply)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ETHNICITY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setEthnicities((prev) => toggleListValue(prev, option))
                    }
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      ethnicities.includes(option)
                        ? "bg-[#4a4a4a] text-white"
                        : "bg-white text-[#2c2c2c] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {ethnicities.includes("Other") && (
                <input
                  type="text"
                  value={ethnicityOther}
                  onChange={(e) => setEthnicityOther(e.target.value)}
                  placeholder="Please specify"
                  className="bg-white border border-gray-300 rounded-lg w-full h-[52px] px-4 text-[#2c2c2c] text-base focus:outline-none focus:border-[#4a4a4a]"
                />
              )}
            </div>
          )}

          {/* Step 4: Focus */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Focus
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  What would you like to focus on?
                </p>
              </div>

              <div className="space-y-3">
                {AESTHETIC_FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFocus(opt as (typeof AESTHETIC_FOCUS_OPTIONS)[number])}
                    className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                      focus === opt
                        ? "bg-[#4a4a4a] text-white"
                        : "bg-white text-[#2c2c2c] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {focus === "Other" && (
                <input
                  type="text"
                  value={focusOther}
                  onChange={(e) => setFocusOther(e.target.value)}
                  placeholder="Please specify"
                  className="bg-white border border-gray-300 rounded-lg w-full h-[52px] px-4 text-[#2c2c2c] text-base focus:outline-none focus:border-[#4a4a4a]"
                />
              )}
            </div>
          )}

          {/* Step 5: Treatments */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Treatments
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  Previous treatments (Select all that apply)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TREATMENT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleTreatmentChange(option)}
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      treatments.includes(option)
                        ? "bg-[#4a4a4a] text-white"
                        : "bg-white text-[#2c2c2c] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {treatments.includes("Other") && (
                <input
                  type="text"
                  value={treatmentsOther}
                  onChange={(e) => setTreatmentsOther(e.target.value)}
                  placeholder="Please specify"
                  className="bg-white border border-gray-300 rounded-lg w-full h-[52px] px-4 text-[#2c2c2c] text-base focus:outline-none focus:border-[#4a4a4a] mt-3"
                />
              )}
            </div>
          )}

          {/* Navigation button */}
          <div className="mt-12">
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                  isStepValid()
                    ? "bg-[#4a4a4a] text-white hover:bg-[#3a3a3a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || upsert.isPending}
                className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                  isStepValid() && !upsert.isPending
                    ? "bg-[#4a4a4a] text-white hover:bg-[#3a3a3a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {upsert.isPending ? "Saving..." : "Continue"}
              </button>
            )}
          </div>

          {/* Error display */}
          {upsert.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-semibold">Error saving intake data:</p>
              <p>{upsert.error.message}</p>
              <p className="mt-2 text-xs">Please make sure you're logged in and try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
