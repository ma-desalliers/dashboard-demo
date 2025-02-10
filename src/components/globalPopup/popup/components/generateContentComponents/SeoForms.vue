<template>
  <div class="">
    <!-- Keywords Section -->
    <CExpansionItem
      v-model="expandedSections.keywords"
      class="c-border-bottom c-border-radius-none"
      title="Keywords (7)"
      :tooltip="{ 
        title: 'Keywords Info',
        description: 'Information about keywords and their usage'
      }"
    >
      <template #header-right>
        <q-btn
          outline
          rounded
          color="green"
          class="ai-button"
          size="sm"
        >
          <q-icon name="autoAwesome" class="q-mr-xs" />
          AI
        </q-btn>
      </template>
      
      <div class="keywords-list ">
        <div v-for="keyword in keywords" :key="keyword" class="q-py-xs">
          {{ keyword }}
        </div>
      </div>
    </CExpansionItem>

    <!-- Terms Section -->
    <CExpansionItem
      v-model="expandedSections.terms"
      title="Terms (0)"
      class="q-mt-sm c-border-bottom c-border-radius-none"
      :tooltip="{ 
        title: 'Terms Info',
        description: 'Information about terms and definitions'
      }"
    >
      <template #header-right>
        <q-btn
          outline
          rounded
          color="green"
          class="ai-button"
          size="sm"
        >
          <q-icon name="magic" class="q-mr-xs" />
          AI
        </q-btn>
      </template>
    </CExpansionItem>

    <!-- FAQ Section -->
    <CExpansionItem
      v-model="expandedSections.faq"
      title="FAQ (0)"
      class="q-mt-md c-border-bottom c-border-radius-none"
      :tooltip="{ 
        title: 'FAQ Info',
        description: 'Information about frequently asked questions'
      }"
    >
      <template #header-right>
        <q-btn
          outline
          rounded
          color="green"
          class="ai-button"
          size="sm"
        >
          <q-icon name="magic" class="q-mr-xs" />
          AI
        </q-btn>
      </template>
    </CExpansionItem>

    <!-- Metrics Section -->
    <div class="row q-col-gutter-md q-mt-lg">
      <div class="col-6">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2">Headings</div>
          <q-icon 
            name="info"
            size="xs"
            color="grey-6"
            class="q-ml-sm"
          >
            <q-tooltip>Information about headings count</q-tooltip>
          </q-icon>
        </div>
        <q-input
          v-model="metrics.headings"
          dense
        />
      </div>
      
      <div class="col-6">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2">Words</div>
          <q-icon 
            name="info"
            size="xs"
            color="grey-6"
            class="q-ml-sm"
          >
            <q-tooltip>Information about word count</q-tooltip>
          </q-icon>
        </div>
        <q-input
          v-model="metrics.words"
          dense
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const expandedSections = reactive({
  keywords: true,
  terms: false,
  faq: false
})

const keywords = ref([
  'top agence web',
  'meilleur web agency',
  'agence meilleurs'
])

const metrics = reactive({
  headings: '1600',
  words: '1600'
})
</script>

<style scoped lang="scss">
.ai-button {
  background-color: #0C9A3E;
  color: white;
  font-size: 12px;
  padding: 0 12px;
  
  &:hover {
   // background-color: darken(#0C9A3E, 5%);
  }
  
  .q-icon {
    font-size: 14px;
  }
}

.keywords-list {
  color: #4A4A4A;
  font-size: 13px;
}

.text-subtitle1 {
  color: #222F3E;
  font-weight: bold;
  font-size: 14px;
}

:deep(.q-icon) {
  opacity: 0.7;
}
</style>