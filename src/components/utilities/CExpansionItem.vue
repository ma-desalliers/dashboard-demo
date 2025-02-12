<template>
  <q-expansion-item
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    class="custom-expansion bg-white"
    switch-toggle-side
    expand-icon-toggle
    expand-icon-class="expand-icon-class"
  >
    <template #header>
      <div class="row full-width items-center">
        <div class="row items-center">
          <div class="text-subtitle2">{{ title }}</div>
          <CustomTooltip
            v-if="tooltip"
            :title="tooltip.title"
            :description="tooltip.description"
            :image="tooltip.image"
            :button="tooltip.button"
            class="q-ml-sm"
          />
        </div>
        <q-space />
        <slot name="header-right"></slot>
      </div>
    </template>

    <template #default>
      <slot></slot>
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
interface TooltipProps {
  title: string;
  description: string;
  image?: string;
  button?: string;
}

interface Props {
  modelValue?: boolean;
  title: string;
  tooltip?: TooltipProps;
}

defineProps<Props>();
defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped lang="scss">
.custom-expansion {
  border-radius: 8px;
  overflow: hidden;

  :deep(.q-expansion-item__container) {
    .q-item {
      padding: 16px;
    }
  }

  :deep(.q-expansion-item__content) {
    padding: 0 16px 16px 16px;
    background-color: #ffffff;
  }
  :deep(.expand-icon-class){
  padding-right:8px ;
  min-width:unset
}
}


</style>