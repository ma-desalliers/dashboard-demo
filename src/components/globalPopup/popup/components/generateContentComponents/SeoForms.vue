<template>
  <div class="">
    <!-- Terms Section -->
    <CExpansionItem
      v-model="expandedSections.terms"
      :title="`Terms (${formData.terms?.length || 0})`"
      class="c-border-bottom c-border-radius-none"
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
      
      <CondensedList 
        v-model="formData.terms"
        @update:model-value="updateForm({ terms: $event })"
      />
    </CExpansionItem>

    <!-- FAQ Section -->
    <CExpansionItem
      v-model="expandedSections.faq"
      :title="`FAQ (${formData.faq?.length || 0})`"
      class="q-mt-md c-border-bottom c-border-radius-none"
      :tooltip="{ 
        title: 'FAQ Info',
        description: 'Information about frequently asked questions'
      }"
    >
      <template #header-right>
        <AiBtn></AiBtn>
      </template>
      
      <CondensedList 
        v-model="formData.faq"
        @update:model-value="updateForm({ faq: $event })"
      />
    </CExpansionItem>

    <!-- Metrics Section -->
    <div class="row q-col-gutter-md q-mt-lg">
      <div class="col-4">
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
          v-model="formData.headingCount"
          dense
        />
      </div>
      
      <div class="col-4">
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
          v-model="formData.wordCount"
          dense
        />
      </div>

      <div class="col-4">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2">Images</div>
          <q-icon 
            name="info"
            size="xs"
            color="grey-6"
            class="q-ml-sm"
          >
            <q-tooltip>Information about image count</q-tooltip>
          </q-icon>
        </div>
        <q-input
          v-model="formData.imageCount"
          dense
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Metrics {
  headingCount?: string
  wordCount?: string
  imageCount?: string
  terms?: string[]
  faq?: string[]
}

const props = withDefaults(defineProps<{
  modelValue?: Metrics
}>(), {
  modelValue: () => ({
    headingCount: '0',
    wordCount: '0',
    imageCount: '0',
    terms: [],
    faq: []
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Metrics): void
}>()

const expandedSections = reactive({
  terms: true,
  faq: false
})

// Single reactive form data object
const formData = reactive<Metrics>({...props.modelValue})

// Watch for changes in props
watch(() => props.modelValue, (newValue) => {
  Object.assign(formData, newValue)
}, { deep: true })

// Watch for changes in form data
watch(formData, (newValue) => {
  emit('update:modelValue', {...newValue})
}, { deep: true })

// Single update function for form updates
const updateForm = (updates: Partial<Metrics>) => {
  Object.assign(formData, updates)
}
</script>

<style scoped lang="scss">
.ai-button {
  background-color: #0C9A3E;
  color: white;
  font-size: 12px;
  padding: 0 12px;
  
  .q-icon {
    font-size: 14px;
  }
}

:deep(.q-icon) {
  opacity: 0.7;
}
</style>