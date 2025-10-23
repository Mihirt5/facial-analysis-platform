"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";
import { usePostHog } from "posthog-js/react";
import {
  AGE_OPTIONS,
  ETHNICITY_OPTIONS,
  AESTHETIC_FOCUS_OPTIONS,
  TREATMENT_OPTIONS,
  type AgeBracket,
} from "~/types/intake";

type FocusOption = (typeof AESTHETIC_FOCUS_OPTIONS)[number];
type EthnicityOption = (typeof ETHNICITY_OPTIONS)[number];
type TreatmentOption = (typeof TREATMENT_OPTIONS)[number];

export default function MobileOnboardingPage() {
  const router = useRouter();
  const {
    data: session,
    isPending: isSessionLoading,
    error: sessionError,
  } = authClient.useSession();
  const posthog = usePostHog();

  const [step, setStep] = useState(0);

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
  const { data: hasAnyAnalysisSafe } = api.analysis.hasAnyAnalysisSafe.useQuery(undefined, {
    enabled: !isSessionLoading && !!session?.user,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Show loading state while checking user status (don't wait for analysis query if it fails)
  const isLoadingUserStatus = isSessionLoading || (!!session?.user && (isLoadingIntake || isLoadingSubscription));

  // Debug logging
  useEffect(() => {
    // Removed sensitive logging
  }, [session, userIntake, subscriptionStatus, userAnalyses, isLoadingUserStatus]);

  // Track step changes for PostHog analytics
  useEffect(() => {
    if (posthog && session?.user) {
      const stepNames = [
        "name_input",
        "age_selection", 
        "ethnicity_selection",
        "focus_selection",
        "treatment_selection",
        "signup_completion"
      ];
      
      const currentStepName = stepNames[step];
      
      posthog.capture("onboarding_step_entered", {
        step: step,
        step_name: currentStepName,
        user_id: session.user.id,
        timestamp: new Date().toISOString()
      });
      
      console.log(`PostHog: User entered step ${step} (${currentStepName})`);
    }
  }, [step, posthog, session?.user]);

  // Track page unload/drop-off
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (posthog && session?.user && step < 5) {
        const stepNames = [
          "name_input",
          "age_selection", 
          "ethnicity_selection",
          "focus_selection",
          "treatment_selection",
          "signup_completion"
        ];
        
        const currentStepName = stepNames[step];
        
        posthog.capture("onboarding_dropped_off", {
          step: step,
          step_name: currentStepName,
          user_id: session.user.id,
          timestamp: new Date().toISOString(),
          drop_off_reason: "page_unload"
        });
        
        console.log(`PostHog: User dropped off at step ${step} (${currentStepName})`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, posthog, session?.user]);

  // State
  const [ageBracket, setAgeBracket] = useState<AgeBracket | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ethnicities, setEthnicities] = useState<EthnicityOption[]>([]);
  const [focuses, setFocuses] = useState<FocusOption[]>([]);
  const [focusOther, setFocusOther] = useState("");
  const [treatments, setTreatments] = useState<TreatmentOption[]>([]);
  const [treatmentsOther, setTreatmentsOther] = useState("");

  // Persist locally between reloads
  useEffect(() => {
    try {
      const raw = localStorage.getItem("onboardingDraft");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.ageBracket) setAgeBracket(d.ageBracket as AgeBracket);
        if (Array.isArray(d.ethnicities)) setEthnicities(d.ethnicities);
        if (Array.isArray(d.focuses)) setFocuses(d.focuses);
        if (typeof d.focusOther === "string") setFocusOther(d.focusOther);
        if (Array.isArray(d.treatments)) setTreatments(d.treatments);
        if (typeof d.treatmentsOther === "string")
          setTreatmentsOther(d.treatmentsOther);
        if (typeof d.firstName === "string") setFirstName(d.firstName);
        if (typeof d.lastName === "string") setLastName(d.lastName);
        // Restore step if it exists
        if (typeof d.step === "number" && d.step >= 0 && d.step <= 5) {
          setStep(d.step);
        }
      }
    } catch (error) {
      console.error("Failed to restore onboarding data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const draft = {
      ageBracket,
      firstName,
      lastName,
      ethnicities,
      focuses,
      focus: focuses[0] ?? "", // compatibility for existing save path
      focusOther,
      treatments,
      treatmentsOther,
      step, // Persist current step
    };
    localStorage.setItem("onboardingDraft", JSON.stringify(draft));
  }, [ageBracket, firstName, lastName, ethnicities, focuses, focusOther, treatments, treatmentsOther, step]);


  // Save to backend when user becomes authenticated
  const utils = api.useUtils();
  const upsert = api.intake.upsert.useMutation({
    onSuccess: async (createdIntake) => {
      console.log("Intake upsert successful, invalidating cache and determining final destination");
      
      // Track successful onboarding completion
      if (posthog && session?.user) {
        posthog.capture("onboarding_completed", {
          user_id: session.user.id,
          timestamp: new Date().toISOString(),
          total_steps_completed: 6,
          completion_time: new Date().toISOString()
        });
        
        console.log("PostHog: User completed entire onboarding process");
      }
      
      await Promise.all([
        utils.intake.getMine.invalidate(),
        utils.subscription.isSubscribed.invalidate(),
        utils.analysis.getUserAnalyses.invalidate(),
        utils.analysis.hasAnyAnalysisSafe.invalidate(),
      ]);

      // Mark flow done; route based on actual state
      try { localStorage.setItem("onboardingPostSignInSave", "done"); } catch {}

      const { getClientRedirectDestination } = await import("~/lib/redirect-utils");
      const destination = getClientRedirectDestination(
        createdIntake ?? userIntake,
        subscriptionStatus,
        userAnalyses || []
      );
      console.log(`Onboarding completed: redirecting to ${destination}`);
      router.push(destination);
    },
    onError: (error) => {
      console.error("Intake upsert failed:", error);
      console.error("Error details:", {
        message: error.message,
        data: error.data,
        shape: error.shape,
      });
    },
  });

  // Auto-save after sign-in if the user came from this step
  useEffect(() => {
    // Wait for session to load first
    if (isSessionLoading) return;
    
    if (!session?.user) return;
    
    // Check if user already has intake data - determine final destination
    if (userIntake && subscriptionStatus) {
      import("~/lib/redirect-utils").then(({ getClientRedirectDestination }) => {
        const destination = getClientRedirectDestination(userIntake, subscriptionStatus, userAnalyses || []);
        console.log(`Auto-save: redirecting to ${destination}`);
        router.push(destination);
      });
      return;
    }
    
    const shouldPersist = localStorage.getItem("onboardingPostSignInSave");
    if (!shouldPersist) {
      return;
    }

    const dRaw = localStorage.getItem("onboardingDraft");
    try {
      const d = dRaw ? JSON.parse(dRaw) : {};
      upsert
        .mutateAsync({
          data: {
            firstName: (d.firstName as string) || firstName || "Guest",
            lastName: (d.lastName as string) || lastName || "User",
            ageBracket: (d.ageBracket as AgeBracket) || (ageBracket as AgeBracket),
            country: "USA",
            ethnicities:
              (d.ethnicities as EthnicityOption[])?.length > 0
                ? (d.ethnicities as EthnicityOption[])
                : ethnicities.length > 0
                  ? ethnicities
                  : (["Other"] as EthnicityOption[]),
            ethnicityOther: "",
            // Backend limitation: single focus; store the first selected
            focus: ((d.focuses?.[0] ?? focuses[0] ?? "Overall upgrade") as FocusOption),
            focusOther: d.focusOther ?? focusOther ?? "",
            treatments:
              (d.treatments as TreatmentOption[])?.length > 0
                ? (d.treatments as TreatmentOption[])
                : treatments.length > 0
                  ? treatments
                  : (["None"] as TreatmentOption[]),
            treatmentsOther: d.treatmentsOther ?? treatmentsOther ?? "",
          },
          completed: true,
        })
        .then(async (createdIntake) => {
          // Mark flow done; keep draft for back navigation
          try { localStorage.setItem("onboardingPostSignInSave", "done"); } catch {}

          await Promise.all([
            utils.intake.getMine.invalidate(),
            utils.subscription.isSubscribed.invalidate(),
            utils.analysis.getUserAnalyses.invalidate(),
            utils.analysis.hasAnyAnalysisSafe.invalidate(),
          ]);

          const { getClientRedirectDestination } = await import("~/lib/redirect-utils");
          const destination = getClientRedirectDestination(
            createdIntake ?? userIntake,
            subscriptionStatus,
            userAnalyses || []
          );
          console.log(`Auto-save completed: redirecting to ${destination}`);
          router.push(destination);
        })
        .catch((e) => console.error(e));
    } catch {}
  }, [session, isSessionLoading, userIntake, subscriptionStatus, userAnalyses, router, firstName, lastName, ageBracket, ethnicities, focuses, focusOther, treatments, treatmentsOther, upsert]);

  // Redirect logic: only redirect users who already have intake data (not new users completing onboarding)
  useEffect(() => {
    if (!session?.user || !userIntake || !subscriptionStatus) return;

    // Only redirect if the user already has intake data (they're returning to this page)
    // Don't redirect if they're in the middle of completing onboarding
    const isCompletingOnboarding = localStorage.getItem("onboardingPostSignInSave") || 
                                   !firstName || !lastName || step > 0;
    
    if (isCompletingOnboarding) {
      console.log("User is completing onboarding, not redirecting");
      return;
    }

    // Import the redirect utility
    import("~/lib/redirect-utils").then(({ getClientRedirectDestination }) => {
      const analysisQueryFailed = !!analysesError && !userAnalyses;
      const destination = getClientRedirectDestination(
        userIntake,
        subscriptionStatus,
        (userAnalyses && userAnalyses.length > 0) || hasAnyAnalysisSafe?.hasAnalysis ? (userAnalyses ?? [{} as any]) : [],
        analysisQueryFailed
      );
      
      // Only redirect if we're not already on the correct page
      if (destination !== "/mobile/onboarding") {
        console.log(`Redirecting to final destination: ${destination}`);
        router.push(destination);
      }
    });
  }, [session?.user, userIntake, subscriptionStatus, userAnalyses, router, firstName, lastName, step]);

  const isValid = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(firstName.trim()) && Boolean(lastName.trim());
      case 1:
        return Boolean(ageBracket);
      case 2:
        return ethnicities.length > 0;
      case 3:
        return focuses.length > 0 || focusOther.trim().length > 0;
      case 4:
        return treatments.length > 0;
      default:
        return true;
    }
  }, [step, ageBracket, ethnicities.length, focuses.length, focusOther, treatments.length, firstName, lastName]);

  const toggle = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleTreatmentToggle = (opt: TreatmentOption) => {
    setTreatments((prev) => {
      if (opt === "None") return ["None"] as TreatmentOption[];
      if (prev.includes("None")) return [opt];
      return toggle(prev, opt);
    });
  };

  const next = () => {
    // Track step completion before moving to next step
    if (posthog && session?.user) {
      const stepNames = [
        "name_input",
        "age_selection", 
        "ethnicity_selection",
        "focus_selection",
        "treatment_selection",
        "signup_completion"
      ];
      
      const completedStepName = stepNames[step];
      
      posthog.capture("onboarding_step_completed", {
        step: step,
        step_name: completedStepName,
        user_id: session.user.id,
        timestamp: new Date().toISOString(),
        // Add step-specific data
        ...(step === 0 && { first_name: firstName, last_name: lastName }),
        ...(step === 1 && { age_bracket: ageBracket }),
        ...(step === 2 && { ethnicities: ethnicities }),
        ...(step === 3 && { focuses: focuses, focus_other: focusOther }),
        ...(step === 4 && { treatments: treatments, treatments_other: treatmentsOther })
      });
      
      console.log(`PostHog: User completed step ${step} (${completedStepName})`);
    }
    
    setStep((s) => Math.min(5, s + 1));
  };
  const back = () => {
    // Track back button usage
    if (posthog && session?.user) {
      const stepNames = [
        "name_input",
        "age_selection", 
        "ethnicity_selection",
        "focus_selection",
        "treatment_selection",
        "signup_completion"
      ];
      
      const currentStepName = stepNames[step];
      
      posthog.capture("onboarding_step_back", {
        step: step,
        step_name: currentStepName,
        user_id: session.user.id,
        timestamp: new Date().toISOString(),
        action: step === 0 ? "exit_to_mobile" : "previous_step"
      });
      
      console.log(`PostHog: User went back from step ${step} (${currentStepName})`);
    }
    
    if (step === 0) {
      // If on the first step, go back to mobile page
      router.push("/mobile");
    } else {
      // Otherwise, go to previous step
      setStep((s) => Math.max(0, s - 1));
    }
  };

  // Progress based on current step (0-5, where 5 is signup)
  const totalSteps = 6; // Name, Age, Ethnicity, Focus, Treatments, Signup
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((step + 1) / totalSteps) * 100)),
  );

  // Show loading state while session is loading
  if (isSessionLoading) {
    return (
      <div className="w-full h-screen relative bg-[#f3f3f3] overflow-hidden flex flex-col items-center justify-center px-[34px] box-border gap-[24px] leading-[normal] tracking-[normal]">
        <div className="text-Parallel-Main text-lg font-medium">Loading...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Parallel-Main"></div>
      </div>
    );
  }

  // Show loading state while checking user status
  if (isLoadingUserStatus) {
    return (
      <div className="w-full h-screen relative bg-[#f3f3f3] overflow-hidden flex flex-col items-center justify-center px-[34px] box-border gap-[24px] leading-[normal] tracking-[normal]">
        <div className="text-Parallel-Main text-lg font-medium">Checking your account status...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Parallel-Main"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-start pt-[41px] px-[34px] pb-[80px] box-border gap-[24px] leading-[normal] tracking-[normal]">
      {/* Top bar (Figma-style) */}
      <div className="w-[352px] flex items-end flex-wrap content-end gap-[17.5px] max-w-full">
        <Image
          onClick={back}
          className="cursor-pointer [border:none] p-0 bg-[transparent] h-[32.5px] w-[32.5px] relative object-contain"
          width={32.5}
          height={32.5}
          sizes="100vw"
          alt="Back"
          src="/Group@2x.png"
        />
        <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[12.5px] box-border min-w-[196px]">
          <div className="self-stretch h-1 relative rounded-[100px] bg-[#d9d9d9]">
            <div className="absolute top-0 left-0 rounded-[100px] bg-[#d9d9d9] w-full h-full hidden" />
            <div
              className="absolute top-0 left-0 rounded-[100px] bg-Parallel-Main h-1 z-[1]"
              style={{ width: `${progressPercent}%`, transition: "width 200ms ease" }}
            />
          </div>
        </div>
      </div>

      {/* Step container with fade */}
      <div key={step} className="w-[334px] max-w-full transition-opacity duration-300 ease-out">
        {/* 0. Name */}
        {step === 0 && (
          <div className="flex flex-col gap-[42.5px] w-full">
            <div className="w-[237px] h-[197.5px] flex items-start pt-0 px-1 pb-[138.5px] box-border">
              <div className="flex flex-col items-start gap-[7px]">
                <h1 className="m-0 relative text-[32px] tracking-[-0.05em] font-medium font-[Inter] text-Parallel-Main">
                  Name
                </h1>
                <div className="h-[13px] relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium inline-block">
                  <p className="m-0">(Personalize reports and notifications.)</p>
                </div>
              </div>
            </div>
            <div className="self-stretch h-[173px] flex items-start py-0 px-1 box-border max-w-full text-left text-base text-Parallel-Main font-[Inter]">
              <div className="flex-1 flex flex-col items-start gap-[13px] max-w-full">
                <div className="self-stretch flex flex-col items-start gap-2.5">
                  <div className="relative tracking-[-0.05em] font-medium">
                    First Name
                  </div>
                  <input
                    className="w-full min-w-[218px] rounded-[16px] border border-[#d7dce6] bg-white/90 px-4 py-[14px] text-[17px] font-medium text-[#202c3a] shadow-[0_14px_32px_rgba(25,45,85,0.08)] transition-colors duration-200 ease-out placeholder:text-[#9aa6b8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-Parallel-Main focus:ring-offset-2 focus:ring-offset-[#f3f3f3] hover:border-[#c9d1dc]"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="self-stretch flex flex-col items-start gap-2.5">
                  <div className="relative tracking-[-0.05em] font-medium">
                    Last Name
                  </div>
                  <input
                    className="w-full min-w-[218px] rounded-[16px] border border-[#d7dce6] bg-white/90 px-4 py-[14px] text-[17px] font-medium text-[#202c3a] shadow-[0_14px_32px_rgba(25,45,85,0.08)] transition-colors duration-200 ease-out placeholder:text-[#9aa6b8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-Parallel-Main focus:ring-offset-2 focus:ring-offset-[#f3f3f3] hover:border-[#c9d1dc]"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Age */}
        {step === 1 && (
          <div className="flex flex-col gap-[18px]">
            <div className="h-[104.5px] flex items-start pt-0 px-1 pb-[10px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
              <div className="flex flex-col items-start gap-[7px] max-w-full">
                <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">Your Age</h1>
                <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">Pick a bracket</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start gap-3.5">
              {AGE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setAgeBracket(opt)} className={`cursor-pointer border-[#000] border-solid border-[1px] pt-3.5 pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center ${
                  ageBracket === opt ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"
                }`}>
                  <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${
                    ageBracket === opt ? "text-Parallel-Main" : "text-[#fff]"
                  }`}>{opt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Ethnicity (multi) */}
        {step === 2 && (
          <div className="flex flex-col gap-[18px]">
            <div className="h-[104.5px] flex items-start pt-0 px-1 pb-[10px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
              <div className="flex flex-col items-start gap-[7px] max-w-full">
                <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">Ethnicity (Self-ID)</h1>
                <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">(Improves harmony benchmarks and skin-tone matching.)</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start gap-3.5">
              {ETHNICITY_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setEthnicities((prev) => toggle(prev, opt))} className={`cursor-pointer border-[#000] border-solid border-[1px] pt-3.5 pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center ${
                  ethnicities.includes(opt) ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"
                }`}>
                  <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${
                    ethnicities.includes(opt) ? "text-Parallel-Main" : "text-[#fff]"
                  }`}>{opt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Focus (multi) */}
        {step === 3 && (
          <div className="flex flex-col gap-[18px]">
            <div className="h-[104.5px] flex items-start pt-0 px-1 pb-[10px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
              <div className="flex flex-col items-start gap-[7px] max-w-full">
                <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">Primary Aesthetic Focus</h1>
                <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">Choose one or more options.</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start gap-3.5">
              {AESTHETIC_FOCUS_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setFocuses((prev) => toggle(prev, opt))} className={`cursor-pointer border-[#000] border-solid border-[1px] pt-3.5 pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center ${
                  focuses.includes(opt) ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"
                }`}>
                  <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${
                    focuses.includes(opt) ? "text-Parallel-Main" : "text-[#fff]"
                  }`}>{opt}</div>
                </button>
              ))}
            </div>
            {focuses.includes("Other") && (
              <input
                className="w-full rounded-[5px] border border-[#d9d9d9] bg-white px-3 py-3 text-sm"
                placeholder="If Other, please describe"
                value={focusOther}
                onChange={(e) => setFocusOther(e.target.value)}
              />
            )}
          </div>
        )}

        {/* 4. Treatments (multi with None logic) */}
        {step === 4 && (
          <div className="flex flex-col gap-[18px]">
            <div className="h-[104.5px] flex items-start pt-0 px-1 pb-[10px] box-border max-w-full text-left text-[32px] text-Parallel-Main font-[Inter]">
              <div className="flex flex-col items-start gap-[7px] max-w-full">
                <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">Prior Aesthetic Treatments / Surgeries</h1>
                <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium whitespace-nowrap">Select all that apply.</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start gap-3.5">
              {TREATMENT_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => handleTreatmentToggle(opt)} className={`cursor-pointer border-[#000] border-solid border-[1px] pt-3.5 pb-[13px] self-stretch rounded-[5px] overflow-hidden flex items-start justify-center ${
                  treatments.includes(opt) ? "bg-[#dcdcdc]" : "bg-Parallel-Main hover:bg-[#707070]"
                }`}>
                  <div className={`relative text-xl tracking-[-0.05em] font-normal font-[Inter] text-center inline-block ${
                    treatments.includes(opt) ? "text-Parallel-Main" : "text-[#fff]"
                  }`}>{opt}</div>
                </button>
              ))}
            </div>
            {treatments.includes("Other") && (
              <input
                className="w-full rounded-[5px] border border-[#d9d9d9] bg-white px-3 py-3 text-sm"
                placeholder="If Other, please specify"
                value={treatmentsOther}
                onChange={(e) => setTreatmentsOther(e.target.value)}
              />
            )}
          </div>
        )}


        {/* 5. Google signup */}
        {step === 5 && (
          <div className="flex flex-col justify-between min-h-[400px] w-full">
            <div className="space-y-6">
              <h2 className="text-Parallel-Main font-['Inter'] text-2xl">Create your account</h2>
              <p className="text-sm text-gray-600">We'll save your responses and take you to payment.</p>
            </div>
            <div className="space-y-4">
              {session?.user ? (
                <button
                  onClick={() => {
                    
                    const formData = {
                      firstName: firstName || "Guest",
                      lastName: lastName || "User",
                      ageBracket: ageBracket as AgeBracket,
                      country: "USA",
                      ethnicities: ethnicities.length > 0 ? ethnicities : (["Other"] as EthnicityOption[]),
                      ethnicityOther: "",
                      focus: (focuses[0] ?? "Overall upgrade") as FocusOption,
                      focusOther,
                      treatments: treatments.length > 0 ? treatments : (["None"] as TreatmentOption[]),
                      treatmentsOther,
                    };
                    
                    console.log("Form data being submitted:", formData);
                    
                    // Validate required fields
                    if (!ageBracket) {
                      console.error("Age bracket is required but not selected");
                      alert("Please select your age bracket before continuing.");
                      return;
                    }
                    
                    if (ethnicities.length === 0) {
                      console.error("Ethnicities are required but none selected");
                      alert("Please select at least one ethnicity before continuing.");
                      return;
                    }
                    
                    if (focuses.length === 0 && !focusOther.trim()) {
                      console.error("Focus is required but none selected");
                      alert("Please select at least one aesthetic focus before continuing.");
                      return;
                    }
                    
                    if (treatments.length === 0) {
                      console.error("Treatments are required but none selected");
                      alert("Please select at least one treatment option before continuing.");
                      return;
                    }
                    
                    console.log("About to call upsert.mutate with data:", formData);
                    upsert.mutate({
                      data: formData,
                      completed: true,
                    });
                    console.log("upsert.mutate called, mutation state:", {
                      isPending: upsert.isPending,
                      isError: upsert.isError,
                      isSuccess: upsert.isSuccess,
                      error: upsert.error,
                    });
                  }}
                  className="w-full rounded-md bg-Parallel-Main px-4 py-3 text-white disabled:opacity-50"
                  disabled={upsert.isPending}
                >
                  {upsert.isPending ? "Saving..." : "Save and continue"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Track Google sign-in attempt
                    if (posthog) {
                      posthog.capture("onboarding_google_signin_clicked", {
                        timestamp: new Date().toISOString(),
                        step: step,
                        step_name: "signup_completion"
                      });
                      console.log("PostHog: User clicked Google sign-in");
                    }

                    // Ensure auto-save runs after OAuth, then redirect to /payment
                    try {
                      localStorage.setItem("onboardingPostSignInSave", "true");
                      console.log("Set onboardingPostSignInSave flag for auto-save after Google sign-in");
                    } catch {}

                    // Return from Google directly to onboarding to trigger auto-save → /payment
                    signIn("/mobile/onboarding");
                  }}
                  className="w-full rounded-md bg-Parallel-Main px-4 py-3 text-white"
                >
                  Continue with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={back}
          className="cursor-pointer border-Parallel-Main border-solid border-[1px] pt-2 pb-2 px-4 rounded-[5px] flex items-center justify-center font-[Inter] min-w-[80px]"
        >
          <div className="relative text-sm tracking-[-0.05em] font-normal text-Parallel-Main text-center">
            Back
          </div>
        </button>
        {step < 5 ? (
          <button
            onClick={next}
            disabled={!isValid}
            className="cursor-pointer border-Parallel-Main border-solid border-[1px] pt-2 pb-2 px-4 rounded-[5px] flex items-center justify-center bg-Parallel-Main hover:bg-[#707070] disabled:opacity-40 min-w-[80px]"
          >
            <div className="relative text-sm tracking-[-0.05em] font-normal font-[Inter] text-center text-[#fff]">
              {step === 2 || step === 3 || step === 4 ? "Continue" : "Next"}
            </div>
          </button>
        ) : (
          <div className="text-xs text-gray-500 font-[Inter]">{upsert.isPending ? "Saving..." : ""}</div>
        )}
      </div>
    </div>
  );
}
