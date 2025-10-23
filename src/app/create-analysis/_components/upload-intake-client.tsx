"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import type { AestheticFocus, AgeBracket, Country } from "~/types/intake";
import {
  AESTHETIC_FOCUS_OPTIONS,
  AGE_OPTIONS,
  ETHNICITY_OPTIONS,
  TREATMENT_OPTIONS,
} from "~/types/intake";
import { CountryDropdown } from "./intake/country-dropdown";
import { UploadFacesClient } from "./upload-faces-client";

export function UploadIntakeClient({
  onCompleted,
  showUploadAfterFinish = true,
  userName,
  redirectAfterIntake,
}: {
  onCompleted?: () => void;
  showUploadAfterFinish?: boolean;
  userName?: string;
  redirectAfterIntake?: string;
}) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [isUploadPhase, setIsUploadPhase] = useState(false);

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

  const utils = api.useUtils();
  const upsert = api.intake.upsert.useMutation({
    onSuccess: async () => {
      await utils.intake.getMine.invalidate();
      if (onCompleted) onCompleted();
    },
  });
  // ----------------------------

  const ethnicityHasOther = ethnicities.includes("Other");
  const focusIsOther = focus === "Other";
  const treatmentHasOther = treatments.includes("Other");

  const steps = [
    "Name",
    "Age Bracket",
    "Country",
    "Ethnicity",
    "Primary Aesthetic Focus",
    "Prior Treatments",
  ] as const;

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 0: // Name
        return Boolean(firstName.trim()) && Boolean(lastName.trim());
      case 1: // Age Bracket
        return Boolean(age);
      case 2: // Country
        return Boolean(country?.name && country?.alpha2);
      case 3: // Ethnicity
        return (
          ethnicities.length > 0 &&
          (!ethnicityHasOther || Boolean(ethnicityOther.trim()))
        );
      case 4: // Primary Aesthetic Focus
        return Boolean(focus) && (!focusIsOther || Boolean(focusOther.trim()));
      case 5: // Prior Treatments
        return (
          treatments.length > 0 &&
          (treatments.includes("None")
            ? treatments.length === 1
            : !treatmentHasOther || Boolean(treatmentsOther.trim()))
        );
      default:
        return false;
    }
  }, [
    currentStep,
    firstName,
    lastName,
    age,
    country,
    ethnicities,
    ethnicityHasOther,
    ethnicityOther,
    focus,
    focusIsOther,
    focusOther,
    treatmentHasOther,
    treatmentsOther,
    treatments,
  ]);

  const handleTreatmentChange = (
    option: (typeof TREATMENT_OPTIONS)[number],
  ) => {
    setTreatments((prev) => {
      // If clicking "None", clear all and set only "None"
      if (option === "None") {
        return ["None"];
      }

      // If clicking something else and "None" is already selected, remove "None"
      if (prev.includes("None")) {
        return [option];
      }

      // Toggle the option on/off
      if (prev.includes(option)) {
        return prev.filter((t) => t !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const toggleListValue = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleSubmitIntake = async () => {
    if (!isStepValid) return;

    const intakeInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ageBracket: age as AgeBracket,
      country: country!.alpha3, // Can only submit if country is selected
      ethnicities,
      ethnicityOther: ethnicityOther.trim(),
      focus: focus as AestheticFocus,
      focusOther: focusOther.trim(),
      treatments,
      treatmentsOther: treatmentsOther.trim(),
    };

    await upsert
      .mutateAsync({
        data: intakeInput,
        completed: true,
      })
      .then(() => {
        if (showUploadAfterFinish) {
          setIsUploadPhase(true);
        } else {
          // Use custom redirect path if provided, otherwise default to /analysis
          router.push(redirectAfterIntake || "/analysis");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TwoColumnLayout rightPanelTitle="CREATE ANALYSIS">
      {!isUploadPhase ? (
        <Card className="mx-auto w-full max-w-xl">
          <CardHeader>
            <div className="flex items-end justify-between">
              <CardTitle className="font-['Tobias'] text-2xl font-bold text-gray-900">
                {steps[currentStep]}
              </CardTitle>
              <div className="text-muted-foreground text-sm">
                {currentStep + 1} / {steps.length}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-2 space-y-2">
                <Input
                  id="first-name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  id="last-name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <p className="text-muted-foreground col-span-full text-xs">
                  So we know what to call you! Just an initial for last name is
                  fine.
                </p>
              </div>
            )}

            {/* Age Bracket */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {AGE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm ${
                        age === opt ? "border-gray-900" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="age"
                        className="h-4 w-4"
                        checked={age === opt}
                        onChange={() => setAge(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <p className="text-muted-foreground col-span-full text-xs">
                  Improves age-sensitive benchmarks (ex: skin and hair).
                </p>
              </div>
            )}

            {/* Country */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <CountryDropdown
                    onChange={(country) => setCountry(country)}
                    placeholder="Select a country"
                  />
                </div>
                <p className="text-muted-foreground col-span-full text-xs">
                  Surfaces region-specific tips and schedules reminder pings
                  while you&apos;re awake.
                </p>
              </div>
            )}

            {/* Ethnicity */}
            {currentStep === 3 && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ETHNICITY_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm ${
                        ethnicities.includes(opt)
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={ethnicities.includes(opt)}
                        onChange={() =>
                          setEthnicities((prev) => toggleListValue(prev, opt))
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {ethnicityHasOther && (
                  <Input
                    className="mt-2"
                    placeholder="If Other, please specify"
                    value={ethnicityOther}
                    onChange={(e) => setEthnicityOther(e.target.value)}
                  />
                )}
                <p className="text-muted-foreground text-xs">
                  Improves harmony benchmarks and skin-tone matching.
                </p>
              </div>
            )}

            {/* Primary Aesthetic Focus */}
            {currentStep === 4 && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {AESTHETIC_FOCUS_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm ${
                        focus === opt ? "border-gray-900" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="focus"
                        className="h-4 w-4"
                        checked={focus === opt}
                        onChange={() => setFocus(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {focusIsOther && (
                  <Input
                    className="mt-2"
                    placeholder="If Other, please describe"
                    value={focusOther}
                    onChange={(e) => setFocusOther(e.target.value)}
                  />
                )}
              </div>
            )}

            {/* Prior Treatments */}
            {currentStep === 5 && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TREATMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm ${
                        treatments.includes(opt)
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={treatments.includes(opt)}
                        onChange={() => handleTreatmentChange(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {treatmentHasOther && (
                  <Input
                    className="mt-2"
                    placeholder="If Other, please specify"
                    value={treatmentsOther}
                    onChange={(e) => setTreatmentsOther(e.target.value)}
                  />
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!isStepValid}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitIntake}
                  disabled={!isStepValid || upsert.isPending}
                >
                  {upsert.isPending ? "Saving..." : "Finish"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mx-auto w-full max-w-4xl">
          <UploadFacesClient />
        </div>
      )}
    </TwoColumnLayout>
  );
}

export default UploadIntakeClient;
