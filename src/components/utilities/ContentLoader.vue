<template>
  <q-inner-loading
    :showing="showing"
    transition-show="fade"
    transition-hide="fade"
    class="bg-white"
  >
    <div class="column items-center">
      <!-- Paper effect container -->
      <div class="line-container">
        <!-- Animated content lines -->
        <div class="q-gutter-y-sm">
          <div
            v-for="(line, index) in lineWidths"
            :key="index"
            class="loading-line rounded"
            :class="{ 'shine-effect': isInitialAnimationDone }"
            :style="{
              width: `${line}%`,
              animationDelay: isInitialAnimationDone 
                ? `${index * 0.1}s` 
                : `${index * 0.8}s`
            }"
          />
        </div>
      </div>

      <!-- Optional loading text -->
      <div v-if="label" class="text-subtitle1 q-mt-md text-grey-8">{{ label }}</div>
    </div>
  </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  showing: boolean;
  label?: string;
}>();

const isInitialAnimationDone = ref(false)

// Generate random widths once and store them
const lineWidths = ref( Array.from({ length: 8 }, () => Math.random() * 40 + 60))

onMounted(() => {
  handleAnimation()
})

const handleAnimation = () =>{
  setTimeout(() => {
    isInitialAnimationDone.value = true

    setTimeout(()=>{
      lineWidths.value = Array.from({ length: 8 }, () => Math.random() * 40 + 60)
      isInitialAnimationDone.value = false
      handleAnimation()
    },4000)
  }, 6400)
}
</script>

<style scoped>
.loading-line {
  height: 16px;
  background: #e7e7e7;
  opacity: 0;
  transform-origin: left;
  position: relative;
  overflow: hidden;
}

.loading-line:not(.shine-effect) {
  animation: loadingAnimation 0.8s ease-in-out forwards;
}

.shine-effect {
  opacity: 1;
}

.shine-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 255, 255, 0.6), 
    transparent
  );
  animation: shineAnimation 2s infinite linear;
}

@keyframes loadingAnimation {
  0% {
    opacity: 0.5;
    transform: scaleX(0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes shineAnimation {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.q-inner-loading {
  z-index: 10;
}

.line-container {
  position: absolute;
  inset: 20px;
  padding:15px;
  border: solid 1px #e7e7e7;
  border-radius: 4px; 
}
</style>