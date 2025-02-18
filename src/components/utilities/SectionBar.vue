<template>
  <div class="row items-center">
    <div 
      v-for="(section, index) in totalSections" 
      :key="index"
      class="section"
      :class="{ 
        'bg-green': index < activeCount,
        'bg-grey-7': index >= activeCount 
      }"
    />
    <span class="text-grey-8 c-section-subtitle q-pl-sm">{{ getStageLabel(activeCount) }}</span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 

interface Props {
  activeCount: number
  totalSections?: number
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  totalSections: 4 
})

const stages =  computed(()=>{
  return  props.labels ?? [
    t('awareness'),
    t('consideration'),
    t('decision'),
    t('retention'),
  ]
})
const getStageLabel = (stageNumber: number): string => {
  return stages.value[stageNumber - 1]
};
</script>

<style scoped>
.section {
  width: 6px;
  height:10px;
  margin-left:2px;
  transition: background-color 0.3s ease;
}
</style>