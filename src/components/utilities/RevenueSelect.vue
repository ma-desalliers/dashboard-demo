<template>
    <q-select
      :model-value="modelValue"
      @update:model-value="(val) => emit('update:modelValue', val)"
      :options="options"
      option-label="label"
      option-value="value"
      label="Chiffre d'affaire"
      outlined
      dense
      emit-value
      map-options
      clearable
    />
  </template>
  
  <script setup lang="ts">
const options = [
    { label: 'Moins de 1 million ($)', value: '0-1000000' },
    { label: '1 à 2.5 millions ($)', value: '1000000-2500000' },
    { label: '2.5 à 5 millions ($)', value: '2500000-5000000' },
    { label: '5 à 10 millions ($)', value: '5000000-10000000' },
    { label: '10 à 25 millions ($)', value: '10000000-25000000' },
    { label: '25 à 50 millions ($)', value: '25000000-50000000' },
    { label: '50 à 100 millions ($)', value: '50000000-100000000' },
    { label: 'Plus de 100 millions ($)', value: '100000000+' }
];
  
  const props = defineProps<{
    modelValue?: string;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  </script>