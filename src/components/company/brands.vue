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
              <q-img :src="logoData?.favicon" spinner-color="primary" style="height: 60px; width: 60px" />
            </div>

            <!-- Complete Logo -->
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Complete</div>
              <q-img :src="logoData?.complete" spinner-color="primary" style="height: 60px" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Colors Section -->
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="text-h6">Colors</div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Primary</div>
              <!--<c-color-picker v-model="brandData.design.primary_color"></c-color-picker>-->
            </div>
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">Secondary</div>
              <!--<c-color-picker v-model="brandData.design.secondary_color"></c-color-picker>-->
            </div>

          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Right Panel -->
    <div class="col-12 col-md-8" style="height:100vh; overflow:auto">
      <!-- Brand Personality Section -->
      <c-expansion-item v-model="personalityExpanded" title="Brand Personality" class="q-mb-md">

        <div class="personality-table">
          <c-table :columns="personalityColumns" :rows="personalityRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

      </c-expansion-item>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCompanyStore } from '~/src/stores/companyStore';
import {
  valueOptions,
  qualityOptions,
  humannessOptions,
  distinctivenessOptions,
  detailLevelOptions,
  preferredApproachOptions,
  contentDepthOptions,
  presentationStyleOptions,
  clarityOptions,
  emotionalToneOptions,
  humorOptions,
  formalityOptions,
  voiceOptions,
  toneOptions,
  technicalContentToneOptions,
  socialMediaToneOptions,
  customerSupportToneOptions,
  marketingToneOptions,
  binaryOptions,
  contractionExceptionOptions,
  jargonUsageOptions,
  usageLevelOptions,
  capitalizationOptions,
  titleStyleOptions,
  acronymUsageOptions,
  sentenceLengthOptions,
  maxWordsOptions,
  paragraphLengthOptions,
  headingFrequencyOptions,
  listStyleOptions,
  listLengthOptions
} from '@/src/asset/constant/brandStyle';



interface LogoData {
  favicon?: string;
  complete?: string;
}


const props = withDefaults(defineProps<{
  logoData?: LogoData;
}>(), {
});

const emit = defineEmits(['update:brandData'])

const companyStore = useCompanyStore()
const brandData = computed({get:()=>{
  return companyStore.brandGuide
}, 
set:(value)=>{
  //companyStore.saveBrandGuide(theCompany.value.uuid, value)
  companyStore.setBrandGuide(value)
  console.log(value)

}})  

const theCompany = computed(()=>companyStore.theCompany)

// Expansion states
const personalityExpanded = ref(false);
const toneExpanded = ref(false);
const rulesExpanded = ref(false);

const {t} = useI18n()

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
    type: 'checklist',

    updateFn: (params: any) => { console.log(params) }
  }
];

const personalityColumns = computed(() => [
  {
    name: 'parameter',
    label: 'Parameter',
    field: 'parameter',
    align: 'left' as const,
    style: '',
  },
  {
    name: 'values',
    label: 'values',
    field: 'labels',
    align: 'left' as const,
    style: '',
    type: 'checklist',
    max:2,
    updateFn: (params: any) => { updatePersonality(params) }
  }
]);

const personalityRows = computed(() => {
  return [
    {
      parameter: 'Values',
      labels:brandData.value?.values.length ? brandData.value?.values.join(', ') : t('unselected') ,
      items: brandData.value?.values,
      options: valueOptions.map(option => ({
          ...option,
          label: t(option.label)
      })),
      max:2,
      updateFn: updatePersonality
    },
    {
      parameter: 'Emotional Tone',
      labels:brandData.value?.emotional_tone?.length ? brandData.value?.emotional_tone.join(', ') : t('unselected') ,
      items: brandData.value?.emotional_tone,
      options: qualityOptions.map(option => ({
        ...option,
        label: t(option.label)
      })),
      updateFn:  updateEmotionalTone
    },
    {
      parameter: 'Humanness',
      values: brandData.value?.humanness,
      options: humannessOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Distinctiveness',
      values: brandData.value?.distinctiveness,
      options: distinctivenessOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    /*{
      parameter: 'Style - Detail Level',
      values: brandData.value?.style.detail_level,
      options: detailLevelOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Style - Preferred Approach',
      values: brandData.value?.style.preferred_approach,
      options: preferredApproachOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Style - Content Depth',
      values: brandData.value?.style.content_depth,
      options: contentDepthOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Style - Presentation',
      values: brandData.value?.style.presentation_style,
      options: presentationStyleOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }*/
  ]
})
const toneOfVoiceRows = computed(() => {
 /* return [
    {
      parameter: 'Clarity',
      values: brandData.value.tone_of_voice.clarity.join(', '),
      options: clarityOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Emotional Tone',
      values: brandData.value.tone_of_voice.emotional_tone.join(', '),
      options: emotionalToneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Use of Humor',
      values: brandData.value.tone_of_voice.use_of_humor.join(', '),
      options: humorOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Formality Level',
      values: brandData.value.tone_of_voice.formality_level.join(', '),
      options: formalityOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Voice',
      values: brandData.value.tone_of_voice.voice.join(', '),
      options: voiceOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Primary Tone',
      values: brandData.value.tone_of_voice.primary_tone,
      options: toneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Secondary Tone',
      values: brandData.value.tone_of_voice.secondary_tone,
      options: toneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Technical Content Tone',
      values: brandData.value.tone_of_voice.situational_adjustments.technical_content,
      options: technicalContentToneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Social Media Tone',
      values: brandData.value.tone_of_voice.situational_adjustments.social_media,
      options: socialMediaToneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Customer Support Tone',
      values: brandData.value.tone_of_voice.situational_adjustments.customer_support,
      options: customerSupportToneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Marketing Tone',
      values: brandData.value.tone_of_voice.situational_adjustments.marketing,
      options: marketingToneOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ]*/
})

// Language Rules
const languageRulesRows = computed(() => {
 /* const rules = brandData.value.rules.language;
  return [
    {
      parameter: 'Contractions',
      values: rules.contractions.preference,
      options: binaryOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Contraction Exceptions',
      values: rules.contractions.exceptions.join(', '),
      options: contractionExceptionOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Slang Usage',
      values: rules.slang.preference,
      options: binaryOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Jargon Usage',
      values: rules.jargon_usage.preference,
      options: jargonUsageOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ];*/
});

// Punctuation Rules
const punctuationRulesRows = computed(() => {
 /* const rules = brandData.value.rules.punctuation;
  return [
    {
      parameter: 'Oxford Comma',
      values: rules.oxford_comma.preference,
      options: binaryOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Ellipsis Usage',
      values: rules.ellipsis_usage.preference,
      options: usageLevelOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Exclamation Marks',
      values: rules.exclamation_marks.preference,
      options: usageLevelOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ];*/
});

// Capitalization Rules
const capitalizationRulesRows = computed(() => {
 /* const rules = brandData.value.rules.capitalization;
  return [
    {
      parameter: 'Proper Nouns',
      values: rules.proper_nouns.preference,
      options: capitalizationOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Title Style',
      values: rules.titles.style,
      options: titleStyleOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Acronym Usage',
      values: rules.acronyms.first_usage,
      options: acronymUsageOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ];*/
});

// Sentence Structure Rules
const sentenceStructureRulesRows = computed(() => {
  /*const rules = brandData.value.rules.sentence_structure;
  return [
    {
      parameter: 'Preferred Length',
      values: rules.preferred_lengths.optimal,
      options: sentenceLengthOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Maximum Words',
      values: rules.preferred_lengths.maximum_words.toString(),
      options: maxWordsOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'Paragraph Length',
      values: rules.paragraph_length.optimal,
      options: paragraphLengthOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ];*/
});

// Terminology Rules
const terminologyRulesRows = computed(() => {
  /*const rules = brandData.value.rules.terminology;
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
  ];*/
});

// Point of View Rules
const povRulesRows = computed(() => {
/*  const rules = brandData.value.rules.point_of_view;
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
  ];*/
});

// Content Structure Rules
const contentStructureRulesRows = computed(() => {
 /* const rules = brandData.value.rules.content_structure;
  return [
    {
      parameter: 'Heading Frequency',
      values: rules.headings.frequency,
      options: headingFrequencyOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'List Style',
      values: rules.lists.style,
      options: listStyleOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    },
    {
      parameter: 'List Length',
      values: rules.lists.length,
      options: listLengthOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))
    }
  ];*/
});
const toneColumns = computed(() => baseColumns);
const rulesColumns = computed(() => baseColumns);

const rulesRows = computed(() => {
 /* const flatRules: { parameter: string; values: string }[] = [];

  Object.entries(brandData.value.rules).forEach(([category, rules]) => {
    Object.entries(rules).forEach(([rule, values]) => {
      flatRules.push({
        parameter: `${formatLabel(category)} - ${formatLabel(rule)}`,
        values: Array.isArray(values) ? values.join(', ') : ''
      });
    });
  });

  return flatRules;*/
});


const updatePersonality = (options: any) =>{
console.log('update Personality', options)
if(brandData.value)
  brandData.value.values = options.value
companyStore.setBrandGuide(brandData.value)
 // emit('update:brandData', brandData.value)
}

const updateEmotionalTone = (options: any) =>{
console.log('update quality', options)
if(brandData.value)
  brandData.value.emotional_tone = options.value

companyStore.setBrandGuide(brandData.value)
}

const formatLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};




/*

      <!-- Tone of Voice Section -->
      <c-expansion-item v-model="toneExpanded" title="Tone of Voice" class="q-mb-md">
        <div class="tone-table">
          <c-table :columns="toneColumns" :rows="toneOfVoiceRows" :pagination="{ rowsPerPage: 0 }" />
        </div>
      </c-expansion-item>

      <!-- Rules Section with Multiple Tables -->
      <c-expansion-item v-model="rulesExpanded" title="Rules & Guidelines" class="q-mb-md">
        <!-- Language Rules -->
        <div class="text-subtitle1 q-mb-sm">Language Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="languageRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Punctuation Rules -->
        <div class="text-subtitle1 q-mb-sm">Punctuation Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="punctuationRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Capitalization Rules -->
        <div class="text-subtitle1 q-mb-sm">Capitalization Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="capitalizationRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Sentence Structure Rules -->
        <div class="text-subtitle1 q-mb-sm">Sentence Structure Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="sentenceStructureRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Terminology Rules -->
        <div class="text-subtitle1 q-mb-sm">Terminology Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="terminologyRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Point of View Rules -->
        <div class="text-subtitle1 q-mb-sm">Point of View Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="povRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>

        <!-- Content Structure Rules -->
        <div class="text-subtitle1 q-mb-sm">Content Structure Guidelines</div>
        <div class="rules-table q-mb-md">
          <c-table :columns="rulesColumns" :rows="contentStructureRulesRows" :pagination="{ rowsPerPage: 0 }" />
        </div>
      </c-expansion-item>*/

</script>

<style scoped>
.color-box {
  height: 60px;
  width: 60px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

