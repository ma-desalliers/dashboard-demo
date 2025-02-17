<template>
  <div class="row items-center q-gutter-x-md">
    <span class="text-grey-8 text-caption">{{ getStageLabel(stage) }}</span>
    <div class="row q-gutter-x-xs">
      <div
        v-for="n in 4"
        :key="n"
        :class="n <= stage ? 'bg-green-5' : 'bg-grey-4'"
        style="width: 16px; height: 8px; border-radius: 2px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stage: number;
}

const props = defineProps<Props>();

const stages = {
  1: 'Awareness',
  2: 'Consideration',
  3: 'Decision',
  4: 'Retention'
} as const;

const getStageLabel = (stageNumber: number): string => {
  return stages[stageNumber as keyof typeof stages] || '';
};
</script>