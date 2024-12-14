<template>
  <q-avatar
    :size="size"
    :class="colorClass"
    :text-color="textColor"
    rounded
    class="score-avatar"
  >
    <span>{{ score }}</span>
  </q-avatar>
</template>

<script setup lang="ts">
interface Props {
  score: number;
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: '24px'
});

const colorClass = computed(() => {
  switch (true) {
    case props.score <= 2:
      return 'bg-green';
    case props.score === 3:
      return 'bg-yellow';
    default:
      return 'bg-red';
  }
});

const textColor = computed(() => {
  // Use darker text for yellow background for better contrast
  return props.score === 3 ? 'grey-9' : 'white';
});
</script>

<style scoped>
.score-avatar {
  font-weight: 500;
}
</style>