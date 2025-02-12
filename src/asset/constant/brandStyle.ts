// Types
interface Option {
  label: string;
  value: string;
}

// Personality Options
export const valueOptions: Option[] = [
  { label:'Integrity', value: "integrity" },
  { label:'Excellence', value: "excellence" },
  { label:'Customer-Centric', value: "customer-centric" },
  { label:'Innovation', value: "innovation" },
  { label:'Sustainability', value: "sustainability" },
  { label:'Diversity', value: "diversity" },
  { label:'Collaboration', value: "collaboration" },
  { label:'Accountability', value: "accountability" },
  { label:'Respect', value: "respect" },
  { label:'Creativity', value: "creativity" },
  { label:'Reliability', value: "reliability" },
  { label:'Quality', value: "quality" },
  { label:'Transparency', value: "transparency" },
  { label:'Responsibility', value: "responsibility" },
  { label:'Adaptability', value: "adaptability" },
  { label:'Commitment', value: "commitment" },
  { label:'Empathy', value: "empathy" },
  { label:'Passion', value: "passion" },
  { label:'Loyalty', value: "loyalty" },
  { label:'Consistency', value: "consistency" }
];

export const qualityOptions: Option[] = [
  { label:'Approachable', value: "approachable" },
  { label:'Dynamic', value: "dynamic" },
  { label:'Reliable', value: "reliable" },
  { label:'Versatile', value: "versatile" },
  { label:'Adaptable', value: "adaptable" },
  { label:'Visionary', value: "visionary" },
  { label:'Dedicated', value: "dedicated" },
  { label:'Innovative', value: "innovative" },
  { label:'Proactive', value: "proactive" },
  { label:'Thoughtful', value: "thoughtful" },
  { label:'Friendly', value: "friendly" },
  { label:'Professional', value: "professional" },
  { label:'Authentic', value: "authentic" },
  { label:'Trustworthy', value: "trustworthy" },
  { label:'Bold', value: "bold" },
  { label:'Sophisticated', value: "sophisticated" },
  { label:'Passionate', value: "passionate" },
  { label:'Empathetic', value: "empathetic" },
  { label:'Confident', value: "confident" },
  { label:'Resourceful', value: "resourceful" }
];

export const humannessOptions: Option[] = [
  { label:'Empathetic', value: "empathetic" },
  { label:'Authentic', value: "authentic" },
  { label:'Relatable', value: "relatable" },
  { label:'Warm', value: "warm" },
  { label:'Caring', value: "caring" },
  { label:'Genuine', value: "genuine" },
  { label:'Supportive', value: "supportive" },
  { label:'Inclusive', value: "inclusive" },
  { label:'Kind', value: "kind" },
  { label:'Humble', value: "humble" }
];

export const distinctivenessOptions: Option[] = [
  { label:'Unique', value: "unique" },
  { label:'Memorable', value: "memorable" },
  { label:'Iconic', value: "iconic" },
  { label:'Innovative', value: "innovative" },
  { label:'Creative', value: "creative" },
  { label:'Bold', value: "bold" },
  { label:'Trailblazing', value: "trailblazing" },
  { label:'Exceptional', value: "exceptional" },
  { label:'Standout', value: "standout" },
  { label:'Remarkable', value: "remarkable" }
];

// Style Options
export const detailLevelOptions: Option[] = [
  { label:'High-Level', value: "high-level" },
  { label:'In-Depth', value: "in-depth" },
  { label:'Comprehensive', value: "comprehensive" },
  { label:'Detailed', value: "detailed" },
  { label:'Overview', value: "overview" },
  { label:'Summarized', value: "summarized" },
  { label:'Extensive', value: "extensive" },
  { label:'Elaborate', value: "elaborate" },
  { label:'Focused', value: "focused" },
  { label:'Targeted', value: "targeted" }
];

export const preferredApproachOptions: Option[] = [
  { label:'Comprehensive', value: "comprehensive" },
  { label:'Focused', value: "focused" },
  { label:'Balanced', value: "balanced" }
];

export const contentDepthOptions: Option[] = [
  { label:'Light', value: "light" },
  { label:'Balanced', value: "balanced" },
  { label:'Deep', value: "deep" }
];

export const presentationStyleOptions: Option[] = [
  { label:'Professional', value: "professional" },
  { label:'Casual', value: "casual" },
  { label:'Academic', value: "academic" },
  { label:'Creative', value: "creative" }
];

// Tone of Voice Options
export const clarityOptions: Option[] = [
  { label:'Clear', value: "clear" },
  { label:'Concise', value: "concise" },
  { label:'Direct', value: "direct" },
  { label:'Transparent', value: "transparent" },
  { label:'Unambiguous', value: "unambiguous" },
  { label:'Straightforward', value: "straightforward" },
  { label:'Lucid', value: "lucid" },
  { label:'Coherent', value: "coherent" },
  { label:'Elegant', value: "elegant" },
  { label:'Precise', value: "precise" }
];

export const emotionalToneOptions: Option[] = [
  { label:'Exciting', value: "exciting" },
  { label:'Trustworthy', value: "trustworthy" },
  { label:'Compassionate', value: "compassionate" },
  { label:'Inspiring', value: "inspiring" },
  { label:'Optimistic', value: "optimistic" },
  { label:'Empathetic', value: "empathetic" },
  { label:'Confident', value: "confident" },
  { label:'Calm', value: "calm" },
  { label:'Enthusiastic', value: "enthusiastic" },
  { label:'Serious', value: "serious" },
  { label:'Hopeful', value: "hopeful" },
  { label:'Compelling', value: "compelling" },
  { label:'Motivational', value: "motivational" },
  { label:'Uplifting', value: "uplifting" },
  { label:'Authoritative', value: "authoritative" },
  { label:'Friendly', value: "friendly" },
  { label:'Sincere', value: "sincere" },
  { label:'Passionate', value: "passionate" },
  { label:'Engaging', value: "engaging" },
  { label:'Reassuring', value: "reassuring" }
];

export const humorOptions: Option[] = [
  { label:'Humorous', value: "humorous" },
  { label:'Serious', value: "serious" },
  { label:'Neutral', value: "neutral" },
  { label:'Playful', value: "playful" },
  { label:'Witty', value: "witty" },
  { label:'Dry', value: "dry" },
  { label:'Sarcastic', value: "sarcastic" },
  { label:'Light-hearted', value: "light-hearted" },
  { label:'Self-deprecating', value: "self-deprecating" },
  { label:'Subtle', value: "subtle" }
];

export const formalityOptions: Option[] = [
  { label:'Formal', value: "formal" },
  { label:'Semi-formal', value: "semi-formal" },
  { label:'Informal', value: "informal" },
  { label:'Professional', value: "professional" },
  { label:'Casual', value: "casual" },
  { label:'Business Casual', value: "business casual" },
  { label:'Technical', value: "technical" },
  { label:'Conversational', value: "conversational" },
  { label:'Polite', value: "polite" },
  { label:'Friendly', value: "friendly" }
];

export const voiceOptions: Option[] = [
  { label:'Active', value: "active" },
  { label:'Passive', value: "passive" }
];

export const toneOptions: Option[] = [
  { label:'Professional', value: "professional" },
  { label:'Friendly', value: "friendly" },
  { label:'Casual', value: "casual" },
  { label:'Formal', value: "formal" }
];

// Situational Tone Options
export const technicalContentToneOptions: Option[] = [
  { label:'Formal', value: "formal" },
  { label:'Professional', value: "professional" },
  { label:'Technical', value: "technical" }
];

export const socialMediaToneOptions: Option[] = [
  { label:'Casual', value: "casual" },
  { label:'Friendly', value: "friendly" },
  { label:'Engaging', value: "engaging" }
];

export const customerSupportToneOptions: Option[] = [
  { label:'Helpful', value: "helpful" },
  { label:'Professional', value: "professional" },
  { label:'Friendly', value: "friendly" }
];

export const marketingToneOptions: Option[] = [
  { label:'Engaging', value: "engaging" },
  { label:'Persuasive', value: "persuasive" },
  { label:'Dynamic', value: "dynamic" }
];

// Rules Options
export const binaryOptions: Option[] = [
  { label:'Use', value: "use" },
  { label:'Avoid', value: "avoid" }
];

export const contractionExceptionOptions: Option[] = [
  { label:'Formal Documentation', value: "formal documentation" },
  { label:'Legal Content', value: "legal content" }
];

export const jargonUsageOptions: Option[] = [
  { label:'Minimal', value: "minimal" },
  { label:'Moderate', value: "moderate" },
  { label:'Liberal', value: "liberal" }
];

export const usageLevelOptions: Option[] = [
  { label:'Use Sparingly', value: "use sparingly" },
  { label:'Avoid', value: "avoid" }
];

export const capitalizationOptions: Option[] = [
  { label:'Always Capitalize', value: "always capitalize" },
  { label:'Selective Capitalization', value: "selective" }
];

export const titleStyleOptions: Option[] = [
  { label:'Title Case', value: "title case" },
  { label:'Sentence Case', value: "sentence case" }
];

export const acronymUsageOptions: Option[] = [
  { label:'Spell Out First', value: "spell out with acronym in parentheses" },
  { label:'Acronym Only', value: "acronym only" }
];

export const sentenceLengthOptions: Option[] = [
  { label:'Short', value: "short" },
  { label:'Medium', value: "medium" },
  { label:'Long', value: "long" }
];

export const maxWordsOptions: Option[] = [
  { label:'25 words', value: "25" },
  { label:'30 words', value: "30" },
  { label:'35 words', value: "35" }
];

export const paragraphLengthOptions: Option[] = [
  { label:'2-3 sentences', value: "2-3 sentences" },
  { label:'3-4 sentences', value: "3-4 sentences" },
  { label:'4-5 sentences', value: "4-5 sentences" }
];

export const headingFrequencyOptions: Option[] = [
  { label:'Every 300 words', value: "every 300 words minimum" },
  { label:'Every 500 words', value: "every 500 words minimum" }
];

export const listStyleOptions: Option[] = [
  { label:'Bullet Points', value: "bullet points for unordered" },
  { label:'Numbered Lists', value: "numbers for sequential" }
];

export const listLengthOptions: Option[] = [
  { label:'3-7 items', value: "3-7 items optimal" },
  { label:'5-9 items', value: "5-9 items optimal" }
];
