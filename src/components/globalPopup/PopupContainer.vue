// GlobalPopup.vue
<template>
  <Teleport to="body">
    <q-dialog
      v-model="isOpen"
      position="standard"
      class="c-global-popup"
      :class="dialogClass"
      transition-duration="0"
      @hide="handleHide"
    >
      <q-card
        flat
        bordered
        class="dynamic-popup"
        :style="popupStyle"
        ref="cardRef"
      >
        <q-card-section :style="{ height: '100%', overflow: 'auto' }">
          <slot></slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { QCard } from 'quasar'

const props = defineProps<{
  modelValue: boolean,
  size?: {
    width?: string,
    height?: string,
    maxHeight?: string
  },
  dialogClass?:string,
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'hide'): void
}>()

const cardRef = ref<InstanceType<typeof QCard>>()
const triggerElement = ref<DOMRect | null>(null)

const popupStyle = reactive({
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: props.size?.width || '600px',
  maxHeight: props.size?.maxHeight || '250px',
  minWidth: ''
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const calculatePosition = () => {
  if (!triggerElement.value || !cardRef.value?.$el) return
  
  const rect = triggerElement.value
  const popupWidth = parseInt(popupStyle.width)
  const actualHeight = cardRef.value.$el.offsetHeight
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 5 // Margin from viewport edges
  
  // Calculate horizontal position
  let leftPosition
  if (rect.x + rect.width + popupWidth + margin <= viewportWidth) {
    // Fits to the right of trigger
    leftPosition = rect.x + rect.width
  } else if (rect.x - popupWidth - margin >= 0) {
    // Fits to the left of trigger
    leftPosition = rect.x - popupWidth
  } else {
    // Doesn't fit either side - align to viewport edge with margin
    leftPosition = viewportWidth - popupWidth - margin
  }
  
  // Calculate vertical position
  let topPosition
  if (rect.y + actualHeight + margin <= viewportHeight) {
    // Fits below trigger
    topPosition = rect.y
  } else if (rect.y - actualHeight >= margin) {
    // Fits above trigger
    topPosition = rect.y - actualHeight
  } else {
    // Doesn't fit above or below - align to bottom of viewport with margin
    topPosition = viewportHeight - actualHeight - margin
  }
  
  // Ensure left position doesn't go beyond left edge
  leftPosition = Math.max(margin, leftPosition)
  
  // Apply the calculated positions
  popupStyle.left = `${leftPosition}px`
  popupStyle.top = `${topPosition}px`
}
const handleHide = () => {
  emit('hide')
  emit('update:modelValue', false)
}

const setTriggerElement = (element: HTMLElement, size?: { width?: string, maxHeight?: string }) => {
  triggerElement.value = element.getBoundingClientRect()
  if (size) {
    popupStyle.width = size.width || popupStyle.width
    popupStyle.maxHeight = size.maxHeight || popupStyle.maxHeight
  }
  nextTick(calculatePosition)
}

// Setup resize handling
onMounted(() => {
  if (cardRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      nextTick(calculatePosition)
    })
    resizeObserver.observe(cardRef.value.$el)
    
    window.addEventListener('resize', calculatePosition)
    
    onBeforeUnmount(() => {
      if (cardRef.value) {
        resizeObserver.unobserve(cardRef.value.$el)
      }
      window.removeEventListener('resize', calculatePosition)
    })
  }
})

// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && triggerElement.value) {
    nextTick(calculatePosition)
  }
})

defineExpose({
  setTriggerElement
})
</script>

<style scoped lang="scss">
.dynamic-popup {
  position: fixed;
  z-index: 9999;
  background: white;
  
  .q-card__section {
    padding: 0px !important;
  }
}

:deep(.q-dialog__backdrop) {
  background: transparent !important;
}
</style>