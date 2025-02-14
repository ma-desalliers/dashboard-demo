<template>
  <div class="row items-center q-gutter-x-sm">
    <q-btn
      v-if="showIcons"
      round
      dense
      flat
      icon="remove"
      @click="decrementValue"
      :disable="sliderValue <= 0"
    />
    <div class="col">
    <q-slider
      v-model="sliderValue"
      :min="0"
      :max="100"
      :step="5"
      label
      label-always
      color="primary"
      class="q-mt-md"
      dense
    />
  </div>
    <q-btn
      v-if="showIcons"
      round
      dense
      flat
      icon="add"
      @click="incrementValue"
      :disable="sliderValue >= 100"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number,
  showIcons?: boolean
}>(), {
  modelValue: 0,
  showIcons: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const sliderValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})

const incrementValue = () => {
  if (sliderValue.value < 100) {
    emit('update:modelValue', Math.min(100, sliderValue.value + 5))
  }
}

const decrementValue = () => {
  if (sliderValue.value > 0) {
    emit('update:modelValue', Math.max(0, sliderValue.value - 5))
  }
}
</script>