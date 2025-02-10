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
        <q-card-section class="popup-content">
          <div class="popup-scroll-container">
            <slot></slot>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { QCard } from 'quasar'

interface Position {
  top?: string | number
  left?: string | number
}

interface Size {
  width?: string
  height?: string
  maxHeight?: string
}

const props = defineProps<{
  modelValue: boolean
  size?: Size
  position?: Position
  dialogClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'hide'): void
}>()

const cardRef = ref<InstanceType<typeof QCard>>()
const triggerElement = ref<DOMRect | null>(null)

const popupStyle = reactive({
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: props.size?.width || '600px',
  maxHeight: props.size?.maxHeight || '90vh',
  minWidth: '',
})

// Initialize position from props if provided
watch(() => props.position, (newPosition) => {
  if (newPosition) {
    if (newPosition.top !== undefined) {
      popupStyle.top = typeof newPosition.top === 'number' 
        ? `${newPosition.top}px` 
        : newPosition.top
    }
    if (newPosition.left !== undefined) {
      popupStyle.left = typeof newPosition.left === 'number' 
        ? `${newPosition.left}px` 
        : newPosition.left
    }
  }
}, { immediate: true })

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const calculatePosition = () => {
  if (!triggerElement.value || !cardRef.value?.$el) return
  
  const rect = triggerElement.value
  const popupWidth = parseInt(popupStyle.width)
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 20
  
  const contentHeight = cardRef.value.$el.querySelector('.popup-scroll-container')?.scrollHeight || 0
  const maxAllowedHeight = viewportHeight - (margin * 2)
  
  const finalHeight = Math.min(contentHeight, maxAllowedHeight)
  popupStyle.maxHeight = `${finalHeight}px`

  // Handle manual position overrides
  const manualTop = props.position?.top !== undefined 
    ? (typeof props.position.top === 'number' ? `${props.position.top}px` : props.position.top)
    : null
  const manualLeft = props.position?.left !== undefined
    ? (typeof props.position.left === 'number' ? `${props.position.left}px` : props.position.left)
    : null

  // Calculate positions
  if (!manualLeft) {
    let leftPosition
    if (rect.x + rect.width + popupWidth + margin <= viewportWidth) {
      leftPosition = rect.x + rect.width + margin
    } else if (rect.x - popupWidth - margin >= 0) {
      leftPosition = rect.x - popupWidth - margin
    } else {
      leftPosition = (viewportWidth - popupWidth) / 2
    }
    // Ensure the popup stays within viewport bounds
    leftPosition = Math.max(margin, Math.min(leftPosition, viewportWidth - popupWidth - margin))
    popupStyle.left = `${leftPosition}px`
  } else {
    popupStyle.left = manualLeft
  }

  if (!manualTop) {
    // Calculate vertical position
    const topPosition = Math.max(
      margin,
      Math.min(
        rect.y,
        viewportHeight - finalHeight - margin
      )
    )
    popupStyle.top = `${topPosition}px`
  } else {
    popupStyle.top = manualTop
  }
}

const handleHide = () => {
  emit('hide')
  emit('update:modelValue', false)
}

const setTriggerElement = (
  element: HTMLElement, 
  customizations?: {
    size?: Size
    position?: Position
  }
) => {
  triggerElement.value = element.getBoundingClientRect()
  
  if (customizations?.size) {
    if (customizations.size.width) {
      popupStyle.width = customizations.size.width
    }
    if (customizations.size.maxHeight) {
      popupStyle.maxHeight = customizations.size.maxHeight
    }
  }
  
  if (customizations?.position) {
    if (customizations.position.top !== undefined) {
      popupStyle.top = typeof customizations.position.top === 'number' 
        ? `${customizations.position.top}px` 
        : customizations.position.top
    }
    if (customizations.position.left !== undefined) {
      popupStyle.left = typeof customizations.position.left === 'number' 
        ? `${customizations.position.left}px` 
        : customizations.position.left
    }
  }

  nextTick(() => {
    calculatePosition()
    setTimeout(calculatePosition, 50)
  })
}

onMounted(() => {
  if (cardRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      nextTick(calculatePosition)
    })
    
    resizeObserver.observe(cardRef.value.$el)
    
    const scrollContainer = cardRef.value.$el.querySelector('.popup-scroll-container')
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer)
    }
    
    window.addEventListener('resize', calculatePosition)
    
    onBeforeUnmount(() => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculatePosition)
    })
  }
})

watch(() => props.modelValue, (newValue) => {
  if (newValue && triggerElement.value) {
    nextTick(() => {
      calculatePosition()
      setTimeout(calculatePosition, 50)
    })
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
  display: flex;
  flex-direction: column;
  
  .popup-content {
    padding: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .popup-scroll-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }
}

:deep(.q-dialog__backdrop) {
  background: transparent !important;
}
</style>