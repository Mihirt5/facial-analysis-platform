/**
 * The selection options for the user intake form
 *
 * This should serve as a single source of truth for the intake form
 * and the server-side validation of the intake form
 */

export const AGE_OPTIONS = ["<18", "18-24", "25-34", "35-44", "45+"] as const;

export type AgeBracket = (typeof AGE_OPTIONS)[number];

export const ETHNICITY_OPTIONS = [
  "African",
  "East Asian",
  "South Asian",
  "Latino",
  "Middle-Eastern",
  "White",
  "Other",
] as const;

export type Ethnicity = (typeof ETHNICITY_OPTIONS)[number];

export const AESTHETIC_FOCUS_OPTIONS = [
  "Sharper definition",
  "Clearer skin",
  "Balanced symmetry",
  "Overall upgrade",
  "Other",
] as const;

export type AestheticFocus = (typeof AESTHETIC_FOCUS_OPTIONS)[number];

export const TREATMENT_OPTIONS = [
  "None",
  "Braces/orthodontics",
  "Retinoids/Accutane",
  "Chemical peels",
  "Laser",
  "Other",
] as const;

export type Treatment = (typeof TREATMENT_OPTIONS)[number];

// Country interface matching the country-dropdown component
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}
