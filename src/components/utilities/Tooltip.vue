<template>
    <div class="inline-block">
      <q-btn
        round
        flat
        dense
        size="sm"
        icon="info"
        color="grey-7"
        class="custom-tooltip-trigger"
      >
        <q-tooltip
          anchor="center right"
          self="center left"
          max-width="300"
          class="custom-tooltip bg-grey-1"
          :offset="[10, 0]"
        >
          <div class="tooltip-content">
            <template v-if="image">
              <div class="tooltip-image q-mb-sm">
                <img :src="image" :alt="title">
              </div>
            </template>
            
            <div class="text-h6 q-mb-sm c-text-dark">{{ title }}</div>
            <div class="text-body2 c-text-dark">{{ description }}</div>
            <slot/>
            
            <template v-if="button">
              <div class="q-mt-md">
                <slot name="button">
                  {{ button }}
                </slot>
              </div>
            </template>
          </div>
        </q-tooltip>
      </q-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string;
    description?: string;
    image?: string | null;
    button?: string | null;
  }
  
  defineProps<Props>();
  </script>
  
  <style scoped>
  .custom-tooltip {
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .tooltip-content {
    padding: 12px;
    max-width: 300px;
  }
  
  .tooltip-image img {
    width: 100%;
    border-radius: 4px;
  }
  
  :deep(.q-tooltip) {
    font-size: inherit;
    color:#213343
  }
  
  :deep(.q-tooltip__arrow) {
    width: 10px;
    height: 10px;
    background: rgb(172, 172, 172);
  }
  </style>