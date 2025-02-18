<template>
  <div class="">
    <q-btn-group class="c-btn-group" outline>
      <q-btn
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :icon="option.icon"
        :color="modelValue === option.value ? 'green' : 'grey-7'"
        :outline="modelValue !== option.value"
        @click="updateValue(option.value)"
        :class="{ 
          'q-px-md': !option.icon, 
          'square-btn': option.icon && !option.label 
        }"
      />
    </q-btn-group>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label?: string;
  value: string;
  icon?: string;
}

interface Props {
  modelValue: string;
  options: Option[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const updateValue = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<style scoped lang="scss">
.q-btn-group {
  box-shadow: none;
}

.q-btn {
  min-width: 100px;
}

.square-btn {
  min-width: 40px !important;
  width: 40px;
  height: 40px;
  padding: 0;
}

.c-btn-group{
  :deep(.q-btn--outline){
    &:before{
      border-color:#cecece
    }
  }
}
</style>