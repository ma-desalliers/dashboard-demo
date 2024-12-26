<template>
  <div class="c-stack-counter" :style="containerStyle">
    <!-- Stacked shapes -->
    <div class="c-stack-counter__container">
      <div 
        v-for="i in visibleCount" 
        :key="i"
        class="c-stack-counter__item"
        :style="getSquarePosition(i-1)"
      >
        <div 
          class="c-stack-counter__square"
          :style="getSquareStyle(i-1)"
        >
          <!-- Display total count on the top square -->
          <div 
            v-if="i === 1" 
            class="c-stack-counter__number"
          >
    <!--{{ count }}-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  count?: number
  size?: number
  maxVisible?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  size: 64, // 4rem default
  maxVisible: 5,
  color: 'var(--q-primary)'
})

const visibleCount = computed(() => Math.min(props.maxVisible, Math.max(1, props.count)))

// Calculate spacing based on square size
const getSpacing = computed(() => Math.max(3, props.size * 0.11)) // 12% of square size, minimum 5px

// Calculate total height based on visible count and spacing
const totalHeight = computed(() => {
  const baseHeight = props.size; // Height of a single square
  const stackHeight = (visibleCount.value - 1) * getSpacing.value; // Height added by stacking
  return baseHeight + stackHeight;
})

const containerStyle = computed(() => ({
  '--square-size': `${props.size}px`,
  '--square-color': props.color,
  '--stack-spacing': `${getSpacing.value}px`,
  '--total-height': `${totalHeight.value}px`
}))

const getSquarePosition = (index: number) => ({
  transform: `translateY(${index * getSpacing.value}px)`,
  zIndex: props.maxVisible - index,
  left: '50%',
  marginLeft: `-${props.size / 2}px`
})

const getSquareStyle = (index: number) => ({
  transform: 'perspective(800px) rotateX(60deg) rotate(45deg)',
  opacity: 1 - (index * 0.15),
  border: `${Math.max(2, props.size * 0.04)}px solid var(--square-color)`, // Border scales with size
  backgroundColor: '#ffffff'
})
</script>

<style scoped lang="scss">
.c-stack-counter {
  position: relative;
  width: calc(var(--square-size) * 1.5);
  height: var(--total-height);

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__item {
    position: absolute;
    top: 0;
  }

  &__square {
    width: var(--square-size);
    height: var(--square-size);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center center;
  }

  &__number {
    transform: rotate(-45deg);
    color: var(--square-color);
    font-size: calc(var(--square-size) * 0.6);
    font-weight: bold;
  }
}
</style>