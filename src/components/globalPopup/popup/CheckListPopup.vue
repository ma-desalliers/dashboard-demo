<template>
  <div class="status-trigger cursor-pointer" ref="triggerRef" @click="showPopup = true">
    <slot></slot>
  </div>

  <PopupContainer
    v-model="showPopup"
    ref="popupRef"
    @hide="handleHide"
  >
    <div class="badge-selector q-pa-md">
    <div class="row justify-between">
      <div class="text-subtitle1 q-mb-sm">Select Options</div>
      <div v-if="props.max" 
          class="text-caption q-mb-sm">
       {{ max }} {{$t('items can be selected')}}
      </div>
    </div>
      <!-- Select All Option - Hidden when max is set -->
      <div v-if="!props.max" class="q-mb-md">
        <q-checkbox
          v-model="selectAll"
          :label="$t('Select All')"
          @update:model-value="handleSelectAll"
          dense
        />
      </div>

      <q-separator class="q-mb-sm" />

      <!-- Selection limit warning -->
     

      <div class="column">
        <div 
          v-for="option in options" 
          :key="getOptionValue(option)"
          class="option-row q-py-sm"
        >
          <q-checkbox
            v-model="selectedValues"
            :val="getOptionValue(option)"
            :label="option[optionLabel]"
            @update:model-value="handleChange"
            :disable="isOptionDisabled(option)"
            dense
          />
        </div>
      </div>
    </div>
  </PopupContainer>
</template>


<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import PopupContainer from '../PopupContainer.vue'
import { useI18n } from 'vue-i18n'

interface Option {
  [key: string]: any;
  label: string;
}

const props = withDefaults(defineProps<{
  currentItem: string[] | string
  optionValue?: string
  optionLabel?: string
  options: Option[]
  max?: number
}>(), {
  currentItem: () => [],
  optionValue: 'value',
  optionLabel: 'label'
})


const emit = defineEmits<{
  (e: 'update:modelValue', values: string[]): void
  (e: 'change', values: string[]): void
  (e: 'save', values: string[]): void
}>()

const { t } = useI18n()

const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref()
const showPopup = ref(false)
const selectAll = ref(false)
const selectedValues = ref<string[]>([])

const getOptionValue = (option: Option): string => {
  return option[props.optionValue]
}

// Computed property for displaying selected labels
const selectedLabels = computed(() => {
  if (selectedValues.value.length === 0) return t('none')
  if (selectedValues.value.length === props.options.length) return t('All Selected')
  return t('{count} selected', { count: selectedValues.value.length })
})

const isOptionDisabled = (option: Option): boolean => {
  if (!props.max) return false
  return selectedValues.value.length >= props.max && 
        !selectedValues.value.includes(getOptionValue(option))
}
const updateSelectAllState = () => {
  selectAll.value = selectedValues.value.length === props.options.length
}

const handleSelectAll = (value: boolean) => {
  selectedValues.value = value 
    ? props.options.map(opt => getOptionValue(opt))
    : []
  handleChange()
}

const handleChange = () => {
  // Ensure we don't exceed the maximum selection limit
  if (props.max && selectedValues.value.length > props.max) {
    selectedValues.value = selectedValues.value.slice(0, props.max)
  }
  emit('update:modelValue', selectedValues.value)
  emit('change', selectedValues.value)
}

const handleHide = () => {
  emit('save', selectedValues.value)
  showPopup.value = false
}

onMounted(() => {
  selectedValues.value = [...props.currentItem]
  updateSelectAllState()
})

watch(() => props.currentItem, (newValue) => {
  selectedValues.value = [...(newValue || [])]
  updateSelectAllState()
}, { immediate: true })

// Watch selected values to update selectAll state
watch(selectedValues, () => {
  updateSelectAllState()
})


watch(showPopup, (isOpen) => {
  if (isOpen && triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '250px',
        maxHeight: '500px'
      })
    })
  }
})

</script>

<style scoped lang="scss">
.selected-display {
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  min-width: 120px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}

.option-row {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}

.status-trigger {
  display: inline-block;
}

.badge-selector {
  min-width: 300px;
}
</style>