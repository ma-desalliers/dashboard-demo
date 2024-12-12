<template>
    <div class="q-px-md">
      <div class="text-subtitle1 q-mb-sm" v-if="label">{{ label }}</div>
      <q-linear-progress
        :value="computedProgress"
        size="25px"
        :color="color"
        :style="{ width: computedWidth }"
        rounded
        stripe
      >
        <div class="absolute-full flex flex-center">
          <q-badge :color="color" :label="`${current} / ${total}`" />
        </div>
      </q-linear-progress>
    </div>
  </template>
  <script setup lang="ts">
  const props = defineProps<{
    current: number;
    total: number;
    label?: string;
    color?: string;
    width?: string;
  }>();
  
  const computedProgress = computed(() => props.current / props.total);
  const computedWidth = computed(() => props.width || '300px');
  </script>