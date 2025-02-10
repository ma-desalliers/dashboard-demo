<template>
  <div class="content-sliders q-mb-lg">
    <div v-for="slider in sliders" :key="slider.id" class="q-mb-lg">
      <div class="row items-center justify-between">
        <div class="row items-center q-mr-sm" style="width: 140px">
          <div class="text-subtitle2 q-mr-sm">{{ $t(slider.id) }}</div>
          <q-icon name="help" size="xs" color="grey-6">
            <q-tooltip>{{ $t(slider.tooltip) }}</q-tooltip>
          </q-icon>
        </div>
        <div class="col row items-center">
          <q-slider 
            :model-value="slider.value"
            :min="0" 
            :max="slider.max" 
            :step="1" 
            color="green"
            class="col"
            @update:model-value="(value: number | null) => updateSliderValue(slider.id, value)"
          />
          <div class="q-ml-sm" style="width: 30px; text-align: right">
            {{ slider.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ContentSlider {
  id: string
  label: string
  value: number | null
  max: number
  tooltip: string
}

const props = defineProps<{
  modelValue: ContentSlider[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ContentSlider[]): void
}>()

const sliders = computed(() => props.modelValue)

const updateSliderValue = (sliderId: string, newValue: number | null) => {
  const updatedSliders = props.modelValue.map(slider => 
    slider.id === sliderId ? { ...slider, value: newValue } : slider
  )
  emit('update:modelValue', updatedSliders)
}
</script>

<style scoped>
.content-sliders {
  width: 100%;
}
</style>