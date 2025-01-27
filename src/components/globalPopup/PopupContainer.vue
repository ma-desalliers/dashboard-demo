// GlobalPopup.vue
<template>
  <Teleport to="body">
    <q-dialog
      v-model="isOpen"
      position="standard"
      class="c-global-popup"
      transition-show="fade"
      transition-hide="fade"
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
  }
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
  
  // Calculate available space
  const rightSpace = viewportWidth - (rect.x + rect.width)
  const bottomSpace = viewportHeight - rect.y
  
  // Position horizontally
  if (rightSpace >= popupWidth) {
    popupStyle.left = `${rect.x + rect.width}px`
  } else {
    popupStyle.left = `${rect.x - popupWidth}px`
  }
  
  // Position vertically
  if (bottomSpace >= actualHeight) {
    popupStyle.top = `${rect.y}px`
  } else {
    popupStyle.top = `${rect.y + rect.height - actualHeight}px`
  }
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