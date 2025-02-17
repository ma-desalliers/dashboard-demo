<template>
  <div class="thumbs-review">
    <button @click="toggleThumbs('up')" :class="{ active: value === true }"><i class="fa-regular fa-thumbs-up"></i></button>
    <button @click="toggleThumbs('down')" :class="{ active: value === false }"><i class="fa-regular fa-thumbs-down"></i></button>
  </div>
</template>

<script setup lang="ts">
import { ref,  watch } from 'vue';

const props = defineProps<{
  modelValue: boolean | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | null): void;
}>();

const value = ref<boolean | null>(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  value.value = newValue;
});

function toggleThumbs(direction: 'up' | 'down') {
  if (direction === 'up') {
    value.value =  true;
  } else if (direction === 'down') {
    value.value =  false;
  }
  emit('update:modelValue', value.value);
}
</script>

<style scoped>
.thumbs-review button {
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 5px;
  margin: 0 5px;
}

.thumbs-review button.active .fa-thumbs-up{
  color: var(--q-green);
}

.thumbs-review button.active .fa-thumbs-down{
  color: var(--q-negative);
}
</style>
