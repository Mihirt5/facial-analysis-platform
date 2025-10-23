"use client";

import { countries } from "country-data-list";
import { Globe, Loader2, LogOut, Palette, Save, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CountryDropdown } from "~/app/create-analysis/_components/intake/country-dropdown";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";
import type {
  AestheticFocus,
  AgeBracket,
  Country,
  Ethnicity,
  Treatment,
} from "~/types/intake";
import { useRouter } from "next/navigation";
import {
  AESTHETIC_FOCUS_OPTIONS,
  AGE_OPTIONS,
  ETHNICITY_OPTIONS,
  TREATMENT_OPTIONS,
} from "~/types/intake";

export default function AnalysisSettingsPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageBracket, setAgeBracket] = useState<AgeBracket | "">("");
  const [country, setCountry] = useState<Country | null>(null);
  const [ethnicities, setEthnicities] = useState<Ethnicity[]>([]);
  const [ethnicityOther, setEthnicityOther] = useState("");
  const [focus, setFocus] = useState<AestheticFocus | "">("");
  const [focusOther, setFocusOther] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentsOther, setTreatmentsOther] = useState("");

  const utils = api.useUtils();

  const { data: existingIntake, isLoading: isLoadingIntake } =
    api.intake.getMine.useQuery();

  const upsertMutation = api.intake.upsert.useMutation({
    onSuccess: () => {
      toast.success("Intake settings updated successfully!");
      void utils.intake.getMine.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update intake settings: " + error.message);
    },
  });

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!existingIntake) return true; // If no existing data, consider it unsaved

    // Compare current form state with existing data
    const currentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ageBracket,
      country: country?.alpha3 ?? null,
      ethnicities,
      ethnicityOther,
      focus,
      focusOther,
      treatments,
      treatmentsOther,
    };

    const existingData = {
      firstName: existingIntake.firstName?.trim() ?? "",
      lastName: existingIntake.lastName?.trim() ?? "",
      ageBracket: existingIntake.ageBracket ?? "",
      country: existingIntake.country ?? null,
      ethnicities: (existingIntake.ethnicities ?? []) as Ethnicity[],
      ethnicityOther: existingIntake.ethnicityOther ?? "",
      focus: existingIntake.focus ?? "",
      focusOther: existingIntake.focusOther ?? "",
      treatments: (existingIntake.treatments ?? []) as Treatment[],
      treatmentsOther: existingIntake.treatmentsOther ?? "",
    };

    return JSON.stringify(currentData) !== JSON.stringify(existingData);
  };

  // Load existing data
  useEffect(() => {
    if (existingIntake) {
      setFirstName(existingIntake.firstName ?? "");
      setLastName(existingIntake.lastName ?? "");
      setAgeBracket(existingIntake.ageBracket as AgeBracket);
      setEthnicities((existingIntake.ethnicities ?? []) as Ethnicity[]);
      setEthnicityOther(existingIntake.ethnicityOther ?? "");
      setFocus(existingIntake.focus as AestheticFocus);
      setFocusOther(existingIntake.focusOther ?? "");
      setTreatments((existingIntake.treatments ?? []) as Treatment[]);
      setTreatmentsOther(existingIntake.treatmentsOther ?? "");

      // Set country based on stored country code
      if (existingIntake.country) {
        // Find the country object from the country code
        const countryData = countries as { all?: unknown };
        const allCountries = Array.isArray(countryData.all)
          ? countryData.all
          : [];
        const countryObj = allCountries.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            c && typeof c === "object" && c.alpha3 === existingIntake.country,
        ) as Country | undefined;

        if (countryObj) {
          setCountry(countryObj);
        }
      }
    }
  }, [existingIntake]);

  const handleEthnicityChange = (ethnicity: Ethnicity, checked: boolean) => {
    if (checked) {
      setEthnicities((prev) => [...prev, ethnicity]);
    } else {
      setEthnicities((prev) => prev.filter((e) => e !== ethnicity));
      if (ethnicity === "Other") {
        setEthnicityOther("");
      }
    }
  };

  const handleTreatmentChange = (treatment: Treatment, checked: boolean) => {
    if (treatment === "None") {
      if (checked) {
        setTreatments(["None"]);
        setTreatmentsOther("");
      } else {
        setTreatments([]);
      }
    } else {
      if (checked) {
        setTreatments((prev) =>
          prev.filter((t) => t !== "None").concat(treatment),
        );
      } else {
        setTreatments((prev) => prev.filter((t) => t !== treatment));
        if (treatment === "Other") {
          setTreatmentsOther("");
        }
      }
    }
  };

  const handleSubmit = () => {
    // Check each required field individually for better error messages
    if (!firstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name");
      return;
    }
    if (!ageBracket) {
      toast.error("Please select your age bracket");
      return;
    }
    if (!country) {
      toast.error("Please select your country");
      return;
    }
    if (ethnicities.length === 0) {
      toast.error("Please select at least one ethnicity");
      return;
    }
    if (!focus) {
      toast.error("Please select your primary aesthetic focus");
      return;
    }
    if (treatments.length === 0) {
      toast.error("Please select at least one treatment option");
      return;
    }

    // Validate "Other" fields
    if (ethnicities.includes("Other") && !ethnicityOther.trim()) {
      toast.error("Please specify other ethnicity");
      return;
    }
    if (focus === "Other" && !focusOther.trim()) {
      toast.error("Please specify other aesthetic focus");
      return;
    }
    if (treatments.includes("Other") && !treatmentsOther.trim()) {
      toast.error("Please specify other treatments");
      return;
    }

    upsertMutation.mutate({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ageBracket,
        country: country.alpha3,
        ethnicities,
        ethnicityOther,
        focus,
        focusOther,
        treatments,
        treatmentsOther,
      },
      completed: true,
    });
  };

  const [manageLoading, setManageLoading] = useState(false);

  const handleManageSubscription = async () => {
    setManageLoading(true);
    try {
      toast.loading("Redirecting to subscription management...");

      const response = await fetch("/api/auth/subscription/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          returnUrl: window.location.origin + "/analysis/settings",
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `HTTP ${response.status}: ${text || response.statusText}`,
        );
      }

      const result = (await response.json()) as {
        url?: string;
        redirect?: boolean;
      };
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to create customer portal session:", error);
      toast.error("Failed to open customer portal. Please try again.");
    } finally {
      setManageLoading(false);
    }
  };

  if (isLoadingIntake) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Logout */}
      <div className="flex w-full items-center justify-between rounded-md border bg-white p-4">
        <div className="flex items-start space-x-3">
          <LogOut className="mt-1 h-5 w-5 text-gray-600" />
          <div>
            <p className="font-medium">Log Out</p>
            <p className="text-sm text-gray-500">
              Sign out of your current session
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await authClient.signOut().then(() => {
              void utils.intake.getMine.invalidate();
              router.push("/auth");
            });
          }}
        >
          Log Out
        </Button>
      </div>

      {/* <div className="flex w-full items-center justify-between rounded-md border bg-white p-4">
        <div className="flex items-start space-x-3">
          <LogOut className="mt-1 h-5 w-5 text-gray-600" />
          <div>
            <p className="font-medium">Manage your subscription</p>
            <p className="text-sm text-gray-500">
              Cancel / Renew your subscription and edit billing information
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleManageSubscription}
          disabled={manageLoading}
        >
          {manageLoading ? "Redirecting..." : "Manage"}
        </Button>
      </div> */}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Intake Settings</h1>
            {hasUnsavedChanges() && (
              <span
                className="flex h-2 w-2 rounded-full bg-orange-500"
                title="Unsaved changes"
              />
            )}
          </div>
          <p className="text-muted-foreground">
            Manage your personal information and preferences for analysis
            {hasUnsavedChanges() && (
              <span className="ml-2 text-orange-600">• Unsaved changes</span>
            )}
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={upsertMutation.isPending}
          className={`min-w-[120px] ${!hasUnsavedChanges() && "hidden"}`}
          variant={hasUnsavedChanges() ? "default" : "outline"}
        >
          {upsertMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {hasUnsavedChanges() ? "Save Changes" : "No Changes"}
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Age Bracket</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {AGE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors ${
                      ageBracket === option
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ageBracket"
                      className="h-4 w-4"
                      checked={ageBracket === option}
                      onChange={() => setAgeBracket(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <CountryDropdown
                onChange={(country) => setCountry(country)}
                defaultValue={existingIntake?.country}
                placeholder="Select your country"
              />
              <p className="text-muted-foreground text-xs">
                Used for region-specific recommendations and scheduling
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ethnicity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Ethnicity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {ETHNICITY_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ethnicity-${option}`}
                    checked={ethnicities.includes(option)}
                    onCheckedChange={(checked: boolean) =>
                      handleEthnicityChange(option, checked)
                    }
                  />
                  <Label
                    htmlFor={`ethnicity-${option}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>

            {ethnicities.includes("Other") && (
              <div className="space-y-2">
                <Label htmlFor="ethnicityOther">Please specify</Label>
                <Input
                  id="ethnicityOther"
                  value={ethnicityOther}
                  onChange={(e) => setEthnicityOther(e.target.value)}
                  placeholder="Enter your ethnicity"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aesthetic Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Primary Aesthetic Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {AESTHETIC_FOCUS_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors ${
                    focus === option
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="focus"
                    className="h-4 w-4"
                    checked={focus === option}
                    onChange={() => setFocus(option)}
                  />
                  {option}
                </label>
              ))}
            </div>

            {focus === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="focusOther">Please specify your focus</Label>
                <Input
                  id="focusOther"
                  value={focusOther}
                  onChange={(e) => setFocusOther(e.target.value)}
                  placeholder="Describe your aesthetic focus"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prior Treatments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Prior Treatments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {TREATMENT_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`treatment-${option}`}
                    checked={treatments.includes(option)}
                    onCheckedChange={(checked: boolean) =>
                      handleTreatmentChange(option, checked)
                    }
                    disabled={option !== "None" && treatments.includes("None")}
                  />
                  <Label
                    htmlFor={`treatment-${option}`}
                    className={`text-sm font-normal ${
                      option !== "None" && treatments.includes("None")
                        ? "text-muted-foreground"
                        : ""
                    }`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>

            {treatments.includes("Other") && (
              <div className="space-y-2">
                <Label htmlFor="treatmentsOther">
                  Please specify treatments
                </Label>
                <Textarea
                  id="treatmentsOther"
                  value={treatmentsOther}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setTreatmentsOther(e.target.value)
                  }
                  placeholder="Describe your prior treatments"
                  rows={3}
                />
              </div>
            )}

            <p className="text-muted-foreground text-xs">
              Select &quot;None&quot; if you haven&apos;t had any treatments, or
              choose all that apply
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
