<template>
  <div class="c-loader-container" :style="containerStyle">
    <div class="c-loader">
      <div class="c-circle c-circle-xs"></div>
      <div class="c-circle c-circle-small"></div>
      <div class="c-circle c-circle-medium"></div>
      <div class="c-circle c-circle-large"></div>
      <div class="c-circle c-circle-xl"></div>
    </div>
    <div class="c-loader-text">{{ selectedStats }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: string;
  color?: string;
}>(), {
  size: '40px',
  color: 'var(--q-primary)'
})

const containerStyle = computed(() => ({
  '--loader-size': props.size,
  '--loader-color': props.color
}))

const stats =  [
    "84% of executives trust AI to drive growth.",
    "$190.6B will be the global AI market size by 2025.",
    "$15.7T will be added to the GDP by AI by 2030.",
    "37.3% is the projected CAGR of the AI market (2023-2030).",
    "25% reduction in delivery times with AI adoption.",
    "35% improvement in supply chain efficiency using AI.",
    "30% boost in sales with AI-powered analytics.",
    "90% of businesses will adopt AI by 2025.",
    "35% annual growth in AI adoption within HR.",
    "30% improvement in disaster prediction accuracy with AI.",
    "30% reduction in repair costs in utilities using AI.",
    "30% boost in recruitment efficiency with AI tools.",
    "20% annual reduction in food waste using AI.",
    "60% reduction in data analysis time with AI tools.",
    "50% cut in customer response time with AI chatbots.",
    "70% improvement in fraud detection accuracy with AI.",
    "20% increase in ROI from AI-powered online ads.",
    "15% reduction in hospital costs using AI.",
    "25% improvement in financial forecasts with AI.",
    "75% of customer service queries are handled by AI chatbots.",
    "25% reduction in manufacturing error rates with AI.",
    "40% faster detection of cyber threats using AI.",
    "40% improvement in car safety with AI tools.",
    "56% increase in content personalization using AI.",
    "20% boost in customer retention rates with AI.",
    "90% translation accuracy achieved by AI tools.",
    "25% boost in inventory management efficiency using AI.",
    "15% reduction in energy consumption through AI.",
    "85% accuracy in stock trend predictions using AI.",
    "40% improvement in retail demand forecasting with AI.",
    "$20B expected AI market size in healthcare by 2025.",
    "70% faster insurance claim processing with AI tools.",
    "75% of large companies optimize operations with AI.",
    "18% boost in manufacturing productivity using AI.",
    "20% annual cost savings in logistics using AI.",
    "60% of retailers optimize pricing strategies using AI.",
    "60% of companies improve cybersecurity systems with AI.",
    "15% reduction in vehicle maintenance costs with AI.",
    "30% of warehouse management systems use AI tools.",
    "25% yield improvement in smart farming with AI adoption.",
    "15% reduction in manufacturing downtime through AI.",
    "70% faster legal document analysis using AI tools.",
    "25% improvement in bank loan approvals with AI.",
    "30% improvement in real estate price prediction accuracy using AI.",
    "70% of fraud prevention systems leverage AI.",
    "18% increase in telecom profits with AI tools.",
    "20% of annual vehicle costs are reduced using AI optimization.",
    "40% of cyber threats are detected faster using AI.",
    "30% of global weather predictions improve accuracy with AI.",
    "30% improvement in asset maintenance efficiency in manufacturing."
]


const selectedStats = ref(stats[0])

const getRandomStat = () => {
  const randomIndex = Math.floor(Math.random() * stats.length)
  selectedStats.value = stats[randomIndex]
}

onMounted(()=>{

  console.log('hello')

  getRandomStat()

})



</script>

<style scoped lang="scss">
.c-loader-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(var(--loader-size) / 2);
  gap: 1rem;
}

.c-loader {
  position: relative;
  width: var(--loader-size);
  height: var(--loader-size);
}

.c-loader-text {
  font-size: 0.875rem;
  color: var(--loader-color);
  opacity: 0.8;
}

.c-circle {
  position: absolute;
  border-radius: 50%;
  background: transparent;
  border-style: solid;
  border-width: 3px;
  transition: all 0.3s ease;

  &.c-circle-xs {
    width: calc(var(--loader-size) * 0.6);
    height: calc(var(--loader-size) * 0.6);
    top: 20%;
    left: 20%;
   // background: color-mix(in srgb, var(--loader-color) 30%, white);
    border-color: color-mix(in srgb, var(--loader-color) 55%, white);
    animation: juggle 1.5s ease-in-out infinite, bounce 1.5s ease-in-out infinite;
  }

  &.c-circle-small {
    width: calc(var(--loader-size) * 0.8);
    height: calc(var(--loader-size) * 0.8);
    top: 10%;
    left: 10%;
   // background: color-mix(in srgb, var(--loader-color) 50%, white);
    border-color: color-mix(in srgb, var(--loader-color) 75%, white);
    animation: juggle 1.5s ease-in-out infinite 0.2s, bounce 1.5s ease-in-out infinite 0.2s;
  }
  
  &.c-circle-medium {
    width: var(--loader-size);
    height: var(--loader-size);
    top: 0;
    left: 0;
  //  background: var(--loader-color);
    border-color: var(--loader-color);
    animation: juggle 1.5s ease-in-out infinite 0.4s, bounce 1.5s ease-in-out infinite 0.4s;
  }
  
  &.c-circle-large {
    width: calc(var(--loader-size) * 1.2);
    height: calc(var(--loader-size) * 1.2);
    top: -10%;
    left: -10%;
   // background: color-mix(in srgb, var(--loader-color) 70%, black);
    border-color: color-mix(in srgb, var(--loader-color) 70%, black);
    animation: juggle 1.5s ease-in-out infinite 0.6s, bounce 1.5s ease-in-out infinite 0.6s;
  }

  &.c-circle-xl {
    width: calc(var(--loader-size) * 1.4);
    height: calc(var(--loader-size) * 1.4);
    top: -20%;
    left: -20%;
   // background: color-mix(in srgb, var(--loader-color) 50%, black);
    border-color: color-mix(in srgb, var(--loader-color) 50%, black);
    animation: juggle 1.5s ease-in-out infinite 0.8s, bounce 1.5s ease-in-out infinite 0.8s;
  }
}

@keyframes juggle {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(-50%) scale(0.9) rotate(180deg);
  }
}

@keyframes bounce {
  0%, 100% {
    filter: brightness(100%) contrast(100%);
    opacity: 0.5;
  }
  50% {
    filter: brightness(150%) contrast(120%);
    opacity: 1;
  }
}
</style>