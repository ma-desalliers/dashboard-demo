<template>
  <div class="row q-pa-md q-col-gutter-md">
    <!-- Left Panel -->
    <div class="col-12 col-md-4">
      <!-- Logos Section -->
      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="text-h6">Logos</div>
            <q-icon name="info" size="xs" class="q-ml-sm">
              <q-tooltip>Brand logo guidelines</q-tooltip>
            </q-icon>
          </div>
          
          <div class="row q-col-gutter-md">
            <!-- Favicon -->
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Favicon</div>
              <q-img
                :src="logoData?.favicon"
                spinner-color="primary"
                style="height: 60px; width: 60px"
              />
            </div>
            
            <!-- Complete Logo -->
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Complete</div>
              <q-img
                :src="logoData?.complete"
                spinner-color="primary"
                style="height: 60px"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Colors Section -->
      <q-card flat bordered class="q-mt-md" >
        <q-card-section >
          <div class="row items-center q-mb-md">
            <div class="text-h6">Colors</div>
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Primary</div>
              <c-color-picker v-model="brandData.brand_guide.design.primary_color"></c-color-picker>
            </div>
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Secondary</div>
              <c-color-picker  v-model="brandData.brand_guide.design.secondary_color"></c-color-picker>
            </div>

          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Right Panel -->
    <div class="col-12 col-md-8" style="height:100vh; overflow:auto">
      <!-- Brand Personality Section -->
      <c-expansion-item
        v-model="personalityExpanded"
        title="Brand Personality"
        class="q-mb-md"
      >

      <div class="personality-table">
        <c-table
          :columns="personalityColumns"
          :rows="personalityRows"
          :pagination="{ rowsPerPage: 0 }"
          />
      </div>

      </c-expansion-item>

      <!-- Tone of Voice Section -->
<c-expansion-item
  v-model="toneExpanded"
  title="Tone of Voice"
  class="q-mb-md"
>
  <div class="tone-table">
    <c-table
      :columns="toneColumns"
      :rows="toneOfVoiceRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>
</c-expansion-item>

<!-- Rules Section with Multiple Tables -->
<c-expansion-item
  v-model="rulesExpanded"
  title="Rules & Guidelines"
  class="q-mb-md"
>
  <!-- Language Rules -->
  <div class="text-subtitle1 q-mb-sm">Language Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="languageRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Punctuation Rules -->
  <div class="text-subtitle1 q-mb-sm">Punctuation Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="punctuationRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Capitalization Rules -->
  <div class="text-subtitle1 q-mb-sm">Capitalization Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="capitalizationRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Sentence Structure Rules -->
  <div class="text-subtitle1 q-mb-sm">Sentence Structure Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="sentenceStructureRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Terminology Rules -->
  <div class="text-subtitle1 q-mb-sm">Terminology Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="terminologyRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Point of View Rules -->
  <div class="text-subtitle1 q-mb-sm">Point of View Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="povRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>

  <!-- Content Structure Rules -->
  <div class="text-subtitle1 q-mb-sm">Content Structure Guidelines</div>
  <div class="rules-table q-mb-md">
    <c-table
      :columns="rulesColumns"
      :rows="contentStructureRulesRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>
</c-expansion-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface LogoData {
  favicon?: string;
  complete?: string;
}


const props = withDefaults(defineProps<{
  brandData?: any;
  logoData?: LogoData;
}>(), {
  brandData: () => ({
    brand_guide: {
      design: {
        'primary-color': '#000000'
      },
      personality: {},
      tone_of_voice: {},
      rules: {}
    }
  })
});

// Expansion states
const personalityExpanded = ref(false);
const toneExpanded = ref(false);
const rulesExpanded = ref(false);

// Table columns definition
const baseColumns = [
  {
    name: 'parameter',
    label: 'Parameter',
    field: 'parameter',
    align: 'left' as const,
    style: '',
  },
  {
    name: 'values',
    label: 'Values',
    field: 'values',
    align: 'left' as const,
    style: '',
    type:'checklist',
    updateFn:(params:any) =>{ console.log(params)}
  }
];

const personalityColumns = computed(() => baseColumns);

const personalityRows = computed(() => {
  return [
    {
      parameter: 'Values',
      values: props.brandData.brand_guide.personality.values.join(', '),
      options: [
        { label: "Integrity", value: "integrity" },
        { label: "Excellence", value: "excellence" },
        { label: "Customer-Centric", value: "customer-centric" },
        { label: "Innovation", value: "innovation" },
        { label: "Sustainability", value: "sustainability" },
        { label: "Diversity", value: "diversity" },
        { label: "Collaboration", value: "collaboration" },
        { label: "Accountability", value: "accountability" },
        { label: "Respect", value: "respect" },
        { label: "Creativity", value: "creativity" },
        { label: "Reliability", value: "reliability" },
        { label: "Quality", value: "quality" },
        { label: "Transparency", value: "transparency" },
        { label: "Responsibility", value: "responsibility" },
        { label: "Adaptability", value: "adaptability" },
        { label: "Commitment", value: "commitment" },
        { label: "Empathy", value: "empathy" },
        { label: "Passion", value: "passion" },
        { label: "Loyalty", value: "loyalty" },
        { label: "Consistency", value: "consistency" }
      ]
    },
    {
      parameter: 'Qualities',
      values: props.brandData.brand_guide.personality.qualities.join(', '),
      options: [
        { label: "Approachable", value: "approachable" },
        { label: "Dynamic", value: "dynamic" },
        { label: "Reliable", value: "reliable" },
        { label: "Versatile", value: "versatile" },
        { label: "Adaptable", value: "adaptable" },
        { label: "Visionary", value: "visionary" },
        { label: "Dedicated", value: "dedicated" },
        { label: "Innovative", value: "innovative" },
        { label: "Proactive", value: "proactive" },
        { label: "Thoughtful", value: "thoughtful" },
        { label: "Friendly", value: "friendly" },
        { label: "Professional", value: "professional" },
        { label: "Authentic", value: "authentic" },
        { label: "Trustworthy", value: "trustworthy" },
        { label: "Bold", value: "bold" },
        { label: "Sophisticated", value: "sophisticated" },
        { label: "Passionate", value: "passionate" },
        { label: "Empathetic", value: "empathetic" },
        { label: "Confident", value: "confident" },
        { label: "Resourceful", value: "resourceful" }
      ]
    },
    {
      parameter: 'Humanness',
      values: props.brandData.brand_guide.personality.humanness.join(', '),
      options: [
        { label: "Empathetic", value: "empathetic" },
        { label: "Authentic", value: "authentic" },
        { label: "Relatable", value: "relatable" },
        { label: "Warm", value: "warm" },
        { label: "Caring", value: "caring" },
        { label: "Genuine", value: "genuine" },
        { label: "Supportive", value: "supportive" },
        { label: "Inclusive", value: "inclusive" },
        { label: "Kind", value: "kind" },
        { label: "Humble", value: "humble" }
      ]
    },
    {
      parameter: 'Distinctiveness',
      values: props.brandData.brand_guide.personality.distinctiveness.join(', '),
      options: [
        { label: "Unique", value: "unique" },
        { label: "Memorable", value: "memorable" },
        { label: "Iconic", value: "iconic" },
        { label: "Innovative", value: "innovative" },
        { label: "Creative", value: "creative" },
        { label: "Bold", value: "bold" },
        { label: "Trailblazing", value: "trailblazing" },
        { label: "Exceptional", value: "exceptional" },
        { label: "Standout", value: "standout" },
        { label: "Remarkable", value: "remarkable" }
      ]
    },
    {
      parameter: 'Style - Detail Level',
      values: props.brandData.brand_guide.personality.style.detail_level.join(', '),
      options: [
        { label: "High-Level", value: "high-level" },
        { label: "In-Depth", value: "in-depth" },
        { label: "Comprehensive", value: "comprehensive" },
        { label: "Detailed", value: "detailed" },
        { label: "Overview", value: "overview" },
        { label: "Summarized", value: "summarized" },
        { label: "Extensive", value: "extensive" },
        { label: "Elaborate", value: "elaborate" },
        { label: "Focused", value: "focused" },
        { label: "Targeted", value: "targeted" }
      ]
    },
    {
      parameter: 'Style - Preferred Approach',
      values: props.brandData.brand_guide.personality.style.preferred_approach,
      options: [
        { label: "Comprehensive", value: "comprehensive" },
        { label: "Focused", value: "focused" },
        { label: "Balanced", value: "balanced" }
      ]
    },
    {
      parameter: 'Style - Content Depth',
      values: props.brandData.brand_guide.personality.style.content_depth,
      options: [
        { label: "Light", value: "light" },
        { label: "Balanced", value: "balanced" },
        { label: "Deep", value: "deep" }
      ]
    },
    {
      parameter: 'Style - Presentation',
      values: props.brandData.brand_guide.personality.style.presentation_style,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Casual", value: "casual" },
        { label: "Academic", value: "academic" },
        { label: "Creative", value: "creative" }
      ]
    }
  ]
})
const toneOfVoiceRows = computed(() => {
  return [
    {
      parameter: 'Clarity',
      values: props.brandData.brand_guide.tone_of_voice.clarity.join(', '),
      options: [
        { label: "Clear", value: "clear" },
        { label: "Concise", value: "concise" },
        { label: "Direct", value: "direct" },
        { label: "Transparent", value: "transparent" },
        { label: "Unambiguous", value: "unambiguous" },
        { label: "Straightforward", value: "straightforward" },
        { label: "Lucid", value: "lucid" },
        { label: "Coherent", value: "coherent" },
        { label: "Elegant", value: "elegant" },
        { label: "Precise", value: "precise" }
      ]
    },
    {
      parameter: 'Emotional Tone',
      values: props.brandData.brand_guide.tone_of_voice.emotional_tone.join(', '),
      options: [
        { label: "Exciting", value: "exciting" },
        { label: "Trustworthy", value: "trustworthy" },
        { label: "Compassionate", value: "compassionate" },
        { label: "Inspiring", value: "inspiring" },
        { label: "Optimistic", value: "optimistic" },
        { label: "Empathetic", value: "empathetic" },
        { label: "Confident", value: "confident" },
        { label: "Calm", value: "calm" },
        { label: "Enthusiastic", value: "enthusiastic" },
        { label: "Serious", value: "serious" },
        { label: "Hopeful", value: "hopeful" },
        { label: "Compelling", value: "compelling" },
        { label: "Motivational", value: "motivational" },
        { label: "Uplifting", value: "uplifting" },
        { label: "Authoritative", value: "authoritative" },
        { label: "Friendly", value: "friendly" },
        { label: "Sincere", value: "sincere" },
        { label: "Passionate", value: "passionate" },
        { label: "Engaging", value: "engaging" },
        { label: "Reassuring", value: "reassuring" }
      ]
    },
    {
      parameter: 'Use of Humor',
      values: props.brandData.brand_guide.tone_of_voice.use_of_humor.join(', '),
      options: [
        { label: "Humorous", value: "humorous" },
        { label: "Serious", value: "serious" },
        { label: "Neutral", value: "neutral" },
        { label: "Playful", value: "playful" },
        { label: "Witty", value: "witty" },
        { label: "Dry", value: "dry" },
        { label: "Sarcastic", value: "sarcastic" },
        { label: "Light-hearted", value: "light-hearted" },
        { label: "Self-deprecating", value: "self-deprecating" },
        { label: "Subtle", value: "subtle" }
      ]
    },
    {
      parameter: 'Formality Level',
      values: props.brandData.brand_guide.tone_of_voice.formality_level.join(', '),
      options: [
        { label: "Formal", value: "formal" },
        { label: "Semi-formal", value: "semi-formal" },
        { label: "Informal", value: "informal" },
        { label: "Professional", value: "professional" },
        { label: "Casual", value: "casual" },
        { label: "Business Casual", value: "business casual" },
        { label: "Technical", value: "technical" },
        { label: "Conversational", value: "conversational" },
        { label: "Polite", value: "polite" },
        { label: "Friendly", value: "friendly" }
      ]
    },
    {
      parameter: 'Voice',
      values: props.brandData.brand_guide.tone_of_voice.voice.join(', '),
      options: [
        { label: "Active", value: "active" },
        { label: "Passive", value: "passive" }
      ]
    },
    {
      parameter: 'Primary Tone',
      values: props.brandData.brand_guide.tone_of_voice.primary_tone,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Casual", value: "casual" },
        { label: "Formal", value: "formal" }
      ]
    },
    {
      parameter: 'Secondary Tone',
      values: props.brandData.brand_guide.tone_of_voice.secondary_tone,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Casual", value: "casual" },
        { label: "Formal", value: "formal" }
      ]
    },
    {
      parameter: 'Technical Content Tone',
      values: props.brandData.brand_guide.tone_of_voice.situational_adjustments.technical_content,
      options: [
        { label: "Formal", value: "formal" },
        { label: "Professional", value: "professional" },
        { label: "Technical", value: "technical" }
      ]
    },
    {
      parameter: 'Social Media Tone',
      values: props.brandData.brand_guide.tone_of_voice.situational_adjustments.social_media,
      options: [
        { label: "Casual", value: "casual" },
        { label: "Friendly", value: "friendly" },
        { label: "Engaging", value: "engaging" }
      ]
    },
    {
      parameter: 'Customer Support Tone',
      values: props.brandData.brand_guide.tone_of_voice.situational_adjustments.customer_support,
      options: [
        { label: "Helpful", value: "helpful" },
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" }
      ]
    },
    {
      parameter: 'Marketing Tone',
      values: props.brandData.brand_guide.tone_of_voice.situational_adjustments.marketing,
      options: [
        { label: "Engaging", value: "engaging" },
        { label: "Persuasive", value: "persuasive" },
        { label: "Dynamic", value: "dynamic" }
      ]
    }
  ]
})

// Language Rules
const languageRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.language;
  return [
    {
      parameter: 'Contractions',
      values: rules.contractions.preference,
      options: [
        { label: "Use", value: "use" },
        { label: "Avoid", value: "avoid" }
      ]
    },
    {
      parameter: 'Contraction Exceptions',
      values: rules.contractions.exceptions.join(', '),
      options: [
        { label: "Formal Documentation", value: "formal documentation" },
        { label: "Legal Content", value: "legal content" }
      ]
    },
    {
      parameter: 'Slang Usage',
      values: rules.slang.preference,
      options: [
        { label: "Use", value: "use" },
        { label: "Avoid", value: "avoid" }
      ]
    },
    {
      parameter: 'Jargon Usage',
      values: rules.jargon_usage.preference,
      options: [
        { label: "Minimal", value: "minimal" },
        { label: "Moderate", value: "moderate" },
        { label: "Liberal", value: "liberal" }
      ]
    }
  ];
});

// Punctuation Rules
const punctuationRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.punctuation;
  return [
    {
      parameter: 'Oxford Comma',
      values: rules.oxford_comma.preference,
      options: [
        { label: "Use", value: "use" },
        { label: "Avoid", value: "avoid" }
      ]
    },
    {
      parameter: 'Ellipsis Usage',
      values: rules.ellipsis_usage.preference,
      options: [
        { label: "Use Sparingly", value: "use sparingly" },
        { label: "Avoid", value: "avoid" }
      ]
    },
    {
      parameter: 'Exclamation Marks',
      values: rules.exclamation_marks.preference,
      options: [
        { label: "Use Sparingly", value: "use sparingly" },
        { label: "Avoid", value: "avoid" }
      ]
    }
  ];
});

// Capitalization Rules
const capitalizationRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.capitalization;
  return [
    {
      parameter: 'Proper Nouns',
      values: rules.proper_nouns.preference,
      options: [
        { label: "Always Capitalize", value: "always capitalize" },
        { label: "Selective Capitalization", value: "selective" }
      ]
    },
    {
      parameter: 'Title Style',
      values: rules.titles.style,
      options: [
        { label: "Title Case", value: "title case" },
        { label: "Sentence Case", value: "sentence case" }
      ]
    },
    {
      parameter: 'Acronym Usage',
      values: rules.acronyms.first_usage,
      options: [
        { label: "Spell Out First", value: "spell out with acronym in parentheses" },
        { label: "Acronym Only", value: "acronym only" }
      ]
    }
  ];
});

// Sentence Structure Rules
const sentenceStructureRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.sentence_structure;
  return [
    {
      parameter: 'Preferred Length',
      values: rules.preferred_lengths.optimal,
      options: [
        { label: "Short", value: "short" },
        { label: "Medium", value: "medium" },
        { label: "Long", value: "long" }
      ]
    },
    {
      parameter: 'Maximum Words',
      values: rules.preferred_lengths.maximum_words.toString(),
      options: [
        { label: "25 words", value: "25" },
        { label: "30 words", value: "30" },
        { label: "35 words", value: "35" }
      ]
    },
    {
      parameter: 'Paragraph Length',
      values: rules.paragraph_length.optimal,
      options: [
        { label: "2-3 sentences", value: "2-3 sentences" },
        { label: "3-4 sentences", value: "3-4 sentences" },
        { label: "4-5 sentences", value: "4-5 sentences" }
      ]
    }
  ];
});

// Terminology Rules
const terminologyRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.terminology;
  return [
    {
      parameter: 'Preferred Terms',
      values: rules.preferred_terms.join(', '),
      options: rules.preferred_terms.map(term => ({ 
        label: term, 
        value: term 
      }))
    },
    {
      parameter: 'Prohibited Terms',
      values: rules.prohibited_terms.join(', '),
      options: rules.prohibited_terms.map(term => ({ 
        label: term, 
        value: term 
      }))
    },
    {
      parameter: 'Industry Jargon',
      values: rules.industry_jargon.join(', '),
      options: rules.industry_jargon.map(term => ({ 
        label: term, 
        value: term 
      }))
    }
  ];
});

// Point of View Rules
const povRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.point_of_view;
  return [
    {
      parameter: 'Primary Perspective',
      values: rules.primary_preference,
      options: rules.perspectives.map(perspective => ({
        label: perspective,
        value: perspective
      }))
    },
    {
      parameter: 'Secondary Perspective',
      values: rules.secondary_preference,
      options: rules.perspectives.map(perspective => ({
        label: perspective,
        value: perspective
      }))
    }
  ];
});

// Content Structure Rules
const contentStructureRulesRows = computed(() => {
  const rules = props.brandData.brand_guide.rules.content_structure;
  return [
    {
      parameter: 'Heading Frequency',
      values: rules.headings.frequency,
      options: [
        { label: "Every 300 words", value: "every 300 words minimum" },
        { label: "Every 500 words", value: "every 500 words minimum" }
      ]
    },
    {
      parameter: 'List Style',
      values: rules.lists.style,
      options: [
        { label: "Bullet Points", value: "bullet points for unordered" },
        { label: "Numbered Lists", value: "numbers for sequential" }
      ]
    },
    {
      parameter: 'List Length',
      values: rules.lists.length,
      options: [
        { label: "3-7 items", value: "3-7 items optimal" },
        { label: "5-9 items", value: "5-9 items optimal" }
      ]
    }
  ];
});
const toneColumns = computed(() => baseColumns);
const rulesColumns = computed(() => baseColumns);

const rulesRows = computed(() => {
  const flatRules: { parameter: string; values: string }[] = [];
  
  Object.entries(props.brandData.brand_guide.rules).forEach(([category, rules]) => {
    Object.entries(rules).forEach(([rule, values]) => {
      flatRules.push({
        parameter: `${formatLabel(category)} - ${formatLabel(rule)}`,
        values: Array.isArray(values) ? values.join(', ') : ''
      });
    });
  });
  
  return flatRules;
});

const formatLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>

<style scoped>
.color-box {
  height: 60px;
  width: 60px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>