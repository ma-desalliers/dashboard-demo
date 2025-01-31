<template>
  <div class="personality-table">
    <c-table
      :columns="personalityColumns"
      :rows="personalityRows"
      :pagination="{ rowsPerPage: 0 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PersonalityData {
  values: string[];
  qualities: string[];
  humanness: string[];
  distinctiveness: string[];
  style: {
    detail_level: string[];
    preferred_approach: string;
    content_depth: string;
    presentation_style: string;
  };
}

const data: PersonalityData = {
  values: ["integrity", "excellence", "customer-centric", "innovation", "sustainability", "diversity", "collaboration", "accountability", "respect", "creativity", "reliability", "quality", "transparency", "responsibility", "adaptability", "commitment", "empathy", "passion", "loyalty", "consistency"],
  qualities: ["approachable", "dynamic", "reliable", "versatile", "adaptable", "visionary", "dedicated", "innovative", "proactive", "thoughtful", "friendly", "professional", "authentic", "trustworthy", "bold", "sophisticated", "passionate", "empathetic", "confident", "resourceful"],
  humanness: ["empathetic", "authentic", "relatable", "warm", "caring", "genuine", "supportive", "inclusive", "kind", "humble"],
  distinctiveness: ["unique", "memorable", "iconic", "innovative", "creative", "bold", "trailblazing", "exceptional", "standout", "remarkable"],
  style: {
    detail_level: ["high-level", "in-depth", "comprehensive", "detailed", "overview", "summarized", "extensive", "elaborate", "focused", "targeted"],
    preferred_approach: "comprehensive",
    content_depth: "balanced",
    presentation_style: "professional"
  }
}

const personalityColumns = [
  {
    name: 'parameter',
    label: 'Parameter',
    field: 'parameter',
    align: 'left' as const,
    style: 'font-weight: 600'
  },
  {
    name: 'values',
    label: 'Values',
    field: 'values',
    align: 'left' as const,
  }
]

const personalityRows = computed(() => {
  return [
    {
      parameter: 'Values',
      values: data.values.join(', ')
    },
    {
      parameter: 'Qualities',
      values: data.qualities.join(', ')
    },
    {
      parameter: 'Humanness',
      values: data.humanness.join(', ')
    },
    {
      parameter: 'Distinctiveness',
      values: data.distinctiveness.join(', ')
    },
    {
      parameter: 'Style - Detail Level',
      values: data.style.detail_level.join(', ')
    },
    {
      parameter: 'Style - Preferred Approach',
      values: data.style.preferred_approach
    },
    {
      parameter: 'Style - Content Depth',
      values: data.style.content_depth
    },
    {
      parameter: 'Style - Presentation',
      values: data.style.presentation_style
    }
  ]
})
</script>

<style scoped>
.personality-table {
  width: 100%;
}
</style>