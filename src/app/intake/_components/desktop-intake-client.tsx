"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";
import type { AestheticFocus, AgeBracket, Country } from "~/types/intake";
import {
  AESTHETIC_FOCUS_OPTIONS,
  AGE_OPTIONS,
  ETHNICITY_OPTIONS,
  TREATMENT_OPTIONS,
} from "~/types/intake";
import { CountryDropdown } from "~/app/create-analysis/_components/intake/country-dropdown";

export function DesktopIntakeClient() {
  const router = useRouter();
  const utils = api.useUtils();
  const {
    data: session,
    isPending: isSessionLoading,
    error: sessionError,
  } = authClient.useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check user status for redirect logic
  const { data: userIntake, isLoading: isLoadingIntake } = api.intake.getMine.useQuery(undefined, {
    enabled: !isSessionLoading && !!session?.user,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: subscriptionStatus, isLoading: isLoadingSubscription } = api.subscription.isSubscribed.useQuery(undefined, {
    enabled: !isSessionLoading && !!session?.user,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: userAnalyses, isLoading: isLoadingAnalyses, error: analysesError } = api.analysis.getUserAnalyses.useQuery(undefined, {
    enabled: !isSessionLoading && !!session?.user,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  // Safe boolean check to avoid schema issues in prod
  const { data: hasAnyAnalysisSafe, error: hasAnalysisError } = api.analysis.hasAnyAnalysisSafe.useQuery(undefined, {
    enabled: !isSessionLoading && !!session?.user,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Production debugging
  if (process.env.NODE_ENV === "production") {
    console.log("[DESKTOP INTAKE] Analysis query states:", {
      hasAnyAnalysisSafe,
      hasAnalysisError: hasAnalysisError?.message,
      userAnalyses: userAnalyses?.length || 0,
      analysesError: analysesError?.message,
    });
  }

  // Don't wait for analysis query if it fails - use intake and subscription data for routing
  const isLoadingUserStatus = isSessionLoading || (!!session?.user && (isLoadingIntake || isLoadingSubscription));

  // Form states
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [age, setAge] = useState<AgeBracket | "">("");
  const [country, setCountry] = useState<Country | null>(null);
  const [ethnicities, setEthnicities] = useState<(typeof ETHNICITY_OPTIONS)[number][]>([]);
  const [ethnicityOther, setEthnicityOther] = useState<string>("");
  const [focus, setFocus] = useState<(typeof AESTHETIC_FOCUS_OPTIONS)[number] | "">("");
  const [focusOther, setFocusOther] = useState<string>("");
  const [treatments, setTreatments] = useState<(typeof TREATMENT_OPTIONS)[number][]>([]);
  const [treatmentsOther, setTreatmentsOther] = useState<string>("");

  const upsert = api.intake.upsert.useMutation({
    onSuccess: async () => {
      console.log("Desktop intake saved successfully");
      
      // Only run on client side
      if (typeof window === "undefined") return;
      
      // Mark flow as done and refresh relevant caches; let routing effect decide destination
      localStorage.setItem("desktopIntakePostSignInSave", "done");
      try {
        await Promise.all([
          utils.intake.getMine.invalidate(),
          utils.subscription.isSubscribed.invalidate(),
          utils.analysis.getUserAnalyses.invalidate(),
          utils.analysis.hasAnyAnalysisSafe.invalidate(),
        ]);
      } catch {}
    },
    onError: (error) => {
      console.error("Desktop intake save failed:", error);
    },
  });

  // Restore form data from localStorage on mount
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window === "undefined") return;
    
    try {
      const raw = localStorage.getItem("desktopIntakeDraft");
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.firstName === "string") setFirstName(d.firstName);
        if (typeof d.lastName === "string") setLastName(d.lastName);
        if (d.age) setAge(d.age as AgeBracket);
        if (d.country) setCountry(d.country as Country);
        if (Array.isArray(d.ethnicities)) setEthnicities(d.ethnicities);
        if (typeof d.ethnicityOther === "string") setEthnicityOther(d.ethnicityOther);
        if (d.focus) setFocus(d.focus as (typeof AESTHETIC_FOCUS_OPTIONS)[number]);
        if (typeof d.focusOther === "string") setFocusOther(d.focusOther);
        if (Array.isArray(d.treatments)) setTreatments(d.treatments);
        if (typeof d.treatmentsOther === "string") setTreatmentsOther(d.treatmentsOther);
        if (typeof d.currentStep === "number" && d.currentStep >= 0 && d.currentStep <= 6) {
          setCurrentStep(d.currentStep);
        }
      }
    } catch (error) {
      console.error("Failed to restore desktop intake data from localStorage:", error);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window === "undefined") return;
    
    const draft = {
      firstName,
      lastName,
      age,
      country,
      ethnicities,
      ethnicityOther,
      focus,
      focusOther,
      treatments,
      treatmentsOther,
      currentStep,
    };
    localStorage.setItem("desktopIntakeDraft", JSON.stringify(draft));
  }, [firstName, lastName, age, country, ethnicities, ethnicityOther, focus, focusOther, treatments, treatmentsOther, currentStep]);

  // Prevent duplicate post-sign-in save (idempotency guard)
  const hasTriggeredPostSignInSave = useRef(false);

  // Unified routing logic for authenticated users
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Wait for session to load first
    if (isSessionLoading) return;
    
    if (!session?.user) return;
    
    // Prevent multiple redirects
    if (hasRedirected) return;

    // Check if we should auto-save after sign-in (user just completed OAuth)
    const postSignInState = localStorage.getItem("desktopIntakePostSignInSave");
    const shouldPersist = postSignInState === "pending";
    
    if (shouldPersist && !hasTriggeredPostSignInSave.current && !upsert.isPending) {
      hasTriggeredPostSignInSave.current = true;
      // Mark as processing immediately to avoid duplicate triggers from re-renders/HMR
      localStorage.setItem("desktopIntakePostSignInSave", "processing");
      // User just signed in from the form - auto-save their responses
      const dRaw = localStorage.getItem("desktopIntakeDraft");
      try {
        const d = dRaw ? JSON.parse(dRaw) : {};
        upsert.mutateAsync({
          data: {
            firstName: (d.firstName as string) || "Guest",
            lastName: (d.lastName as string) || "User",
            ageBracket: (d.age as AgeBracket) || ("18-24" as AgeBracket),
            country: (d.country?.alpha3 as string) || "USA",
            ethnicities:
              Array.isArray(d.ethnicities) && d.ethnicities.length > 0
                ? d.ethnicities
                : (["Other"] as (typeof ETHNICITY_OPTIONS)[number][]),
            ethnicityOther: (d.ethnicityOther as string) || "",
            focus: (d.focus as AestheticFocus) || ("Overall upgrade" as AestheticFocus),
            focusOther: (d.focusOther as string) || "",
            treatments:
              Array.isArray(d.treatments) && d.treatments.length > 0
                ? d.treatments
                : (["None"] as (typeof TREATMENT_OPTIONS)[number][]),
            treatmentsOther: (d.treatmentsOther as string) || "",
          },
          completed: true,
        });
      } catch (error) {
        console.error("Auto-save error:", error);
        // Reset to pending so user can retry by reloading or clicking again
        localStorage.setItem("desktopIntakePostSignInSave", "pending");
        hasTriggeredPostSignInSave.current = false;
      }
      return; // Wait for mutation to finish; routing will be handled afterward by logic below
    }

    // User is already authenticated - check their status and route accordingly
    if (!subscriptionStatus) {
      // Still loading subscription data
      console.log("Desktop intake: Still loading subscription data...");
      return;
    }

    // If analysis query failed, assume they have analyses (they uploaded photos)
    // The query fails due to missing morph_variations column, not because they have no analyses
    const hasAnalyses = (userAnalyses && userAnalyses.length > 0) || !!hasAnyAnalysisSafe?.hasAnalysis;
    const analysisQueryFailed = analysesError && !userAnalyses;
    
    // Debug: Check if query is still loading or if it's actually failed
    const isAnalysisQueryStillLoading = isLoadingAnalyses;
    const hasAnalysisData = !!userAnalyses;
    const hasAnalysisError = !!analysesError;
    
    console.log("Desktop intake: Analysis query debug", {
      isLoadingAnalyses,
      hasAnalysisData,
      hasAnalysisError,
      analysisError: analysesError?.message,
      userAnalysesLength: userAnalyses?.length,
      analysisQueryFailed,
    });
    
    if (analysisQueryFailed) {
      console.log("Desktop intake: Analysis query failed, assuming they have analyses (uploaded photos)", {
        error: analysesError?.message,
      });
    }

    console.log("Desktop intake: User status loaded", {
      hasIntake: !!userIntake,
      isSubscribed: subscriptionStatus.isSubscribed,
      hasAnalyses,
      analysisCount: userAnalyses?.length || 0,
      analysisQueryFailed,
    });

    // Routing logic based on completion status:
    // 1. Has complete analysis → /analysis
    // 2. Has paid + intake but no analysis → /create-analysis
    // 3. Has intake but hasn't paid → /payment
    // 4. No intake → stay on form (show form to fill out)

    if (userIntake) {
      // User has filled out the intake form
      if (!subscriptionStatus.isSubscribed) {
        // Has intake but hasn't paid - send to payment
        console.log("Desktop intake: User has intake but hasn't paid, redirecting to /payment");
        setHasRedirected(true);
        window.location.href = "/payment";
      } else if (hasAnalyses) {
        // Has paid AND has analysis - send to analysis page
        console.log("Desktop intake: User has paid and has analysis, redirecting to /analysis");
        setHasRedirected(true);
        window.location.href = "/analysis";
      } else if (analysisQueryFailed) {
        // Analysis query failed (likely due to missing morph_variations column)
        // Since they have intake + subscription, assume they have an analysis and send to /analysis
        // If they don't have one, the analysis page will handle it gracefully
        console.log("Desktop intake: Analysis query failed, assuming user has analysis (intake + subscription), redirecting to /analysis");
        setHasRedirected(true);
        window.location.href = "/analysis";
      } else {
        // Has paid but no analysis yet - send to create analysis
        console.log("Desktop intake: User has paid but no analysis, redirecting to /create-analysis");
        setHasRedirected(true);
        window.location.href = "/create-analysis";
      }
    } else {
      // User has no intake data - let them fill out the form
      console.log("Desktop intake: User has no intake data, showing form");
      // Reset to step 0 and clear any localStorage draft if they want to start fresh
      // (but keep the draft so they can continue if they left partway through)
    }
  }, [session, isSessionLoading, userIntake, subscriptionStatus, userAnalyses, upsert, hasRedirected]);

  const toggleListValue = useCallback(<T extends string>(list: T[], value: T): T[] => {
    if (value === "None") {
      return ["None"] as T[];
    }
    if (list.includes("None" as T)) {
      return [value];
    }
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }, []);

  const handleTreatmentChange = useCallback((option: (typeof TREATMENT_OPTIONS)[number]) => {
    setTreatments((prev) => toggleListValue(prev, option));
  }, [toggleListValue]);

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 0: // Name
        return firstName.trim().length > 0 && lastName.trim().length > 0;
      case 1: // Age
        return age !== "";
      case 2: // Country
        return country !== null;
      case 3: // Ethnicity
        return ethnicities.length > 0 && (!ethnicities.includes("Other") || ethnicityOther.trim().length > 0);
      case 4: // Focus
        return focus !== "" && (focus !== "Other" || focusOther.trim().length > 0);
      case 5: // Treatments
        return treatments.length > 0 && (!treatments.includes("Other") || treatmentsOther.trim().length > 0);
      case 6: // Sign-in step
        return true;
      default:
        return false;
    }
  }, [currentStep, firstName, lastName, age, country, ethnicities, ethnicityOther, focus, focusOther, treatments, treatmentsOther]);

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.push("/");
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleSignIn = () => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Set flag for auto-save after sign-in
    localStorage.setItem("desktopIntakePostSignInSave", "pending");
    
    // Redirect to /intake after Google OAuth
    signIn("/intake");
  };

  const handleAuthenticatedSubmit = () => {
    if (!session?.user) return;

    const formData = {
      firstName: firstName || "Guest",
      lastName: lastName || "User",
      ageBracket: age as AgeBracket,
      country: country?.alpha3 || "USA",
      ethnicities: ethnicities.length > 0 ? ethnicities : (["Other"] as (typeof ETHNICITY_OPTIONS)[number][]),
      ethnicityOther,
      focus: focus as AestheticFocus,
      focusOther,
      treatments: treatments.length > 0 ? treatments : (["None"] as (typeof TREATMENT_OPTIONS)[number][]),
      treatmentsOther,
    };

    console.log("Submitting form data:", formData);
    upsert.mutate({
      data: formData,
      completed: true,
    });
  };

  const progressPercentage = ((currentStep + 1) / 7) * 100;

  // All hooks are now called unconditionally above
  // Now handle conditional rendering logic

  // Show loading state while checking session
  if (isSessionLoading) {
    return (
      <div className="bg-[#C0C7D4] h-screen relative overflow-hidden font-['Inter'] flex items-center justify-center">
        <div className="text-white text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // Show loading state while checking user status
  if (isLoadingUserStatus) {
    return (
      <div className="bg-[#C0C7D4] h-screen relative overflow-hidden font-['Inter'] flex items-center justify-center">
        <div className="text-white text-lg font-medium">Checking your account status...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#C0C7D4] h-screen relative overflow-hidden font-['Inter']">
      {/* Left Panel - Animated Gradient Background with Fractal Noise */}
      <div className="rounded-[15px] w-[910px] h-[calc(100vh-28px)] absolute left-2.5 top-3.5 overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: 'linear-gradient(135deg, #8B9DC3 0%, #C0C7D4 25%, #DFE3E8 50%, #C0C7D4 75%, #8B9DC3 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
          }}
        />
        
        {/* Animated blurred circles for depth */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(80px)',
            left: '20%',
            top: '10%',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,157,195,0.8) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(60px)',
            right: '15%',
            bottom: '20%',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        
        {/* SVG noise filter */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <filter id="fractalNoiseIntake">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#fractalNoiseIntake)" />
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
        
        {/* Welcome text */}
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
          {/* Progress indicator - back arrow and bar */}
          <div className="flex items-center gap-4 mb-12">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full border-2 border-[#4a4a4a] flex items-center justify-center hover:bg-gray-100 transition-colors"
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
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
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

          {/* Step 6: Sign in */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[#2c2c2c] text-[32px] font-normal mb-2">
                  Create your account
                </h1>
                <p className="text-[#6b6b6b] text-sm">
                  We'll save your responses and take you to payment.
                </p>
              </div>

              <div className="space-y-4">
                {session?.user ? (
                  <button
                    onClick={handleAuthenticatedSubmit}
                    disabled={upsert.isPending}
                    className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                      upsert.isPending
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#4a4a4a] text-white hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {upsert.isPending ? "Saving..." : "Save and continue"}
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="w-full h-[52px] rounded-lg bg-[#4a4a4a] text-white text-base font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    Continue with Google
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation button */}
          <div className="mt-12">
            {currentStep < 6 ? (
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
            ) : null}
          </div>

          {/* Error display */}
          {upsert.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              Error: {upsert.error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
