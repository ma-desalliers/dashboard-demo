import { z } from 'zod';

export type CompanyList = Company & {
  style: CompanyStylePreferences;
}

export interface Company {
  uuid: string;
  name: string;
  subIndustry?: string;
  revenue?: string;
  yearFounded?: number;
  createdTs: number;
}

export interface CompanyStylePreferences {
  clientUuid: string;
  primaryColor?: string;
  favicon?: string;
  createdAt: number;
}

const allowedValues = [
  "integrity", "excellence", "customer-centric", "innovation", "sustainability",
  "diversity", "collaboration", "accountability", "respect", "creativity",
  "reliability", "quality", "transparency", "responsibility", "adaptability",
  "commitment", "empathy", "passion", "loyalty", "consistency"
];

const allowedHumanness = [
  "empathetic", "authentic", "relatable", "warm", "caring",
  "genuine", "supportive", "inclusive", "kind", "humble"
];

const allowedClarity = [
  "clear", "concise", "direct", "transparent", "unambiguous",
  "straightforward", "lucid", "coherent", "elegant", "precise"
];

const allowedEmotionalTone = [
  "exciting", "trustworthy", "compassionate", "inspiring", "optimistic",
  "empathetic", "confident", "calm", "enthusiastic", "serious",
  "hopeful", "compelling", "motivational", "uplifting", "authoritative",
  "friendly", "sincere", "passionate", "engaging", "reassuring"
];

export const brandGuideSchema = z.object({
  values: z.array(z.enum(allowedValues as [string, ...string[]])).max(2, "You can select up to 2 values only."),
  humanness: z.array(z.enum(allowedHumanness as [string, ...string[]])).max(2, "You can select up to 2 humanness traits."),
  clarity: z.array(z.enum(allowedClarity as [string, ...string[]])).max(2, "You can select up to 2 clarity options."),
  emotional_tone: z.array(z.enum(allowedEmotionalTone as [string, ...string[]])).max(2, "You can select up to 2 emotional tones."),
  voice: z.enum(["active", "passive"], { required_error: "Voice is required." }),
  capitalization: z.enum(["title case", "sentence case", "all caps", "lowercase"], { required_error: "Capitalization is required." }),
});

export type BrandGuide = z.infer<typeof brandGuideSchema>;
