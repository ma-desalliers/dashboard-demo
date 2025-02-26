<template>
  <div class="coming-soon-tooltip-wrapper">
    <div 
      class="c-tooltip-content"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <slot></slot>
    </div>
    <q-tooltip
      v-model="showTooltip"
      :delay="delay"
      :max-width="maxWidth"
      :anchor="anchor"
      :self="self"
      :offset="offset"
      :class="tooltipClass"
      :style="tooltipStyle"
    >
      <q-icon 
        v-if="showIcon" 
        :name="icon" 
        :size="iconSize" 
        class="q-mr-xs q-mb-xs"
      />
      <span class="c-box-title" style="color:white">
      {{ message }}
    </span>
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message?: string
  delay?: number
  maxWidth?: string
  anchor?: "bottom middle" | "top middle" | "top left" | "top right" | "top start" | "top end" | "center left" | "center middle" | "center right" | "center start" | "center end" | "bottom left" | "bottom right" | "bottom start" | "bottom end" | undefined
  self?: "bottom middle" | "top middle" | "top left" | "top right" | "top start" | "top end" | "center left" | "center middle" | "center right" | "center start" | "center end" | "bottom left" | "bottom right" | "bottom start" | "bottom end" | undefined
  offset?: [number, number]
  tooltipClass?: string
  showIcon?: boolean
  icon?: string
  iconSize?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Coming Soon',
  delay: 300,
  maxWidth: '250',
  anchor: 'top middle',
  self: 'top middle',
  offset: () => [0, 8],
  tooltipClass: 'bg-amber-8',
  showIcon: true,
  icon: 'construction',
  iconSize: '22px',
  color: ''
})

const showTooltip = ref(false)

const tooltipStyle = computed(() => {
  if (props.color) {
    return { backgroundColor: props.color }
  }
  return {}
})
</script>

<style scoped>
.coming-soon-tooltip-wrapper {
  display: inline-block;
}

.c-tooltip-content {
  display: inline-block;
  cursor: help;
}
</style>