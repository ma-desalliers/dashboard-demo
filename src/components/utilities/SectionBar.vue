<template>
  <div class="row items-center">
    <div 
      v-for="(section, index) in totalSections" 
      :key="index"
      class="section q-mx-1"
      :class="{ 
        'bg-green': index < activeCount,
        'bg-grey-4': index >= activeCount 
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeCount: number
  totalSections?: number
}

withDefaults(defineProps<Props>(), {
  totalSections: 4
})
</script>

<style scoped>
.section {
  width: 24px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
</style>