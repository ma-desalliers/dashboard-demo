<template>
    <q-input
      :model-value="modelValue"
      @update:model-value="(val) => emit('update:modelValue', val)"
      type="textarea"
      :label="label"
      outlined
      dense
      autogrow
      :rows="6"
      class="custom-textarea full-width"
      input-style="min-height:150px"
    />
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue?: string;
    label?: string;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  </script>
  
  <style scoped>
  .custom-textarea {
    min-height: 150px;
  }
  </style>