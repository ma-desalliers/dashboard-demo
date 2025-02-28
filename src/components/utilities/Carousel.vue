<template>
  <div class="carousel-container relative-position">
    <div ref="scrollContainer" class="row no-wrap q-gutter-md scroll-x">
      <slot></slot>
    </div>

    <q-btn 
      round 
      outline 
      color="primary" 
      icon="chevron_left"
      class="scroll-button scroll-left" 
      @click="scroll('left')" 
      :disable="isScrollLeftDisabled"
    />
    <q-btn 
      round 
      outline 
      color="primary" 
      icon="chevron_right"
      class="scroll-button scroll-right" 
      @click="scroll('right')" 
      :disable="isScrollRightDisabled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  scrollAmount: {
    type: Number,
    default: 300 // Default scroll amount in px
  },
  showArrows: {
    type: Boolean,
    default: true
  }
})

const scrollContainer = ref<HTMLElement | null>(null)
const currentScrollPosition = ref(0)
const maxScrollPosition = ref(0)

const isScrollLeftDisabled = computed(() => {
  return currentScrollPosition.value <= 0
})

const isScrollRightDisabled = computed(() => {
  return currentScrollPosition.value >= maxScrollPosition.value
})

const calculateMaxScroll = () => {
  if (!scrollContainer.value) return
  
  const containerWidth = scrollContainer.value.clientWidth
  const scrollWidth = scrollContainer.value.scrollWidth
  maxScrollPosition.value = Math.max(0, scrollWidth - containerWidth)
}

const updateScrollPosition = () => {
  if (!scrollContainer.value) return
  currentScrollPosition.value = scrollContainer.value.scrollLeft
}

const scroll = (direction: 'left' | 'right') => {
  const container = scrollContainer.value
  if (!container) return

  const scrollAmount = calculateScrollAmount()
  
  if (direction === 'left') {
    const newPosition = Math.max(0, currentScrollPosition.value - scrollAmount)
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  } else {
    const newPosition = Math.min(maxScrollPosition.value, currentScrollPosition.value + scrollAmount)
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }
}

const calculateScrollAmount = () => {
  const container = scrollContainer.value
  if (!container) return props.scrollAmount
  
  // Calculate dynamic scroll amount based on container width
  const containerWidth = container.getBoundingClientRect().width
  
  if (containerWidth >= 1200) {
    return containerWidth * 0.75 // Scroll 75% of viewport on large screens
  } else if (containerWidth >= 768) {
    return containerWidth * 0.8 // Scroll 80% of viewport on medium screens
  } else {
    return containerWidth * 0.9 // Scroll 90% of viewport on small screens
  }
}

// Handle window resize
const handleResize = () => {
  calculateMaxScroll()
  updateScrollPosition()
}

// Handle scroll event
const handleScroll = () => {
  updateScrollPosition()
}

onMounted(() => {
  // Use nextTick to ensure DOM is fully rendered
  nextTick(() => {
    calculateMaxScroll()
    updateScrollPosition()
  })
  
  window.addEventListener('resize', handleResize)
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
}

.scroll-x {
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
  scrollbar-width: none;     /* Hide scrollbar for Firefox */
  padding: 8px 20px;         /* Add padding for the buttons */
}

.scroll-x::-webkit-scrollbar {
  display: none;  /* Hide scrollbar for Chrome, Safari and Opera */
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  transition: opacity 0.3s, background-color 0.3s;
  background-color: #ffffff !important;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.scroll-button:hover:not(:disabled) {
  background-color: #f5f5f5 !important;
}

.scroll-left {
  left: 0px;
}

.scroll-right {
  right: 17px;
}
</style>