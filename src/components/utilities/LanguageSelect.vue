<template>
  <div class="">
    <div class="text-caption q-mb-sm">Select Language</div>
    <div v-for="option in languageOptions" :key="option.key" class="q-mb-xs">
      <q-radio
        v-model="modelValue"
        :val="option.key"
        :label="option.label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LanguageOption {
  key: string
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
}>(), {
  defaultValue: 'English'
})


const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const languageOptions: LanguageOption[] = [
  {
    key: 'English',
    label: 'English'
  },
  {
    key: 'Français Canadien',
    label: 'Français canadien'
  }
]

// Computed property to handle v-model
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
})

watchEffect(() => {
  if (!props.modelValue) {
    emit('update:modelValue', props.defaultValue)
  }
})
</script>