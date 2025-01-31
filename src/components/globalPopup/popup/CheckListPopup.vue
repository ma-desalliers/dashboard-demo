# StatusPopup.vue
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
      <div class="text-subtitle1 q-mb-sm">Select Options</div>
      
      <!-- Select All Option -->
      <div class="q-mb-md">
        <q-checkbox
          v-model="selectAll"
          :label="$t('Select All')"
          @update:model-value="handleSelectAll"
          dense
        />
      </div>

      <q-separator class="q-mb-sm" />

      <div class="column">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="option-row q-py-sm"
        >
          <q-checkbox
            v-model="selectedValues"
            :val="option.value"
            :label="option.label"
            @update:model-value="handleChange"
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

const props = withDefaults(defineProps<{
  modelValue?: string[]
  optionValue?: string
  optionLabel?: string
  options: { value: string; label: string }[]
}>(), {
  optionValue: 'uuid',
  optionLabel: 'name',
  modelValue: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', values: string[]): void
  (e: 'change', values: string[]): void
  (e: 'save', values: string[]): void
}>()

const { t } = useI18n()

const triggerRef = ref<HTMLElement>()
const popupRef = ref()
const showPopup = ref(false)
const selectAll = ref(false)

const selectedValues = ref<string[]>(props.modelValue || [])

// Computed property for displaying selected labels
const selectedLabels = computed(() => {
  if (selectedValues.value?.length === 0) return t('none')
  if (selectedValues.value?.length === props.options?.length) return 'All Selected'
  return `${selectedValues.value?.length} selected`
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedValues.value = newValue || []
  updateSelectAllState()
})

// Watch selected values to update selectAll state
watch(selectedValues, () => {
  updateSelectAllState()
})

const updateSelectAllState = () => {
  selectAll.value = selectedValues.value?.length === props.options?.length
}

const handleSelectAll = (value: boolean) => {
  selectedValues.value = value ? props.options.map(opt => opt.value) : []
  handleChange()
}

const handleChange = () => {
  emit('update:modelValue', selectedValues.value)
  emit('change', selectedValues.value)
}

const handleHide = () => {
  emit('save', selectedValues.value)
  showPopup.value = false
}

watch(showPopup, (isOpen) => {
  if (isOpen && triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '300px',
        maxHeight: '500px'
      })
    })
  }
})

onMounted(() => {
  selectedValues.value = props.modelValue || []
  updateSelectAllState()
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